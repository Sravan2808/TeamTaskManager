import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  authFailure,
  authStart,
  clearError as clearErrorAction,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  setError as setErrorAction,
} from "../store/slices/authSlice";
import { login, logout, register } from "../services/auth.api";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const loginUser = useCallback(
    async (payload) => {
      dispatch(authStart());
      try {
        const data = await login(payload);
        if (data?.success === false) {
          dispatch(authFailure(data?.message || "Login failed"));
          return { ok: false, error: data?.message || "Login failed" };
        }
        dispatch(loginSuccess(data));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.message || "Login failed";
        dispatch(authFailure(message));
        return { ok: false, error: message };
      }
    },
    [dispatch],
  );

  const registerUser = useCallback(
    async (payload) => {
      dispatch(authStart());
      try {
        const data = await register(payload);
        if (data?.success === false) {
          dispatch(authFailure(data?.message || "Registration failed"));
          return { ok: false, error: data?.message || "Registration failed" };
        }
        dispatch(registerSuccess(data));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.message || "Registration failed";
        dispatch(authFailure(message));
        return { ok: false, error: message };
      }
    },
    [dispatch],
  );

  const logoutUser = useCallback(async () => {
    dispatch(authStart());
    try {
      const data = await logout();
      if (data?.success === false) {
        dispatch(authFailure(data?.message || "Logout failed"));
        return { ok: false, error: data?.message || "Logout failed" };
      }
      dispatch(logoutSuccess());
      return { ok: true, data };
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed";
      dispatch(authFailure(message));
      dispatch(logoutSuccess());
      return { ok: false, error: message };
    }
  }, [dispatch]);

  const clearError = useCallback(
    () => dispatch(clearErrorAction()),
    [dispatch],
  );

  const setError = useCallback(
    (message) => dispatch(setErrorAction(message)),
    [dispatch],
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    clearError,
    setError,
  };
}
