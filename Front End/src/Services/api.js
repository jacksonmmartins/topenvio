// src/Services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Funções Auth
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

// 🔹 Funções Planos
export async function getPlanos() {
  return api.get("/planos"); // públicos
}

export async function criarPlano(dados) {
  return api.post("/planos", dados); // só admin
}

export async function atualizarPlano(id, dados) {
  return api.put(`/planos/${id}`, dados); // só admin
}

export async function excluirPlano(id) {
  return api.delete(`/planos/${id}`); // só admin
}

export default api;
