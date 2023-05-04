import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAggDataByAssetName } from '@/pages/api';
import { useSnapshot } from 'valtio';
import state from '../state';
import { Box, Typography } from '@mui/material';
import { Point } from 'geojson';


const Map = () => {

  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const snapshot = useSnapshot(state);

  //function to get aggregated data and update the filter in data table using asset name
  //function is called when a marker is clicked
  async function updateGraph(assetName: string) {
    try {
      await getAggDataByAssetName(assetName);
      state.tabelFilter = state.graphData[0]._id['Asset Name'];
    } catch (error) {
      console.log(error);
    }
  }

  //this useEffect loads the map. Map is loaded only once.
  useEffect(() => {
    if (!map && document.getElementById('map-container')) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
      const mapInstance = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-95.7129, 37.0902],
        zoom: 1.5,
        dragPan: true,
        scrollZoom: true,
      });
      mapInstance.addControl(new mapboxgl.NavigationControl());

      mapInstance.on('load', () => {
        // console.log('Map loaded');
        setMap(mapInstance);
      });
    } else if (map) {
      return
      //console.log('Map already exists');
    } else {
      return
      //console.log('Map container not found');
    }
  }, [map]);

  useEffect(() => {
    if (map && snapshot.data) {

      // create a new GeoJSON object from the data
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: state.data.map((location: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location['Long'], location['Lat']],
          },
          properties: {
            id: location['_id'],
            name: location['Asset Name'],
            category: location['Business Category'],
            rating: location['Risk Rating'],
            factors: JSON.parse(location['Risk Factors']),
          },
        })),
      };

      // if the markers source already exists, update the data
      if (map.getSource('markers')) {
        (map.getSource('markers') as mapboxgl.GeoJSONSource).setData(geojson);
      }
      else {
        // otherwise, create a new source and add it to the map
        map.addSource('markers', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
          clusterProperties: {
            total_rating: ['+', ['get', 'rating']],
          },
        });

        // adds a layer to render the markers using the source
        map.addLayer({
          id: 'markers',
          type: 'circle',
          filter: ['!', ['has', 'point_count']],
          source: 'markers',
          paint: {
            'circle-color': ['interpolate', ['linear'],
              ['get', 'rating'],
              0,
              '#00ff00',
              0.5,
              '#ffff00',
              1,
              '#ff0000',
            ],
            'circle-radius': 10,
          },
        });

        //adds a layer to create clusters
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'markers',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'interpolate',
              ['linear'],
              ['/', ['get', 'total_rating'], ['get', 'point_count']],
              0,
              'lightgreen',
              0.25,
              'yellow',
              0.5,
              'orange',
              0.8,
              'red',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });




        //click event listener to the clusters layer
        map.on('click', 'clusters', (e) => {
          const features: mapboxgl.MapboxGeoJSONFeature[] | null = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });

          if (!features.length) return;
          if (features[0].properties === null) return;

          const clusterId = features[0].properties.cluster_id;
          const source = map.getSource('markers') as any;

          if (!source.getClusterExpansionZoom) return;

          // get the cluster expansion zoom for the clicked cluster
          source.getClusterExpansionZoom(
            clusterId,
            (err: any, zoom: any) => {
              if (err) return;

              const featureGeometry = features[0].geometry as Point;
              const coordinates = featureGeometry.coordinates as mapboxgl.LngLatLike;

              map.easeTo({
                center: coordinates,
                zoom: zoom
              });
            }
          );
        });

        //reset the filter in Data Table when map is clicked (other than marker)
        map.on('click', (e) => {
          state.tabelFilter = '';
        });

        // change the cursor to a pointer when the mouse is over the clusters layer or markers layer
        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'markers', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'markers', () => {
          map.getCanvas().style.cursor = '';
        });

        // inspect a marker on click
        map.on('click', 'markers', (e) => {
          if (!e.features) return;
          if (e.features[0].geometry.type !== 'Point') return;

          const coordinates = e.features[0].geometry.coordinates.slice();

          if (e.features[0].properties === null) return;

          const businessCategory = e.features[0].properties.category;
          const assetName = e.features[0].properties.name;
          const riskRating = e.features[0].properties.rating;

          //get aggregated data and update table filter
          updateGraph(assetName);

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // create popup node on click
          new mapboxgl.Popup()
            .setLngLat(coordinates as mapboxgl.LngLatLike)
            .setHTML(
              `<span class="text-black" style={{color:'black'}}>Asset Name: ${assetName}<br>Business Category: ${businessCategory}</span>`
            )
            .addTo(map);
        });


        // add a layer to render the count labels
        map.addLayer({
          id: 'cluster-counts',
          type: 'symbol',
          source: 'markers',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 15,
          },
          paint: {
            'text-color': '#fff',
          },
        });
      }
    }
  },);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Typography
        style={{ color: 'white', marginBottom: '1rem', fontWeight: 500 }}
      >
        Click clusters to expand and view color-coded risk indicators for assets.
      </Typography>
      <Box
        id="map-container"
        sx={{
          height: '100%',
          width: '100%',
          borderRadius: '1rem',
          boxShadow: '0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)',
          backgroundColor: 'white',
          color: 'black',
          zIndex: 1
        }}
      />

    </div>
  );
};

export default Map;




