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

- **Weaver app:** `/` — tap a demo weaver or enter phone → Continue (no OTP)
- **Buyer portal:** `/buyer` — phone → Continue (no OTP)
- **Auth details:** [AUTH.md](./AUTH.md) — required for Vercel deploy
- **Real vs simulated:** `/about`

## Deploy (Vercel)

SQLite does **not** work on Vercel. Set these env vars, then redeploy:

- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `SESSION_SECRET` — any long random string

Then run against that same DB once:

```bash
npx prisma db push
npm run db:seed
```

See [AUTH.md](./AUTH.md).

## Stack

- Next.js 16 + React + Tailwind
- Prisma + PostgreSQL for identity / sessions
- JSON store (`data/loomos-store.json`) for demand, payments, wallet (still simulated money)
