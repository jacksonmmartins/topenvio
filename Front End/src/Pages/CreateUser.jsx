import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Pages/CreateUser.css"; // Seu CSS já definido

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Senhas não conferem");
      return;
    }

    try {
      await api.post("/auth/createuser", { name, email, password });
      navigate("/login"); // redireciona para login após cadastro
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar usuário");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Criar Conta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="Repetir Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Criar Conta</button>
        </form>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
}

