# LoomOS Auth — PostgreSQL + Phone OTP

## What changed

- **PostgreSQL** via Prisma stores cooperatives, users, weaver/buyer profiles, OTP challenges, sessions.
- **Phone OTP** for weavers and buyers (httpOnly `loomos_session` cookie).
- **Dev OTP** — when MSG91/Twilio env vars are unset, the API returns `devCode` and logs it. Label in UI: “Dev OTP — SMS provider not wired.”
- Domain data (requirements, payments, wallets) still in `data/loomos-store.json`, keyed by the same stable ids.

## Why Vercel broke with SQLite

Vercel serverless has no persistent local disk and cannot run `better-sqlite3`. OTP send writes to the DB first — so every request returned **500** (100% error rate). Production needs a hosted Postgres `DATABASE_URL`.

## Setup (local + Vercel)

1. Create a free Postgres DB (pick one):
   - [Neon](https://console.neon.tech) → New project → copy connection string
   - [Prisma Postgres](https://console.prisma.io) → create database → copy `postgres://` URL
   - Vercel dashboard → Storage → create Postgres / Neon integration
2. Put the URL in `.env` and in **Vercel → Project → Settings → Environment Variables**:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
OTP_PEPPER="change-me-otp-pepper"
SESSION_SECRET="change-me-session-secret"
```

3. Push schema + seed demo users:

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

4. After setting Vercel env vars, **Redeploy**. Then run seed against the same production URL once:

```bash
$env:DATABASE_URL="postgresql://...production..."
npm run db:seed
```

Open [http://localhost:3000](http://localhost:3000) (or your Vercel URL).

## Seed phones (Demo Mode — fictional people)

| Role   | Phone      | Person / org                          |
|--------|------------|----------------------------------------|
| Weaver | 9000000001 | Meena                                  |
| Weaver | 9000000002 | Selvi                                  |
| Weaver | 9000000003 | Kamala                                 |
| Buyer  | 9100000001 | Saffron Thread Boutique                |
| Buyer  | 9100000002 | Festival Cloth Desk                    |

New buyer phones can sign up with a business name. New weaver phones must be enrolled by the cooperative (seed / admin) — self-signup is blocked.

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/otp/send` | `{ phone, role: "WEAVER" \| "BUYER" }` |
| POST | `/api/auth/otp/verify` | `{ phone, code, role, name?, region? }` → sets cookie |
| POST | `/api/auth/logout` | Clears session |
| GET | `/api/auth/me` | Current user + profile |

## Production SMS

When env keys are set, `getOtpDelivery()` switches automatically — no code change.

### Without SMS keys (current default)

OTP is **not** sent by SMS. The UI shows **Dev OTP** on screen after “Send OTP”. Use that code to log in.

### MSG91 (India — recommended for real SMS)

1. Create an MSG91 account, get **Auth Key**.
2. Create a DLT-approved OTP template, e.g.
   `Your LoomOS sign-in code is ##VAR1##. Valid 10 minutes.`
3. Put in `.env` **and** Vercel env:

```env
MSG91_AUTHKEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_or_flow_id
MSG91_SENDER=LOOMOS
MSG91_OTP_VAR=VAR1
```

4. Redeploy. Request OTP on a **real phone you own** — you should get SMS; UI must **not** show `devCode`.

Verification still happens in LoomOS (hashed OTP in Postgres). MSG91 only delivers the text.

### Twilio (alternative)

```env
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_FROM_NUMBER=+1...
```

Rotate `OTP_PEPPER` and `SESSION_SECRET` before any real users.
