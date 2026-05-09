import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  members: [],
  loading: false,
  error: null,
  loaded: false,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLoaded(state, action) {
      state.loaded = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setMembers(state, action) {
      state.members = action.payload;
    },
    addMember(state, action) {
      state.members.push(action.payload);
    },
    removeMember(state, action) {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
    updateMember(state, action) {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.members[idx] = { ...state.members[idx], ...action.payload };
      }
    },
  },
});

export const {
  setLoading,
  setLoaded,
  setError,
  setMembers,
  addMember,
  removeMember,
  updateMember,
} = teamSlice.actions;
export default teamSlice.reducer;
