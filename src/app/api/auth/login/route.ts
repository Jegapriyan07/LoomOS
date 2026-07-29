import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/auth/db";
import { isValidIndianMobile, normalizePhone } from "@/lib/auth/phone";
import { resolveUserAfterOtp } from "@/lib/auth/resolve-user";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  readSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { ensureBuyerInJsonStore } from "@/lib/demand/store";
import {
  bootstrapWeaverSimulation,
  SIM_EPOCH_COOKIE,
} from "@/lib/demo/simulate-session";

function parseRole(raw: unknown): UserRole | null {
  const s = String(raw ?? "").toUpperCase();
  if (s === "WEAVER") return UserRole.WEAVER;
  if (s === "BUYER") return UserRole.BUYER;
  return null;
}

/**
 * Pitch-friendly login — no OTP.
 * Login (demo): fresh simulated orders/production each time.
 * Register (new phone): empty data + client tour.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const role = parseRole(body.role);
    const modeRaw = String(body.mode ?? "login").toLowerCase();
    const mode = modeRaw === "register" ? "register" : "login";

    if (!role) {
      return NextResponse.json(
        { error: "role must be WEAVER or BUYER" },
        { status: 400 },
      );
    }
    if (!isValidIndianMobile(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number" },
        { status: 400 },
      );
    }

    const categories = Array.isArray(body.categories)
      ? body.categories.map((c: unknown) => String(c))
      : undefined;

    const existedBefore = await prisma.user.findFirst({
      where: { phone, role },
      select: { id: true },
    });
    const creatingNew = mode === "register" && !existedBefore;

    const user = await resolveUserAfterOtp({
      phone,
      role,
      mode,
      name: body.name ? String(body.name) : undefined,
      region: body.region ? String(body.region) : undefined,
      primaryLanguage: body.primaryLanguage
        ? String(body.primaryLanguage)
        : undefined,
      categories,
      district: body.district ? String(body.district) : undefined,
      yearsWeaving: body.yearsWeaving ? String(body.yearsWeaving) : undefined,
      businessType: body.businessType ? String(body.businessType) : undefined,
      email: body.email ? String(body.email) : undefined,
    });

    if (user.buyer) {
      await ensureBuyerInJsonStore({
        id: user.buyer.id,
        name: user.buyer.businessName,
        region: user.buyer.region,
        email: user.buyer.email,
      });
    }

    let hasPipeline = false;
    let simEpoch = Date.now().toString(36);

    if (user.weaver) {
      const sim = await bootstrapWeaverSimulation({
        weaverId: user.weaver.id,
        mode: creatingNew ? "register" : "login",
      });
      hasPipeline = sim.hasPipeline;
      simEpoch = sim.simEpoch;
    }

    const old = await readSessionToken();
    await destroySession(old);
    await clearSessionCookie();

    const token = await createSession(user.id);
    await setSessionCookie(token);

    const jar = await cookies();
    jar.set(SIM_EPOCH_COOKIE, simEpoch, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      ok: true,
      isNew: creatingNew,
      tour: creatingNew,
      hasPipeline,
      simEpoch,
      user: {
        userId: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        weaverId: user.weaver?.id ?? null,
        buyerId: user.buyer?.id ?? null,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    console.error("[auth/login]", message);
    const isConfig =
      /DATABASE_URL|PostgreSQL|SQLite file|Demo cooperative is missing/i.test(
        message,
      ) || message.includes("Can't reach database");
    const isReadonlyFs = /EROFS|read-only file system/i.test(message);
    return NextResponse.json(
      {
        error: isConfig
          ? "Database not ready. Set DATABASE_URL on Vercel, run prisma db push + db:seed, then redeploy."
          : isReadonlyFs
            ? "App storage is misconfigured for serverless. Redeploy with the latest store fix."
            : message,
      },
      { status: isConfig || isReadonlyFs ? 500 : 400 },
    );
  }
}
