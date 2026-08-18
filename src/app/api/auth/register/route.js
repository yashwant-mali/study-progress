import { NextResponse } from 'next/server';
import { register } from '@/controllers/authController';

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await register(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to register' },
      { status: error.status || 500 },
    );
  }
}
