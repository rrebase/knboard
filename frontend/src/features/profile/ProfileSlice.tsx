import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetail, Avatar } from "types";
import api, { API_USERS, API_AVATARS } from "api";
import { RootState } from "store";
import { createSuccessToast } from "features/toast/ToastSlice";

export interface ValidationErrors extends Partial<UserDetail> {
  non_field_errors?: string[];
}

export const fetchUserDetail = createAsyncThunk<UserDetail>(
  "profile/fetchUserDetailStatus",
  async (_, { getState }) => {
    const id = (getState() as RootState).auth.user?.id;
    const response = await api.get(`${API_USERS}${id}/`);
    return response.data;
  }
);

export const updateUser = createAsyncThunk<
  UserDetail,
  UserDetail,
  {
    rejectValue: ValidationErrors;
  }
>(
  "profile/updateUserStatus",
  async (userData, { dispatch, getState, rejectWithValue }) => {
    try {
      const id = (getState() as RootState).auth.user?.id;
      const response = await api.put(`${API_USERS}${id}/`, userData);
      dispatch(createSuccessToast("User saved"));
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const updateAvatar = createAsyncThunk<Avatar, number>(
  "profile/updateAvatarStatus",
  async (avatarId, { dispatch, getState }) => {
    const id = (getState() as RootState).auth.user?.id;
    const response = await api.post(`${API_USERS}${id}/update_avatar/`, {
      id: avatarId
    });
    dispatch(createSuccessToast("Avatar saved"));
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
  avatars: Avatar[];
  userDetail: UserDetail | null;
  loading: boolean;
  apiErrors?: ValidationErrors;
}

export const initialState: InitialState = {
  avatars: [],
  userDetail: null,
  loading: false,
  apiErrors: undefined
};

export const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      state.userDetail = action.payload;
    });
    builder.addCase(fetchAvatarList.fulfilled, (state, action) => {
      state.avatars = action.payload;
    });
    builder.addCase(updateUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.userDetail = action.payload;
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.apiErrors = action.payload;
      state.loading = false;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      if (state.userDetail) {
        state.userDetail.avatar = action.payload;
      }
    });
  }
});

export const {} = slice.actions;

export default slice.reducer;
