// src/Pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/api"; // ✅ Corrigido
import "../Layout/Layout.css";

export default function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      const userRole = localStorage.getItem("role");
      if (userRole === "admin") navigate("/admin");
      else navigate("/profile");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redireciona conforme o tipo de usuário
      if (res.data.user.role === "admin") navigate("/admin");
      else if (!res.data.user.companyName || !res.data.user.companySize)
        navigate("/completeprofile");
      else navigate("/profile");

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

        {message && <p style={{ color: "red" }}>{message}</p>}

        <p>
          Não tem conta?{" "}
          <span
            style={{ color: "#0073e6", cursor: "pointer" }}
            onClick={() => navigate("/createuser")}
          >
            Criar Conta
          </span>
        </p>

        <p>
          <a href="/forgot-password">Esqueceu sua senha?</a>
        </p>
      </div>
    </div>
  );
}
