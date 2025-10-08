// Back End/Routes/Planos.js
import express from "express";
import Plano from "../Models/Planos.js"; // Modelo de planos
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Middleware para verificar se é admin
function verifyAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    if (user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
    req.user = user;
    next();
  });
}

// 🔹 Rotas públicas
router.get("/", async (req, res) => {
  try {
    const planos = await Plano.find();
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar planos" });
  }
});

// 🔹 Rotas protegidas (Admin)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const novoPlano = new Plano(req.body);
    const salvo = await novoPlano.save();
    res.json(salvo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar plano" });
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const plano = await Plano.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar plano" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Plano.findByIdAndDelete(req.params.id);
    res.json({ message: "Plano excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir plano" });
  }
});

export default router;
