import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  subjects: [],
  isLoading: false,
  error: null,
  currentSubject: null,
  isCurrentLoading: false,
};

// Fetch all subjects
export const getAllSubjects = createAsyncThunk(
  "/Subject/getallSubject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/Subject/getallSubject", {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subjects"
      );
    }
  }
);

// Get subject by ID
export const getSubjectById = createAsyncThunk(
  "/Subject/getsingleSubject",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/Subject//getsingleSubject//${subjectId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subject"
      );
    }
  }
);

const SubjectSlice = createSlice({
  name: "Subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.loading = false;
      })
      .addCase(getAllSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const { clearCurrentSubject } = subjectSlice.actions;
export default SubjectSlice.reducer;
