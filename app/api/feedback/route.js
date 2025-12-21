import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db';
import Feedback from '../../../utils/models/Feedback';
import { getTransporter } from '../../lib/email';

const MONGODB_DB = process.env.MONGODB_DB || 'sharemytimer';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

export async function POST(req) {
  try {
    const { feedback, userEmail } = await req.json();
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
    const emailContent = userEmail 
      ? `Feedback from: ${userEmail}\n\nFeedback: ${feedback.trim()}`
      : `Feedback: ${feedback.trim()}\n\n(Submitted anonymously)`;
    
    const htmlContent = userEmail
      ? `<p><strong>Feedback from:</strong> ${userEmail}</p><p><strong>Feedback:</strong> ${feedback.trim()}</p>`
      : `<p><strong>Feedback:</strong> ${feedback.trim()}</p><p><em>(Submitted anonymously)</em></p>`;

    await transporter.sendMail({
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      subject: userEmail ? `New Feedback Received from ${userEmail}` : 'New Feedback Received (Anonymous)',
      text: emailContent,
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 