import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { createDashboardFixture } from "./dashboard-fixture.mjs";

const { server, state } = createDashboardFixture();
let app;
let base;
async function port() {
  const socket = net.createServer();
  await new Promise((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const value = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  return value;
}
const read = (token = "farmer-a", query = "") =>
  fetch(base + "/api/dashboard" + query, {
    headers: token ? { Cookie: "__Host-agrisense_session=" + token } : {},
  });
before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const upstream = "http://127.0.0.1:" + server.address().port;
  const webPort = await port();
  base = "http://127.0.0.1:" + webPort;
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(webPort),
    ],
    {
      cwd: process.cwd(),
      stdio: "ignore",
      windowsHide: true,
      env: {
        ...process.env,
        NODE_ENV: "production",
        AGRISENSE_PLATFORM_URL: upstream,
        AGRISENSE_BRAIN_URL: upstream,
        AGRISENSE_FARM_URL: upstream,
        AGRISENSE_FARM_READ_TOKEN: "fixture-read-token",
        AGRISENSE_WEB_ORIGIN: base,
        AGRISENSE_DATA_ENV: "validation",
      },
    },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/login")).status === 200) return;
    } catch {}
    if (app.exitCode !== null)
      throw new Error("Build required: run npm run build before this test.");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Local test server did not start.");
});
after(async () => {
  app?.kill();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test("missing sessions fail before any upstream read", async () => {
  state.calls.length = 0;
  assert.equal((await read(null)).status, 401);
  assert.equal(state.calls.length, 0);
});
test("caller cannot select a different owner", async () => {
  state.calls.length = 0;
  assert.equal((await read("farmer-a", "?owner_id=other")).status, 400);
  assert.equal(state.calls.length, 0);
});
test("dashboard reads only fixed existing operations and returns explicit limits", async () => {
  state.calls.length = 0;
  const response = await read();
  const value = await response.json();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(value.farms.data[0].name, "Kebun Uji A");
  assert.equal(value.harvests.data[0].price_per_kg, "18000");
  assert.equal(value.finance.status, "unavailable");
  assert.equal(value.list_limits.farms, 25);
  assert.equal(value.activity_scope, "latest_growing_crop");
  const calls = state.calls.filter((call) => call.path === "/mcp/call");
  assert.deepEqual(calls.map((call) => call.body.tool_name).sort(), [
    "check_credit_score",
    "get_crop_status",
    "get_farm_status",
    "get_harvest_history",
  ]);
  for (const call of calls) {
    assert.equal(call.body.farmer_id, undefined);
    assert.equal(call.body.correlation_id, undefined);
  }
  assert.equal(
    state.calls.find((call) => call.path === "/internal/activities/recent").body
      .owner_phone,
    "+6281111111111",
  );
  assert.equal(
    state.calls.some((call) =>
      /confirm|operations|identity\/dashboard/.test(call.path),
    ),
    false,
  );
  assert.equal(JSON.stringify(value).includes("fixture-read-token"), false);
});
test("sessions select their own backend profile", async () => {
  state.calls.length = 0;
  const value = await (await read("farmer-b")).json();
  assert.equal(value.profile.name, "Petani Uji B");
  assert.equal(value.farms.data[0].name, "Kebun Uji B");
  assert.equal(
    state.calls.find((call) => call.path === "/internal/activities/recent").body
      .owner_phone,
    "+6282222222222",
  );
});
test("a later read includes newly persisted upstream records", async () => {
  state.revision = 1;
  assert.equal((await (await read()).json()).crops.data.length, 2);
  state.revision = 0;
});
test("one unavailable tool does not fabricate zero-valued data", async () => {
  state.failTool = "get_farm_status";
  const value = await (await read()).json();
  assert.equal(value.farms.status, "error");
  assert.equal(value.farms.data, null);
  assert.equal(value.crops.status, "available");
  state.failTool = null;
});
test("malformed upstream data produces a controlled section error", async () => {
  state.malformedTool = "get_farm_status";
  assert.equal((await (await read()).json()).farms.status, "error");
  state.malformedTool = null;
});
test("revoked ownership invalidates the snapshot", async () => {
  state.denyTool = "get_crop_status";
  const response = await read();
  assert.equal(response.status, 403);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/i);
  state.denyTool = null;
});
test("admin and expired sessions cannot read farmer snapshots", async () => {
  assert.equal((await read("admin")).status, 403);
  assert.equal((await read("expired")).status, 401);
});
test("login rejects six digits, accepts the backend code format, and keeps tokens in cookies", async () => {
  const post = (code) =>
    fetch(base + "/api/session", {
      method: "POST",
      headers: { Origin: base, "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "081111111111", code }),
    });
  assert.equal((await post("123456")).status, 400);
  const response = await post("a".repeat(64));
  const value = await response.json();
  assert.equal(response.status, 200);
  assert.equal(value.access_token, undefined);
  const cookie = response.headers.get("set-cookie");
  for (const flag of ["HttpOnly", "Secure", "SameSite=strict"])
    assert.ok(cookie.toLowerCase().includes(flag.toLowerCase()));
});
