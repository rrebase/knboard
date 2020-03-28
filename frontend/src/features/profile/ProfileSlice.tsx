import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetail, Avatar } from "types";
import api, { API_USERS, API_AVATARS } from "api";
import { RootState } from "store";

export const fetchUserDetail = createAsyncThunk<UserDetail>(
  "profile/fetchUserDetailStatus",
  async (_, { getState }) => {
    const id = (getState() as RootState).auth.user?.id;
    const response = await api.get(`${API_USERS}${id}/`);
    return response.data;
  }
);

export const fetchAvatarList = createAsyncThunk<Avatar[]>(
  "profile/fetchAvatarListStatus",
  async () => {
    const response = await api.get(API_AVATARS);
    return response.data;
  }
);

interface InitialState {
  avatars: string[];
  userDetail: UserDetail | null;
}

export const initialState: InitialState = {
  avatars: [],
  userDetail: null
};

export const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = slice.actions;

export default slice.reducer;
