import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "aurea_admin_session";
const PENDING_COOKIE_NAME = "aurea_admin_pending";
const SESSION_HOURS = 12;
const PENDING_MINUTES = 5;

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET es obligatorio en producción");
  }
  return new TextEncoder().encode("aurea-dev-secret");
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(PENDING_COOKIE_NAME);
}

export async function createPendingTotpSession() {
  const token = await new SignJWT({ pendingTotp: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PENDING_MINUTES}m`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(PENDING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_MINUTES * 60,
  });
}

export async function hasPendingTotpSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PENDING_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.pendingTotp === true;
  } catch {
    return false;
  }
}

export async function clearPendingTotpSession() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!password || !expected) return false;

  if (expected.startsWith("$2a$") || expected.startsWith("$2b$") || expected.startsWith("$2y$")) {
    return bcrypt.compare(password, expected);
  }

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function consumeLoginAttempt(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { ok: true as const };
  }
  if (current.count >= 8) {
    return { ok: false as const, retryAt: current.resetAt };
  }
  current.count += 1;
  return { ok: true as const };
}
