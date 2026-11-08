import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export function createAccessToken(user) {
  return jwt.sign(
    { username: user.username, name: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    { subject: String(user.id), expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
}

export function createRefreshToken(user) {
  return jwt.sign(
    { tokenUse: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { subject: String(user.id), expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function publicUser(user) {
  return { id: user.id, name: user.name, username: user.username };
}

export function refreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
