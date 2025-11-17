import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { AiFillBackward } from "react-icons/ai"; 
import "./Usuarios.css"

export default function Admin() {
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://topenvio.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clients.filter((c) => c._id !== id));
      alert("Cliente excluído e e-mail enviado!");
    } catch (err) {
      alert("Erro ao excluir cliente");
    }
  };

  return (
    <div className="usuarios-containe">
      <h1>Painel do Administrador
      </h1>
      <div className="usuarios-grid">
        {clients.map((client) => (
          <div key={client._id} className="usuario-card">
            <h3>{client.name}</h3>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Empresa:</strong> {client.companyName || "Não informado"}</p>
            <p><strong>Porte:</strong> {client.companySize}</p>
            <button onClick={() => handleDelete(client._id)}>
              <FaTrash /> Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
