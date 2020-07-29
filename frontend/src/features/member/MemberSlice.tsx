import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { BoardMember } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { RootState } from "store";

const memberAdapter = createEntityAdapter<BoardMember>({
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});

interface ExtraInitialState {
  dialogMember: number | null;
  memberListOpen: boolean;
}

export const initialState = memberAdapter.getInitialState<ExtraInitialState>({
  dialogMember: null,
  memberListOpen: false,
});

export const slice = createSlice({
  name: "member",
  initialState,
  reducers: {
    addBoardMembers: memberAdapter.addMany,
    removeBoardMember: memberAdapter.removeOne,
    setDialogMember: (state, action: PayloadAction<number | null>) => {
      state.dialogMember = action.payload;
    },
    setMemberListOpen: (state, action: PayloadAction<boolean>) => {
      state.memberListOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      memberAdapter.setAll(state, action.payload.members);
    });
  },
});

export const {
  addBoardMembers,
  removeBoardMember,
  setDialogMember,
  setMemberListOpen,
} = slice.actions;

const memberSelectors = memberAdapter.getSelectors(
  (state: RootState) => state.member
);

export const {
  selectAll: selectAllMembers,
  selectEntities: selectMembersEntities,
  selectTotal: selectMembersTotal,
} = memberSelectors;

export default slice.reducer;
