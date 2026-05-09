import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  filter: "all",
  loading: false,
  error: null,
  loaded: false,
};

function toUiStatus(status) {
  if (status === "in_progress") return "in-progress";
  return status || "todo";
}

function normalizeTask(task) {
  const assigneeId = task.assigneeId?._id || task.assigneeId || task.assignee;
  const projectId = task.projectId?._id || task.projectId;

  return {
    id: task.id || task._id,
    title: task.title || "Untitled Task",
    description: task.description || "",
    projectId,
    assignee: assigneeId || null,
    status: toUiStatus(task.status),
    priority: task.priority || task.prority || "medium",
    dueDate: task.dueDate || null,
    createdAt: task.createdAt || task.created_at || null,
  };
}

const taskSlice = createSlice({
  name: "tasks",
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
    setTasks(state, action) {
      state.tasks = action.payload.map((task) => normalizeTask(task));
    },
    addTask(state, action) {
      state.tasks.unshift(normalizeTask(action.payload));
    },
    updateTask(state, action) {
      const updated = normalizeTask(action.payload);
      const idx = state.tasks.findIndex((t) => t.id === updated.id);
      if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...updated };
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    updateTaskStatus(state, action) {
      const { id, status } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) task.status = status;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const {
  setLoading,
  setLoaded,
  setError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  setFilter,
} = taskSlice.actions;
export default taskSlice.reducer;
