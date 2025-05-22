import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4500/api",
});

// Optionally export custom functions
export const deleteBoard = (id) => api.delete(`/boards/${id}`);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

export default api;

