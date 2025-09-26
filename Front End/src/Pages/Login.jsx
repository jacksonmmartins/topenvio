import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Entrar</h2>
        <form>
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Login</button>
        </form>
        <p>
          Não tem conta? <a href="/createuser">Criar conta</a>
        </p>
      </div>
    </div>
  );
}
