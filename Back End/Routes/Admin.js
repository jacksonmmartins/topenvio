// Back End/Routes/Admin.js
import express from "express";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../Config/nodemailer.js";

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

// Buscar todos os clientes
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

    // dispara e-mail confirmando exclusão
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

export default router;
