import { useState } from "react";
import api from "../Services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage("Link enviado! Verifique seu e-mail.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao enviar link");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: 10, maxWidth: 400, width: "100%" }}>
        <h2>Esqueceu a senha</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem" }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: "0.8rem", background: "#0073e6", color: "#fff", border: "none", borderRadius: 8 }}
          >
            Enviar link
          </button>
        </form>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}
