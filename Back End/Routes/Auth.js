// Back End/Routes/Auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { transporter } from "../Config/nodemailer.js"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Middleware para verificar token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// Teste inicial
router.get("/teste", (req, res) => {
  res.send("Backend e MongoDB funcionando!");
});

// Registrar usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
  token, 
  user: { 
    name: user.name, 
    email: user.email, 
    role: user.role,   // <-- adiciona o role
    companyName: user.companyName, 
    companySize: user.companySize 
  } 
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Esqueci a senha
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Gerar token de 15 minutos
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Envia e-mail
    await transporter.sendMail({
      from: `"Top Envio" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Redefinição de senha",
      html: `
        <p>Você solicitou redefinir sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha (válido por 15 min):</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({ message: "Link de redefinição enviado para seu email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar link de redefinição" });
  }
});

// Reset de senha
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
});

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
  const { companyName, companySize } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { companyName, companySize },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ message: "Perfil atualizado com sucesso", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
