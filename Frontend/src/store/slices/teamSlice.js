import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [
    { id: 'user-1', name: 'Alex Morgan', email: 'alex@taskforge.io', role: 'Project Lead', avatar: 'AM', color: '#00D4FF' },
    { id: 'user-2', name: 'Sarah Chen', email: 'sarah@taskforge.io', role: 'UI Designer', avatar: 'SC', color: '#7B61FF' },
    { id: 'user-3', name: 'James Wilson', email: 'james@taskforge.io', role: 'Backend Dev', avatar: 'JW', color: '#00FF88' },
    { id: 'user-4', name: 'Maya Patel', email: 'maya@taskforge.io', role: 'Mobile Dev', avatar: 'MP', color: '#FFB800' },
    { id: 'user-5', name: 'Ryan Kim', email: 'ryan@taskforge.io', role: 'DevOps', avatar: 'RK', color: '#FF4757' },
  ],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setMembers(state, action) {
      state.members = action.payload;
    },
    addMember(state, action) {
      state.members.push(action.payload);
    },
    removeMember(state, action) {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    updateMember(state, action) {
      const idx = state.members.findIndex(m => m.id === action.payload.id);
      if (idx !== -1) state.members[idx] = { ...state.members[idx], ...action.payload };
    },
  },
});

export const { setMembers, addMember, removeMember, updateMember } = teamSlice.actions;
export default teamSlice.reducer;
