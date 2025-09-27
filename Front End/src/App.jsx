// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Planos from "./Pages/Planos";
import Sobre from "./Pages/Sobre";
import Login from "./Pages/Login";
import CreateUser from "./Pages/CreateUser";
import CompleteProfile from "./Pages/CompleteProfile";
import Profile from "./Pages/Profile";
import PrivateRoute from "./Components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Layout global com Navbar e Footer */}
        <Route path="/" element={<Layout />}>
          {/* Páginas públicas */}
          <Route index element={<Home />} />
          <Route path="planos" element={<Planos />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="login" element={<Login />} />
          <Route path="createuser" element={<CreateUser />} />

          {/* Páginas privadas */}
          <Route
            path="completeprofile"
            element={
              <PrivateRoute>
                <CompleteProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
