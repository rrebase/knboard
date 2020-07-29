import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Label, Id } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { RootState } from "store";
import api, { API_LABELS } from "api";
import { createInfoToast, createErrorToast } from "features/toast/ToastSlice";
import { AxiosError } from "axios";

export const createLabel = createAsyncThunk<Label, Omit<Label, "id">>(
  "label/createLabelStatus",
  async (label, { dispatch }) => {
    const response = await api.post(`${API_LABELS}`, label);
    dispatch(createInfoToast("Label created"));
    return response.data;
  }
);

export const patchLabel = createAsyncThunk<
  Label,
  { id: Id; fields: Partial<Label> }
>(
  "label/patchLabelStatus",
  async ({ id, fields }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_LABELS}${id}/`, fields);
      dispatch(createInfoToast("Label updated"));
      return response.data;
    } catch (err) {
      const error: AxiosError = err;
      if (!error.response) {
        throw err;
      }
      dispatch(createErrorToast(error.response.data));
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLabel = createAsyncThunk<Id, Id>(
  "label/deleteLabelStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_LABELS}${id}/`);
    dispatch(createInfoToast("Label deleted"));
    return id;
  }
);

const labelAdapter = createEntityAdapter<Label>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

interface ExtraInitialState {
  dialogOpen: boolean;
}

export const initialState = labelAdapter.getInitialState<ExtraInitialState>({
  dialogOpen: false,
});

export const slice = createSlice({
  name: "label",
  initialState,
  reducers: {
    setDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      labelAdapter.setAll(state, action.payload.labels);
    });
    builder.addCase(createLabel.fulfilled, (state, action) => {
      labelAdapter.addOne(state, action.payload);
    });
    builder.addCase(patchLabel.fulfilled, (state, action) => {
      const { id, name, color } = action.payload;
      labelAdapter.updateOne(state, { id, changes: { name, color } });
    });
    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      labelAdapter.removeOne(state, action.payload);
    });
  },
});

export const { setDialogOpen } = slice.actions;

export const labelSelectors = labelAdapter.getSelectors(
  (state: RootState) => state.label
);

export const {
  selectAll: selectAllLabels,
  selectEntities: selectLabelEntities,
} = labelSelectors;

export default slice.reducer;
