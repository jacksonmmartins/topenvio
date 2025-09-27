import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../Layout/Layout.css";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("pequeno");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Carrega o perfil ao entrar na página
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setCompanyName(res.data.companyName || "");
        setCompanySize(res.data.companySize || "pequeno");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // 🔹 Atualiza perfil e depois busca novamente no backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        "/auth/profile",
        { companyName, companySize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 👇 Recarrega os dados atualizados do backend
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);

      setMessage("Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  if (!profile) return <p>Carregando...</p>;

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Perfil do Cliente</h2>

        {!editMode ? (
          <div>
            <p><strong>Nome:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Empresa:</strong> {profile.companyName || "Não informado"}</p>
            <p><strong>Porte:</strong> {profile.companySize || "Não informado"}</p>
            <button onClick={() => setEditMode(true)}>Editar</button>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <input type="text" value={profile.name} disabled />
            <input type="email" value={profile.email} disabled />
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
        )}

        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
