import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello, Next.js API!',
    firebase: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configured' : 'Not configured',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not configured'
  });
} 