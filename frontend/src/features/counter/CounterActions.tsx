import { AppDispatch, AppThunk } from "../../store";
import {
  fetchValueStart,
  fetchValueSuccess,
  fetchValueError
} from "./CounterSlice";
import axios from "axios";

export const sleep = (t = Math.random() * 200 + 300) =>
  new Promise(resolve => setTimeout(resolve, t));

export const fetchInitialValue = (): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(fetchValueStart());
  try {
    // For demo purpose let's say out value is the length
    // of project name in manifest and the api call is slow
    await sleep();
    const response = await axios.get("/manifest.json");
    const value = response.data.name.length;
    dispatch(fetchValueSuccess(value));
  } catch (e) {
    dispatch(fetchValueError("Something went wrong."));
  }
};
