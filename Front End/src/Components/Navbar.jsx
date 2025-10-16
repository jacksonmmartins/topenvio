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
        localStorage.removeItem("token");
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
      {/* Marca */}
      <div className="navbar-brand">
        <Link to="/" onClick={() => setIsOpen(false)} style={{ color: "#0d0c0cff", textDecoration: "none" }}>
          Top Envio
        </Link>
      </div>

      {/* Botão sanduíche (mobile) */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Menu central */}
      <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/planos" onClick={() => setIsOpen(false)}>Planos</Link></li>
        <li><Link to="/sobre" onClick={() => setIsOpen(false)}>Sobre</Link></li>

        {token && userRole === "admin" && (
          <li><Link to="/admin" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
        )}
        {token && userRole !== "admin" && (
          <li><Link to="/profile" onClick={() => setIsOpen(false)}>Dados</Link></li>
        )}
        {!token && (
          <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
        )}

        {/* Mostra o botão sair dentro do menu no mobile */}
        {token && (
          <li className="mobile-only">
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="logout-btn">
              Sair
            </button>
          </li>
        )}
      </ul>

      {/* Botão sair separado (desktop) */}
      {token && (
        <div className="navbar-right desktop-only">
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
