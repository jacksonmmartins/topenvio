import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
