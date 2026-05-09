import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask as deleteTaskAction,
  setError,
  setFilter,
  setLoaded,
  setLoading,
  setTasks,
  updateTask,
  updateTaskStatus as updateTaskStatusAction,
} from "../store/slices/taskSlice";
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  getTasks,
  updateTask as updateTaskApi,
} from "../services/task.api";

function toApiStatus(status) {
  if (status === "in-progress") return "in_progress";
  return status;
}

function toApiTaskPayload(task) {
  return {
    title: task.title,
    description: task.description,
    projectId: task.projectId || null,
    assigneeId: task.assignee || null,
    prority: task.priority || "medium",
    status: toApiStatus(task.status || "todo"),
    dueDate: task.dueDate || null,
  };
}

export default function useTasks(options = {}) {
  const { autoFetch = false } = options;
  const dispatch = useDispatch();
  const { tasks, filter, loading, error, loaded } = useSelector(
    (state) => state.tasks,
  );

  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getTasks();
      dispatch(setTasks(Array.isArray(data) ? data : []));
      dispatch(setLoaded(true));
      return { ok: true, data };
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to load tasks";
      dispatch(setError(message));
      dispatch(setLoaded(true));
      return { ok: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createTask = useCallback(
    async (payload) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await createTaskApi(toApiTaskPayload(payload));
        dispatch(addTask(data));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.error || "Failed to create task";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const updateTaskStatus = useCallback(
    async ({ id, status }) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await updateTaskApi(id, { status: toApiStatus(status) });
        dispatch(updateTask(data));
        dispatch(updateTaskStatusAction({ id, status }));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.error || "Failed to update task";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const updateTaskDetails = useCallback(
    async ({ id, ...payload }) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await updateTaskApi(id, toApiTaskPayload(payload));
        dispatch(updateTask(data));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.error || "Failed to update task";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const deleteTask = useCallback(
    async (taskId) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await deleteTaskApi(taskId);
        dispatch(deleteTaskAction(taskId));
        return { ok: true };
      } catch (error) {
        const message = error?.response?.data?.error || "Failed to delete task";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    (nextFilter) => dispatch(setFilter(nextFilter)),
    [dispatch],
  );

  useEffect(() => {
    if (autoFetch && !loaded) {
      fetchTasks();
    }
  }, [autoFetch, loaded, fetchTasks]);

  return {
    tasks,
    filter,
    loading,
    error,
    loaded,
    fetchTasks,
    createTask,
    updateTaskStatus,
    updateTaskDetails,
    deleteTask,
    setFilter: changeFilter,
  };
}
