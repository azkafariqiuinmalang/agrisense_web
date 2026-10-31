import "server-only";
import { backend, BackendError } from "./backend";
import type {
  Activity,
  Crop,
  CreditScore,
  Farm,
  FarmerDashboardData,
  Harvest,
  ReadSection,
} from "./farmer-dashboard-types";

// The web adapter only permits these existing read operations. No mutations,
// provider calls, arbitrary tool names, owner IDs or database access.
type ReadTool =
  | "get_farm_status"
  | "get_crop_status"
  | "get_harvest_history"
  | "check_credit_score";
type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new BackendError(502);
  return value as RecordValue;
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new BackendError(502);
  return value;
}
function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}
function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new BackendError(502);
  return value;
}
function decimal(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && /^\d+(\.\d+)?$/.test(value)) return value;
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0)
    return String(value);
  throw new BackendError(502);
}
function rows<T>(
  value: unknown,
  key: string,
  map: (row: RecordValue) => T,
): T[] {
  const array = record(value)[key];
  if (!Array.isArray(array) || array.length > 25) throw new BackendError(502);
  return array.map((item) => map(record(item)));
}
function serviceOrigin(kind: "BRAIN" | "FARM"): string {
  const fallback =
    process.env.NODE_ENV === "production"
      ? ""
      : `http://127.0.0.1:${kind === "BRAIN" ? 3002 : 3003}`;
  try {
    const url = new URL(process.env[`AGRISENSE_${kind}_URL`] || fallback);
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error();
    return url.origin;
  } catch {
    throw new BackendError(503);
  }
}
async function readRequest(
  url: string,
  token: string,
  body: unknown,
): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new BackendError(response.status);
  const reader = response.body?.getReader();
  if (!reader) throw new BackendError(502);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 1024 * 1024) {
      await reader.cancel();
      throw new BackendError(502);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function mcp(tool: ReadTool, token: string): Promise<unknown> {
  const value = record(
    await readRequest(serviceOrigin("BRAIN") + "/mcp/call", token, {
      tool_name: tool,
      arguments: tool === "check_credit_score" ? {} : { limit: 25 },
      caller_agent: "agrisense-web-dashboard",
    }),
  );
  if (value.success !== true) {
    if (value.error === "ownership_denied") throw new BackendError(403);
    throw new BackendError(503);
  }
  return value.data;
}
async function section<T>(read: () => Promise<T>): Promise<ReadSection<T>> {
  try {
    return { status: "available", data: await read() };
  } catch (error) {
    if (error instanceof BackendError && [401, 403].includes(error.status))
      throw error;
    return { status: "error", data: null, reason: "temporarily_unavailable" };
  }
}
function farm(row: RecordValue): Farm {
  return {
    id: text(row.farm_id),
    name: text(row.name),
    area_hectares: decimal(row.area_hectares),
    soil_type: optionalText(row.soil_type),
    irrigation_type: optionalText(row.irrigation_type),
    active_crop_count: number(row.active_crop_count),
  };
}
function crop(row: RecordValue): Crop {
  return {
    id: text(row.crop_id),
    farm_id: text(row.farm_id),
    crop_type: text(row.crop_type),
    seed_variety: optionalText(row.seed_variety),
    status: text(row.status),
    planted_at: text(row.planted_at),
    age_days: number(row.age_days),
    cultivation_system: optionalText(row.cultivation_system),
    cultivation_unit_count:
      row.cultivation_unit_count == null
        ? null
        : number(row.cultivation_unit_count),
    area_hectares: decimal(row.area_hectares),
    expected_harvest_at: optionalText(row.expected_harvest_at),
  };
}
function harvest(row: RecordValue): Harvest {
  const yieldKg = decimal(row.yield_kg);
  if (yieldKg === null) throw new BackendError(502);
  return {
    id: text(row.harvest_id),
    farm_id: text(row.farm_id),
    crop_id: text(row.crop_id),
    yield_kg: yieldKg,
    quality_grade: optionalText(row.quality_grade),
    price_per_kg: decimal(row.price_per_kg),
    harvested_at: text(row.harvested_at),
  };
}
function credit(value: unknown): CreditScore {
  const row = record(value);
  if (!["available", "expired", "not_available"].includes(String(row.status)))
    throw new BackendError(502);
  return {
    status: row.status as CreditScore["status"],
    score: decimal(row.score),
    calculated_at: optionalText(row.calculated_at),
    valid_until: optionalText(row.valid_until),
  };
}
async function activities(phone: string): Promise<ReadSection<Activity[]>> {
  const secret = process.env.AGRISENSE_FARM_READ_TOKEN;
  if (!secret)
    return { status: "unavailable", data: null, reason: "not_configured" };
  // The internal token is only used for this fixed read endpoint. The owner
  // phone comes from an authenticated backend profile, never browser input.
  try {
    const value = await readRequest(
      serviceOrigin("FARM") + "/internal/activities/recent",
      secret,
      {
        owner_phone: phone,
        activity_type: null,
        limit: 20,
      },
    );
    if (!Array.isArray(value) || value.length > 20) throw new BackendError(502);
    return {
      status: "available",
      data: value.map((item) => {
        const row = record(item);
        return {
          id: text(row.activity_id),
          activity_type: text(row.activity_type),
          description: text(row.description),
          quantity: decimal(row.quantity),
          unit: optionalText(row.unit),
          performed_at: text(row.performed_at),
        };
      }),
    };
  } catch {
    // Internal credential failures are service failures, not user session failures.
    return { status: "error", data: null, reason: "temporarily_unavailable" };
  }
}
export async function readFarmerDashboard(
  token: string,
): Promise<FarmerDashboardData> {
  const profile = record(await backend("/identity/profile", token));
  if (
    profile.role !== "farmer" ||
    !["active", "pending_verification"].includes(String(profile.status))
  )
    throw new BackendError(403);
  const phone = text(profile.phone);
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new BackendError(502);
  const [farms, crops, harvests, creditScore, recent] = await Promise.all([
    section(async () =>
      rows(await mcp("get_farm_status", token), "farms", farm),
    ),
    section(async () =>
      rows(await mcp("get_crop_status", token), "crops", crop),
    ),
    section(async () =>
      rows(await mcp("get_harvest_history", token), "harvests", harvest),
    ),
    section(async () => credit(await mcp("check_credit_score", token))),
    activities(phone),
  ]);
  return {
    profile: {
      user_id: text(profile.user_id),
      name: text(profile.name),
      phone,
      status: text(profile.status),
    },
    generated_at: new Date().toISOString(),
    data_environment: process.env.AGRISENSE_DATA_ENV || "configured_backend",
    farms,
    crops,
    harvests,
    activities: recent,
    credit_score: creditScore,
    finance: { status: "unavailable", data: null, reason: "not_exposed" },
    list_limits: { farms: 25, crops: 25, harvests: 25, activities: 20 },
    activity_scope: "latest_growing_crop",
  };
}
