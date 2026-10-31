"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandGlyph } from "@/components/landing/Logo";
import { Icon, type IconName } from "@/components/landing/Icon";
import type { Crop, ReadSection } from "@/lib/farmer-dashboard-types";
import { useFarmerDashboard } from "./use-farmer-dashboard";
import s from "./dashboard.module.css";

type View = "overview" | "farms" | "activities" | "harvests" | "finance";
const navigation: { id: View; label: string; icon: IconName }[] = [
  { id: "overview", label: "Ringkasan", icon: "inspection" },
  { id: "farms", label: "Kebun & tanaman", icon: "greenhouse" },
  { id: "activities", label: "Aktivitas", icon: "calendar" },
  { id: "harvests", label: "Panen", icon: "leaf" },
  { id: "finance", label: "Keuangan", icon: "task" },
];
const activities: Record<string, string> = {
  watering: "Penyiraman",
  fertilizing: "Pemupukan",
  spraying: "Penyemprotan",
  pruning: "Pemangkasan",
  inspection: "Inspeksi",
};
const cropNames: Record<string, string> = {
  melon: "Melon",
  rice: "Padi",
  corn: "Jagung",
  tomato: "Tomat",
  chili: "Cabai",
  other: "Tanaman",
};
const statusNames: Record<string, string> = {
  growing: "Sedang tumbuh",
  harvested: "Sudah dipanen",
  failed: "Tidak tumbuh",
  completed: "Selesai",
};
const numbers = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 4 });
const dates = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});
const times = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
});
const money = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
function date(value: string | null) {
  const parsed = value ? new Date(value) : null;
  return parsed && Number.isFinite(parsed.getTime())
    ? dates.format(parsed)
    : "Belum tercatat";
}
function quantity(value: string | number | null) {
  return value !== null && Number.isFinite(Number(value))
    ? numbers.format(Number(value))
    : "—";
}
function currency(value: string | null) {
  return value && /^\d+$/.test(value) ? money.format(BigInt(value)) : "—";
}

function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={s.empty}>
      <span className={s.emptyMark}>
        <Icon name="leaf" size={25} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={s.panel}>
      <div className={s.panelHeading}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function Readable<T>({
  section,
  children,
  emptyTitle,
}: {
  section: ReadSection<T> | undefined;
  children: ReactNode;
  emptyTitle: string;
}) {
  if (!section)
    return <div className={s.placeholder} aria-label="Data sedang dimuat" />;
  if (section.status !== "available")
    return (
      <Empty
        title={
          section.status === "error"
            ? "Data sementara belum dapat dimuat."
            : emptyTitle
        }
      >
        Pencatatan melalui WhatsApp tetap mengikuti layanan yang Anda gunakan.
        Dashboard akan memeriksa kembali data yang tersedia.
      </Empty>
    );
  return children;
}
function CropCard({ crop, farmName }: { crop: Crop; farmName: string }) {
  return (
    <article className={s.cropCard}>
      <div className={s.cropCardTop}>
        <span className={s.badge}>
          {statusNames[crop.status] || crop.status}
        </span>
        <span className={s.age}>
          {crop.age_days}
          <small>hari setelah tanam</small>
        </span>
      </div>
      <h3>{cropNames[crop.crop_type] || crop.crop_type}</h3>
      <p>{crop.seed_variety || "Varietas belum tercatat"}</p>
      <div className={s.cropDetails}>
        <span>{farmName}</span>
        <span>Ditanam {date(crop.planted_at)}</span>
        {crop.area_hectares !== null && (
          <span>Luas tanam {quantity(crop.area_hectares)} ha</span>
        )}
        {crop.expected_harvest_at && (
          <span>Rencana panen {date(crop.expected_harvest_at)}</span>
        )}
        {crop.cultivation_system && (
          <span>
            {crop.cultivation_system}
            {crop.cultivation_unit_count
              ? " · " + crop.cultivation_unit_count + " unit"
              : ""}
          </span>
        )}
      </div>
    </article>
  );
}

