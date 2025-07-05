import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  classes: [],
  isLoading: false,
  error: null,
  currentClass: [],
  isCurrentLoading: false,
};

// Fetch all classes
export const getAllClasses = createAsyncThunk(
  "/class/getallclass",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/class/getallclass", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
        console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
);

// Get class by ID
export const getClassById = createAsyncThunk(
  "/class/getClassById",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/class/getClassById/${classId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class"
      );
    }
  }
);

const ClassSlice = createSlice({
  name: "Class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClasses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getClassById.pending, (state) => {
        state.isCurrentLoading = true;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.currentClass = action.payload;
        state.isCurrentLoading = false;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.isCurrentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentClass } = ClassSlice.actions;
export default ClassSlice.reducer;
