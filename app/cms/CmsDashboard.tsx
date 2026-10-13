"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { BrandGlyph } from "@/components/landing/Logo";
import { Icon, type IconName } from "@/components/landing/Icon";
import type { CmsData } from "@/lib/cms-types";
import s from "./cms.module.css";

const statuses: Record<string, string> = { active: "Aktif", pending_verification: "Menunggu verifikasi", inactive: "Nonaktif", suspended: "Ditangguhkan" };
const roles: Record<string, string> = { farmer: "Petani", kios: "Kios", supplier: "Supplier", bank_partner: "Mitra bank", iot_vendor: "Vendor IoT", admin: "Admin", super_admin: "Super admin" };
const activities: Record<string, string> = { watering: "Penyiraman", fertilizing: "Pemupukan", spraying: "Penyemprotan", pruning: "Pemangkasan", inspection: "Inspeksi" };
const statusColors: Record<string, string> = { active: "#237a4a", pending_verification: "#d3a63c", inactive: "#889a90", suspended: "#b35b57" };
const money = (value: string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(BigInt(value));
const number = (value: number | string) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(Number(value));
const date = (value: string | null, time = false) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", ...(time ? { timeStyle: "short" as const } : {}), timeZone: "Asia/Jakarta" }).format(new Date(value)) : "Belum tercatat";
const month = (value: string) => new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "Asia/Jakarta" }).format(new Date(value + "-01T00:00:00+07:00"));
const nav: { id: string; name: string; icon: IconName }[] = [
  { id: "overview", name: "Ringkasan", icon: "inspection" }, { id: "users", name: "Pengguna", icon: "chat" },
  { id: "farms", name: "Kebun & tanaman", icon: "greenhouse" }, { id: "finance", name: "Keuangan", icon: "task" },
];

function FinanceChart({ rows }: { rows: CmsData["monthly"] }) {
  const maximum = rows.reduce((max, row) => [BigInt(row.expense_idr), BigInt(row.revenue_idr), max].reduce((a, b) => a > b ? a : b), BigInt(1));
  const points = (key: "expense_idr" | "revenue_idr") => rows.map((row, i) => `${35 + i * 100},${155 - Number(BigInt(row[key]) * BigInt(120000) / maximum) / 1000}`).join(" ");
  const empty = rows.every(row => row.expense_idr === "0" && row.revenue_idr === "0");
  return <>
    <div className={s.chartLegend}><span><i style={{ background: "#237a4a" }} />Pendapatan</span><span><i style={{ background: "#c5a049" }} />Pengeluaran</span><span className={s.chartScope}>6 bulan kalender</span></div>
    {empty ? <div className={s.emptyChart}><Icon name="calendar" size={28} /><p>Belum ada transaksi pada periode ini.</p></div> : <svg viewBox="0 0 570 190" className={s.lineChart} role="img" aria-label="Tren pendapatan dan pengeluaran tercatat; nilai lengkap tersedia pada tabel">
      {[35, 75, 115, 155].map(y => <line key={y} x1="25" x2="550" y1={y} y2={y} stroke="#e7eee8" strokeDasharray="4 5" />)}
      <polyline points={points("expense_idr")} fill="none" stroke="#c5a049" strokeWidth="3" strokeLinejoin="round" />
      <polyline points={points("revenue_idr")} fill="none" stroke="#237a4a" strokeWidth="3" strokeLinejoin="round" />
      {rows.map((row, i) => <text key={row.month} x={35 + i * 100} y="181" textAnchor="middle" fill="#66796c" fontSize="11">{month(row.month)}</text>)}
    </svg>}
    <details className={s.chartData}><summary>Lihat angka bulanan</summary><div className={s.tableScroll}><table><caption>Nilai aktual dari database, bukan estimasi hasil</caption><thead><tr><th>Bulan</th><th>Pendapatan</th><th>Pengeluaran</th><th>Panen</th></tr></thead><tbody>{rows.map(row => <tr key={row.month}><td>{row.month}</td><td>{money(row.revenue_idr)}</td><td>{money(row.expense_idr)}</td><td>{number(row.harvest_kg)} kg</td></tr>)}</tbody></table></div></details>
  </>;
}

