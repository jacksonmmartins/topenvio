import mongoose from "mongoose";

const EnderecoSchema = new mongoose.Schema({
  cep: String,
  logradouro: String,
  bairro: String,
  cidade: String,
  estado: String,
  numero: String,
  lat: Number,
  lon: Number,
});

const EntregaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  origem: EnderecoSchema,
  destino: EnderecoSchema,
  distancia: Number,
  status: { type: String, default: "pendente" },
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model("Entrega", EntregaSchema);
