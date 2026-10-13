"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Data = {
 data_environment:string;
 profile: {name:string;phone:string}; generated_at:string;
 summary:{farm_count:number;active_crop_count:number;activity_count:number;harvest_total_kg:string;expense_total_idr:string};
 period:{from:string;to:string}; list_limits:{farms:number;crops:number;recent_activities:number};
 farms:{id:string;name:string;area_hectares:string|null}[];
 crops:{id:string;crop_type:string;status:string;age_days:number;seed_variety:string|null}[];
 recent_activities:{id:string;activity_type:string;description:string|null;performed_at:string;farm_name:string}[];
 expense_categories:{category:string;amount_idr:string}[];
 activity_categories:{activity_type:string;count:number}[];
 monthly:{month:string;expense_idr:string;harvest_kg:string}[];
};
const currency = (s:string) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(BigInt(s));
const activityNames:Record<string,string>={watering:"Penyiraman",fertilizing:"Pemupukan",spraying:"Penyemprotan",pruning:"Pemangkasan",inspection:"Inspeksi"};
const date = (s:string) => new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeZone:"Asia/Jakarta"}).format(new Date(s));

export default function FarmerDashboard() {
 const router=useRouter(); const [data,setData]=useState<Data|null>(null); const [error,setError]=useState("");const [busy,setBusy]=useState(true);
 const requestVersion=useRef(0);
 const load=useCallback(async(signal?:AbortSignal)=>{
  const version=++requestVersion.current;
  try {
   const response=await fetch("/api/dashboard",{cache:"no-store",signal}); const value=await response.json();
   if(signal?.aborted||version!==requestVersion.current)return;
   if(response.status===401){setData(null);router.replace("/login");return;}
   if(!response.ok){setData(null);setError(value.error||"Data belum dapat diambil.");return;}
   setData(value);
  } catch {if(!signal?.aborted&&version===requestVersion.current){setData(null);setError("Koneksi terputus. Coba muat ulang.");}}
  finally {if(!signal?.aborted&&version===requestVersion.current)setBusy(false);}
 },[router]);
 useEffect(()=>{
  const controller=new AbortController();
  void Promise.resolve().then(()=>{if(!controller.signal.aborted)return load(controller.signal);});
  return()=>controller.abort();
 },[load]);
 async function logout(){
  requestVersion.current++;
  try {
   const response=await fetch("/api/session/logout",{method:"POST"});
   if(response.ok){setData(null);router.replace("/login");}else{setError("Belum dapat keluar. Coba lagi.");}
  } catch {setError("Koneksi gagal saat keluar. Coba lagi.");}
 }
 return <main id="main" className="mx-auto max-w-5xl px-6 py-10">
  <nav className="flex flex-wrap justify-between gap-4"><Link href="/">AgriSense</Link><div className="flex gap-4">
   <button className="min-h-11 px-3" onClick={()=>{setBusy(true);setError("");void load();}} disabled={busy}>Muat ulang</button><button className="min-h-11 px-3" onClick={()=>void logout()}>Keluar</button></div></nav>
  <h1 className="my-6 text-3xl font-bold">Dashboard petani</h1>
  <p>Data berasal dari backend dan database. Dashboard ini hanya untuk melihat; pencatatan tetap melalui WhatsApp.</p>
  {busy && <p role="status" className="my-6">Mengambil data…</p>}
  {error && <p role="alert" className="my-6">{error}</p>}
  {data && <>
   {data.data_environment==="validation"&&<p role="status" className="my-4">Mode uji lokal: data berasal dari database validation terisolasi, bukan data produksi petani.</p>}
   <p className="my-6">{data.profile.name} · {data.profile.phone} · Diperbarui {date(data.generated_at)}</p>
   <section aria-label="Ringkasan seluruh data" className="my-6 grid grid-cols-2 gap-4 md:grid-cols-3">
    {[["Kebun",data.summary.farm_count],["Tanaman aktif",data.summary.active_crop_count],["Aktivitas tercatat",data.summary.activity_count],
     ["Total panen (kg)",data.summary.harvest_total_kg],["Total pengeluaran",currency(data.summary.expense_total_idr)]].map(([label,value])=>
     <article key={String(label)} className="rounded border p-4"><h2>{label}</h2><p className="mt-2 text-xl font-bold">{value}</p></article>)}
   </section>
   <p>Ringkasan: seluruh riwayat tercatat. Grafik: {date(data.period.from)}–{date(data.period.to)}.</p>
   <section className="my-8"><h2 className="text-xl font-bold">Pengeluaran per kategori</h2>
    {data.expense_categories.length===0 ? <p>Belum ada pengeluaran pada periode ini.</p> : data.expense_categories.map(row=>{
      const total=data.expense_categories.reduce((n,r)=>n+BigInt(r.amount_idr),BigInt(0));
      const percent=total>BigInt(0)?Number(BigInt(row.amount_idr)*BigInt(10000)/total)/100:0;
      return <div key={row.category} className="my-3"><label>{row.category} — {currency(row.amount_idr)} ({percent}%)
       <meter className="block h-6 w-full" min={0} max={100} value={percent} aria-label={`${row.category}: ${percent}%`} /></label></div>;
    })}
   </section>
   <section className="my-8"><h2 className="text-xl font-bold">Komposisi aktivitas</h2>
    {data.activity_categories.length===0 ? <p>Belum ada aktivitas pada periode ini.</p> : data.activity_categories.map(row=>
     <div key={row.activity_type} className="my-3"><label>{activityNames[row.activity_type]||row.activity_type} — {row.count} kegiatan
      <meter className="block h-6 w-full" min={0} max={Math.max(...data.activity_categories.map(r=>r.count))} value={row.count} aria-label={`${row.activity_type}: ${row.count} kegiatan`} /></label></div>)}
   </section>
   <section className="my-8"><h2 className="text-xl font-bold">Panen dan pengeluaran bulanan</h2>
    <div className="overflow-x-auto"><table className="w-full text-left"><caption className="text-left">6 bulan kalender terakhir; nol berarti belum ada pencatatan, bukan estimasi hasil.</caption>
     <thead><tr><th>Bulan</th><th>Panen (kg)</th><th>Pengeluaran</th></tr></thead>
     <tbody>{data.monthly.map(row=><tr key={row.month}><td className="py-3">{row.month}</td><td>{row.harvest_kg}</td><td>{currency(row.expense_idr)}</td></tr>)}</tbody></table></div>
   </section>
   <section className="my-8"><h2 className="text-xl font-bold">Kebun dan tanaman</h2>
    <p>Menampilkan maksimal {data.list_limits.farms} kebun dan {data.list_limits.crops} tanaman; ringkasan tetap menghitung seluruh data.</p>
    {data.farms.length===0 ? <p>Belum ada kebun tercatat.</p> : <ul>{data.farms.map(f=><li key={f.id}>{f.name} — {f.area_hectares ?? "luas belum tersedia"} {f.area_hectares!==null&&"ha"}</li>)}</ul>}
    {data.crops.length===0 ? <p>Belum ada tanaman tercatat.</p> : <ul>{data.crops.map(c=><li key={c.id}>{c.crop_type} · {c.seed_variety||"varietas belum tersedia"} · {c.age_days} hari · {c.status}</li>)}</ul>}
   </section>
   <section className="my-8"><h2 className="text-xl font-bold">20 aktivitas terbaru</h2>
    {data.recent_activities.length===0 ? <p>Belum ada aktivitas yang dikonfirmasi.</p> : <ul>{data.recent_activities.map(a=><li key={a.id} className="my-3">{date(a.performed_at)} · {a.farm_name} · {activityNames[a.activity_type]||a.activity_type}: {a.description||"tanpa keterangan"}</li>)}</ul>}
   </section>
  </>}
 </main>;
}
