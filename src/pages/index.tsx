'use client';
import { useEffect, useState } from 'react';
import React from 'react'
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import Map from '../../components/mapContainer';
import LineChart from '../../components/lineGraph';
import DataTable from '../../components/dataTable';
import DecadeSelector from '../../components/decadeSelector'
import LandingPage from '../../components/landingPage';

import { getDataByDecade, getDecades, getAggDataByAssetName } from './api';
import state from '../../state';

export default function Home() {

  //dataLoaded checks if data is loaded in order to render components
  const [dataLoaded, setDataLoaded] = useState(false);

  //showData is used to toggle(hide or display) the data table and graph
  const [showData, setShowData] = useState(false);

  //snapshot is used to watch the updates in state variables
  const snapshot = useSnapshot(state);

  //toggleShowData is used to toggle(true or false) showData
  function toggleShowData() {
    setShowData(!showData);
  }

  //useEffect is used to fetch data from the api and set the state variables. 
  useEffect(() => {
    async function fetchData() {
      try {
        //getDecades() returns an array of decades
        const decades = await getDecades();

        //if there are more than one decade, set the first decade as the current decade
        if (decades.length > 1) {
          state.decade = decades[0];

          //getDataByDecade() returns an array of data points for the current decade
          await getDataByDecade(state.decade);
        }

        //if there are more than 10 data points, get the aggregate data by asset name
        if (state.data.length > 10) {
          
          //getAggDataByAssetName() returns an array of data points for each asset name
          await getAggDataByAssetName(state.data[0]["Asset Name"]);
        }

        //if there are more than 2 data points, set dataLoaded to true
        if (state.graphData.length > 2) {
          setDataLoaded(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchData();
  }, []);



  return (
    <>
      <LandingPage />

      {/* Render components only if data is loaded */}
      {dataLoaded && (<>

        <div style={{ height: '100vh', width: '100%', marginTop: '2vh' }} className='font-inter'>
          <div
            id='main-content'
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              color: 'black'
            }}>
            <DecadeSelector />
            <button onClick={toggleShowData}
              style={{  backgroundColor: showData ? 'black' : 'white', 
              color: showData ? 'white' : 'black', 
              borderRadius: '20px', 
              padding: '5px 10px', 
              fontWeight: 600, 
              border: '2px solid black',
              transition: 'all 0.3s ease',
              outline: 'none',
              cursor: 'pointer'}}>
              {showData ? 'Hide Asset Data' : 'Show Asset Data'}
            </button>
          </div>

          {/* Only display map at first render. Line Chart and Data Table are displayed when "Show Data" button is clicked*/}
          <div style={{ height: '100vh', position: 'relative', marginTop: '5vh' }}>
            <motion.div
              initial={{ scale: 1.25 }}
              animate={{
                x: showData ? '-25vw' : 0,
                y: showData ? '-25vh' : 0,
                top: showData ? 0 : '-25vh',
                scale: showData ? 1 : 1.25,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                height: '50vh',
                width: '45vw', backgroundColor: 'transparent', position: 'absolute',
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
                opacity: showData ? 1 : 0,
                x: showData ? '25vw' : 0,
                y: showData ? '-25vh' : 0,
                scale: showData ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
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
                opacity: showData ? 1 : 0,
                y: showData ? '35vh' : 0,
                scale: showData ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <DataTable />
            </motion.div>
          </div>
        </div>
      </>
      )}
    </>
  )

}





