import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import toast from 'react-hot-toast';
import { getSafeUserData, storeUserData, clearAuthData, getRememberMePreference } from "../lib/utils";

const initialState = {
  Authuser: getSafeUserData() || null, 
  isUserSignup: false,
  staffuser: null,
  manageruser: null,
  adminuser: null,
  isUserLogin: false,
  token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  isUpdatingUserInfo: false,
  rememberMe: getRememberMePreference() || false,
};


export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Signup request payload:', credentials);
      const response = await axiosInstance.post("auth/signup", credentials, { withCredentials: true });
      console.log('Signup API response:', response.data);
      
      if (response.data && response.data.user) {
        storeUserData(response.data.user, false); // Don't remember by default for new signups
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Signup failed. Please check your information and try again."
      );
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      console.log('Login request payload:', { email, password, rememberMe });
      const response = await axiosInstance.post("auth/login", { email, password }, { withCredentials: true });
      console.log('Login API response:', response.data);
      
      if (response.data && response.data.user) {
        const user = response.data.user;
        console.log('User role from API:', user.role, 'User ID:', user.id);
        
        // Add token to user object if it's in the response but not in the user object
        if (response.data.token && !user.token) {
          user.token = response.data.token;
        }
        
        // Store user data with remember me preference
        storeUserData(user, rememberMe);
        
        // Store token in the appropriate storage based on remember me preference
        const storage = rememberMe ? localStorage : sessionStorage;
        if (response.data.token) {
          storage.setItem('token', response.data.token);
        }
      }
      
      return { ...response.data, rememberMe };
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Login failed. Please check your credentials and try again."
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",

  async (tokenId, { rejectWithValue }) => {
    console.log(tokenId);
    try {
      const response = await axiosInstance.post(
        "auth/googleLogin",
        { token: tokenId },
        { withCredentials: true }
      );

      if (response.data && response.data.user) {
        const user = response.data.user;

        // Ensure token is set
        if (response.data.token && !user.token) {
          user.token = response.data.token;
        }

        // Store in localStorage/sessionStorage
        const rememberMe = true; // or get from cookie/setting
        storeUserData(user, rememberMe);
        const storage = rememberMe ? localStorage : sessionStorage;
        if (response.data.token) {
          storage.setItem("token", response.data.token);
        }

        return { ...response.data, rememberMe };
      }

      throw new Error("Invalid Google response.");
    } catch (error) {
      console.error("Google Login Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);


// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      clearAuthData();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const storedUser = getSafeUserData();
      const token = state.auth.token;
      const rememberMe = state.auth.rememberMe;

      // if (!storedUser || !token) {
      //   return rejectWithValue("User not authenticated. Please log in again.");
      // }

      // // Store profile image in localStorage if it’s a base64 image
      // if (userData.ProfilePic && userData.ProfilePic.startsWith("data:image")) {
      //   localStorage.setItem("profileImage", userData.ProfilePic);
      // }

      // Determine endpoint based on role
      const userRole = storedUser.role;
      let endpoint;
      if (userRole === "teacher") {
        endpoint = `teacher/editTeacherProfile/${
          storedUser.id || storedUser._id
        }`;
      } else if (userRole === "Student") {
        endpoint = `student/updateProfile/${storedUser.id || storedUser._id}`;
      } else {
        endpoint = `auth/updateUserInfo`;
      }

      const response = await axiosInstance.put(endpoint, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If profile image update is needed
      if (userData.ProfilePic && userRole === "admin") {
        await axiosInstance.put(
          "/auth/updateUserInfo",
          { ProfilePic: userData.ProfilePic },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem(
          "profileImage",
          response?.data?.updatedUser?.ProfilePic
        );
        toast.success("Profile picture updated successfully");
      }
      // If profile image update is needed
      if (userData.ProfilePic && userRole === "Student") {
        try {
          const response = await axiosInstance.put(
            `student/updateProfilePic/${storedUser.id || storedUser._id}`,
            { ProfilePic: userData.ProfilePic },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.updatedUser.ProfilePic);
          localStorage.setItem(
            "profileImage",
            response?.data?.updatedUser?.ProfilePic
          );
          toast.success("Profile picture updated successfully");
        } catch (error) {
          console.error("Profile picture info error:", error);
          toast.error("Profile picture error");
        }
      }
      // If profile image update is needed for teacher
      if (userData.ProfilePic && userRole === "teacher") {
        try {
          const response = await axiosInstance.put(
            `teacher/updateTeacherpic/${storedUser.id || storedUser._id}`,
            { ProfilePic: userData.ProfilePic },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.updatedUser.ProfilePic);
          localStorage.setItem(
            "profileImage",
            response?.data?.updatedUser?.ProfilePic
          );
          toast.success("Profile picture updated successfully");
        } catch (error) {
          console.error("Profile picture info error:", error);
          toast.error("Profile picture error");
        }
      }
      

      const updatedUser = response.data?.updatedUser || response.data;

      // Append ProfilePic if needed
      if (userData.ProfilePic) {
        updatedUser.ProfilePic = userData.ProfilePic;
      }

      storeUserData(updatedUser, rememberMe);

      return updatedUser;
    } catch (error) {
      console.error("Update user info error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile information"
      );
    }
  }
);

export const removeusers=createAsyncThunk("auth/removeuser",async(UserId,{rejectWithValue})=>{
  try {

    const response=await axiosInstance.delete(`auth/removeuser/${UserId}`,UserId,{ withCredentials: true });

    return response.data

  } catch (error) {
     return rejectWithValue(error.response?.data?.message || 'Failed to delete  user');
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(signup.pending, (state) => {
        state.isUserSignup = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isUserSignup = false;
        state.Authuser = action.payload.user;
        state.token = action.payload.token;
        // toast.success("Signup successful!")
      })
      .addCase(signup.rejected, (state, action) => {
        state.isUserSignup = false;
        toast.error(action.payload || "Error in signup");
      })

      .addCase(login.pending, (state) => {
        state.isUserLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isUserLogin = false;
        state.Authuser = action.payload.user;
        state.token = action.payload.token;
        state.rememberMe = action.payload.rememberMe;
        // toast.success("Login successfully")
      })
      .addCase(login.rejected, (state, action) => {
        state.isUserLogin = false;
        toast.error(action.payload || "Error in login");
      })

      .addCase(logout.fulfilled, (state) => {
        state.Authuser = null;
        state.token = null;
        // Don't reset rememberMe preference
        // toast.success("Successfully logged out!");
      })
      .addCase(logout.rejected, (state, action) => {})

      .addCase(updateUserInfo.pending, (state) => {
        state.isUpdatingUserInfo = true;
      })

      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isUpdatingUserInfo = false;
        state.Authuser = {
          ...state.Authuser,
          ...action.payload,
        };
        // toast.success("Profile information updated successfully");
      })

      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isUpdatingUserInfo = false;
        toast.error(action.payload || "Failed to update profile information");
      })
      .addCase(googleLogin.pending, (state) => {
        state.isUserLogin = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isUserLogin = false;
        state.Authuser = action.payload.user;
        state.token = action.payload.token;
        state.rememberMe = action.payload.rememberMe;
        toast.success("Google login successful");
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isUserLogin = false;
        toast.error(action.payload || "Google login failed");
      });
      

      

      


      
     
    
      
    



  
  },
});

export const { setRememberMe } = authSlice.actions;
export default authSlice.reducer;