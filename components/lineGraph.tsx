import Chart from 'chart.js/auto';
import state from '../state';
import { useRef, useEffect, useState, useMemo } from 'react';

const LineChart = () => {
  const labels = state.graphData[0].data.map((item: any) => item.Year);
//console.log('sg:',state.graphData);

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

  const options = useMemo(() => ({

    scales: {
      x: {
        disply: true,
        title: {
          display: true,
          text: 'Year'
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Average Risk Rating'
        }
    }},
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
              return `Risk Factors Avg: ${riskFactorsAvgString}`;
            } else {
              return '';
            }
          },
        },

      },
    },
    backgroundColor: 'white',
  }), []);;


  const canvasRef = useRef(null);

  //const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if(!canvasRef.current) return console.log('no canvas ref' );
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
    <div style={{ height: '100%' }} >
      <h2 style={{ marginBottom: '20px' }}>Asset Name: {state.graphData[0]._id['Asset Name']}</h2>
      <div style={{ marginBottom: '40px' }}>
        <label htmlFor="category-select" style={{ marginRight: '10px' }}>Select a Business Category:  </label>
        <select id="category-select" style={{ color: 'black' }} value={selectedCategory} onChange={handleCategoryChange}>
          {categoryOptions}
        </select>
      </div>
      <canvas ref={canvasRef} style={{
        backgroundColor: 'white', borderRadius: '10px',
        boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
      }}></canvas>
    </div>
  );
};

export default LineChart;
