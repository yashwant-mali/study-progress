import { NextResponse } from 'next/server';
import { login } from '@/controllers/authController';
import { getSessionCookieName, getSessionCookieOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await login(body);

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(
      getSessionCookieName(),
      result.token,
      getSessionCookieOptions(),
    );
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to login' },
      { status: error.status || 500 },
    );
  }
}
