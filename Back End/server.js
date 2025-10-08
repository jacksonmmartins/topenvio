// Back End/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import authRoutes from "./Routes/Auth.js";
import adminRoutes from "./Routes/Admin.js";
import planosRoutes from "./Routes/Planos.js"; // ✅ corrigido
import User from "./Models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/planos", planosRoutes); // ✅ rota de planos separada

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado ao MongoDB"))
.catch((err) => console.error("Erro ao conectar:", err));

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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
