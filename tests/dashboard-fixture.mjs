import http from "node:http";

// Test-only upstream. It never connects to AgriSense or a database.
export function createDashboardFixture() {
  const state = {
    revision: 0,
    failTool: null,
    denyTool: null,
    malformedTool: null,
    calls: [],
    delay: 0,
  };
  const ids = {
    farm: "11111111-1111-4111-8111-111111111111",
    crop: "22222222-2222-4222-8222-222222222222",
    harvest: "33333333-3333-4333-8333-333333333333",
    activity: "44444444-4444-4444-8444-444444444444",
  };
  const server = http.createServer(async (request, response) => {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const body = raw ? JSON.parse(raw) : null;
    const token = request.headers.authorization?.replace("Bearer ", "");
    const reply = (status, value) => {
      response.writeHead(status, { "Content-Type": "application/json" });
      response.end(JSON.stringify(value));
    };
    const owner = token === "farmer-b" ? "B" : "A";
    state.calls.push({
      path: request.url,
      method: request.method,
      body,
      owner,
    });
    if (request.url === "/identity/login")
      return reply(200, {
        access_token: "farmer-a",
        expires_in: 900,
        token_type: "Bearer",
      });
    if (request.url === "/identity/profile") {
      if (token === "expired") return reply(401, {});
      return reply(200, {
        user_id: owner === "A" ? ids.farm : ids.crop,
        name: "Petani Uji " + owner,
        phone: owner === "A" ? "+6281111111111" : "+6282222222222",
        role: token === "admin" ? "admin" : "farmer",
        status: "active",
      });
    }
    if (request.url === "/internal/activities/recent") {
      if (token !== "fixture-read-token") return reply(401, {});
      return reply(200, [
        {
          activity_id: ids.activity,
          activity_type: "watering",
          description: "Penyiraman tercatat",
          quantity: "10.000",
          unit: "liter",
          performed_at: "2026-10-14T01:00:00Z",
        },
      ]);
    }
    if (request.url !== "/mcp/call") return reply(404, {});
    if (state.delay)
      await new Promise((resolve) => setTimeout(resolve, state.delay));
    const tool = body.tool_name;
    if (state.denyTool === tool) return reply(403, {});
    if (state.failTool === tool)
      return reply(200, { success: false, error: "domain_unavailable" });
    if (state.malformedTool === tool)
      return reply(200, { success: true, data: { farms: "not-an-array" } });
    const data = {
      get_farm_status: {
        farms: [
          {
            farm_id: ids.farm,
            name: "Kebun Uji " + owner,
            area_hectares: "0.1250",
            soil_type: "Tanah",
            irrigation_type: "Tetes",
            active_crop_count: 1 + state.revision,
          },
        ],
      },
      get_crop_status: {
        crops: Array.from({ length: 1 + state.revision }, (_, index) => ({
          crop_id: index ? ids.harvest : ids.crop,
          farm_id: ids.farm,
          crop_type: "melon",
          seed_variety: "Golden",
          status: "growing",
          planted_at: "2026-09-16",
          age_days: 28,
          cultivation_system: "greenhouse",
          cultivation_unit_count: 2,
          area_hectares: "0.1250",
        })),
      },
      get_harvest_history: {
        harvests: [
          {
            harvest_id: ids.harvest,
            crop_id: ids.crop,
            farm_id: ids.farm,
            yield_kg: "125.50",
            quality_grade: "A",
            price_per_kg: "18000",
            harvested_at: "2026-10-13T02:00:00Z",
          },
        ],
      },
      check_credit_score: {
        status: "not_available",
        score: null,
        is_bank_approval: false,
      },
    }[tool];
    return data
      ? reply(200, { tool_name: tool, success: true, data })
      : reply(400, {});
  });
  return { server, state };
}
