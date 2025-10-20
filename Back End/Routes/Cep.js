// src/routes/cep.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * Rota: /api/cep/:cep
 * Descrição: Consulta o CEP via API pública ViaCEP e retorna os dados formatados.
 */
router.get("/:cep", async (req, res) => {
  const { cep } = req.params;

  try {
    // Validação do formato: exatamente 8 dígitos numéricos
    if (!/^\d{8}$/.test(cep)) {
      console.warn(`CEP inválido recebido: ${cep}`);
      return res.status(400).json({ erro: "CEP fora do padrão de 8 dígitos." });
    }

    // Requisição à API ViaCEP
    const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(viaCepUrl);

    // Se a API externa retornar erro (ex: 404)
    if (!response.ok) {
      console.error(`Erro na API ViaCEP para CEP ${cep}: status ${response.status}`);
      return res
        .status(response.status)
        .json({ erro: "Erro ao buscar CEP na API externa." });
    }

    const data = await response.json();

    // Verifica se o CEP existe (ViaCEP retorna { erro: true } para inexistentes)
    if (data.erro) {
      console.warn(`CEP não encontrado: ${cep}`);
      return res.status(404).json({ erro: "CEP não encontrado." });
    }

    // Retorna dados formatados
    res.status(200).json({
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ddd: data.ddd,
    });
  } catch (err) {
    console.error("Erro interno ao buscar CEP:", err);
    res.status(500).json({ erro: "Erro interno no servidor ao buscar CEP." });
  }
});

export default router;
