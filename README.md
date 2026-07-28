# LoomOS

Voice-first decision copilot for Indian handloom weavers (Next.js).

## Setup

```bash
cp .env.example .env
# Set DATABASE_URL to a PostgreSQL URL (Neon / Prisma Postgres / Vercel Postgres)
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Weaver app:** `/` — phone OTP (seed `9000000001` Meena)
- **Buyer portal:** `/buyer` — phone OTP (seed `9100000001`)
- **Auth details:** [AUTH.md](./AUTH.md) — required for Vercel deploy
- **Real vs simulated:** `/about`

## Deploy (Vercel)

SQLite does **not** work on Vercel. Set these env vars, then redeploy:

- `DATABASE_URL` — PostgreSQL connection string
- `OTP_PEPPER`, `SESSION_SECRET`
- Optional SMS: `MSG91_*` or `TWILIO_*` (otherwise Dev OTP shows on screen)

See [AUTH.md](./AUTH.md).

## Stack

- Next.js 16 + React + Tailwind
- Prisma + PostgreSQL for identity / OTP / sessions
- JSON store (`data/loomos-store.json`) for demand, payments, wallet (still simulated money)
