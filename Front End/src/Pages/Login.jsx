// src/Pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Layout/Layout.css";

export default function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Se já estiver logado, redireciona para Profile
  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // Redireciona para CompleteProfile ou Profile conforme backend
      navigate("/completeprofile");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
        <p>
          Não tem conta?{" "}
          <span
            style={{ color: "#0073e6", cursor: "pointer" }}
            onClick={() => navigate("/createuser")}
          >
            Criar Conta
          </span>
        </p>
      </div>
    </div>
  );
}
