import { backend } from "@/lib/backend";
import { failure, json, sessionToken } from "@/lib/session";

// No owner query param, no arbitrary MCP forwarding, and no write endpoints.
export async function GET(request: Request) {
  if (new URL(request.url).search) return json({ error: "Dashboard tidak menerima pemilihan pemilik data." }, 400);
  try {
    const value = await backend("/identity/dashboard", await sessionToken());
    return json({ ...(value as Record<string, unknown>), data_environment: process.env.AGRISENSE_DATA_ENV || "configured_backend" });
  }
  catch (error) { return failure(error); }
}
