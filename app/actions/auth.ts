"use server";

import { cookies } from "next/headers";
import { demoUsers } from "@/lib/auth/demo-users";
import type { AuthUser } from "@/lib/auth/types";

const SESSION_COOKIE_NAME = "pulse_session";

export async function signInAction(login: string, pass: string): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();
  const matchedUser = demoUsers.find(
    (user) =>
      (user.name.toLowerCase() === login.trim().toLowerCase() ||
        user.id === login.trim()) &&
      user.pin === pass.trim()
  );

  if (!matchedUser) {
    return { success: false, error: "Login ou senha inválidos." };
  }

  // Set HTTP-only cookie
  cookieStore.set(SESSION_COOKIE_NAME, matchedUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return { success: true };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!userId) return null;
  return demoUsers.find((user) => user.id === userId) ?? null;
}
