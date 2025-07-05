import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState = {
  assignments: [],
  isLoading: false,
  error: null,
  currentAssignment: null,
  submitAssignments: [],
};

// ✅ Create assignment
export const createAssignment = createAsyncThunk(
  "/assignment/createAssgiment",
  async ({id,formData}, { rejectWithValue }) => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("ClassId", formData.class);
      payload.append("subject", formData.subject);
      payload.append("dueDate", formData.dueDate);
      payload.append("maxScore", formData.maxScore);
      payload.append("teacherId", id);

      formData.attachments.forEach((file) => {
        payload.append("attachments", file); // backend should accept multiple
      });
      console.log(payload);

      const response = await axiosInstance.post(
        "/assignment/createAssgiment",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Assignment created successfully!");
      return response.data;
    } catch (error) {
      toast.error("Failed to create assignment");
      return rejectWithValue(
        error.response?.data?.message || "Error creating assignment"
      );
    }
  }
);
// ✅ Create assignment
export const submitAssignment = createAsyncThunk(
  "/assignment/submitAssgiment",
  async (formData , { rejectWithValue }) => {
    try {
      const payload = new FormData();
      
      payload.append("student_id", formData.student_id);
      payload.append("AssignmentId", formData.AssignmentId);
      payload.append("comment", formData.comment);
      if (formData.attachments?.length > 0) {
        payload.append("attachments", formData.attachments[0]);
      }      
      for (const pair of payload.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }      

      const response = await axiosInstance.post(
        "/assignment/submitAssgiment",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Assignment submitted successfully!");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to submit assignment");
      console.log("Error submitting assignment:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error creating assignment"
      );
    }
  }
);

// ✅ Get all assignments
export const getAllAssignments = createAsyncThunk(
  "/assignment/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/assignment/getAll", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }
);

// Get assignment by ID
export const getAssignmentById = createAsyncThunk(
  "/assignment/assignmentbyId",
  async (assignmentId, { rejectWithValue }) => {
    try {
      console.log(assignmentId);
      const response = await axiosInstance.get(
        `/assignment/assignmentbyId/${assignmentId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignment"
      );
    }
  }
);

// ✅ Get assignments by teacher ID
export const getAssignmentsByTeacherId = createAsyncThunk(
  "/assignment/teacher/",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/assignment/teacher/${teacherId}`,
        { withCredentials: true }
      );
      return response.data.assignments;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  })
export const getSubmitAssignments = createAsyncThunk(
  "/assignment/assignment/getSubmitAssignmentbyId/",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/assignment/getSubmitAssignmentbyId/${assignmentId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }
);
export const deleteAssignment = createAsyncThunk(
  "/assignment/deleteAssignment/",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/assignment/deleteAssignment/${teacherId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: "Assignment",
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload); // Add new assignment to the list
        state.isLoading = false;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllAssignments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getSubmitAssignments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubmitAssignments.fulfilled, (state, action) => {
        state.submitAssignments = action.payload;
        state.isLoading = false;
      })
      .addCase(getSubmitAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAssignmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssignmentById.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
        state.isLoading = false;
      })
      .addCase(getAssignmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAssignmentsByTeacherId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssignmentsByTeacherId.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.isLoading = false;
      })
      .addCase(getAssignmentsByTeacherId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  }, 
});

export const { clearCurrentAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;
