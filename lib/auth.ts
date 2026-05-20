import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { JWT_SECRET, AUTH_COOKIE_NAME } from "./constants";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { id: number; email: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): { id: number; email: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as JwtPayload & { id: number; email: string; username: string };
  } catch {
    return null;
  }
}

export async function getAuthFromCookies(): Promise<{ id: number; email: string; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<{ id: number; email: string; username: string }> {
  const user = await getAuthFromCookies();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
