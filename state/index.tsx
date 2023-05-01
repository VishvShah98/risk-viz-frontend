import { proxy } from 'valtio';
import { DataPoint, GraphDataPoint } from '../components/types';

const state = proxy({
  decade: 0,
  data: []as DataPoint[],
  graphData: []as GraphDataPoint[],
  tabelFilter: '',
  showData: false,
  dataLoaded: false,
});

export default state;

