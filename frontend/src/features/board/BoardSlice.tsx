import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Board, IColumn, Id, ITask, Label, NanoBoard } from "types";
import api, { API_BOARDS } from "api";
import { RootState } from "store";
import { logout } from "features/auth/AuthSlice";

interface InitialState {
  detail: Board | null;
  all: NanoBoard[];
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
  all: [],
  fetchLoading: true,
  fetchError: null,
  createDialogOpen: false,
  createLoading: false,
  createError: null,
  detailLoading: false,
  detailError: undefined,
};

interface PatchFields {
  name: string;
}

export const patchBoard = createAsyncThunk<
  Board,
  { id: Id; fields: Partial<PatchFields> }
>("board/patchBoardStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_BOARDS}${id}/`, fields);
  return response.data;
});

interface ColumnsResponse extends IColumn {
  tasks: ITask[];
}

interface BoardDetailResponse extends Board {
  columns: ColumnsResponse[];
  labels: Label[];
}

export interface BoardSearchQuery {
  boardId: string | number;
  assigneeIds?: number[];
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
  BoardSearchQuery,
  {
    rejectValue: string;
  }
>("board/fetchByIdStatus", async (boardSearchQuery, { rejectWithValue }) => {
  try {
    const queryString = boardSearchQuery.assigneeIds
      ? `?assignees=${boardSearchQuery.assigneeIds}`
      : "";
    const response = await api.get(
      `${API_BOARDS}${boardSearchQuery.boardId}/${queryString}`
    );
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createBoard = createAsyncThunk<Board, string>(
  "board/createBoardStatus",
  async (name) => {
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBoards.pending, (state) => {
      state.fetchLoading = true;
      state.fetchError = null;
      state.detailError = undefined;
    });
    builder.addCase(fetchAllBoards.fulfilled, (state, action) => {
      state.all = action.payload;
      state.fetchError = null;
      state.fetchLoading = false;
    });
    builder.addCase(fetchAllBoards.rejected, (state, action) => {
      state.fetchError = action.payload as string;
      state.fetchLoading = false;
    });
    builder.addCase(fetchBoardById.pending, (state) => {
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
    builder.addCase(createBoard.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.all.push(action.payload);
      state.createError = null;
      state.createLoading = false;
      state.createDialogOpen = false;
    });
    builder.addCase(createBoard.rejected, (state, action) => {
      state.createError = action.payload as string;
      state.createLoading = false;
    });
    builder.addCase(patchBoard.fulfilled, (state, action) => {
      if (state.detail !== null) {
        state.detail.name = action.payload.name;
      }
      state.detailError = undefined;
      state.detailLoading = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.all = [];
      state.detail = null;
    });
  },
});

export const { setCreateDialogOpen } = slice.actions;

export const currentBoardOwner = (state: RootState) => {
  return (
    Boolean(state.auth.user) &&
    state.board.detail?.owner === state.auth.user?.id
  );
};

export default slice.reducer;
