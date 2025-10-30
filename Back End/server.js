// Back End/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

import authRoutes from "./Routes/Auth.js";
import adminRoutes from "./Routes/Admin.js";
import planosRoutes from "./Routes/Planos.js";
import User from "./Models/User.js";
import cepRoutes from "./Routes/Cep.js";

dotenv.config();
const app = express();

// ============================================================
// 🌐 Configuração CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", // dev
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("🚫 CORS bloqueado para origem:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🧩 Middlewares
app.use(express.json());
app.use(cookieParser());

// 🛠 Rotas
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/planos", planosRoutes);
app.use("/api/cep", cepRoutes);

app.get("/ping", (req, res) => res.status(200).json({ message: "Servidor Top Envio ativo!" }));

// 💾 Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar:", err));

// 👑 Criação automática do admin
async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@topenvio.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";

  try {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("👑 Administrador criado!");
    }
  } catch (err) {
    console.error("Erro ao criar admin:", err);
  }
}
createAdminUser();

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
