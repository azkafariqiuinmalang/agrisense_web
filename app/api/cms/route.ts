import { backend, BackendError } from "@/lib/backend";
import { failure, json, sessionToken } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const token = await sessionToken();
    const params = new URL(request.url).searchParams;
    const allowed = ["search", "status", "role", "page", "page_size", "user_id"];
    if ([...params.keys()].some(key => !allowed.includes(key) || params.getAll(key).length !== 1)) return json({ error: "Filter CMS tidak valid." }, 400);
    if ((params.get("search") || "").length > 100) return json({ error: "Pencarian maksimal 100 karakter." }, 400);
    for (const [key, limit] of [["page", 10000], ["page_size", 50]] as const) {
      const raw = params.get(key);
      if (raw !== null && (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > limit)) return json({ error: "Halaman CMS tidak valid." }, 400);
    }
    if (params.has("user_id") && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(params.get("user_id") || "")) return json({ error: "ID pengguna tidak valid." }, 400);
    // UI checks are not authorization. Both profile and CMS SQL recheck DB role/status.
    const profile = await backend("/identity/profile", token) as { role: string; status: string };
    if (!["admin", "super_admin"].includes(profile.role) || profile.status !== "active") throw new BackendError(403);
    const value = await backend("/admin/dashboard", token, undefined, params);
    return json({ ...(value as Record<string, unknown>), data_environment: process.env.AGRISENSE_DATA_ENV || "configured_backend" });
  } catch (error) {
    if (error instanceof BackendError && error.status === 400) return json({ error: "Filter CMS tidak valid." }, 400);
    if (error instanceof BackendError && error.status === 404) return json({ error: "Pengguna tidak ditemukan, atau endpoint CMS belum tersedia pada backend yang dikonfigurasi." }, 404);
    return failure(error, false);
  }
}
