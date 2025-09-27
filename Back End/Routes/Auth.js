import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { register, login } from "../Controllers/AuthController.js";

const router = express.Router();

// Middleware para verificar token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user; // salva os dados decodificados do token
    next();
  });
}

// Teste inicial
router.get("/teste", (req, res) => {
  res.send("Backend e MongoDB funcionando!");
});

// Criar usuário
router.post("/register", register);

// Login
router.post("/login", login);

// Perfil do usuário logado
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Atualizar perfil
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { companyName, companySize } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { companyName, companySize },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ message: "Perfil atualizado com sucesso", user });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
