// src/Pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../Services/api";
import "./AdminPanel.css"; // garante que tenha estilos globais

export default function AdminPanel() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClients(res.data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(clients.filter(c => c._id !== id));
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Painel do Administrador</h2>
      <div className="clients-grid">
        {clients.length === 0 && <p>Nenhum cliente encontrado.</p>}
        {clients.map((client) => (
          <div key={client._id} className="client-card">
            <h3>{client.name}</h3>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Empresa:</strong> {client.companyName || "Não informado"}</p>
            <p><strong>Porte:</strong> {client.companySize}</p>
            <button 
              className="delete-btn" 
              onClick={() => handleDelete(client._id)}
            >
              <FaTrash /> Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
