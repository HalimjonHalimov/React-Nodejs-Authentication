# React Authentication Learning Backend

Oddiy local Node.js + Express backend: Register, Login, JWT access token, refresh token in HttpOnly cookie, refresh rotation, Logout va protected endpoint.

## Talablar
- Node.js 20 yoki undan yangi
- Frontend default manzili: `http://localhost:5173`

## Ishga tushirish (Windows PowerShell)

```powershell
cd auth-backend
npm install
Copy-Item .env.example .env
```

```powershell
npm run dev
```

Server `http://localhost:5000` da ishlaydi. Birinchi ishga tushganda `data/db.json` avtomatik yaratiladi.

## API

### Register
`POST http://localhost:5000/api/auth/register`

```json
{ "name": "name", "username": "username", "password": "password123" }
```

Javobda `accessToken` va `user` keladi. Refresh token esa HttpOnly cookie sifatida o‘rnatiladi.

### Login
`POST http://localhost:5000/api/auth/login`

```json
{ "username": "username", "password": "password123" }
```

### Refresh
`POST http://localhost:5000/api/auth/refresh`

Browser cookie yuborishi uchun frontend Axios instance'da `withCredentials: true` bo‘lishi kerak. Endpoint access token qaytaradi va refresh cookie'ni rotate qiladi.

### Logout
`POST http://localhost:5000/api/auth/logout`

### Current user
`GET http://localhost:5000/api/auth/me`

Header: `Authorization: Bearer <accessToken>`

### Protected demo
`GET http://localhost:5000/api/protected`

Header: `Authorization: Bearer <accessToken>`

## Frontend Axios misoli

```js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Register
const response = await api.post('/auth/register', {
  name,
  username,
  password,
});
const accessToken = response.data.accessToken;

// Protected request
const result = await api.get('/protected', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```