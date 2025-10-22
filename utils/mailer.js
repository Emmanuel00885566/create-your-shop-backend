import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME || "Create Your Shop"} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("MAIL SENT:", info.messageId);
    return { messageId: info.messageId };
  } catch (err) {
    console.error("MAIL ERROR:", err.message);
    throw err;
  }
}
