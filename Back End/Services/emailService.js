import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetEmail(to, token) {
  const resetLink = `${process.env.FRONT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Suporte TopEnvio" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperação de Senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Se você não solicitou, ignore este e-mail.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
