// src/Services/api.js
import axios from "axios";

// 🔹 Define a URL base dependendo do ambiente
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"      // backend local
    : import.meta.env.VITE_API_URL || "https://topenvio.onrender.com/api"; // backend remoto

// 🔹 Cria instância Axios
const api = axios.create({
  baseURL,
  withCredentials: true, // necessário para cookies/JWT
});

// 🔹 Interceptor para enviar token JWT se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // opcional se usar JWT
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Funções de autenticação

// Login
// Se backend usar cookies, o token é enviado automaticamente
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

// Registrar usuário
export async function register(name, email, password) {
  return api.post("/auth/register", { name, email, password });
}

// Perfil do usuário logado
export async function getProfile() {
  return api.get("/auth/profile");
}

// Atualizar perfil
export async function updateProfile(data) {
  return api.put("/auth/profile", data);
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

// 🔹 Exporta a instância Axios
export default api;
