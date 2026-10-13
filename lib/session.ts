import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BackendError } from "./backend";

export const cookieName = process.env.NODE_ENV === "production" ? "__Host-agrisense_session" : "agrisense_session";
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };

export function json(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" } });
}
export function sameOrigin(request: Request) {
  const allowed = process.env.AGRISENSE_WEB_ORIGIN;
  if (allowed) return request.headers.get("origin") === new URL(allowed).origin;
  if (process.env.NODE_ENV === "production") return false;
  return ["http://127.0.0.1:3000", "http://localhost:3000"].includes(request.headers.get("origin") || "");
}
export async function sessionToken() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || token.length > 4096) throw new BackendError(401);
  return token;
}
export function failure(error: unknown, clearForbidden = true) {
  const upstream = error instanceof BackendError ? error.status : 503;
  const status = upstream === 401 || upstream === 403 || upstream === 429 ? upstream : 503;
  const message = status === 401 ? "Sesi atau kode login tidak valid. Ketik LOGIN di WhatsApp untuk kode baru."
    : status === 403 ? "Akun ini tidak memiliki akses ke halaman yang diminta. CMS hanya untuk admin aktif."
    : status === 429 ? "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."
    : "Backend belum dapat diakses. Coba lagi setelah layanan tersedia.";
  const response = json({ error: message }, status);
  if (status === 401 || (status === 403 && clearForbidden)) response.cookies.set(cookieName, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
