import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Board, IColumn, ITask } from "types";
import api, { API_BOARDS } from "api";

interface InitialState {
  detail: Board | null;
  entities: Board[];
  fetchLoading: boolean;
  fetchError: string | null;
  createDialogOpen: boolean;
  createLoading: boolean;
  createError: string | null;
  detailLoading: boolean;
  detailError: string | null;
}

export const initialState: InitialState = {
  detail: null,
  entities: [],
  fetchLoading: false,
  fetchError: null,
  createDialogOpen: false,
  createLoading: false,
  createError: null,
  detailLoading: false,
  detailError: null
};

interface ColumnsResponse extends IColumn {
  tasks: ITask[];
}

export interface BoardDetailResponse extends Board {
  columns: ColumnsResponse[];
}

export const fetchAllBoards = createAsyncThunk<Board[]>(
  "board/fetchAllStatus",
  async () => {
    const response = await api.get(API_BOARDS);
    return response.data;
  }
);

export const fetchBoardById = createAsyncThunk<Board, string>(
  "board/fetchByIdStatus",
  async id => {
    const response = await api.get(`${API_BOARDS}${id}/`);
    return response.data;
  }
);

export const createBoard = createAsyncThunk<Board, string>(
  "board/createBoardStatus",
  async name => {
    const response = await api.post(API_BOARDS, { name });
    return response.data;
  }
);

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createDialogOpen = action.payload;
    }
  },
  extraReducers: {
    [fetchAllBoards.pending.type]: state => {
      state.fetchLoading = true;
    },
    [fetchAllBoards.fulfilled.type]: (state, action) => {
      state.entities = action.payload;
      state.fetchError = null;
      state.fetchLoading = false;
    },
    [fetchAllBoards.rejected.type]: (state, action) => {
      state.fetchError = action.payload;
      state.fetchLoading = false;
    },
    [fetchBoardById.pending.type]: state => {
      state.detailLoading = true;
    },
    [fetchBoardById.fulfilled.type]: (state, action) => {
      const { id, name, owner, members } = action.payload;
      state.detail = { id, name, owner, members };
      state.detailError = null;
      state.detailLoading = false;
    },
    [fetchBoardById.rejected.type]: (state, action) => {
      state.detailError = action.payload;
      state.detailLoading = false;
    },
    [createBoard.pending.type]: state => {
      state.createLoading = true;
    },
    [createBoard.fulfilled.type]: (state, action) => {
      state.entities.push(action.payload);
      state.createError = null;
      state.createLoading = false;
      state.createDialogOpen = false;
    },
    [createBoard.rejected.type]: (state, action) => {
      state.createError = action.payload;
      state.createLoading = false;
    }
  }
});

export const { setCreateDialogOpen } = slice.actions;

export default slice.reducer;
