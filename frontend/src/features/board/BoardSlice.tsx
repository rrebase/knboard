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
  detailError?: string;
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
  detailError: undefined
};

interface ColumnsResponse extends IColumn {
  tasks: ITask[];
}

interface BoardDetailResponse extends Board {
  columns: ColumnsResponse[];
}

export const fetchAllBoards = createAsyncThunk<Board[]>(
  "board/fetchAllStatus",
  async () => {
    const response = await api.get(API_BOARDS);
    return response.data;
  }
);

export const fetchBoardById = createAsyncThunk<
  BoardDetailResponse,
  string,
  {
    rejectValue: string;
  }
>("board/fetchByIdStatus", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_BOARDS}${id}/`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

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
  extraReducers: builder => {
    builder.addCase(fetchAllBoards.pending, state => {
      state.fetchLoading = true;
    });
    builder.addCase(fetchAllBoards.fulfilled, (state, action) => {
      state.entities = action.payload;
      state.fetchError = null;
      state.fetchLoading = false;
    });
    builder.addCase(fetchAllBoards.rejected, (state, action) => {
      state.fetchError = action.payload as string;
      state.fetchLoading = false;
    });
    builder.addCase(fetchBoardById.pending, state => {
      state.detailLoading = true;
    });
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const { id, name, owner, members } = action.payload;
      state.detail = { id, name, owner, members };
      state.detailError = undefined;
      state.detailLoading = false;
    });
    builder.addCase(fetchBoardById.rejected, (state, action) => {
      state.detailError = action.payload;
      state.detailLoading = false;
    });
    builder.addCase(createBoard.pending, state => {
      state.createLoading = true;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.entities.push(action.payload);
      state.createError = null;
      state.createLoading = false;
      state.createDialogOpen = false;
    });
    builder.addCase(createBoard.rejected, (state, action) => {
      state.createError = action.payload as string;
      state.createLoading = false;
    });
  }
});

export const { setCreateDialogOpen } = slice.actions;

export default slice.reducer;
