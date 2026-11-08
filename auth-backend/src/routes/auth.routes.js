import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  publicUser,
  refreshCookieOptions
} from '../utils.js';

const router = Router();
const cookieOptions = refreshCookieOptions();

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, cookieOptions);
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth'
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, username, password } = req.body ?? {};

    if (![name, username, password].every((value) => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ message: 'name, username va password majburiy.' });
    }
    if (name.trim().length > 80 || username.trim().length > 30 || password.length < 8) {
      return res.status(400).json({ message: 'Name/username juda uzun yoki password kamida 8 belgidan iborat bo‘lishi kerak.' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = db.data.users.find((user) => user.username === normalizedUsername);
    if (existingUser) {
      return res.status(409).json({ message: 'Bu username band.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: db.data.users.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name: name.trim(),
      username: normalizedUsername,
      passwordHash,
      refreshTokenHash: null,
      createdAt: new Date().toISOString()
    };

    const refreshToken = createRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    db.data.users.push(user);
    await db.write();

    setRefreshCookie(res, refreshToken);
    return res.status(201).json({
      message: 'Ro‘yxatdan o‘tish muvaffaqiyatli.',
      accessToken: createAccessToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return res.status(400).json({ message: 'username va password majburiy.' });
    }

    const user = db.data.users.find((item) => item.username === username.trim().toLowerCase());
    const passwordIsValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !passwordIsValid) {
      return res.status(401).json({ message: 'Username yoki password noto‘g‘ri.' });
    }

    const refreshToken = createRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await db.write();
    setRefreshCookie(res, refreshToken);

    return res.json({
      message: 'Login muvaffaqiyatli.',
      accessToken: createAccessToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token topilmadi.' });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (payload.tokenUse !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token noto‘g‘ri.' });
    }

    const user = db.data.users.find((item) => item.id === Number(payload.sub));
    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: 'Refresh token bekor qilingan yoki yaroqsiz.' });
    }

    // Rotate refresh token: old token becomes invalid after this write.
    const newRefreshToken = createRefreshToken(user);
    user.refreshTokenHash = hashToken(newRefreshToken);
    await db.write();
    setRefreshCookie(res, newRefreshToken);

    return res.json({ accessToken: createAccessToken(user) });
  } catch {
    clearRefreshCookie(res);
    return res.status(401).json({ message: 'Refresh token muddati tugagan yoki yaroqsiz.' });
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = db.data.users.find((item) => item.id === Number(payload.sub));
        if (user && user.refreshTokenHash === hashToken(token)) {
          user.refreshTokenHash = null;
          await db.write();
        }
      } catch {
        // Even an expired/invalid cookie should be cleared in the browser.
      }
    }

    clearRefreshCookie(res);
    return res.json({ message: 'Logout muvaffaqiyatli.' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
