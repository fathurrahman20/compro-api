# 🏢 My Company API

REST API untuk manajemen berita (News) dan autentikasi berbasis JWT HttpOnly Cookie.
Dibangun menggunakan Express, Prisma ORM, PostgreSQL (Neon), dan Zod untuk validation.

---

## 🚀 Tech Stack

| Layer         | Teknologi                                |
| ------------- | ---------------------------------------- |
| Runtime       | Node.js + npm                            |
| Backend       | Express.js                               |
| ORM           | Prisma ORM                               |
| Database      | PostgreSQL (Neon)                        |
| Validation    | Zod                                      |
| Auth          | JWT (access + refresh) — HttpOnly Cookie |
| Documentation | Scalar API Docs (OpenAPI 3.0)            |

---

## 📁 Project Structure

```
src/
 ├─ application/
 │   └─ database.ts      → Prisma Client instance
 │
 ├─ controllers/         → Handler untuk route (Auth & News)
 ├─ errors/              → Custom error classes & global error handler
 ├─ middleware/          → Auth middleware & request validation
 ├─ routes/              → Auth routes & News routes
 ├─ schema/              → Zod schemas (auth + news validation)
 ├─ services/            → Business logic (auth + news services)
 ├─ types/
 │   └─ express.d.ts     → Extend Express Request typing for user payload
 ├─ utils/
 │   └─ jwt.ts           → Generate & verify JWT tokens
 │
 └─ index.ts             → App entry + middleware setup
```

---

## ⚙️ Environment Variables

Buat `.env` dari template:

```sh
cp .env.example .env
```

Isi sesuai kredensial Neon + URL frontend + JWT secret:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
FRONTEND_URL="http://localhost:5173"

ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token
```

---

## 📦 Install Dependencies

```sh
npm install
```

> Bisa diganti dengan `npm` atau `pnpm` sesuai preferensi.

---

## 🗄️ Setup Database (Prisma ORM)

```sh
npx prisma generate
npx prisma migrate deploy
```

Optional (dev only):

```sh
npx prisma studio
```

---

## ▶️ Menjalankan Project

Development:

```sh
npm run dev
```

Production:

```sh
npm run build
npm run start
```

Server URL:

```
http://localhost:3000
```

---

## 🗄️ Prisma + Database Layer

`src/application/database.ts`

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
});
```

Middleware atau service tinggal import:

```ts
import { prisma } from "@/application/database";
```

---

## 🔐 JWT Utils

`src/utils/jwt.ts`

- `generateAccessToken(user)`
- `generateRefreshToken(user)`
- `verifyAccessToken(token)`
- `verifyRefreshToken(token)`

Token disimpan dalam **HttpOnly Secure Cookie** → meningkatkan keamanan XSS/CSRF

---

## 🧩 Zod Validation Schema

Folder `src/schema/`:

| Schema                | File             | Digunakan di |
| --------------------- | ---------------- | ------------ |
| Auth (login/register) | `auth.schema.ts` | `/auth/*`    |
| News (create/update)  | `news.schema.ts` | `/news/*`    |

Middleware validasi request otomatis return error yang terstruktur ✅

---

## 📚 Endpoint Summary

### ✅ Auth Endpoints

| Endpoint        | Method | Auth      | Deskripsi              |
| --------------- | ------ | --------- | ---------------------- |
| `/auth/login`   | POST   | ❌        | Login → set cookie JWT |
| `/auth/me`      | GET    | ✅ Cookie | Get current user       |
| `/auth/refresh` | GET    | ✅ Cookie | Refresh access token   |
| `/auth/logout`  | DELETE | ✅ Cookie | Remove session cookie  |

### 📰 News Endpoints

| Endpoint    | Method | Auth      | Deskripsi                       |
| ----------- | ------ | --------- | ------------------------------- |
| `/news`     | GET    | ❌        | List dengan search + pagination |
| `/news`     | POST   | ✅ Cookie | Create news                     |
| `/news/:id` | GET    | ❌        | Get detail news                 |
| `/news/:id` | PATCH  | ✅ Cookie | Update news                     |
| `/news/:id` | DELETE | ✅ Cookie | Delete news                     |

Search & pagination support:

```
GET /news?page=1&limit=10&q=keyword
```

---

## 📚 API Documentation

Scalar UI:

```
http://localhost:3000/api-docs
```

Production:

```
https://compro-api.onrender.com/api-docs
```

---
