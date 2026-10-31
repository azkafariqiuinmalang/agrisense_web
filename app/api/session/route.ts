import { backend, BackendError } from "@/lib/backend";
import { cookieName, cookieOptions, failure, json, sameOrigin, sessionToken } from "@/lib/session";

type Profile = { user_id: string; name: string; phone: string; role: string; status: string };
function account(value: unknown): Profile {
  const profile = value as Profile;
  if (!profile || !["farmer", "admin", "super_admin"].includes(profile.role) || !["active", "pending_verification"].includes(profile.status)
    || (profile.role !== "farmer" && profile.status !== "active")) throw new BackendError(403);
  return profile;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Permintaan harus berasal dari web AgriSense." }, 403);
  try {
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Format login tidak valid." }, 400);
    const reader=request.body?.getReader();
    if(!reader)return json({error:"Data login tidak tersedia."},400);
    const decoder=new TextDecoder(); let raw="";let bytes=0;
    while(true){
      const {done,value}=await reader.read();if(done)break;
      bytes+=value.length;
      if(bytes>2048){await reader.cancel();return json({error:"Data login terlalu panjang."},413);}
      raw+=decoder.decode(value,{stream:true});
    }
    raw+=decoder.decode();
    const body = JSON.parse(raw);
    if (!body || Object.keys(body).some(k => !["phone", "code"].includes(k)) || typeof body.phone !== "string" || typeof body.code !== "string") {
      return json({ error: "Masukkan nomor WhatsApp dan kode login." }, 400);
    }
    let phone = body.phone.trim().replace(/[\s()-]/g, "");
    if (phone.startsWith("08")) phone = "+62" + phone.slice(1);
    else if (phone.startsWith("62")) phone = "+" + phone;
    const code = body.code.trim();
    if (!/^\+[1-9]\d{7,14}$/.test(phone) || !/^[a-f0-9]{64}$/i.test(code)) {
      return json({ error: "Nomor atau kode tidak sesuai. Tempel kode 64 karakter dari balasan LOGIN di WhatsApp." }, 400);
    }
    const login = await backend("/identity/login", undefined, { phone, code }) as { access_token: string; expires_in: number; token_type: string };
    if (!login || typeof login.access_token !== "string" || login.access_token.length > 4096 || login.token_type !== "Bearer" || login.expires_in !== 900) throw new BackendError(502);
    const profile = account(await backend("/identity/profile", login.access_token));
    const response = json({ profile, redirect_to: profile.role === "farmer" ? "/dashboard" : "/cms" });
    response.cookies.set(cookieName, login.access_token, { ...cookieOptions, maxAge: login.expires_in });
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Format login tidak valid." }, 400);
    return failure(error);
  }
}
export async function GET() {
  try { return json({ profile: account(await backend("/identity/profile", await sessionToken())) }); }
  catch (error) { return failure(error); }
}
