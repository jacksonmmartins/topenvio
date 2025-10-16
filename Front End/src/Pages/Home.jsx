import { useState, useEffect } from "react";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import img5 from "../images/img5.jpg";
import "./Home.css";

const images = [img1, img2, img3, img4, img5];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Autoplay do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`Obrigado, ${name}! Você se inscreveu com ${email}`);
    setName("");
    setEmail("");
  };

  return (
    <div className="scroll-container">
      {/* Seção 1: Carrossel + texto */}
      <section className="section">
        <div className="container">
          <p className="brand-text">
            A escolha inteligente para entregas rápidas e seguras. <br />
            Com tecnologia e agilidade, conectamos sua empresa aos clientes em todo o Brasil. <br />
            Soluções de transporte confiáveis para quem valoriza prazo e qualidade. <br />
            Seu negócio vai mais longe com a gente.
          </p>

          <div className="carousel">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((src, i) => (
                <img key={i} src={src} alt={`slide ${i}`} className="carousel-img" />
              ))}
            </div>

            <div className="indicators">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === current ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Newsletter */}
      <section className="section">
        <div className="container newsletter-container">
          <h2>Se inscreva na nossa News Letter!</h2>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn">Inscrever-se</button>
          </form>
          {message && <p className="newsletter-message">{message}</p>}
        </div>
      </section>
    </div>
  );
}
