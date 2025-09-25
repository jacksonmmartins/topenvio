import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Sobre from "../Pages/Sobre";
import Planos from "../Pages/Planos";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Todas as rotas dentro do Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/planos" element={<Planos />} />
      </Route>
    </Routes>
  );
}
