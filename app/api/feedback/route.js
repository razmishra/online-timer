import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db';
import Feedback from '../../../utils/models/Feedback';
import nodemailer from 'nodemailer';

const MONGODB_DB = process.env.MONGODB_DB || 'sharemytimer';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Email sending utility
function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function POST(req) {
  try {
    const { feedback } = await req.json();
    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return NextResponse.json({ error: 'Feedback cannot be empty.' }, { status: 400 });
    }
    // Store in MongoDB using Mongoose
    await connectToDatabase();
    await Feedback.create({
      feedback: feedback.trim(),
      userAgent: req.headers.get('user-agent') || '',
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
    });

    // Send email
    const transporter = getTransporter();
    await transporter.sendMail({
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'New Feedback Received',
      text: `Feedback: ${feedback.trim()}`,
      html: `<p><strong>Feedback:</strong> ${feedback.trim()}</p>`
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 