import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  grades: [],
  isLoading: false,
  error: null,
  currentGrade: null,
  isCurrentLoading: false,
};

// Fetch all subjects
export const createGrade = createAsyncThunk(
  "/grade/createGrade",
  async (gradeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/grade/createGrade",
        gradeData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to add student. Please try again.");
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subjects"
      );
    }
  }
);

// Get subject by ID
export const getAllGrade = createAsyncThunk(
  `/grade/getallGrader`,
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/grade/getallGrader/${teacherId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subject"
      );
    }
  }
);

const GradeSlice = createSlice({
  name: "Grade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGrade.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.grades = action.payload;
        state.isLoading = false;
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllGrade.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGrade.fulfilled, (state, action) => {
        state.grades = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllGrade.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


export default GradeSlice.reducer;
