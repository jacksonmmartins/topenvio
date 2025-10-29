// src/Services/api.js
import axios from "axios";

// 🔹 Determina a URL base
const baseURL = (() => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000/api"; // backend local
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL; // backend remoto definido na Vercel
  }
  // fallback seguro caso não tenha variável de ambiente
  console.warn(
    "VITE_API_URL não definida, usando fallback https://topenvio.onrender.com/api"
  );
  return "https://topenvio.onrender.com/api";
})();

// 🔹 Cria instância Axios
const api = axios.create({
  baseURL,
  withCredentials: true, // cookies/JWT
});

// 🔹 Interceptor para enviar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Funções de autenticação
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

export async function register(name, email, password) {
  return api.post("/auth/register", { name, email, password });
}

export async function getProfile() {
  return api.get("/auth/profile");
}

export async function updateProfile(data) {
  return api.put("/auth/profile", data);
}

// 🔹 Funções Planos
export async function getPlanos() {
  return api.get("/planos");
}

export async function criarPlano(dados) {
  return api.post("/planos", dados);
}

export async function atualizarPlano(id, dados) {
  return api.put(`/planos/${id}`, dados);
}

export async function excluirPlano(id) {
  return api.delete(`/planos/${id}`);
}

// 🔹 Exporta instância
export default api;

// 🔹 DEBUG: mostra URL usada
console.log("API Base URL:", baseURL);
