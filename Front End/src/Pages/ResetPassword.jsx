import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", { token, password });

      setMessage("Senha redefinida com sucesso!");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao redefinir senha");
    }
  };

  return (
    <div className="reset-container">
      <h2>Redefinir Senha</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Redefinir</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
