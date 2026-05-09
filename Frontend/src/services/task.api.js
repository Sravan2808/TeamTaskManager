import axios from "axios";

const api = axios.create({
  baseURL: "https://teamtaskmanager-production-5a91.up.railway.app",
  withCredentials: true,
});

export async function getTasks() {
  const response = await api.get("/api/tasks");
  return response.data;
}

export async function createTask(payload) {
  const response = await api.post("/api/tasks", payload);
  return response.data;
}

export async function updateTask(taskId, payload) {
  const response = await api.put(`/api/tasks/${taskId}`, payload);
  return response.data;
}

export async function deleteTask(taskId) {
  const response = await api.delete(`/api/tasks/${taskId}`);
  return response.data;
}
