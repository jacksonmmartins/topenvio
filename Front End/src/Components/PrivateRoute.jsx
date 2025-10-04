import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Não logado → volta pro login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }

    // Se for rota apenas para admin
    if (adminOnly && decoded.role !== "admin") {
      return <Navigate to="/login" />;
    }

    // Caso contrário, tudo certo
    return children;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    localStorage.clear();
    return <Navigate to="/login" />;
  }
}
