import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getProjects() {
  const response = await api.get("/api/projects");
  return response.data;
}

export async function createProject(payload) {
  const response = await api.post("/api/projects", payload);
  return response.data;
}

export async function deleteProject(projectId) {
  const response = await api.delete(`/api/projects/${projectId}`);
  return response.data;
}
