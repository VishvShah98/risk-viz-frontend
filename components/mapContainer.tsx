import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getAggDataByAssetName } from '@/pages/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSnapshot } from 'valtio';
import state from '../state';
import Box from '@mui/material/Box';
import { Point } from 'geojson';


const Map = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const snapshot = useSnapshot(state);

  async function updateGraph(assetName: string) {
    try {
      //console.log(assetName);
      await getAggDataByAssetName(assetName);
      state.tabelFilter = state.graphData[0]._id['Asset Name'];
      //console.log(state.graphData);
    } catch (error) {
      //console.log(error);
    }
  }

  useEffect(() => {
    if (!map && document.getElementById('map-container')) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
      const mapInstance = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-95.7129, 37.0902],
        zoom: 2,
        dragPan: true,
        scrollZoom: true,
      });
      mapInstance.addControl(new mapboxgl.NavigationControl());

      mapInstance.on('load', () => {
        // console.log('Map loaded');
        setMap(mapInstance);
      });
    } else if (map) {
      //console.log('Map already exists');
    } else {
      //console.log('Map container not found');
    }
  }, [map]);

  useEffect(() => {
    if (map && snapshot.data) {

      //console.log(snapshot.data);

      // create a new GeoJSON object from the data
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: snapshot.data.map((location: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location['Long'], location['Lat']],
          },
          properties: {
            id: location['_id'], // use a unique id for each feature
            name: location['Asset Name'], // add other properties as needed
            category: location['Business Category'],
            rating: location['Risk Rating'],
            factors: JSON.parse(location['Risk Factors']),
          },
        })),
      };

      // calculate the bounds of the GeoJSON data
      //     console.log(geojson);
      //     const bounds = turf.bbox(geojson);


      // // fit the map to the bounds of the GeoJSON data
      // map.fitBounds(bounds, {
      //   padding: 20,
      //   maxZoom: 14,
      //   duration: 0,
      // });
      // if the markers source already exists, update the data
      if (map.getSource('markers')) {
        (map.getSource('markers') as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        // otherwise, create a new source and add it to the map
        map.addSource('markers', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // add a layer to render the markers using the source
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



        // add a layer to render the cluster counts
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'markers',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              200,
              '#f1f075',
              500,
              '#f28cb1'
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


        //  add a click event listener to the clusters layer
        map.on('click', 'clusters', (e) => {
          const features: mapboxgl.MapboxGeoJSONFeature[] | null = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          if (!features.length) return;
          //solve this typescript error: Object is possibly 'null'.ts(2531)

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
              //console.log(coordinates);
              map.easeTo({
                center: coordinates,
                zoom: zoom
              });
            }
          );
        });




        map.on('click', (e) => {
          //console.log('Map clicked at:', e.lngLat);
          // do something with the clicked location
          state.tabelFilter = '';
        });


        // change the cursor to a pointer when the mouse is over the clusters layer
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

          updateGraph(assetName);

          //state.showData = true;

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
  }, [map, snapshot.data]);

  return (
  
  <div style={{ height: '100%', width: '100%' }}>
    
    <div style={{

  }} >
    </div>
    <Box id="map-container" style={{ height: '100%', width: '100%', zIndex: 1, color:'black' }} sx={{
      borderRadius: "1rem",
      boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .8)",
    }} ></Box>
     </div> 
    );
};

export default Map;




