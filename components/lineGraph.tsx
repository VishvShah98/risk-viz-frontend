import Chart from 'chart.js/auto';
import state from '../state';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { ChartOptions } from 'chart.js';

const LineChart = () => {
  const labels = state.graphData[0].data.map((item: any) => item.Year);
  //console.log('sg:',state.graphData);
  const snapshot = useSnapshot(state);
  const datasets = state.graphData.map((item: any) => {
    return {
      label: item._id['Business Category'],
      data: item.data.map((item: any) => item['Risk Rating Avg']),
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // generate a random color for each line
      fill: false,
    };
  });



  const [selectedCategory, setSelectedCategory] = useState(datasets[0].label);
  const selectedDataset = datasets.find((dataset: any) => dataset.label === selectedCategory);

  // const data = useMemo(() => ({
  //   labels: labels,
  //   datasets: [selectedDataset], 
  // }), [labels, selectedDataset]);
  const data = useMemo(() => ({
    labels: labels,
    datasets: selectedDataset ? [selectedDataset] : [],
  }), [labels, selectedDataset]);

  // console.log('Data: ',data)

  const options: ChartOptions<'line'> = useMemo(() => ({

    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year',
          align: 'center',
          font: {
            weight: 'bolder',
            size: 12,
          },
          padding: 5,
          fullSize: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Risk Rating',
          align: 'center',
          font: {
            weight: 'bolder',
            size: 12,
          },
          padding: 5,
          fullSize: true,
        }
      }
    },
    plugins: {
      tooltip: {
        boxWidth: 1,
        position: (context: any, event: any) => {
          const chart = context.chart;
          const positioner = chart?.tooltip?.getPositioner?.(context, event);
          if (positioner) {
            return 'nearest';
          } else {
            return 'average';
          }
        },
        callbacks: {
          label: function (context: any) {
            const graphData = true;
            if (graphData) {
              const riskFactorsAvg = state.graphData[context.datasetIndex].data[context.dataIndex]['Risk Factors Avg']
              //console.log('riskFactorsAvg: ', riskFactorsAvg);
              const firstKey = Object.keys(riskFactorsAvg)[0];
              const firstValue = riskFactorsAvg[firstKey].toFixed(2);
              const restOfRiskFactorsAvgString = Object.keys(riskFactorsAvg)
                .slice(1)
                .reduce((acc, cur) => (acc += `\n${cur}: ${riskFactorsAvg[cur].toFixed(2)};`), '');

              const riskFactorsAvgString = `${firstKey}: ${firstValue};${restOfRiskFactorsAvgString}`;

              //console.log('riskFactorsAvgString: ', riskFactorsAvgString);
              return `Risk Factors: ${riskFactorsAvgString}`;
            } else {
              return '';
            }
          },
        },

      },
      title: {
        display: true,
        text: `Asset Name: ${snapshot.graphData[0]._id['Asset Name']}`,
        color: 'black',
        position: 'top',
        align: 'center',
        font: {
          weight: 'bolder',
          size: 15,
        },
        padding: 5,
        fullSize: true,
      },

      legend: {
        display: false, // set display to false to hide the legend
      },

    },
    backgroundColor: 'white',
  }), [snapshot.graphData]);;


  const canvasRef = useRef(null);

  //const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const categoryOptions = datasets.map((dataset: any) => {
    return (
      <option key={dataset.label} value={dataset.label}>
        {dataset.label}
      </option>
    );
  });

  return (

    <div style={{ position: 'relative' }}>
      <select id="category-select" style={{ color: 'white', position: 'absolute', background: 'darkgrey', top: '0vh', right: '0vw' }} value={selectedCategory} onChange={handleCategoryChange}>
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
