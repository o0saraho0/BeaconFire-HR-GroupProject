import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosauth from "../../interceptors/auth.interceptor";

const initialState = {
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login-employee",
        credentials
      );

      // store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user_id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/user/register",
        userData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosauth.post("http://localhost:3000/api/user/logout");
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Supported by reduxjs-toolkit: When you create the slice with createSlice,
// automatically generates action creators for each reducer function in the reducers object.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.user_id;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.userId = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.token = null;
        state.userId = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
