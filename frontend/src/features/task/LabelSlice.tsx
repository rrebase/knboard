import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk
} from "@reduxjs/toolkit";
import { Label } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { RootState } from "store";
import api, { API_LABELS } from "api";

export const createLabel = createAsyncThunk<Label, Omit<Label, "id">>(
  "label/createLabelStatus",
  async label => {
    const response = await api.post(`${API_LABELS}`, label);
    return response.data;
  }
);

const labelAdapter = createEntityAdapter<Label>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const initialState = labelAdapter.getInitialState({});

export const slice = createSlice({
  name: "label",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      labelAdapter.setAll(state, action.payload.labels);
    });
    builder.addCase(createLabel.fulfilled, (state, action) => {
      labelAdapter.addOne(state, action.payload);
    });
  }
});

export const labelSelectors = labelAdapter.getSelectors(
  (state: RootState) => state.label
);

const { selectAll } = labelSelectors;
export const selectAllLabels = selectAll;

export default slice.reducer;
