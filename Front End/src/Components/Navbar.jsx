import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

 useEffect(() => {
  if (token && token.includes(".")) {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      setUserRole(decoded.role || null);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token"); // remove token corrompido
      setUserRole(null);
    }
  } else {
    setUserRole(null);
  }
}, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Marca / logo */}
      <div className="navbar-brand">
        <Link to="/" onClick={() => setIsOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>
          Top Envio
        </Link>
      </div>

      {/* Botão sanduíche (mobile) */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Menu */}
      <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/planos" onClick={() => setIsOpen(false)}>
            Planos
          </Link>
        </li>
        <li>
          <Link to="/sobre" onClick={() => setIsOpen(false)}>
            Sobre
          </Link>
        </li>

        {/* Se for administrador → mostra Dashboard */}
        {token && userRole === "admin" && (
          <li>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="dashboard-link"
            >
              Dashboard
            </Link>
          </li>
        )}

        {/* Se for usuário comum → mostra Dados */}
        {token && userRole !== "admin" && (
          <li>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="dados-link"
            >
              Dados
            </Link>
          </li>
        )}

        {/* Se não estiver logado → mostra Login */}
        {!token && (
          <li>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </li>
        )}

        {/* Se estiver logado → mostra botão Sair */}
        {token && (
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="logout-btn"
            >
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
