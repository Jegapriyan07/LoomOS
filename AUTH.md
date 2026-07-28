# LoomOS Auth — Real DB + Phone OTP

## What changed

- **SQLite** via Prisma stores cooperatives, users, weaver/buyer profiles, OTP challenges, sessions.
- **Phone OTP** for weavers and buyers (httpOnly `loomos_session` cookie).
- **Dev OTP** — SMS is not wired; the API returns `devCode` and logs it. Label in UI: “Dev OTP — SMS provider not wired.”
- Domain data (requirements, payments, wallets) still in `data/loomos-store.json`, keyed by the same stable ids.

## Setup

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

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

### MSG91 (India — recommended)

1. Create an MSG91 account, get **Auth Key**.
2. Create a DLT-approved OTP template, e.g.  
   `Your LoomOS sign-in code is ##VAR1##. Valid 10 minutes.`
3. Put in `.env`:

```env
MSG91_AUTHKEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_or_flow_id
MSG91_SENDER=LOOMOS
MSG91_OTP_VAR=VAR1
```

4. Restart `npm run dev`.
5. Request OTP on a **real phone you own** — you should get SMS; UI must **not** show `devCode`.

Verification still happens in LoomOS (hashed OTP in SQLite). MSG91 only delivers the text.

### Twilio (alternative)

```env
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_FROM_NUMBER=+1...
```

### Still Dev OTP?

If those vars are missing/empty, `DevOtpProvider` runs: code on screen + server log.

Rotate `OTP_PEPPER` and `SESSION_SECRET` before any real users.

## Postgres later

Change `provider` in `prisma/schema.prisma` to `postgresql`, set `DATABASE_URL`, run `prisma db push` (or migrate).
