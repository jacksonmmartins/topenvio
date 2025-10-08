import React, { useEffect, useState } from "react";
import {
  getPlanos,
  criarPlano,
  atualizarPlano,
  excluirPlano,
} from "../Services/api";
import "../Pages/Planos.css";

export default function Planos() {
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [novoPlano, setNovoPlano] = useState({
    tipo: "Premium",
    valor: "99.90",
    descricao: "Acesso completo e ilimitado às funcionalidades da plataforma.",
  });
  const [editPlanoId, setEditPlanoId] = useState(null);

  // Decodifica token para definir papel do usuário
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, [token]);

  // Busca planos do backend
  const fetchPlanos = async () => {
    try {
      const res = await getPlanos();
      if (Array.isArray(res.data)) {
        setPlanos(res.data);
      } else {
        console.error("API não retornou um array:", res.data);
        setPlanos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
      setPlanos([]);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  // Criar novo plano
  const handleCriarPlano = async (e) => {
    e.preventDefault();
    try {
      const res = await criarPlano(novoPlano);

      // Certifica que planos é um array antes de atualizar
      setPlanos(Array.isArray(planos) ? [...planos, res.data] : [res.data]);

      setNovoPlano({
        tipo: "Premium",
        valor: "",
        descricao: "",
      });
    } catch (err) {
      console.error("Erro ao criar plano:", err);
      alert("Falha ao salvar plano. Verifique permissões de administrador.");
    }
  };

  // Editar plano
  const handleEditPlano = async (plano) => {
    try {
      const res = await atualizarPlano(plano._id, plano);
      setPlanos(
        planos.map((p) => (p._id === plano._id ? res.data : p))
      );
      setEditPlanoId(null);
    } catch (err) {
      console.error("Erro ao atualizar plano:", err);
      alert("Falha ao atualizar plano.");
    }
  };

  // Excluir plano
  const handleDeletePlano = async (id) => {
    if (!window.confirm("Deseja realmente excluir este plano?")) return;
    try {
      await excluirPlano(id);
      setPlanos(planos.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao excluir plano:", err);
      alert("Falha ao excluir plano.");
    }
  };

  return (
    <div className="planos-container">
      <h1>Planos disponíveis</h1>

      {/* Formulário para admin criar plano */}
      {userRole === "admin" && (
        <div className="admin-section">
          <h2>Gerenciar Planos</h2>
          <form onSubmit={handleCriarPlano} className="planos-form">
            <label>Tipo de plano:</label>
            <select
              value={novoPlano.tipo}
              onChange={(e) =>
                setNovoPlano({ ...novoPlano, tipo: e.target.value })
              }
            >
              <option value="Premium">Premium</option>
              <option value="Econômico">Econômico</option>
              <option value="Custo Benefício">Custo Benefício</option>
              <option value="Promocional">Promocional</option>
            </select>

            <label>Valor (R$):</label>
            <input
              type="text"
              value={novoPlano.valor}
              onChange={(e) =>
                setNovoPlano({ ...novoPlano, valor: e.target.value })
              }
              required
            />

            <label>Descrição:</label>
            <textarea
              value={novoPlano.descricao}
              onChange={(e) =>
                setNovoPlano({ ...novoPlano, descricao: e.target.value })
              }
              required
            />

            <button type="submit">Salvar Plano</button>
          </form>
        </div>
      )}

      {/* Listagem de planos */}
      <div className="planos-list">
        {planos.length > 0 ? (
          planos.map((plano) => (
            <div key={plano._id} className="plano-card">
              {userRole === "admin" && editPlanoId === plano._id ? (
                <>
                  <input
                    type="text"
                    value={plano.tipo}
                    onChange={(e) => (plano.tipo = e.target.value)}
                  />
                  <input
                    type="text"
                    value={plano.valor}
                    onChange={(e) => (plano.valor = e.target.value)}
                  />
                  <textarea
                    value={plano.descricao}
                    onChange={(e) => (plano.descricao = e.target.value)}
                  />
                  <button onClick={() => handleEditPlano(plano)}>Salvar</button>
                  <button onClick={() => setEditPlanoId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <h3>{plano.tipo}</h3>
                  <p>
                    <strong>R$ {plano.valor}</strong>
                  </p>
                  <p>{plano.descricao}</p>

                  {userRole === "admin" && (
                    <div className="admin-actions">
                      <button onClick={() => setEditPlanoId(plano._id)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeletePlano(plano._id)}>
                        Excluir
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum plano disponível.</p>
        )}
      </div>
    </div>
  );
}
