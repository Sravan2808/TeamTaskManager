import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern UI',
      members: ['user-1', 'user-2', 'user-3'],
      deadline: '2026-06-15',
      progress: 65,
      taskCount: 24,
      color: '#00D4FF',
    },
    {
      id: 'proj-2',
      name: 'Mobile App v2',
      description: 'React Native mobile application second major release',
      members: ['user-1', 'user-4'],
      deadline: '2026-07-01',
      progress: 30,
      taskCount: 18,
      color: '#7B61FF',
    },
    {
      id: 'proj-3',
      name: 'API Migration',
      description: 'Migrate legacy REST APIs to GraphQL architecture',
      members: ['user-2', 'user-3', 'user-4', 'user-5'],
      deadline: '2026-05-30',
      progress: 85,
      taskCount: 12,
      color: '#00FF88',
    },
  ],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.push(action.payload);
    },
    updateProject(state, action) {
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = { ...state.projects[idx], ...action.payload };
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
  },
});

export const { setProjects, addProject, updateProject, deleteProject, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
