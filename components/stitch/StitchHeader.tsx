"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LeafGlyph } from "@/components/landing/Logo";
import { Icon } from "@/components/landing/Icon";
import styles from "./landing.module.css";

const links = [{id:"tentang",label:"Tentang"},{id:"manfaat",label:"Manfaat"},{id:"cara-kerja",label:"Cara kerja"},{id:"kepercayaan",label:"Kepercayaan"},{id:"faq",label:"FAQ"}];
export function StitchHeader({whatsappUrl}:{whatsappUrl:string|null}) {
 const [active,setActive]=useState("");
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id==="beranda"?"":entry.target.id);
  },{rootMargin:"-15% 0px -60% 0px",threshold:0});
  for(const link of links){const el=document.getElementById(link.id);if(el)observer.observe(el);}
  const hero=document.getElementById("beranda");if(hero)observer.observe(hero);
  return()=>observer.disconnect();
 },[]);
 return <header className={styles.header}><div className={styles.headerInner}>
  <Link className={styles.brand} href="/" aria-label="AgriSense — beranda"><span className={styles.brandMark}><LeafGlyph /></span><span>AgriSense</span></Link>
  <nav className={styles.desktopNav} aria-label="Navigasi utama">
   {links.map(link=><a key={link.id} href={`#${link.id}`} aria-current={active===link.id?"location":undefined}>{link.label}</a>)}
  </nav>
  <div className={styles.headerActions}>
   {whatsappUrl?<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.headerCta}><Icon name="chat" size={18}/>Mulai via WhatsApp</a>
    :<a href="#demo" className={styles.headerCta}><Icon name="chat" size={18}/>Coba simulasi</a>}
   <Link href="/cms" className={styles.loginLink}>CMS</Link>
   <Link href="/login" className={styles.loginLink}>Masuk<span className={styles.loginArrow} aria-hidden="true">↗</span></Link>
   <details className={styles.mobileMenu} onKeyDown={event=>{
    if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus();}
   }}>
    <summary aria-label="Menu navigasi"><Icon name="menu" size={23}/><span>Menu</span></summary>
    <nav aria-label="Navigasi mobile" className={styles.mobilePanel} onClick={event=>{
      if((event.target as HTMLElement).closest("a")){const d=event.currentTarget.closest("details");if(d)d.open=false;}
    }}>{links.map(link=><a href={`#${link.id}`} key={link.id}>{link.label}</a>)}<Link href="/login">Masuk dashboard petani <span aria-hidden="true">↗</span></Link></nav>
   </details>
  </div>
 </div></header>;
}
