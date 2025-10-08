// Back End/Models/Plano.js
import mongoose from "mongoose";

const PlanoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  valor: { type: String, required: true },
  descricao: { type: String, required: true },
}, { timestamps: true });

const Plano = mongoose.model("Plano", PlanoSchema);

export default Plano;