export default function FarmerDashboard({
  className = "",
  whatsappUrl,
}: {
  className?: string;
  whatsappUrl: string | null;
}) {
  const router = useRouter();
  const { data, sync, error, announcement, refresh, stop, resume } =
    useFarmerDashboard();
  const [view, setView] = useState<View>("overview");
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const farms = data?.farms.data || [];
  const crops = data?.crops.data || [];
  const harvests = data?.harvests.data || [];
  const recent = data?.activities.data || [];
  const credit = data?.credit_score.data;
  const farmName = (id: string) =>
    farms.find((farm) => farm.id === id)?.name || "Kebun terkait";
  const filteredCrops = crops.filter((crop) =>
    [crop.crop_type, crop.seed_variety, farmName(crop.farm_id)]
      .join(" ")
      .toLocaleLowerCase("id-ID")
      .includes(search.toLocaleLowerCase("id-ID")),
  );
  const filteredFarms = farms.filter((farm) =>
    farm.name
      .toLocaleLowerCase("id-ID")
      .includes(search.toLocaleLowerCase("id-ID")),
  );
  const filteredActivities = recent.filter(
    (activity) => !activityFilter || activity.activity_type === activityFilter,
  );
  const harvestKg = harvests.reduce(
    (total, row) => total + Number(row.yield_kg),
    0,
  );
  const current = navigation.find((item) => item.id === view)!;
  const updated = data ? new Date(data.generated_at) : null;
  const updatedLabel =
    updated && Number.isFinite(updated.getTime())
      ? times.format(updated)
      : null;
  const person = data?.profile.name || "Kebun Anda";
  const syncing = sync === "loading" || sync === "syncing";
  const snapshots = [
    {
      label: "Kebun ditampilkan",
      value: data?.farms.status === "available" ? quantity(farms.length) : "—",
      note: "Maksimal 25 kebun",
      color: s.mint,
    },
    {
      label: "Tanaman ditampilkan",
      value: data?.crops.status === "available" ? quantity(crops.length) : "—",
      note: "Tanggal tanam dari catatan Anda",
      color: s.blue,
    },
    {
      label: "Panen ditampilkan",
      value:
        data?.harvests.status === "available"
          ? quantity(harvestKg) + " kg"
          : "—",
      note: "Jumlah dari riwayat yang ditampilkan",
      color: s.yellow,
    },
  ];
  async function logout() {
    stop();
    setLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/session/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      router.replace("/login");
    } catch {
      setLoggingOut(false);
      setLogoutError("Belum dapat keluar. Silakan coba kembali.");
      resume();
    }
  }
  const waAction = whatsappUrl ? (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={s.primary}
    >
      Buka WhatsApp <Icon name="arrow" size={18} />
    </a>
  ) : null;
  const cropContent = (
    <Readable
      section={data?.crops}
      emptyTitle="Data tanaman belum dapat dihubungkan."
    >
      {crops.length ? (
        <div className={s.cropGrid}>
          {(view === "overview" ? crops.slice(0, 2) : filteredCrops).map(
            (crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                farmName={farmName(crop.farm_id)}
              />
            ),
          )}
        </div>
      ) : (
        <Empty title="Tanaman pertama Anda dimulai di WhatsApp.">
          Setelah data tanaman tersimpan, varietas, tanggal tanam, dan umurnya
          akan tampil otomatis di sini.
        </Empty>
      )}
      {view === "farms" && crops.length > 0 && filteredCrops.length === 0 && (
        <p className={s.noResults}>
          Tidak ada tanaman yang cocok dengan pencarian.
        </p>
      )}
    </Readable>
  );
  const activityContent = (
    <Readable
      section={data?.activities}
      emptyTitle="Aktivitas belum dapat dihubungkan."
    >
      {recent.length ? (
        <ol className={s.timeline}>
          {(view === "overview" ? recent.slice(0, 4) : filteredActivities).map(
            (activity) => (
              <li key={activity.id}>
                <span className={s.timelineDot} />
                <div>
                  <span className={s.timelineDate}>
                    {date(activity.performed_at)}
                  </span>
                  <h3>
                    {activities[activity.activity_type] ||
                      activity.activity_type}
                  </h3>
                  <p>{activity.description}</p>
                  {activity.quantity !== null && (
                    <span className={s.amount}>
                      {quantity(activity.quantity)} {activity.unit}
                    </span>
                  )}
                </div>
              </li>
            ),
          )}
        </ol>
      ) : (
        <Empty title="Belum ada aktivitas tercatat.">
          Kegiatan yang sudah Anda konfirmasi di WhatsApp akan muncul pada
          pembaruan berikutnya.
        </Empty>
      )}
      {recent.length > 0 &&
        filteredActivities.length === 0 &&
        view === "activities" && (
          <p className={s.noResults}>Belum ada aktivitas untuk kategori ini.</p>
        )}
    </Readable>
  );

  return (
    <div className={s.dashboard + " " + className}>
      <aside className={s.sidebar}>
        <Link href="/" className={s.brand}>
          <BrandGlyph className={s.logo} />
          <span>
            AgriSense<small>KEBUN ANDA</small>
          </span>
        </Link>
        <p className={s.navLabel}>RUANG PETANI</p>
        <nav aria-label="Navigasi dashboard petani">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? s.navActive : ""}
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className={s.sidebarBottom}>
          <div className={s.waNote}>
            <strong>Catat lewat WhatsApp.</strong>
            <p>Ringkasannya mengikuti Anda di sini.</p>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Lanjutkan percakapan <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <Link href="/" className={s.backLink}>
            Kembali ke website ↗
          </Link>
        </div>
      </aside>
      <div className={s.workspace}>
        <header className={s.topbar}>
          <span className={s.breadcrumb}>
            Ruang petani <span>/</span> {current.label}
          </span>
          <div className={s.account}>
            <span className={s.avatar} aria-hidden="true">
              {person.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{person}</strong>
              <small>
                {data?.profile.phone || "Terhubung dengan akun WhatsApp"}
              </small>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={loggingOut}
              className={s.logout}
            >
              {loggingOut ? "Keluar…" : "Keluar"}
            </button>
          </div>
        </header>
        <main id="main" className={s.main}>
          <div className={s.pageHeading}>
            <div>
              <p className={s.eyebrow}>DARI PERCAKAPAN KE KEBUN</p>
              <h1>
                {view === "overview"
                  ? "Kebun Anda, dalam satu tampilan."
                  : current.label}
              </h1>
              <p>
                {view === "overview"
                  ? "Catat di WhatsApp. Pantau perkembangannya di sini."
                  : "Catatan milik Anda, diperbarui otomatis dari layanan AgriSense."}
              </p>
            </div>
            <button
              className={s.refresh}
              type="button"
              disabled={syncing || loggingOut}
              onClick={refresh}
            >
              <span aria-hidden="true">↻</span>
              {syncing ? "Memeriksa…" : "Periksa sekarang"}
            </button>
          </div>
          <div className={s.syncBar}>
            <span
              className={
                s.syncState +
                " " +
                (["offline", "partial"].includes(sync) ? s.disconnected : "")
              }
            >
              <i />
              {sync === "offline"
                ? "Sinkronisasi tertunda"
                : sync === "partial"
                  ? "Sebagian data belum dapat dimuat"
                  : syncing
                    ? "Memeriksa catatan Anda"
                    : "Pembaruan otomatis aktif"}
            </span>
            <span>
              {updatedLabel
                ? "Terakhir diperiksa " + updatedLabel + " WIB"
                : "Menghubungkan data kebun"}{" "}
              · setiap 5 detik saat halaman aktif
            </span>
          </div>
          <div className={s.srOnly} role="status" aria-live="polite">
            {announcement}
          </div>
          {(error || logoutError) && (
            <div className={s.error} role="alert">
              <strong>
                {data
                  ? "Data terakhir tetap ditampilkan."
                  : "Data belum dapat dimuat."}
              </strong>
              <p>{logoutError || error}</p>
              <button type="button" onClick={refresh} disabled={syncing}>
                Coba lagi
              </button>
            </div>
          )}
          {data && data.data_environment !== "configured_backend" && (
            <p className={s.environment}>
              Mode uji lokal. Data ini tidak mewakili data produksi petani.
            </p>
          )}
          {!data && !error && (
            <div className={s.loading} role="status">
              <span className={s.loader} />
              <p>Mengambil catatan kebun Anda…</p>
            </div>
          )}
          {view === "overview" && (
            <>
              <div className={s.stats}>
                {snapshots.map((card) => (
                  <article
                    key={card.label}
                    className={s.stat + " " + card.color}
                  >
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <small>{card.note}</small>
                  </article>
                ))}
              </div>
              <section className={s.welcome}>
                <div>
                  <span className={s.eyebrow}>KEGIATAN HARIAN, TERCATAT</span>
                  <h2>
                    Satu percakapan.
                    <br />
                    Catatan yang terus tumbuh.
                  </h2>
                  <p>
                    Data yang sudah tersimpan melalui WhatsApp akan diperiksa
                    otomatis. Anda cukup melanjutkan kegiatan di kebun.
                  </p>
                  {waAction}
                </div>
                <div className={s.welcomeArt} aria-hidden="true">
                  <div className={s.artLeaf} />
                  <div className={s.artLeafTwo} />
                  <div className={s.artStem} />
                  <span className={s.artDot} />
                </div>
              </section>
              <div className={s.twoColumns}>
                <Panel
                  title="Tanaman Anda"
                  description="Umur tanaman mengikuti tanggal tanam yang tercatat."
                  action={
                    <button
                      className={s.textButton}
                      onClick={() => setView("farms")}
                    >
                      Lihat semua ↗
                    </button>
                  }
                >
                  {cropContent}
                </Panel>
                <Panel
                  title="Aktivitas terbaru"
                  description="Maksimal 20 catatan dari tanaman aktif terakhir."
                  action={
                    <button
                      className={s.textButton}
                      onClick={() => setView("activities")}
                    >
                      Lihat aktivitas ↗
                    </button>
                  }
                >
                  {activityContent}
                </Panel>
              </div>
            </>
          )}
          {view === "farms" && (
            <>
              <div className={s.filters}>
                <label>
                  <span>Cari kebun atau tanaman</span>
                  <input
                    type="search"
                    placeholder="Nama kebun atau varietas…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <p>
                  Menampilkan maksimal 25 kebun dan 25 tanaman. Daftar ini bukan
                  total seluruh riwayat.
                </p>
              </div>
              <Panel title="Kebun yang tercatat">
                <Readable
                  section={data?.farms}
                  emptyTitle="Data kebun belum dapat dihubungkan."
                >
                  {farms.length ? (
                    <div className={s.farmGrid}>
                      {filteredFarms.map((farm) => (
                        <article key={farm.id} className={s.farmCard}>
                          <div className={s.farmMark}>
                            <Icon name="greenhouse" size={24} />
                          </div>
                          <h3>{farm.name}</h3>
                          <p>
                            {quantity(farm.area_hectares)} ha ·{" "}
                            {farm.active_crop_count} tanaman aktif
                          </p>
                          <small>
                            {[farm.soil_type, farm.irrigation_type]
                              .filter(Boolean)
                              .join(" · ") || "Rincian kebun belum tercatat"}
                          </small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty title="Belum ada kebun tercatat.">
                      Daftarkan kebun melalui percakapan WhatsApp AgriSense.
                      Setelah tersimpan, data muncul otomatis.
                    </Empty>
                  )}
                  {farms.length > 0 && filteredFarms.length === 0 && (
                    <p className={s.noResults}>
                      Tidak ada kebun yang cocok dengan pencarian.
                    </p>
                  )}
                </Readable>
              </Panel>
              <Panel title="Tanaman & musim tanam">{cropContent}</Panel>
            </>
          )}
          {view === "activities" && (
            <>
              <div className={s.filters}>
                <label>
                  <span>Jenis kegiatan</span>
                  <select
                    aria-label="Filter jenis kegiatan"
                    value={activityFilter}
                    onChange={(event) => setActivityFilter(event.target.value)}
                  >
                    <option value="">Semua kegiatan</option>
                    {Object.entries(activities).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <p>
                  Riwayat yang tersedia adalah 20 kegiatan terbaru dari tanaman
                  aktif terakhir.
                </p>
              </div>
              <Panel
                title="Kegiatan yang sudah dikonfirmasi"
                description="Draft yang belum disimpan tidak ditampilkan sebagai kegiatan selesai."
              >
                {activityContent}
              </Panel>
            </>
          )}
          {view === "harvests" && (
            <Panel
              title="Riwayat panen"
              description="Maksimal 25 catatan terbaru. Ini hasil tercatat, bukan prediksi panen."
            >
              <Readable
                section={data?.harvests}
                emptyTitle="Riwayat panen belum dapat dihubungkan."
              >
                {harvests.length ? (
                  <div
                    className={s.tableScroll}
                    tabIndex={0}
                    aria-label="Tabel panen dapat digulir"
                  >
                    <table>
                      <caption>Riwayat panen milik akun Anda</caption>
                      <thead>
                        <tr>
                          <th>Kebun</th>
                          <th>Tanggal</th>
                          <th>Berat</th>
                          <th>Kualitas</th>
                          <th>Harga per kg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {harvests.map((row) => (
                          <tr key={row.id}>
                            <td>{farmName(row.farm_id)}</td>
                            <td>{date(row.harvested_at)}</td>
                            <td>
                              <strong>{quantity(row.yield_kg)} kg</strong>
                            </td>
                            <td>{row.quality_grade || "—"}</td>
                            <td>{currency(row.price_per_kg)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty title="Belum ada panen tercatat.">
                    Setelah catatan panen tersimpan melalui WhatsApp, riwayatnya
                    akan muncul di sini.
                  </Empty>
                )}
              </Readable>
            </Panel>
          )}
          {view === "finance" && (
            <div className={s.twoColumns}>
              <Panel
                title="Catatan keuangan"
                description="Pemasukan dan pengeluaran tetap dicatat melalui WhatsApp."
              >
                <Empty title="Riwayat transaksi belum tersedia di dashboard.">
                  Pemasukan dan pengeluaran belum dapat ditampilkan di web.
                  Lanjutkan pencatatan melalui WhatsApp AgriSense.
                </Empty>
                {waAction}
              </Panel>
              <Panel
                title="Skor yang tercatat"
                description="Informasi pendamping; bukan persetujuan kredit atau bank."
              >
                <Readable
                  section={data?.credit_score}
                  emptyTitle="Informasi skor belum dapat dihubungkan."
                >
                  {credit &&
                  credit.status !== "not_available" &&
                  credit.score !== null ? (
                    <div className={s.credit}>
                      <span className={s.badge}>
                        {credit.status === "expired"
                          ? "Masa berlaku berakhir"
                          : "Skor tercatat"}
                      </span>
                      <strong>
                        {quantity(credit.score)}
                        <small>/ 1.000</small>
                      </strong>
                      <p>Diperbarui {date(credit.calculated_at)}</p>
                      <p>Berlaku sampai {date(credit.valid_until)}</p>
                    </div>
                  ) : (
                    <Empty title="Belum ada skor yang tersedia.">
                      Skor hanya ditampilkan jika sudah tercatat pada layanan
                      AgriSense.
                    </Empty>
                  )}
                </Readable>
              </Panel>
            </div>
          )}
          <footer className={s.footer}>
            <span>AgriSense · Ruang petani</span>
            <span>Data milik akun Anda · Pencatatan melalui WhatsApp</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
