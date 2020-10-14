import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, {
  API_LOGIN,
  API_LOGOUT,
  API_REGISTER,
  API_GUEST_REGISTER,
} from "api";
import { User } from "types";
import { createErrorToast, createInfoToast } from "features/toast/ToastSlice";
import { AxiosError } from "axios";
import {
  updateUser,
  updateAvatarFulfilled,
  resetProfile,
} from "features/profile/ProfileSlice";
import { RootState } from "store";

interface InitialState {
  user: User | null;
  loginLoading: boolean;
  loginErrors?: ValidationErrors;
  registerErrors?: ValidationErrors;
}

export const initialState: InitialState = {
  user: null,
  loginLoading: false,
  loginErrors: undefined,
  registerErrors: undefined,
};

interface ValidationErrors {
  non_field_errors?: string[];
}

interface RegisterProps {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export const register = createAsyncThunk<
  User,
  RegisterProps,
  {
    rejectValue: ValidationErrors;
  }
>("auth/registerStatus", async (credentials, { rejectWithValue }) => {
  try {
    // Don't POST blank email
    if (!credentials["email"]) {
      delete credentials["email"];
    }
    const response = await api.post(API_REGISTER, credentials);
    return response.data;
  } catch (err) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const guestRegister = createAsyncThunk<User>(
  "auth/guestRegisterStatus",
  async (_, { dispatch }) => {
    try {
      const response = await api.post(API_GUEST_REGISTER);
      return response.data;
    } catch (e) {
      dispatch(
        createErrorToast("Failed to enter as a guest, try again later.")
      );
    }
  }
);

interface LoginProps {
  username: string;
  password: string;
}

export const login = createAsyncThunk<
  User,
  LoginProps,
  {
    rejectValue: ValidationErrors;
  }
>("auth/loginStatus", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(API_LOGIN, credentials);
    return response.data;
  } catch (err) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk(
  "auth/logoutStatus",
  async (_, { dispatch }) => {
    try {
      await api.post(API_LOGOUT);
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    } finally {
      dispatch(resetProfile());
      dispatch(createInfoToast("Logged out"));
    }
  }
);

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.loginErrors = undefined;
      state.registerErrors = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loginLoading = false;
      state.loginErrors = undefined;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loginErrors = action.payload;
      state.loginLoading = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.user = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (state.user) {
        state.user.username = action.payload.username;
      }
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload;
      state.registerErrors = undefined;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.registerErrors = action.payload;
    });
    builder.addCase(guestRegister.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updateAvatarFulfilled, (state, action) => {
      if (state.user) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        state.user.photo_url = action.payload.photo;
      }
    });
  },
});

export const { clearErrors } = slice.actions;

export const selectMe = (state: RootState) => state.auth.user;

export default slice.reducer;
