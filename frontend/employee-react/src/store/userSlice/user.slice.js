import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching personal information
export const fetchPersonalInfo = createAsyncThunk(
  "user/fetchPersonalInfo",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get("/api/personalinfo", {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Fetching personal info failed"
      );
    }
  }
);

// // instead of directly writing the reducer function by yourself, utilize the createSlice method
const userSlice = createSlice({
  // // this name will be the prefix to the action's type, check Redux DevTools
  name: "user",
  initialState: { isLoggedIn: false, personalInfo: null },
  // // with Redux Toolkit, you don't have to write pure functions anymore for the reducers, because the reducer functions are wrapped with immer.js which converts the impure logic into pure logic
  reducers: {
    // // login will be used as the suffix for action type, the final action type will be 'user/login'
    login: (state) => {
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
  selectors: {
    // // you can also define simple selectors directly in the slice
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
});

// // the actions are automatically generated based on your reducer object's property names
export const { login, logout } = userSlice.actions;

// // the selectors can be accessed directly as well
export const { selectIsLoggedIn } = userSlice.selectors;

// // export the reducer as the default export to be used for creating the store
export default userSlice.reducer;
