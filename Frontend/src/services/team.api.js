import axios from "axios";

const api = axios.create({
  baseURL: "https://teamtaskmanager-production-5a91.up.railway.app",
  withCredentials: true,
});

export async function getMembers() {
  const response = await api.get("/api/users");
  return response.data;
}

export async function updateMemberRole(userId, role) {
  const response = await api.put(`/api/users/${userId}/role`, { role });
  return response.data;
}
