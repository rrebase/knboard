import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

interface InitialState {
  mobileDrawerOpen: boolean;
}

export const initialState: InitialState = {
  mobileDrawerOpen: false,
};

export const slice = createSlice({
  name: "responsive",
  initialState,
  reducers: {
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileDrawerOpen = action.payload;
    },
  },
});

export const { setMobileDrawerOpen } = slice.actions;

export const mobileDrawerOpen = (store: RootState) =>
  store.responsive.mobileDrawerOpen;

export default slice.reducer;
