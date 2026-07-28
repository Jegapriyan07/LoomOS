# LoomOS

Voice-first decision copilot for Indian handloom weavers (Next.js).

## Setup

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Weaver app:** `/` — phone OTP (seed `9000000001` Meena)
- **Buyer portal:** `/buyer` — phone OTP (seed `9100000001`)
- **Auth details:** [AUTH.md](./AUTH.md)
- **Real vs simulated:** `/about`

## Stack

- Next.js 16 + React + Tailwind
- Prisma + SQLite for identity / OTP / sessions
- JSON store (`data/loomos-store.json`) for demand, payments, wallet (still simulated money)
