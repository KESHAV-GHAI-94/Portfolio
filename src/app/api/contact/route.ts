import { NextResponse } from 'next/server';
import prisma from '@/backend/db/prisma';
import { sendEmailNotification } from '@/backend/mail/email';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 60 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per hour
});

export async function POST(req: Request) {
  try {
    // Rate limit: 10 requests per hour per IP
    try {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
      await limiter.check(10, ip);
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid "real" email address' }, { status: 400 });
    }

    // 1. Save to DB
    await prisma.contactSubmission.create({
      data: { name, email, message },
    });

    // 2. Send email notification
    await sendEmailNotification(name, email, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
