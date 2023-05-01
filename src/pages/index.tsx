'use client';
import { useEffect, useState } from 'react';
import React from 'react'
import { motion } from 'framer-motion';
import Map from '../../components/mapContainer';
import LineChart from '../../components/lineGraph';
import DataTable from '../../components/dataTable';
import DecadeSelector from '../../components/decadeSelector'
import { useSnapshot } from 'valtio';
import { getDataByDecade, getDecades, getAggDataByAssetName } from './api';
import state from '../../state';
import LandingPage from '../../components/landingPage';


export default function Home() {

  const [dataLoaded, setDataLoaded] = useState(false);
  const snapshot = useSnapshot(state);

  function toggleShowData() {
    state.showData = !state.showData;
  }

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
        if (state.graphData.length > 2) {
          setDataLoaded(true);

        }
      } catch (error) {
        console.log(error);
        // handle the error, e.g. display an error message to the user
      }
    }

    fetchData();
  }, []);



  return (<>
    <LandingPage />  {dataLoaded && (<>
      <div style={{ height: '100vh', width: '100%', marginTop: '2vh' }} className='font-inter'>

        <div
          id='main-content'
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            color: 'black'
          }}> <DecadeSelector />
          <button onClick={toggleShowData} style={{ backgroundColor: 'white', color: 'black', borderRadius: '20px', padding: '5px 10px 5px 10px' }}>
            {state.showData ? 'Hide Data' : 'Show Data'}
          </button></div>
        <div id='motion components' style={{ height: '100vh', position: 'relative', marginTop: '5vh' }}>
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{
              x: state.showData ? '-25vw' : 0,
              y: state.showData ? '-25vh' : 0,
              scale: state.showData ? 1 : 1.25,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              height: '50vh', width: '45vw', backgroundColor: 'transparent', position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 'auto',
            }}
          >
            <Map />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: state.showData ? 1 : 0,
              x: state.showData ? '25vw' : 0,
              y: state.showData ? '-25vh' : 0,
              scale: state.showData ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
            style={{
              height: '50vh', width: '45vw', backgroundColor: 'transparent', position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 'auto',

            }}
          >
            <LineChart />
          </motion.div>
          <motion.div
            style={{
              height: '40vh', width: '95vw', backgroundColor: 'transparent', position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 'auto',

            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: state.showData ? 1 : 0,
              y: state.showData ? '30vh' : 0,
              scale: state.showData ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
          ><DataTable /></motion.div></div>

      </div> </>
    )}

  </>

  )





}





