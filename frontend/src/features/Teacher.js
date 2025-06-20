import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import { getSafeUserData, storeUserData, clearAuthData, getRememberMePreference } from "../lib/utils";



const initialState = {
  getallTeachers: null,
  isallTeacherget: false,
  isTeacheradd: false,
  isTeacherremove: false,
  searchdata: null,
  issearchdata: false,
  editedTeacher: null,
  iseditedTeacher: false,
  teacherDetails: null, // <-- add this
  isTeacherDetailsLoading: false, // <-- loading state for single teacher fetch
  // 👇 ADD THIS
  Authuser: getSafeUserData() || null, // Or null initially
};



export const AddTeacher = createAsyncThunk(
  "teacher/TeacherProfile",
  async (Teacher, { rejectWithValue }) => {
    console.log(Teacher);
    try {
      const response = await axiosInstance.post(
        "teacher/TeacherProfile",
        Teacher,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error)
      const errorMessage =
        error.response?.data?.error ||
        "Failed to add Teacher. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response?.data?.message || "Teacher adding failed"
      );
    }
  }
);
export const getTeacherById = createAsyncThunk(
  "teacher/getTeacher",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `teacher/getTeacher/${teacherId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error || "Failed to get teacher details.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


  export const RemoveTeacher=createAsyncThunk('teacher/deleteTeacher',async(TeacherId,{rejectWithValue})=>{
    try {
       const response=await axiosInstance.delete(`teacher/deleteTeacher/${TeacherId}`,TeacherId,{ withCredentials: true,})
       return response.data;
  
      
    } catch (error) {
      console.log(error)
      const errorMessage =
        error.response?.data?.error ||
        "Failed to add Teacher. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data?.message || "Teacher remove failed");
    }
  })

  
  export const EditTeacher = createAsyncThunk(
    "teacher/updateTeacher",
    async ({ id, updatedData }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(
          `teacher/updateTeacher/${id}`,
          updatedData, 
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response?.data?.error ||
          "Failed to update Teacher. Please try again.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  export const editPassword = createAsyncThunk(
    "teacher/editPassword",
    async ({ id, values}, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(
          `teacher/editPassword/${id}`,
          values,
          { withCredentials: true }
        );
        console.log(response.data);
        // storeUserData(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response?.data?.error ||
          "Failed to update Teacher. Please try again.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  




  export const gettingallTeachers=createAsyncThunk('teacher/getallTeacher',async(_,{rejectWithValue})=>{
    try {
       const response=await axiosInstance.get("teacher/getallTeacher",{ withCredentials: true,})
       return response.data;
  
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Teacher getting failed");
    }
  })



   export const SearchTeacher=createAsyncThunk('teacher/searchTeacher',async(query,{rejectWithValue})=>{
    try {
       const response=await axiosInstance.get(`teacher/searchTeacher?query=${query}`,query,{ withCredentials: true,})
       return response.data;
  
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Teacher search failed");
    }
  })









const TeacherSlice = createSlice({
name:"Teacher",
initialState:initialState,
reducers:{},
extraReducers:(builder)=>{
  builder

    .addCase(gettingallTeachers.pending, (state) => {
      state.isallTeacherget = true;
    })
    .addCase(gettingallTeachers.fulfilled, (state, action) => {
      state.isallTeacherget = false;
      state.getallTeachers = action.payload || [];
    })

    .addCase(gettingallTeachers.rejected, (state, action) => {
      state.isallTeacherget = false;
      toast.error(action.payload || "Error In adding Teacher logout");
    })

    .addCase(RemoveTeacher.pending, (state) => {
      state.isTeacherremove = true;
    })

    .addCase(RemoveTeacher.fulfilled, (state, action) => {
      state.isTeacherremove = false;
      state.getallTeachers = state.getallTeachers.filter(
        (Teacher) => Teacher._id !== action.meta.arg
      );
    })

    .addCase(RemoveTeacher.rejected, (state, action) => {
      state.isTeacherremove = false;
    })

    .addCase(AddTeacher.pending, (state) => {
      state.isTeacheradd = true;
    })
    .addCase(AddTeacher.fulfilled, (state, action) => {
      state.isTeacheradd = false;
      state.getallTeachers.push(action.payload);
    })

    .addCase(AddTeacher.rejected, (state, action) => {
      state.isTeacheradd = false;
    })
    .addCase(getTeacherById.pending, (state) => {
      state.isTeacherDetailsLoading = true;
      state.teacherDetails = null;
    })
    .addCase(getTeacherById.fulfilled, (state, action) => {
      state.isTeacherDetailsLoading = false;
      state.teacherDetails = action.payload;
    })
    .addCase(getTeacherById.rejected, (state, action) => {
      state.isTeacherDetailsLoading = false;
      state.teacherDetails = null;
    })

    .addCase(SearchTeacher.pending, (state) => {
      state.issearchdata = true;
    })
    .addCase(SearchTeacher.fulfilled, (state, action) => {
      state.issearchdata = false;
      state.searchdata = action.payload;
    })

    .addCase(SearchTeacher.rejected, (state, action) => {
      state.issearchdata = false;
    })

    .addCase(EditTeacher.pending, (state) => {
      state.iseditedTeacher = true;
    })
    .addCase(EditTeacher.fulfilled, (state, action) => {
      state.iseditedTeacher = false;
      state.editedTeacher = action.payload;
    })

    .addCase(EditTeacher.rejected, (state, action) => {
      state.iseditedTeacher = false;
    })
    









}
  


});





export default TeacherSlice.reducer;