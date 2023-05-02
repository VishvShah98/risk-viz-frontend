import { proxy } from 'valtio';
import { DataPoint, GraphDataPoint } from '../components/types';

const state = proxy({

  //decade is used to set the initial decade
  decade: 0,

  //data is used to plot markers on the map
  data: []as DataPoint[],

  //graphData is used to plot the line chart
  graphData: []as GraphDataPoint[],
  
  //tableFilter is used to filter Asset Name in data table when a marker is clicked
  tabelFilter: '',
  
});

export default state;

