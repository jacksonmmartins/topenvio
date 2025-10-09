// src/Services/api.js
import axios from "axios";

// Define a URL base dependendo do ambiente
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // permite enviar cookies se backend usar autenticação baseada em cookies
});

// Interceptor para adicionar token do localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Funções Auth
export async function login(email, password) {
  return api.post("/auth/login", { email, password }, { withCredentials: true });
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
