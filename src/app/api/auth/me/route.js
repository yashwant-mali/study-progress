import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/controllers/authController';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  const session = await getAuthUserFromRequest(request);
  if (!session?.sub) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getCurrentUser(session.sub);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user });
}
