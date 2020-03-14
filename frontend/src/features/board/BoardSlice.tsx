import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppDispatch } from "store";
import { Board } from "types";
import { api, BOARDS } from "endpoints";

interface InitialState {
  entities: Board[];
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  entities: [],
  loading: false,
  error: null
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getBoardsStart: state => {
      state.loading = true;
    },
    getBoardsSuccess: (state, action: PayloadAction<Board[]>) => {
      state.entities = action.payload;
      state.error = null;
      state.loading = false;
    },
    getBoardsFail: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

const { getBoardsStart, getBoardsSuccess, getBoardsFail } = slice.actions;

export const fetchBoards = (): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(getBoardsStart());
  try {
    const response = await api.get(BOARDS);
    dispatch(getBoardsSuccess(response.data));
  } catch (e) {
    dispatch(getBoardsFail("Failed to fetch boards."));
  }
};

export default slice.reducer;
