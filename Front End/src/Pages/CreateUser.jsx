import React from "react";
import "./CreateUser.css";

export default function CriarConta() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Criar Conta</h2>
        <form>
          <input type="text" placeholder="Nome" required />
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <input type="password" placeholder="Repetir Senha" required />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
