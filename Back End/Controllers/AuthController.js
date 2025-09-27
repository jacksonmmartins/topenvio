import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Usuário já existe" });

    // Buscar dados do usuário logado
router.get("/profile", async (req, res) => {
  try {
    const userId = req.user.id; // vem do middleware verifyToken
    const user = await User.findById(userId).select("-password"); // exclui a senha

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Senha inválida" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login realizado com sucesso!", token });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
