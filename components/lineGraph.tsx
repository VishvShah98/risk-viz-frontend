import Chart from 'chart.js/auto';
import state from '../state';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { ChartOptions } from 'chart.js';
import { Typography } from '@mui/material';

const LineChart = () => {

  const snapshot = useSnapshot(state);

  //labels gets the years for x-axis
  const labels = state.graphData[0].data.map((item: any) => item.Year);

  //set data for graph
  const datasets = state.graphData.map((item: any) => {
    return {
      label: item._id['Business Category'],
      data: item.data.map((item: any) => item['Risk Rating Avg']),
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // generate a random color for each line
      fill: false,
    };
  });

  //select data for graph
  const [selectedCategory, setSelectedCategory] = useState(datasets[0].label);
  const selectedDataset = datasets.find((dataset: any) => dataset.label === selectedCategory);

  const data = useMemo(() => ({
    labels: labels,
    datasets: selectedDataset ? [selectedDataset] : [],
  }), [labels, selectedDataset]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    scales: {
      x: {
        display: true,//display x-axis
        title: {
          display: true,//display title
          text: 'Year',//title text
          align: 'center',//title alignment
          font: {
            weight: 'bolder',//title font weight
            size: 12,//title font size
          },
          padding: 5,//title padding
          fullSize: true,//title full size
        },
      },
      y: {
        display: true,//display y-axis
        title: {
          display: true,//display title
          text: 'Risk Rating',//title text
          align: 'center',//title alignment
          font: {
            weight: 'bolder',//title font weight
            size: 12,//title font size
          },
          padding: 5,//title padding
          fullSize: true,//title full size
        }
      }
    },

    plugins: {
      tooltip: {
        boxWidth: 1,//tooltip box width
        backgroundColor: 'black', // Change the background color of the tooltip
        titleFont: {
          color: 'white', // Change the font color of the tooltip title
          size: 14, // Change the font size of the tooltip title
          weight: 'bold', // Change the font weight of the tooltip title
        },
        bodyFont: {
          color: 'white', // Change the font color of the tooltip body
          size: 12, // Change the font size of the tooltip body
          weight: 'normal', // Change the font weight of the tooltip body
        },
        // Custom positioner function
        position: (context: any, event: any) => {
          const chart = context.chart;
          const positioner = chart?.tooltip?.getPositioner?.(context, event);
          if (positioner) {
            return 'nearest';
          } else {
            return 'average';
          }
        },
        // Custom tooltip function
        callbacks: {
          label: function (context: any) {
            const graphData = true;
            if (graphData) {
              const riskFactorsAvg = state.graphData[context.datasetIndex].data[context.dataIndex]['Risk Factors Avg'];
              const sortedRiskFactorsKeys = Object.keys(riskFactorsAvg).sort((a, b) => riskFactorsAvg[b] - riskFactorsAvg[a]);

              const riskFactorsAvgString = sortedRiskFactorsKeys
                .map(key => `${key}: ${riskFactorsAvg[key].toFixed(2)}`)
                .join('; ');

              return `Risk Factors: ${riskFactorsAvgString}`;
            } else {
              return '';
            }
          },
        },
      },
      title: {
        display: true,//display title
        text: `Asset Name: ${snapshot.graphData[0]._id['Asset Name']}`,//title text
        color: 'black',//title color
        position: 'top',//title position
        align: 'center',//title alignment
        font: {
          weight: 'bolder',//title font weight
          size: 15,//title font size
        },
        padding: 5,//title padding
        fullSize: true,//title full size
      },
      legend: {
        display: false, // set display to false to hide the legend
      },
    },

    backgroundColor: 'white',

  }), [snapshot.graphData]);

  const canvasRef = useRef(null);

  //create chart
  useEffect(() => {
    if (!canvasRef.current) return console.log('no canvas ref');
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: data,
      options: options,
    });
    return () => {
      chart.destroy();
    };
  }, [data, options]);

  //handle change of category
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  //dropdown menu for categories
  const categoryOptions = datasets.map((dataset: any) => {
    return (
      <option key={dataset.label} value={dataset.label}>
        {dataset.label}
      </option>
    );
  });

  return (
    <div style={{ position: 'relative' }}>
      <Typography  style={{ color: 'white', marginBottom: '1rem', fontWeight: 500 }}>Climate Risk Rating Line Graph Over Time</Typography>
      <select id="category-select" style={{ color: 'white', position: 'absolute', background: 'grey', top: '7vh', right: '0vw' }} value={selectedCategory} onChange={handleCategoryChange}>
        {categoryOptions}
      </select>
      <canvas ref={canvasRef} style={{
        backgroundColor: 'white', borderRadius: '10px'
        , boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }}></canvas>
    </div>
  );
};

export default LineChart;
