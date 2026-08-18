import crypto from 'crypto';

const COOKIE_NAME = 'studyflow_session';
const DEFAULT_EXPIRES_IN = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be defined and contain at least 32 characters.');
  }
  return secret;
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(input) {
  return crypto.createHmac('sha256', getSecret()).update(input).digest('base64url');
}

export function createToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + expiresIn,
  }));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;

    const expected = sign(`${header}.${body}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(maxAge = DEFAULT_EXPIRES_IN) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export async function getAuthUserFromRequest(request) {
  const token = request.cookies?.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export function unauthorized(message = 'Authentication required') {
  const error = new Error(message);
  error.status = 401;
  return error;
}
