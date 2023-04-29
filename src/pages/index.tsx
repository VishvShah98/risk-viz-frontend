'use client';
import { useEffect, useState } from 'react';
import DecadeSelector from '../../components/decadeSelector'
import { getDataByDecade, getDecades, getAggDataByAssetName } from './api';
import state from '../../state';
import Map from '../../components/mapContainer';
import LineChart from '../../components/lineGraph';
import DataTable from '../../components/dataTable';
import { useSnapshot } from 'valtio';

export default function Home() {

  const [dataLoaded, setDataLoaded] = useState(false);
  const snapshot = useSnapshot(state);

  useEffect(() => {
    async function fetchData() {
      try {
        const decades = await getDecades();
        if (decades.length > 1) {
          state.decade = decades[0];
          await getDataByDecade(state.decade);
        }
        if (state.data.length > 10) {
          await getAggDataByAssetName(state.data[0]["Asset Name"]);
        }
        if (state.graphData.length > 1) {
          setDataLoaded(true);
        }
      } catch (error) {
        console.log(error);
        // handle the error, e.g. display an error message to the user
      }
    }

    fetchData();
  }, []);



  return (
    <div className="font-inter">
      <div className="grid grid-cols-2 gap-2 p-4">
        {dataLoaded && (<>
          <div className="col-span-2 p-3 text-black"><DecadeSelector /></div>
          <div className="h-[80vh]" ><Map /></div>
          <div className="col-span-1 p-3 h-[80vh]"><LineChart /></div>
          <div className="p-3 col-span-2 max-h-[50vh]" style={{ backgroundColor: '2D2D34' }}><DataTable /></div>
        </>
        )}
      </div>
    </div>

  )
}

