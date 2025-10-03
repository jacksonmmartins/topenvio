// src/Components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Marca sempre visível */}
      <div className="navbar-brand">Top Envio</div>

      {/* Botão sanduíche (mobile) */}
      <div
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Links */}
      <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/planos" onClick={() => setIsOpen(false)}>Planos</Link></li>
        <li><Link to="/sobre" onClick={() => setIsOpen(false)}>Sobre</Link></li>
        {!token && (
          <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
        )}
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
