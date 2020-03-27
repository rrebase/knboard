import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { API_LOGIN, API_LOGOUT } from "api";
import { User } from "types";
import { createErrorToast } from "features/toast/ToastSlice";

interface InitialState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  user: null,
  loading: false,
  error: null
};

interface LoginProps {
  username: string;
  password: string;
}

export const login = createAsyncThunk<User, LoginProps>(
  "auth/loginStatus",
  async credentials => {
    const response = await api.post(API_LOGIN, credentials);
    return response.data;
  }
);

export const logout = createAsyncThunk(
  "auth/logoutStatus",
  async (_, { dispatch }) => {
    try {
      await api.post(API_LOGOUT);
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  }
);

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [login.pending.type]: state => {
      state.loading = true;
    },
    [login.fulfilled.type]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    [login.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    [logout.fulfilled.type]: state => {
      state.user = null;
      state.error = null;
    }
  }
});

export default slice.reducer;
