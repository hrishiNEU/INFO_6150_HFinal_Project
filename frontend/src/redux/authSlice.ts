import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  id: sessionStorage.getItem("id") || null,
  email: sessionStorage.getItem("email") || null,
  role: sessionStorage.getItem("role") || null,
  token: sessionStorage.getItem("token") || null,
  isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
  name: sessionStorage.getItem("name") || null,
  profileImage: sessionStorage.getItem("profileImage") || null, // Add profileImage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: string;
        token: string;
        name: string;
        profileImage: string | null;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.profileImage = action.payload.profileImage; // Set profileImage

      // Save to sessionStorage
      sessionStorage.setItem("id", action.payload.id);
      sessionStorage.setItem("email", action.payload.email);
      sessionStorage.setItem("name", action.payload.name);
      sessionStorage.setItem("role", action.payload.role);
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("profileImage", action.payload.profileImage || ""); // Save profileImage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.id = null;
      state.role = null;
      state.email = null;
      state.token = null;
      state.name = null;
      state.profileImage = null; // Reset profileImage

      // Remove from sessionStorage
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("profileImage"); // Remove profileImage
    },
    updateProfileImage: (state, action: PayloadAction<string | null>) => {
      state.profileImage = action.payload;
      sessionStorage.setItem("profileImage", action.payload || "");
    },
  },
});

export const { login, logout, updateProfileImage } = authSlice.actions;
export default authSlice.reducer;
