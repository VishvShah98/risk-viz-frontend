import axios from "axios";
import state from "../../../state";


//get data by decade
export const getDataByDecade = async (decade: number) => {
  try {
    //get data from the api and set the data in state
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/getDataByDecade?decade=${decade}`);
    state.data = response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//get aggregated data by asset name
export const getAggDataByAssetName = async (assetName: string) => {
  try {
    //get data from the api and set the data in state
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/getAggDataByAssetName?assetname=${assetName}`);
    state.graphData = response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//get a list of decades
export const getDecades = async (): Promise<number[]> => {
  //get data from the api and return the data
  const response = await axios.get<number[]>(process.env.NEXT_PUBLIC_URL + "api/getDecades");
  return response.data;
};


