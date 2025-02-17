import { cookies } from "next/headers";

export function getUserIdCookie(): string {
  const cookieStore = cookies();
  const userIdToken = cookieStore.get("userId")?.value || "";

  return userIdToken;
}
