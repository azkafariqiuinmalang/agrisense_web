import { cookieName, cookieOptions, json, sameOrigin } from "@/lib/session";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Permintaan tidak diizinkan." }, 403);
  const response = json({ logged_out: true });
  response.cookies.set(cookieName, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
