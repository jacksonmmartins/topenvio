// Back End/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import authRoutes from "./Routes/Auth.js";
import adminRoutes from "./Routes/Admin.js";
import planosRoutes from "./Routes/Planos.js"; 
import User from "./Models/User.js";

dotenv.config();

const app = express();

// 🔹 CORS configurado para frontend Vercel + preflight
const allowedOrigins = ["https://topenvio.vercel.app"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Preflight OPTIONS para todas as rotas
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// 🔹 Rotas
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/planos", planosRoutes);

// 🔹 Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado ao MongoDB"))
.catch((err) => console.error("Erro ao conectar:", err));

// 🔹 Criar usuário admin se não existir
async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@topenvio.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Administrador",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });
    console.log("Administrador criado com sucesso!");
  }
}

createAdminUser();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
