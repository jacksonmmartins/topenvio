// src/pages/Admin.jsx
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

export default function Admin() {
  const navigate = useNavigate();

  const cards = [
    { title: "Usuários Ativos", route: "/usuarios", description: "Gerencie os usuários ativos do sistema" },
    { title: "Planos Ativos", route: "/planos", description: "Visualize e edite os planos disponíveis" }
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">Painel Administrativo</h1>

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className="admin-card"
          >
            <h2 className="card-title">{card.title}</h2>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
