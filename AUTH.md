# LoomOS Auth — PostgreSQL + phone login (no OTP)

## Pitch mode

- **No OTP / SMS.** `POST /api/auth/login` with `{ phone, role }` creates the session cookie.
- Weaver UI: tap a demo name (Kavita / Selvi / …) or enter phone → **Continue**.
- Buyer UI: enter demo phone → **Continue**, or Register with a business name.

## Setup

1. PostgreSQL `DATABASE_URL` (Neon / Vercel Postgres) in `.env` and Vercel env vars
2. Also set `SESSION_SECRET` (and optionally `OTP_PEPPER` leftover — unused for login)
3. `npx prisma db push` then `npm run db:seed`
4. Redeploy on Vercel after pushing code

## Seed phones

| Role   | Phone      | Person / org                          |
|--------|------------|----------------------------------------|
| Weaver | 9876543210 | Kavita (South Indian · Kanchipuram)     |
| Weaver | 9876543211 | Selvi (South Indian · Madurai)          |
| Weaver | 9876543212 | Kamala (South Indian · Salem)          |
| Weaver | 9876543213 | Lakshmi (South Indian · Erode)         |
| Buyer  | 9840010001 | Saffron Thread Boutique                |
| Buyer  | 9840010002 | Festival Cloth Desk                    |
| Buyer  | 9840010003 | Loom Link Resellers                    |

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | `{ phone, role, mode?, name?, … }` → sets cookie |
| POST | `/api/auth/logout` | Clears session |
| GET | `/api/auth/me` | Current user + profile |
| POST | `/api/auth/otp/*` | Retired (410) |

SQLite does not work on Vercel — use Postgres.
