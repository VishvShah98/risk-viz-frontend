import { useEffect } from "react";
import useSWR from 'swr';
import { getDataByDecade } from "../src/pages/api";
import state from "../state";

const fetchData = async (decade: number) => {
    try {
        const data = await getDataByDecade(decade);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const useFetchDataByDecade = () => {
    const { data, error } = useSWR(state.decade.toString(),
        fetchData,
        { revalidateOnFocus: false });

    useEffect(() => {
        if (data) {
            state.data = data;
        }
    }, [data]);
};
