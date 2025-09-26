import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/User.js";

const router = express.Router();

router.get("/teste", (req, res) => {
  res.send("Backend e MongoDB funcionando!");
});

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

export default router;
