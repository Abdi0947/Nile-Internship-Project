import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  allAttendance: null,
  isAttendanceLoading: false,
  isAttendanceAdded: false,
  isAttendanceRemoved: false,
  
  updatedAttendance: null,
  isUpdating: false,
};


export const addAttendance = createAsyncThunk(
  "attendance/createAttendance",
  async (attendancePayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "attendance/createAttendance",
        attendancePayload,
        { withCredentials: true }
      );
      toast.success("Attendance recorded successfully!");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to add attendance"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to add attendance"
      );
    }
  }
);

// Remove Attendance
export const removeAttendance = createAsyncThunk(
  "attendance/deleteAttendance",
  async (attendanceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `attendance/deleteAttendance/${attendanceId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove attendance"
      );
    }
  }
);

// Update Attendance
export const updateAttendance = createAsyncThunk(
  "attendance/updateAttendance",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `attendance/updateAttendance/${id}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update attendance";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get All Attendance
export const getAllAttendance = createAsyncThunk(
  "attendance/getallAttendance",
  async (teacheId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `attendance/getallAttendance/${teacheId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);



const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Attendance Cases
      .addCase(getAllAttendance.pending, (state) => {
        state.isAttendanceLoading = true;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.isAttendanceLoading = false;
        state.allAttendance = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.isAttendanceLoading = false;
        toast.error(action.payload || "Error fetching attendance records");
      })

      // Remove Attendance Cases
      .addCase(removeAttendance.pending, (state) => {
        state.isAttendanceRemoved = true;
      })
      .addCase(removeAttendance.fulfilled, (state, action) => {
        state.isAttendanceRemoved = false;
        state.allAttendance = state.allAttendance.filter(
          (attendance) => attendance._id !== action.meta.arg
        );
      })
      .addCase(removeAttendance.rejected, (state, action) => {
        state.isAttendanceRemoved = false;
        toast.error(action.payload || "Error removing attendance record");
      })

      // Add Attendance Cases
      .addCase(addAttendance.pending, (state) => {
        state.isAttendanceAdded = true;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.isAttendanceAdded = false;
        if (state.allAttendance) {
          state.allAttendance.push(action.payload);
        } else {
          state.allAttendance = [action.payload];
        }
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.isAttendanceAdded = false;
        toast.error(action.payload || "Error adding attendance");
      })

     

      // Update Attendance Cases
      .addCase(updateAttendance.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updatedAttendance = action.payload;
        if (state.allAttendance) {
          const index = state.allAttendance.findIndex(
            (attendance) => attendance._id === action.payload._id
          );
          if (index !== -1) {
            state.allAttendance[index] = action.payload;
          }
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.isUpdating = false;
        toast.error(action.payload || "Error updating attendance");
      });
  },
});

export default attendanceSlice.reducer;