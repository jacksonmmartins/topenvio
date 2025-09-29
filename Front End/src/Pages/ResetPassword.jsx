import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Layout/Layout.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Captura o token da URL
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redireciona após 2s
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao redefinir senha");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Redefinir Senha</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Salvar nova senha</button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
