import {
  createSlice,
  PayloadAction,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { BoardMember } from "types";
import {
  getBoardDetailSuccess,
  BoardDetailResponse
} from "features/board/BoardSlice";
import { RootState } from "store";

const memberAdapter = createEntityAdapter({
  sortComparer: (a: BoardMember, b: BoardMember) =>
    a.username.localeCompare(b.username)
});

export const slice = createSlice({
  name: "member",
  initialState: memberAdapter.getInitialState(),
  reducers: {
    addBoardMember: memberAdapter.addOne,
    removeBoardMember: memberAdapter.removeOne
  },
  extraReducers: {
    [getBoardDetailSuccess.type]: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      memberAdapter.setAll(state, action.payload.members);
    }
  }
});

export const { addBoardMember, removeBoardMember } = slice.actions;

export const memberSelectors = memberAdapter.getSelectors(
  (state: RootState) => state.member
);

export default slice.reducer;
