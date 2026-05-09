import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: 'task-1',
      title: 'Design hero section',
      description: 'Create the main hero section with animations',
      projectId: 'proj-1',
      assignee: 'user-2',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-05-12',
      createdAt: '2026-05-01',
    },
    {
      id: 'task-2',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      projectId: 'proj-1',
      assignee: 'user-1',
      status: 'done',
      priority: 'high',
      dueDate: '2026-05-08',
      createdAt: '2026-04-28',
    },
    {
      id: 'task-3',
      title: 'Implement auth flow',
      description: 'Build login/signup with JWT authentication',
      projectId: 'proj-2',
      assignee: 'user-4',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-05-15',
      createdAt: '2026-05-03',
    },
    {
      id: 'task-4',
      title: 'API documentation',
      description: 'Write Swagger docs for all REST endpoints',
      projectId: 'proj-3',
      assignee: 'user-3',
      status: 'review',
      priority: 'medium',
      dueDate: '2026-05-10',
      createdAt: '2026-05-02',
    },
    {
      id: 'task-5',
      title: 'Database schema migration',
      description: 'Migrate PostgreSQL schema to new format',
      projectId: 'proj-3',
      assignee: 'user-5',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-05-20',
      createdAt: '2026-05-05',
    },
    {
      id: 'task-6',
      title: 'User onboarding flow',
      description: 'Create walkthrough for new users',
      projectId: 'proj-2',
      assignee: 'user-1',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-05-25',
      createdAt: '2026-05-06',
    },
    {
      id: 'task-7',
      title: 'Performance audit',
      description: 'Lighthouse audit and optimize Core Web Vitals',
      projectId: 'proj-1',
      assignee: 'user-3',
      status: 'todo',
      priority: 'low',
      dueDate: '2026-06-01',
      createdAt: '2026-05-07',
    },
    {
      id: 'task-8',
      title: 'Fix login timeout bug',
      description: 'Sessions expire prematurely on mobile devices',
      projectId: 'proj-2',
      assignee: 'user-4',
      status: 'done',
      priority: 'high',
      dueDate: '2026-05-06',
      createdAt: '2026-04-30',
    },
    {
      id: 'task-9',
      title: 'GraphQL resolvers',
      description: 'Implement query and mutation resolvers for users',
      projectId: 'proj-3',
      assignee: 'user-2',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-05-09',
      createdAt: '2026-05-04',
    },
    {
      id: 'task-10',
      title: 'Responsive nav bar',
      description: 'Make navigation mobile-friendly with hamburger menu',
      projectId: 'proj-1',
      assignee: 'user-2',
      status: 'review',
      priority: 'medium',
      dueDate: '2026-05-11',
      createdAt: '2026-05-03',
    },
  ],
  filter: 'all',
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...action.payload };
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    updateTaskStatus(state, action) {
      const { id, status } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) task.status = status;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask, updateTaskStatus, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
