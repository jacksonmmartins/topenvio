// src/Services/api.js
import axios from "axios";

// =====================================================
// 🔹 Definir Base URL com comportamento ideal no Vite
// =====================================================

const baseURL = (() => {
  const mode = import.meta.env.MODE;
  const envURL = import.meta.env.VITE_API_URL;

  // Ambiente local
  if (mode === "development") {
    console.log("🌱 Modo desenvolvimento detectado → usando backend local");
    return "http://localhost:5000/api";
  }

  // Produção com variável configurada na Vercel
  if (envURL) {
    console.log("🏗️ Usando VITE_API_URL definida na Vercel:", envURL);
    return envURL;
  }

  // 🚨 Fallback seguro (evita quebra do app)
  console.warn(
    "⚠️ VITE_API_URL não definida — usando fallback https://topenvio.onrender.com/api"
  );
  return "https://topenvio.onrender.com/api";
})();

// =====================================================
// 🔹 Criar instância Axios
// =====================================================

const api = axios.create({
  baseURL,
  withCredentials: true, // permite cookies/sessão/JWT
});

// =====================================================
// 🔹 Interceptor para anexar JWT se existir
// =====================================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// 🔹 Endpoints de Autenticação
// =====================================================

export function login(email, password) {
  return api.post("/auth/login", { email, password });
}

export function register(name, email, password) {
  return api.post("/auth/register", { name, email, password });
}

export function getProfile() {
  return api.get("/auth/profile");
}

export function updateProfile(data) {
  return api.put("/auth/profile", data);
}

// =====================================================
// 🔹 Endpoints de Planos
// =====================================================

export function getPlanos() {
  return api.get("/planos");
}

export function criarPlano(dados) {
  return api.post("/planos", dados);
}

export function atualizarPlano(id, dados) {
  return api.put(`/planos/${id}`, dados);
}

export function excluirPlano(id) {
  return api.delete(`/planos/${id}`);
}

// =====================================================
// 🔹 Export default da instância Axios
// =====================================================

export default api;

// =====================================================
// 🔹 Debug
// =====================================================

console.log("⚙️ API Base URL carregada:", baseURL);
