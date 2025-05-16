import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { solicitudCorreo } from '@/utils/solicitudCorreoBone';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const data = req.body;

  const htmlBody = solicitudCorreo(data);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Redibo" <${process.env.MAIL_USER}>`,
    to: data.email,
    subject: 'Nueva Solicitud de Reserva',
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).json({ success: false, error });
  }
}
