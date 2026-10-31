import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { mkdir } from "node:fs/promises";
import { createDashboardFixture } from "./dashboard-fixture.mjs";

// Playwright is an optional local validation tool, not a runtime dependency.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const { server, state } = createDashboardFixture();
const results = [];
const errors = [];
const check = (name, passed) => {
  results.push({ name, passed });
  assert.ok(passed, name);
  console.log("PASS " + name);
};
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const reservation = net.createServer();
await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const base = "http://127.0.0.1:" + port;
const upstream = "http://127.0.0.1:" + server.address().port;
const app = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
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
let browser;
try {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/login")).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + "/login", { waitUntil: "networkidle" });
  check(
    "six-digit boxes removed",
    (await page.getByRole("textbox", { name: /Digit ke-/ }).count()) === 0,
  );
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("081111111111");
  await page
    .getByLabel("Kode login dari WhatsApp", { exact: true })
    .fill("123456");
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  check(
    "short code rejected before login",
    await page
      .getByRole("alert")
      .filter({ hasText: "64 karakter" })
      .textContent()
      .then((value) => value.includes("64 karakter")),
  );
  await page
    .getByLabel("Kode login dari WhatsApp", { exact: true })
    .fill("a".repeat(64));
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Petani Uji A", { exact: true }).waitFor();
  check("WhatsApp-code login opens owner's dashboard", true);
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  check(
    "real read adapter renders crop data",
    (await page
      .getByRole("heading", { name: "Melon", exact: true })
      .count()) === 1,
  );
  const cookie = (await page.context().cookies()).find(
    (value) => value.name === "__Host-agrisense_session",
  );
  check("browser session cookie is HttpOnly", cookie?.httpOnly === true);
  state.revision = 1;
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("h3")].filter(
        (element) => element.textContent === "Melon",
      ).length === 2,
    { timeout: 12000 },
  );
  check("new upstream record appears without manual refresh", true);
  await mkdir("docs/previews", { recursive: true });
  await page.screenshot({
    path: "docs/previews/farmer-dashboard-desktop.png",
    fullPage: true,
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      "dashboard reflows at " + width,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/previews/farmer-dashboard-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Kebun & tanaman", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Cari kebun atau tanaman" })
    .fill("unknown");
  check(
    "search empty result shown",
    await page
      .getByText("Tidak ada tanaman yang cocok dengan pencarian.", {
        exact: true,
      })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Aktivitas", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Filter jenis kegiatan" })
    .selectOption("pruning");
  check(
    "activity filter works",
    await page
      .getByText("Belum ada aktivitas untuk kategori ini.", { exact: true })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Panen", exact: true }).click();
  check(
    "harvest read precision displayed",
    await page.getByText("125,5 kg", { exact: true }).isVisible(),
  );
  await page.getByRole("button", { name: "Keuangan", exact: true }).click();
  check(
    "unavailable finance is disclosed",
    await page
      .getByRole("heading", {
        name: "Riwayat transaksi belum tersedia di dashboard.",
      })
      .isVisible(),
  );
  await page.context().setOffline(true);
  await page.getByText("Sinkronisasi tertunda", { exact: true }).waitFor();
  check(
    "offline keeps owner snapshot visible",
    await page.getByText("Petani Uji A", { exact: true }).isVisible(),
  );
  await page.context().setOffline(false);
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  check("online event resumes synchronization", true);
  await page.route("**/api/dashboard", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Layanan sementara tidak tersedia." }),
    }),
  );
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page
    .getByText("Data terakhir tetap ditampilkan.", { exact: true })
    .waitFor();
  check(
    "temporary server failure preserves snapshot",
    await page.getByText("Petani Uji A", { exact: true }).isVisible(),
  );
  await page.unroute("**/api/dashboard");
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  check(
    "manual recovery replaces error state",
    (await page
      .getByText("Data terakhir tetap ditampilkan.", { exact: true })
      .count()) === 0,
  );
  state.failTool = "get_farm_status";
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page
    .getByText("Sebagian data belum dapat dimuat", { exact: true })
    .waitFor();
  check("partial upstream failure is visible", true);
  state.failTool = null;
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  state.delay = 1500;
  const count = state.calls.filter(
    (value) => value.path === "/identity/profile",
  ).length;
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page.evaluate(() => {
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("online"));
  });
  await page.waitForTimeout(200);
  check(
    "concurrent events do not duplicate reads",
    state.calls.filter((value) => value.path === "/identity/profile").length ===
      count + 1,
  );
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  state.delay = 0;
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenCount = state.calls.length;
  await page.waitForTimeout(5600);
  check("background tabs stop polling", state.calls.length === hiddenCount);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  state.denyTool = "get_crop_status";
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page.waitForURL("**/login");
  check(
    "revocation removes private view",
    (await page.getByText("Petani Uji A", { exact: true }).count()) === 0,
  );
  state.denyTool = null;
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "docs/previews/farmer-login-desktop.png",
    fullPage: true,
  });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      "login reflows at " + width,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/previews/farmer-login-mobile.png",
    fullPage: true,
  });
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("081111111111");
  await page
    .getByLabel("Kode login dari WhatsApp", { exact: true })
    .fill("a".repeat(64));
  await page.getByRole("button", { name: "Masuk ke dashboard" }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Pembaruan otomatis aktif", { exact: true }).waitFor();
  state.delay = 1500;
  await page.getByRole("button", { name: "Periksa sekarang" }).click();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await page.waitForURL("**/login");
  await page.waitForTimeout(1600);
  check(
    "logout cancels polling and pending private view",
    page.url().endsWith("/login") &&
      (await page.getByText("Petani Uji A", { exact: true }).count()) === 0,
  );
  check(
    "logout clears session cookie",
    !(await page.context().cookies()).some(
      (cookie) => cookie.name === "__Host-agrisense_session" && cookie.value,
    ),
  );
  check("no browser runtime errors", errors.length === 0);
  console.log(
    JSON.stringify({
      checks: results.length,
      passed: results.filter((value) => value.passed).length,
    }),
  );
} finally {
  await browser?.close();
  app.kill();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
