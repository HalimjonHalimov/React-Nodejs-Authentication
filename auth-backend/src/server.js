import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { requireAuth } from './middleware/requireAuth.js';
import { publicUser } from './utils.js';

const requiredEnv = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key].startsWith('replace_this')) {
    throw new Error(`${key} ni .env faylida ozgartiring.`);
  }
}

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => res.json({ message: 'Auth learning API ishlayapti.' }));
app.use('/api/auth', authRoutes);

app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: `Xush kelibsiz, ${req.user.name}! Token to‘g‘ri.`, user: publicUser(req.user) });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Serverda kutilmagan xatolik yuz berdi.' });
});

app.listen(port, () => {
  console.log(`Auth API: http://localhost:${port}`);
  console.log(`Frontend origin: ${clientOrigin}`);
});
