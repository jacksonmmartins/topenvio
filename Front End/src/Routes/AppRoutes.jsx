import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Sobre from "../Pages/Sobre";
import Planos from "../Pages/Planos";
import CreateUser from "../Pages/CreateUser";
import CompleteProfile from "../Pages/CompleteProfile";
import Usuarios from "../Pages/Usuarios";
import Admin from "../Pages/AdminPanel";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Todas as rotas dentro do Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/admin" element={<Admin />} />
         <Route path="/usuarios" element={<Usuarios />} />
      </Route>
    </Routes>
  );
}
