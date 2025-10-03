import { useState } from "react";
import api from "../Services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message + ". Confira o console para o link.");
      console.log("Link de redefinição:", res.data.resetLink);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao enviar o link");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "10px", width: "100%", maxWidth: "400px" }}>
        <h2>Esqueceu a senha</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ width: "100%", padding: "0.8rem", border: "none", borderRadius: "8px", background: "#0073e6", color: "#fff" }}>
            Enviar
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
