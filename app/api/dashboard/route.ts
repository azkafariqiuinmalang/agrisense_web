import { readFarmerDashboard } from "@/lib/farmer-dashboard-server";
import { failure, json, sessionToken } from "@/lib/session";

// No owner query param, no arbitrary MCP forwarding, and no write endpoints.
export async function GET(request: Request) {
  if (new URL(request.url).search)
    return json(
      { error: "Dashboard tidak menerima pemilihan pemilik data." },
      400,
    );
  try {
    return json(await readFarmerDashboard(await sessionToken()));
  } catch (error) {
    return failure(error);
  }
}
