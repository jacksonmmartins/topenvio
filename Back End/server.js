// ==========================
// ✅ Importações
// ==========================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

import authRoutes from "./Routes/Auth.js";
import adminRoutes from "./Routes/Admin.js";
import planosRoutes from "./Routes/Planos.js";
import cepRoutes from "./Routes/Cep.js";
import User from "./Models/User.js";

dotenv.config();
const app = express();

// ==========================
// 🌍 CORS Config — compatível com Render + Vercel
// ==========================
const allowedOrigins = [
  "https://topenvio.vercel.app", // produção (Vercel)
  "http://localhost:5173",       // desenvolvimento local (Vite)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem "origin" (como de ferramentas ou preflight Render)
    if (!origin) {
      console.log("⚙️ Requisição sem origin detectada (provavelmente preflight ou server-side).");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("✅ CORS liberado para:", origin);
      return callback(null, true);
    } else {
      console.warn("🚫 CORS bloqueado para origem:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // evita erro de preflight em alguns navegadores
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // necessário para o preflight
app.use(express.json());
app.use(cookieParser());

// ==========================
// 🔗 Rotas
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/planos", planosRoutes);
app.use("/api/cep", cepRoutes);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Servidor Top Envio ativo!" });
});

// ==========================
// 💾 Conexão MongoDB
// ==========================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// ==========================
// 👑 Criação automática do admin
// ==========================
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
      console.log("👑 Administrador padrão criado com sucesso!");
    } else {
      console.log("ℹ️ Administrador padrão já existe.");
    }
  } catch (err) {
    console.error("Erro ao criar admin:", err);
  }
}
createAdminUser();

// ==========================
// 🚀 Inicialização do servidor
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando na porta ${PORT} — Ambiente: ${process.env.NODE_ENV}`)
);
