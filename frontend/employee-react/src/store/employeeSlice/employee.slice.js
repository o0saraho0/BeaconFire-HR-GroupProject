import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching employee profile
export const fetchEmployeeProfile = createAsyncThunk(
  "employee/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/api/personalinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating employee profile
export const updateEmployeeProfile = createAsyncThunk(
  "employee/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/personalinfo", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateEmployeeProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
