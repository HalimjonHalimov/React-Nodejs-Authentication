import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Access token topilmadi.' });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = db.data.users.find((item) => item.id === Number(payload.sub));

    if (!user) {
      return res.status(401).json({ message: 'Foydalanuvchi topilmadi.' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Access token yaroqsiz yoki muddati tugagan.' });
  }
}
