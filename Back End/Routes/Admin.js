// Back End/Routes/Admin.js
import express from "express";
import User from "../Models/User.js";
import Plano from "../Models/Planos.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../Config/nodemailer.js";

dotenv.config();

const router = express.Router();

/* ================= Middleware ================= */
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

/* ================= Usuários ================= */

// Listar todos os clientes (exceto admin)
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// Excluir cliente
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Cliente não encontrado" });

    // Enviar e-mail de exclusão
    await transporter.sendMail({
      from: `"Top Envio" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Exclusão de dados",
      text: "Seus dados foram excluídos, conforme solicitação.",
    });

    res.json({ message: "Cliente excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});

/* ================= Planos ================= */

// Criar novo plano (apenas admin)
router.post("/planos", verifyAdmin, async (req, res) => {
  try {
    const novoPlano = new Plano(req.body);
    const salvo = await novoPlano.save();
    res.json(salvo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar plano" });
  }
});

// Listar todos os planos (todos os usuários podem ver)
router.get("/planos", async (req, res) => {
  try {
    const planos = await Plano.find();
    res.json(planos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar planos" });
  }
});

// Atualizar plano (apenas admin)
router.put("/planos/:id", verifyAdmin, async (req, res) => {
  try {
    const plano = await Plano.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plano) return res.status(404).json({ error: "Plano não encontrado" });
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar plano" });
  }
});

// Excluir plano (apenas admin)
router.delete("/planos/:id", verifyAdmin, async (req, res) => {
  try {
    const plano = await Plano.findByIdAndDelete(req.params.id);
    if (!plano) return res.status(404).json({ error: "Plano não encontrado" });
    res.json({ message: "Plano excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir plano" });
  }
});

export default router;
