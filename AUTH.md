# LoomOS Auth — PostgreSQL + phone login (no OTP)

## Pitch mode

- **No OTP / SMS.** `POST /api/auth/login` with `{ phone, role }` creates the session cookie.
- Weaver UI: tap a demo name (Meena / Selvi / …) or enter phone → **Continue**.
- Buyer UI: enter demo phone → **Continue**, or Register with a business name.

## Setup

1. PostgreSQL `DATABASE_URL` (Neon / Vercel Postgres) in `.env` and Vercel env vars
2. Also set `SESSION_SECRET` (and optionally `OTP_PEPPER` leftover — unused for login)
3. `npx prisma db push` then `npm run db:seed`
4. Redeploy on Vercel after pushing code

## Seed phones

| Role   | Phone      | Person / org                          |
|--------|------------|----------------------------------------|
| Weaver | 9000000001 | Meena                                  |
| Weaver | 9000000002 | Selvi                                  |
| Weaver | 9000000003 | Kamala                                 |
| Buyer  | 9100000001 | Saffron Thread Boutique                |
| Buyer  | 9100000002 | Festival Cloth Desk                    |

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | `{ phone, role, mode?, name?, … }` → sets cookie |
| POST | `/api/auth/logout` | Clears session |
| GET | `/api/auth/me` | Current user + profile |
| POST | `/api/auth/otp/*` | Retired (410) |

SQLite does not work on Vercel — use Postgres.
