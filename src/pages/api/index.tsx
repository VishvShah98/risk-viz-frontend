import axios from "axios";
import state from "../../../state";


export const getDataByDecade = async (decade: number) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/getDataByDecade?decade=${decade}`);
    state.data = response.data;
    // Update the state data with the fetched data

    // return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//get agg data by asset name
export const getAggDataByAssetName = async (assetName: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/getAggDataByAssetName?assetname=${assetName}`);
    state.graphData = response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDecades = async (): Promise<number[]> => {
  const response = await axios.get<number[]>(process.env.NEXT_PUBLIC_URL + "api/getDecades");
  return response.data;
};
