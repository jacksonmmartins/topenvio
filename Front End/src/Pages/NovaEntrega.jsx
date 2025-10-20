import { useState } from "react";
import api from "../Services/api";
import { getDistance } from "geolib";
import "../Layout/Layout.css";

export default function NovaEntrega() {
  const [origem, setOrigem] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    lat: null,
    lon: null,
  });

  const [destino, setDestino] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    lat: null,
    lon: null,
  });

  const [distancia, setDistancia] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  // 🔹 Estado do popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // 🔹 Exibir popup temporário (3s)
  const exibirPopup = (texto) => {
    setPopupMessage(texto);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // 🔹 Função auxiliar para obter lat/lon via API Nominatim (OpenStreetMap)
  const geocodeEndereco = async (enderecoCompleto) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          enderecoCompleto
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      return null;
    }
  };

  // 🔹 Buscar CEP via backend
  const buscarCEP = async (tipo, cep) => {
    // Validação antes da requisição
    if (!/^\d{8}$/.test(cep)) {
      exibirPopup("❌ O CEP informado deve conter exatamente 8 dígitos numéricos.");
      return;
    }

    try {
      const { data } = await api.get(`/cep/${cep}`);

      if (!data || data.erro) {
        exibirPopup("CEP não encontrado.");
        return;
      }

      // Busca coordenadas aproximadas com base no endereço
      const enderecoCompleto = `${data.logradouro}, ${data.localidade}, ${data.uf}`;
      const coords = await geocodeEndereco(enderecoCompleto);

      const novoEndereco = {
        cep,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        numero: "",
        lat: coords?.lat || null,
        lon: coords?.lon || null,
      };

      if (tipo === "origem") setOrigem(novoEndereco);
      else setDestino(novoEndereco);

      setMensagem("");
      exibirPopup("✅ Endereço encontrado com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      exibirPopup("Erro ao buscar CEP. Tente novamente.");
    }
  };

  // 🔹 Calcular distância
  const calcularDistancia = () => {
    if (!origem.lat || !destino.lat) {
      exibirPopup("Informe CEPs válidos para origem e destino antes de calcular.");
      return;
    }

    const metros = getDistance(
      { latitude: origem.lat, longitude: origem.lon },
      { latitude: destino.lat, longitude: destino.lon }
    );

    const km = (metros / 1000).toFixed(2);
    setDistancia(km);
    exibirPopup(`📏 Distância calculada: ${km} km`);
  };

  // 🔹 Salvar entrega
  const salvarEntrega = async () => {
    try {
      if (!distancia) {
        exibirPopup("Calcule a distância antes de salvar.");
        return;
      }

      setSalvando(true);
      const payload = { origem, destino, distancia };
      const res = await api.post("/entregas", payload);

      console.log("✅ Entrega salva:", res.data);
      exibirPopup("✅ Entrega cadastrada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar entrega:", err);
      exibirPopup("Erro ao salvar entrega. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="entrega-container">
      <div className="entrega-card">
        <h2>📦 Nova Entrega</h2>
        <p>Informe os dados de origem e destino do envio.</p>

        {/* ORIGEM */}
        <div className="form-section">
          <h3>🏠 Origem</h3>
          <div className="cep-group">
            <input
              type="text"
              placeholder="CEP"
              value={origem.cep}
              onChange={(e) => setOrigem({ ...origem, cep: e.target.value.replace(/\D/g, "") })}
            />
            <button onClick={() => buscarCEP("origem", origem.cep)}>Buscar CEP</button>
          </div>

          <input type="text" placeholder="Logradouro" value={origem.logradouro} readOnly />
          <input type="text" placeholder="Bairro" value={origem.bairro} readOnly />
          <input type="text" placeholder="Cidade" value={origem.cidade} readOnly />
          <input type="text" placeholder="Estado" value={origem.estado} readOnly />
          <input
            type="text"
            placeholder="Número"
            value={origem.numero}
            onChange={(e) => setOrigem({ ...origem, numero: e.target.value })}
          />
        </div>

        {/* DESTINO */}
        <div className="form-section">
          <h3>🎯 Destino</h3>
          <div className="cep-group">
            <input
              type="text"
              placeholder="CEP"
              value={destino.cep}
              onChange={(e) => setDestino({ ...destino, cep: e.target.value.replace(/\D/g, "") })}
            />
            <button onClick={() => buscarCEP("destino", destino.cep)}>Buscar CEP</button>
          </div>

          <input type="text" placeholder="Logradouro" value={destino.logradouro} readOnly />
          <input type="text" placeholder="Bairro" value={destino.bairro} readOnly />
          <input type="text" placeholder="Cidade" value={destino.cidade} readOnly />
          <input type="text" placeholder="Estado" value={destino.estado} readOnly />
          <input
            type="text"
            placeholder="Número"
            value={destino.numero}
            onChange={(e) => setDestino({ ...destino, numero: e.target.value })}
          />
        </div>

        {/* BOTÕES */}
        <button className="btn-calcular" onClick={calcularDistancia}>
          Calcular Distância
        </button>

        {distancia && (
          <p className="distancia-info">
            Distância aproximada: <strong>{distancia} km</strong>
          </p>
        )}

        <button className="btn-calcular" onClick={salvarEntrega} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar Entrega"}
        </button>

        {mensagem && <p className="mensagem-erro">{mensagem}</p>}
      </div>

      {/* POP-UP */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
            fontWeight: "500",
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
