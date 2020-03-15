import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppDispatch } from "store";
import { Board } from "types";
import api, { API_BOARDS } from "api";

interface InitialState {
  entities: Board[];
  fetchLoading: boolean;
  fetchError: string | null;
  createDialogOpen: boolean;
  createLoading: boolean;
  createError: string | null;
}

export const initialState: InitialState = {
  entities: [],
  fetchLoading: false,
  fetchError: null,
  createDialogOpen: false,
  createLoading: false,
  createError: null
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getBoardsStart: state => {
      state.fetchLoading = true;
    },
    getBoardsSuccess: (state, action: PayloadAction<Board[]>) => {
      state.entities = action.payload;
      state.fetchError = null;
      state.fetchLoading = false;
    },
    getBoardsFail: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
      state.fetchLoading = false;
    },
    createBoardStart: state => {
      state.createLoading = true;
    },
    createBoardSuccess: (state, action: PayloadAction<Board>) => {
      state.entities.push(action.payload);
      state.createError = null;
      state.createLoading = false;
      state.createDialogOpen = false;
    },
    createBoardFail: (state, action: PayloadAction<string>) => {
      state.createError = action.payload;
      state.createLoading = false;
    },
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createDialogOpen = action.payload;
    }
  }
});

export const {
  getBoardsStart,
  getBoardsSuccess,
  getBoardsFail,
  createBoardStart,
  createBoardSuccess,
  createBoardFail,
  setCreateDialogOpen
} = slice.actions;

export const fetchBoards = (): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(getBoardsStart());
  try {
    const response = await api.get(API_BOARDS);
    dispatch(getBoardsSuccess(response.data));
  } catch (err) {
    dispatch(getBoardsFail(err.toString()));
  }
};

export const createBoard = (name: string): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(createBoardStart());
  try {
    const response = await api.post(API_BOARDS, { name });
    dispatch(createBoardSuccess(response.data));
  } catch (err) {
    dispatch(createBoardFail(err.toString()));
  }
};

export default slice.reducer;
