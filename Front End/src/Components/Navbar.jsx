// src/Components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Limpar token e qualquer dado sensível
    localStorage.clear();
    // Redirecionar para Home
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Top Envio</div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/planos">Planos</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
        {!token && <li><Link to="/login">Login</Link></li>}
        {token && (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem"
              }}
            >
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
