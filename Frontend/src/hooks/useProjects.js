import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  removeProject,
  setError,
  setLoaded,
  setLoading,
  setProjects,
} from "../store/slices/projectSlice";
import {
  createProject as createProjectApi,
  deleteProject as deleteProjectApi,
  getProjects,
} from "../services/project.api";

export default function useProjects(options = {}) {
  const { autoFetch = false } = options;
  const dispatch = useDispatch();
  const { projects, loading, error, loaded } = useSelector(
    (state) => state.projects,
  );

  const fetchProjects = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getProjects();
      dispatch(setProjects(Array.isArray(data) ? data : []));
      dispatch(setLoaded(true));
      return { ok: true, data };
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to load projects";
      dispatch(setError(message));
      dispatch(setLoaded(true));
      return { ok: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createProject = useCallback(
    async (payload) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await createProjectApi(payload);
        dispatch(addProject(data));
        return { ok: true, data };
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to create project";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const deleteProject = useCallback(
    async (projectId) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await deleteProjectApi(projectId);
        dispatch(removeProject(projectId));
        return { ok: true };
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to delete project";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (autoFetch && !loaded) {
      fetchProjects();
    }
  }, [autoFetch, loaded, fetchProjects]);

  return {
    projects,
    loading,
    error,
    loaded,
    fetchProjects,
    createProject,
    deleteProject,
  };
}
