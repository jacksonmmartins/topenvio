// Admin.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "./Admin.css";

export default function Admin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pega o token do localStorage
  const token = localStorage.getItem("token");

  // Base URL da API definida via variável de ambiente
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setError("Não foi possível carregar os usuários.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, API_BASE_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clients.filter((client) => client._id !== id));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Não foi possível excluir o usuário.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Lista de Usuários</h2>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="3">Nenhum usuário encontrado.</td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(client._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
