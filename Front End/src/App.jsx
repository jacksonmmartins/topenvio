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
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Admin from "./Pages/Admin";
import AdminPanel from "./Pages/AdminPanel";
import Usuarios from "./Pages/Usuarios";
import NovaEntrega from "./Pages/NovaEntrega";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

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
            path="nova-entrega"
            element={
              <PrivateRoute>
                <NovaEntrega />
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

          {/* Admin e usuários protegidos */}
          <Route
            path="admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          <Route
            path="usuarios"
            element={
              <PrivateRoute adminOnly={true}>
                <Usuarios />
              </PrivateRoute>
            }
          />

        </Route>

        {/* Rota alternativa Admin (se precisar separar) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
