import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, default: "" },
  companySize: { type: String, enum: ["pequeno", "grande"], default: "pequeno" },
  role: { type: String, enum: ["user", "admin"], default: "user" } // 👈 novo
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
