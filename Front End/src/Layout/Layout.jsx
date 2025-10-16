// src/Layout/Layout.jsx
import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import "../Layout/Layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="scroll-container">
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
