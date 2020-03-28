import {
  createSlice,
  PayloadAction,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { BoardMember } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { RootState } from "store";

const memberAdapter = createEntityAdapter<BoardMember>({
  sortComparer: (a, b) => a.username.localeCompare(b.username)
});

interface ExtraInitialState {
  dialogMember: number | null;
}

export const initialState = memberAdapter.getInitialState<ExtraInitialState>({
  dialogMember: null
});

export const slice = createSlice({
  name: "member",
  initialState,
  reducers: {
    addBoardMember: memberAdapter.addOne,
    removeBoardMember: memberAdapter.removeOne,
    setDialogMember: (state, action: PayloadAction<number | null>) => {
      state.dialogMember = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      memberAdapter.setAll(state, action.payload.members);
    });
  }
});

export const {
  addBoardMember,
  removeBoardMember,
  setDialogMember
} = slice.actions;

export const memberSelectors = memberAdapter.getSelectors(
  (state: RootState) => state.member
);

export default slice.reducer;
