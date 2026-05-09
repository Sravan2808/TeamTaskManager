import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('taskforge_user') || 'null');
const savedToken = localStorage.getItem('taskforge_token') || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('taskforge_user', JSON.stringify(action.payload.user));
      localStorage.setItem('taskforge_token', action.payload.token);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signupStart(state) {
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('taskforge_user', JSON.stringify(action.payload.user));
      localStorage.setItem('taskforge_token', action.payload.token);
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('taskforge_user');
      localStorage.removeItem('taskforge_token');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart, loginSuccess, loginFailure,
  signupStart, signupSuccess, signupFailure,
  logout, clearError,
} = authSlice.actions;
export default authSlice.reducer;
