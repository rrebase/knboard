import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppDispatch } from "store";
import { Board, IColumn, ITask, BoardMember } from "types";
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
    },
    getBoardDetailStart: state => {
      state.detailLoading = true;
    },
    getBoardDetailSuccess: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      const { id, name, owner, members } = action.payload;
      state.detail = { id, name, owner, members };
      state.detailError = null;
      state.detailLoading = false;
    },
    getBoardDetailFail: (state, action: PayloadAction<string>) => {
      state.detailError = action.payload;
      state.detailLoading = false;
    },
    addBoardMember: (state, action: PayloadAction<BoardMember>) => {
      state.detail?.members.push(action.payload);
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
  setCreateDialogOpen,
  getBoardDetailStart,
  getBoardDetailSuccess,
  getBoardDetailFail,
  addBoardMember
} = slice.actions;

export const fetchBoardList = (): AppThunk => async (dispatch: AppDispatch) => {
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

export const fetchBoardDetail = (id: string): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(getBoardDetailStart());
  try {
    const response = await api.get(`${API_BOARDS}${id}/`);
    dispatch(getBoardDetailSuccess(response.data));
  } catch (err) {
    dispatch(getBoardDetailFail(err.toString()));
  }
};

export default slice.reducer;