export default function CmsDashboard({ className }: { className: string }) {
  const router = useRouter();
  const [view, setView] = useState("overview");
  const [data, setData] = useState<CmsData | null>(null);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);
  const [busy, setBusy] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("");
  const [refresh, setRefresh] = useState(0);
  const version = useRef(0);
  const detailRef = useRef<HTMLElement>(null);
  const load = useCallback(async (signal: AbortSignal) => {
    const current = ++version.current;
    setBusy(true); setError("");
    const params = new URLSearchParams({ page: String(page), page_size: "20", search, status, role });
    if (selected) params.set("user_id", selected);
    try {
      const response = await fetch("/api/cms?" + params, { signal, cache: "no-store" });
      const value = await response.json();
      if (signal.aborted || current !== version.current) return;
      if (!response.ok) { setData(null); setError(value.error || "Data belum tersedia."); setErrorStatus(response.status); return; }
      setData(value); setErrorStatus(0);
    } catch {
      if (!signal.aborted && current === version.current) { setData(null); setError("Koneksi terputus. Silakan coba muat ulang."); setErrorStatus(503); }
    } finally { if (!signal.aborted && current === version.current) setBusy(false); }
  }, [page, search, status, role, selected]);
  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => { if (!controller.signal.aborted) void load(controller.signal); });
    return () => controller.abort();
  }, [load, refresh]);
  const detailId = data?.selected_user?.profile.id;
  useEffect(() => {
    if (!detailId || !detailRef.current) return;
    detailRef.current.focus({ preventScroll: true });
    detailRef.current.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [detailId]);
  async function logout() {
    version.current++;
    try { const response = await fetch("/api/session/logout", { method: "POST" }); if (response.ok) { setData(null); router.replace("/login"); } else setError("Belum dapat keluar. Coba kembali."); }
    catch { setError("Koneksi gagal saat keluar."); }
  }
  function filter(event: FormEvent) { event.preventDefault(); setSearch(searchInput.trim()); setPage(1); }
  const info = nav.find(item => item.id === view)!;
  const selectedData = data?.selected_user;
  const stats = [
    { label: "Total pengguna", value: data ? number(data.summary.user_count) : "—", note: data ? `${number(data.summary.farmer_count)} akun petani` : "Semua role terdaftar", icon: "chat" as IconName },
    { label: "Kebun tercatat", value: data ? number(data.summary.farm_count) : "—", note: "Tidak termasuk soft delete", icon: "greenhouse" as IconName },
    { label: "Tanaman aktif", value: data ? number(data.summary.active_crop_count) : "—", note: "Status sedang tumbuh", icon: "leaf" as IconName },
    { label: "Aktivitas kebun", value: data ? number(data.summary.activity_count) : "—", note: "Kegiatan yang sudah dilakukan", icon: "inspection" as IconName },
  ];
  const donut = data?.user_statuses.map((row, index) => {
    const before = data.user_statuses.slice(0, index).reduce((sum, item) => sum + item.count, 0);
    const from = data.summary.user_count ? before / data.summary.user_count * 360 : 0;
    const to = data.summary.user_count ? (before + row.count) / data.summary.user_count * 360 : 0;
    return `${statusColors[row.status] || "#889a90"} ${from}deg ${to}deg`;
  }).join(",");

  return <div className={`${s.cms} ${className}`}>
    <aside className={s.sidebar}>
      <Link href="/" className={s.brand}><BrandGlyph className={s.logo} /><span>AgriSense<small>ADMIN WORKSPACE</small></span></Link>
      <span className={s.navLabel}>MONITORING PLATFORM</span>
      <nav aria-label="Menu CMS">{nav.map(item => <button key={item.id} className={view === item.id ? s.navActive : ""} aria-current={view === item.id ? "page" : undefined} onClick={() => setView(item.id)}><Icon name={item.icon} size={20} />{item.name}{item.id === "users" && data && <span>{data.summary.user_count}</span>}</button>)}</nav>
      <div className={s.sidebarNote}><Icon name="confirmed" size={24} /><strong>Data, bukan perkiraan.</strong><p>Semua angka mengikuti catatan backend. Pencatatan tetap melalui WhatsApp.</p><span>Mode baca-saja</span></div>
      <Link href="/" className={s.backLink}>← Kembali ke website</Link>
    </aside>
    <div className={s.workspace}>
      <header className={s.topbar}><div><span>Workspace</span><span>/</span><strong>{info.name}</strong></div><div className={s.account}><span className={s.accessBadge}><Icon name="confirmed" size={15} />Admin only</span><span className={s.avatar}>{data?.profile.name.slice(0, 1).toUpperCase() || "A"}</span><span><strong>{data?.profile.name || "Administrator"}</strong><small>{data ? roles[data.profile.role] : "Akses terautentikasi"}</small></span><button onClick={() => void logout()} aria-label="Keluar dari CMS">Keluar</button></div></header>
      <main id="main" className={s.main}>
        <div className={s.pageHeading}><div><span className={s.eyebrow}>AGRISENSE / CMS</span><h1>{view === "overview" ? "Satu tempat untuk melihat semuanya." : info.name}</h1><p>Ringkasan platform dan data pengguna, langsung dari backend AgriSense.</p></div><button className={s.refreshButton} disabled={busy} onClick={() => setRefresh(value => value + 1)}><span aria-hidden="true">↻</span>{busy ? "Memuat…" : "Muat ulang"}</button></div>
        <div className={s.sourceBar}><span><i />{data ? "Snapshot database" : "Menunggu koneksi backend"}</span><span>{data ? `Diperbarui ${date(data.generated_at, true)} WIB` : "Tidak ada data contoh yang ditampilkan"}</span></div>
        {data?.data_environment.includes("validation") && <p className={s.notice}><Icon name="info" size={18} />Lingkungan uji terisolasi. Data sintetis di database ini bukan data petani produksi.</p>}
        {error && <section className={s.error} role="alert"><Icon name="info" size={25} /><div><h2>{errorStatus === 401 ? "Masuk untuk membuka CMS" : errorStatus === 403 ? "Akses khusus administrator" : "Data belum dapat ditampilkan"}</h2><p>{error}</p>{errorStatus === 401 ? <Link href="/login">Masuk dengan kode WhatsApp →</Link> : errorStatus === 403 ? <Link href="/dashboard">Buka dashboard petani →</Link> : <button onClick={() => setRefresh(value => value + 1)}>Coba lagi</button>}</div></section>}
        <section className={s.stats} aria-label="Ringkasan seluruh platform" aria-busy={busy}>{stats.map((stat, i) => <article key={stat.label} className={i === 0 ? s.primaryStat : ""}><span className={s.statIcon}><Icon name={stat.icon} size={23} /></span><h2>{stat.label}</h2><strong>{stat.value}</strong><p>{stat.note}</p></article>)}</section>
        {busy && <p className={s.loading} role="status">Mengambil snapshot yang terautentikasi…</p>}
        {data && (view === "overview" || view === "finance") && <section className={s.chartGrid}>
          <article className={s.panel}><div className={s.panelHeading}><div><span className={s.eyebrow}>ARUS KEUANGAN</span><h2>Pendapatan & pengeluaran</h2></div><Icon name="calendar" size={20} /></div><FinanceChart rows={data.monthly} /><p className={s.chartFootnote}>Grafik mencakup {date(data.period.from)}–{date(data.period.to)}. Bukan proyeksi keuntungan.</p></article>
          <article className={s.panel}><div className={s.panelHeading}><div><span className={s.eyebrow}>KONDISI AKUN</span><h2>Status pengguna</h2></div></div><div className={s.statusChart}><div className={s.donut} role="img" aria-label={`Komposisi ${data.summary.user_count} akun menurut status`} style={{ background: donut ? `conic-gradient(${donut})` : "#e6eee7" }}><div><strong>{number(data.summary.user_count)}</strong><span>pengguna</span></div></div><ul>{data.user_statuses.map(row => <li key={row.status}><i style={{ background: statusColors[row.status] }} /><span>{statuses[row.status]}</span><strong>{number(row.count)}</strong></li>)}</ul></div><p className={s.chartFootnote}>Status akun dari database, bukan status online WhatsApp.</p></article>
        </section>}
        {data && view === "finance" && <section className={s.financeStats} aria-label="Total seluruh riwayat finansial"><article><span>Pendapatan tercatat</span><strong>{money(data.summary.revenue_total_idr)}</strong></article><article><span>Pengeluaran tercatat</span><strong>{money(data.summary.expense_total_idr)}</strong></article><article><span>Panen tercatat</span><strong>{number(data.summary.harvest_total_kg)} kg</strong></article></section>}
        {data && <section className={s.panel}>
          <div className={s.panelHeading}><div><span className={s.eyebrow}>DIREKTORI PENGGUNA</span><h2>{view === "farms" ? "Pilih pengguna untuk melihat kebunnya" : "Kenali setiap pengguna."}</h2><p>{data.pagination.total} akun sesuai filter · nomor WhatsApp disamarkan</p></div><span className={s.readBadge}>BACA-SAJA</span></div>
          <form className={s.filters} onSubmit={filter}><label className={s.searchLabel}><span className={s.srOnly}>Cari nama, nomor, atau wilayah</span><Icon name="inspection" size={18} /><input aria-label="Cari nama, nomor, atau wilayah" placeholder="Cari nama, nomor, atau wilayah…" value={searchInput} maxLength={100} onChange={event => setSearchInput(event.target.value)} /><button type="submit" disabled={busy}>Cari</button></label><label><span className={s.srOnly}>Filter status</span><select aria-label="Filter status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }}><option value="">Semua status</option>{Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label><span className={s.srOnly}>Filter role</span><select aria-label="Filter role" value={role} onChange={event => { setRole(event.target.value); setPage(1); }}><option value="">Semua role</option>{Object.entries(roles).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></form>
          <div className={s.tableScroll} tabIndex={0} aria-label="Tabel pengguna dapat digulir"><table><caption className={s.srOnly}>Daftar pengguna sesuai filter. Pilih Detail untuk membaca data pengguna.</caption><thead><tr><th>Pengguna</th><th>Role</th><th>Status</th><th>Kebun</th><th>Tanaman aktif</th><th>Terdaftar</th><th><span className={s.srOnly}>Aksi</span></th></tr></thead><tbody>{data.users.map(user => <tr key={user.id} className={selected === user.id ? s.selectedRow : ""}><td><div className={s.userCell}><span className={s.userAvatar}>{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.phone_masked}{user.region ? ` · ${user.region}` : ""}</small></div></div></td><td>{roles[user.role] || user.role}</td><td><span className={s.statusBadge} style={{ color: statusColors[user.status] }}><i />{statuses[user.status] || user.status}</span></td><td>{user.farm_count}</td><td>{user.active_crop_count}</td><td>{date(user.created_at)}</td><td><button className={s.detailButton} aria-label={`Lihat detail ${user.name}`} onClick={() => setSelected(user.id)} disabled={busy}>Detail <span aria-hidden="true">↗</span></button></td></tr>)}</tbody></table></div>
          {data.users.length === 0 && <div className={s.empty}><Icon name="leaf" size={28} /><h3>Tidak ada akun yang cocok.</h3><p>Coba nama lain atau tampilkan semua status dan role.</p><button onClick={() => { setSearch(""); setSearchInput(""); setRole(""); setStatus(""); setPage(1); }}>Hapus filter</button></div>}
          <div className={s.pagination}><span>Halaman {data.pagination.page} dari {Math.max(1, data.pagination.total_pages)} · maksimal {data.pagination.page_size} akun/halaman</span><div><button disabled={busy || page <= 1} onClick={() => setPage(value => value - 1)}>← Sebelumnya</button><button disabled={busy || page >= data.pagination.total_pages} onClick={() => setPage(value => value + 1)}>Berikutnya →</button></div></div>
        </section>}
        {selectedData && <section ref={detailRef} tabIndex={-1} className={`${s.panel} ${s.userDetail}`} aria-label={`Detail pengguna ${selectedData.profile.name}`}>
          <div className={s.panelHeading}><div><span className={s.eyebrow}>DETAIL PENGGUNA</span><h2>{selectedData.profile.name}</h2><p>{selectedData.profile.phone_masked} · {roles[selectedData.profile.role]} · {statuses[selectedData.profile.status]}</p></div><button className={s.detailButton} onClick={() => setSelected("")}>Tutup detail ×</button></div>
          <div className={s.financeStats}><article><span>Pendapatan tercatat</span><strong>{money(selectedData.finance.revenue_idr)}</strong></article><article><span>Pengeluaran tercatat</span><strong>{money(selectedData.finance.expense_idr)}</strong></article><article><span>Panen tercatat</span><strong>{number(selectedData.finance.harvest_kg)} kg</strong></article></div>
          <div className={s.detailGrid}><div><h3>Kebun</h3>{selectedData.farms.length ? selectedData.farms.map(farm => <article className={s.farmCard} key={farm.id}><Icon name="greenhouse" size={22} /><div><strong>{farm.name}</strong><small>{number(farm.area_hectares)} ha · {farm.timezone}</small></div></article>) : <p className={s.emptyText}>Belum memiliki data kebun aktif.</p>}</div><div><h3>Tanaman</h3>{selectedData.crops.length ? selectedData.crops.map(crop => <article className={s.farmCard} key={crop.id}><Icon name="leaf" size={22} /><div><strong>{crop.crop_type} {crop.seed_variety || ""}</strong><small>{crop.farm_name} · {crop.age_days} hari · {crop.status === "growing" ? "Sedang tumbuh" : crop.status}</small></div></article>) : <p className={s.emptyText}>Belum ada catatan tanaman aktif.</p>}</div></div>
          <h3 className={s.activityTitle}>Aktivitas terbaru</h3>{selectedData.activities.length ? <ol className={s.timeline}>{selectedData.activities.map(activity => <li key={activity.id}><span className={s.timelineIcon}><Icon name="inspection" size={18} /></span><div><strong>{activities[activity.activity_type] || activity.activity_type}</strong><p>{activity.description || "Tanpa keterangan tambahan"}</p><small>{activity.farm_name} · {date(activity.performed_at)}{activity.quantity ? ` · ${number(activity.quantity)} ${activity.unit || ""}` : ""}</small></div></li>)}</ol> : <p className={s.emptyText}>Belum ada aktivitas yang dicatat.</p>}
          <p className={s.chartFootnote}>Maksimal {selectedData.list_limits.farms} kebun, {selectedData.list_limits.crops} tanaman, dan {selectedData.list_limits.activities} aktivitas terbaru. Ringkasan finansial tidak dihitung dari potongan daftar ini.</p>
        </section>}
        {data && view === "overview" && <section className={s.bottomGrid}><article className={s.panel}><div className={s.panelHeading}><div><span className={s.eyebrow}>RITME KEBUN</span><h2>Komposisi aktivitas</h2></div></div>{data.activity_categories.length ? data.activity_categories.map(row => <div className={s.activityBar} key={row.activity_type}><div><span>{activities[row.activity_type] || row.activity_type}</span><strong>{row.count} kegiatan</strong></div><meter min={0} max={Math.max(...data.activity_categories.map(item => item.count))} value={row.count} aria-label={`${activities[row.activity_type] || row.activity_type}: ${row.count} kegiatan`} /></div>) : <p className={s.emptyText}>Belum ada aktivitas pada periode grafik.</p>}</article><article className={`${s.panel} ${s.readPanel}`}><Icon name="confirmed" size={32} /><h2>Kendali tetap di tangan pengguna.</h2><p>CMS ini hanya menampilkan data. Pengubahan catatan tetap melalui alur domain dan konfirmasi pemilik; tidak ada aksi edit, hapus, atau persetujuan kredit di sini.</p><span>Autentikasi admin · Filter soft delete · Data aktual</span></article></section>}
        <footer className={s.footer}><span>AgriSense CMS · Dashboard baca-saja</span><span>Data pribadi dibatasi · Tidak menampilkan isi chat atau NIK</span></footer>
      </main>
    </div>
  </div>;
}
