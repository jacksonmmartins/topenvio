import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <h1>Top Envio</h1>
      </div>
      <nav className="links">
        <a href="/">Home</a>
        <a href="/planos">Planos</a>
        <a href="/sobre">Sobre</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
}
