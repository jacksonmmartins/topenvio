import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Layout/Layout.css";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("pequeno");
  const [message, setMessage] = useState("");

  // Se não houver token, redireciona para login
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Busca perfil do usuário
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.name);
        setEmail(res.data.email);
        setCompanyName(res.data.companyName);
        setCompanySize(res.data.companySize);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/profile", { companyName, companySize }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      navigate("/profile"); // 👉 redireciona para a página de perfil
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Perfil do Cliente</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} disabled placeholder="Nome" />
          <input type="email" value={email} disabled placeholder="E-mail" />
          <input
            type="text"
            placeholder="Nome da Empresa"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <select
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
          >
            <option value="pequeno">Pequeno Porte</option>
            <option value="grande">Grande Porte</option>
          </select>
          <button type="submit">Salvar</button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
