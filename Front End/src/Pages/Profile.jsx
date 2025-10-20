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

  // 🔹 Carrega o perfil
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

  // 🔹 Atualiza perfil
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        "/auth/profile",
        { companyName, companySize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
    <div
      className="login-container"
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* 🔹 CARD 1: Perfil */}
      <div
        className="profile-card"
        style={{
          flex: "1 1 300px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: "15px",
          padding: "2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
        }}
      >
        <h2>Perfil do Cliente</h2>

        {!editMode ? (
          <div>
            <p><strong>Nome:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Empresa:</strong> {profile.companyName || "Não informado"}</p>
            <p><strong>Porte:</strong> {profile.companySize || "Não informado"}</p>
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "500",
              }}
              onClick={() => setEditMode(true)}
            >
              Editar
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
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
            <button
              type="submit"
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#16a34a",
                color: "white",
                fontWeight: "500",
              }}
            >
              Salvar
            </button>
          </form>
        )}

        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>

      {/* 🔹 CARD 2: Nova Entrega */}
      <div
        className="nova-entrega-card"
        style={{
          flex: "1 1 300px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: "15px",
          padding: "2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          textAlign: "center",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
        }}
      >
        <h2>📦 Nova Entrega</h2>
        <p>Cadastre uma nova entrega rapidamente.</p>
        <button
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
          onClick={() => navigate("/nova-entrega")}
        >
          Ir para Nova Entrega
        </button>
      </div>
    </div>
  );
}
