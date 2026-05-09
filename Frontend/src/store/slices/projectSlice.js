import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  loaded: false,
};

const defaultColors = ["#00D4FF", "#7B61FF", "#00FF88", "#FFB800", "#FF4757"];

function normalizeProject(project, index = 0) {
  return {
    id: project.id || project._id,
    name: project.name || "Untitled Project",
    description: project.description || "",
    members: Array.isArray(project.members) ? project.members : [],
    deadline: project.deadline || null,
    progress: Number.isFinite(project.progress) ? project.progress : 0,
    taskCount: Number.isFinite(project.taskCount) ? project.taskCount : 0,
    color: project.color || defaultColors[index % defaultColors.length],
  };
}

const projectSlice = createSlice({
  name: "projects",
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
    setProjects(state, action) {
      state.projects = action.payload.map((project, index) =>
        normalizeProject(project, index),
      );
    },
    addProject(state, action) {
      const normalized = normalizeProject(
        action.payload,
        state.projects.length,
      );
      state.projects.unshift(normalized);
    },
    removeProject(state, action) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    clearProjectError(state) {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLoaded,
  setError,
  setProjects,
  addProject,
  removeProject,
  clearProjectError,
  setCurrentProject,
} = projectSlice.actions;
export default projectSlice.reducer;
