import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("taskforge_user") || "null");
const savedToken = localStorage.getItem("taskforge_token") || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginSuccess(state, action) {
      const user = action.payload?.user || null;
      const token = action.payload?.token || null;
      state.loading = false;
      state.error = null;
      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(token);

      if (user) {
        localStorage.setItem("taskforge_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("taskforge_user");
      }

      if (token) {
        localStorage.setItem("taskforge_token", token);
      } else {
        localStorage.removeItem("taskforge_token");
      }
    },
registerSuccess(state, action) {

  const user = action.payload?.user || null;
  const token = action.payload?.token || null;

  state.loading = false;
  state.error = null;

  state.user = user;
  state.token = token;

  state.isAuthenticated = Boolean(token);

  if (user) {
    localStorage.setItem(
      "taskforge_user",
      JSON.stringify(user)
    );
  }

  if (token) {
    localStorage.setItem(
      "taskforge_token",
      token
    );
  }
},
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("taskforge_user");
      localStorage.removeItem("taskforge_token");
    },
    clearError(state) {
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  authStart,
  authFailure,
  loginSuccess,
  registerSuccess,
  logoutSuccess,
  clearError,
  setError,
} = authSlice.actions;
export default authSlice.reducer;
