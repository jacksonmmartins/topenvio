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
    descricao:
      "Acesso completo e ilimitado às funcionalidades da plataforma Top Envio.",
  });
  const [editPlanoId, setEditPlanoId] = useState(null);

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

  const fetchPlanos = async () => {
    try {
      const res = await getPlanos();
      setPlanos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
      setPlanos([]);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  const handleCriarPlano = async (e) => {
    e.preventDefault();
    try {
      const res = await criarPlano(novoPlano);
      setPlanos([...planos, res.data]);
      setNovoPlano({ tipo: "Premium", valor: "", descricao: "" });
    } catch (err) {
      console.error("Erro ao criar plano:", err);
      alert("Falha ao salvar plano. Verifique permissões de administrador.");
    }
  };

  const handleEditPlano = async (plano) => {
    try {
      const res = await atualizarPlano(plano._id, plano);
      setPlanos(planos.map((p) => (p._id === plano._id ? res.data : p)));
      setEditPlanoId(null);
    } catch (err) {
      console.error("Erro ao atualizar plano:", err);
      alert("Falha ao atualizar plano.");
    }
  };

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
      <h1 className="titulo-principal">Escolha o plano ideal para o seu negócio</h1>
      <p className="subtitulo">
        A <strong>Top Envio</strong> oferece soluções logísticas inteligentes para todos os
        perfis — do empreendedor iniciante à grande operação.
      </p>

      {/* 🔹 Bloco institucional "Por que escolher a Top Envio?" */}
      <div className="destaque-topenvio">
        <h2>✨ Por que escolher a Top Envio?</h2>
        <ul>
          <li>Reduza custos logísticos e aumente a eficiência operacional.</li>
          <li>Tenha controle total de seus envios em um único painel.</li>
          <li>Atendimento humano e suporte técnico especializado.</li>
          <li>Tecnologia segura, rápida e 100% brasileira.</li>
        </ul>
        <p className="frase-final">
          Simplifique sua logística. Entregue mais, com menos esforço —{" "}
          <strong>Top Envio</strong>, a tecnologia que move o seu negócio.
        </p>
      </div>

      {userRole === "admin" && (
        <div className="admin-section">
          <h2>Gerenciar Planos</h2>
          <form onSubmit={handleCriarPlano} className="planos-form">
            <label>Tipo de plano:</label>
            <select
              value={novoPlano.tipo}
              onChange={(e) => setNovoPlano({ ...novoPlano, tipo: e.target.value })}
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
              onChange={(e) => setNovoPlano({ ...novoPlano, valor: e.target.value })}
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

            <button type="submit" className="btn-primary">Salvar Plano</button>
          </form>
        </div>
      )}

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
                  <p className="valor">R$ {plano.valor}</p>
                  <p className="descricao">{plano.descricao}</p>

                  {userRole === "admin" ? (
                    <div className="admin-actions">
                      <button
                        className="btn-editar"
                        onClick={() => setEditPlanoId(plano._id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => handleDeletePlano(plano._id)}
                      >
                        Excluir
                      </button>
                    </div>
                  ) : (
                    <button className="btn-primary">Assinar Agora</button>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum plano disponível no momento.</p>
        )}
      </div>
    </div>
  );
}
