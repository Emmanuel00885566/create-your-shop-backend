import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
})

export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, html })
  return { messageId: info.messageId }
}