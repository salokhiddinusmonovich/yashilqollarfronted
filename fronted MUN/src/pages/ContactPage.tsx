import { useState, useEffect } from "react";

const GREEN = "#22C55E";
const ORANGE = "#F97316";

const contacts = [
  {
    label: "Email", value: "yashilqollar@gmail.com", href: "mailto:yashilqollar@gmail.com",
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  {
    label: "Telegram", value: "@yqmun", href: "https://t.me/tashkent_tech_mun",
    icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
  },
  {
    label: "Instagram", value: "@tt_mun", href: "https://instagram.com/tt_mun",
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  },
];

const faq = [
  { q: "Who can attend Yashil Qo'llar MUN 2026?", a: "Yashil Qo'llar MUN is open to high school and university students from all countries. No prior MUN experience is required for most committees." },
  { q: "What language are sessions held in?", a: "All official committee sessions and communications are conducted in English." },
  { q: "Is accommodation provided?", a: "We can recommend partner hotels near the venue. Details are sent to registered delegates upon confirmation." },
  { q: "When will I receive my committee and country assignment?", a: "Assignments are sent by email approximately 3–4 weeks before the conference begins." },
  { q: "Can I attend as a school delegation?", a: "Yes! We welcome school and university delegations. Please contact us for group registration options." },
];

function ContactCard({ c }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={c.href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 16, background: "#111", border: `1px solid ${hovered ? GREEN + "55" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "16px 20px", textDecoration: "none", transition: "border-color 0.2s, transform 0.2s", transform: hovered ? "translateX(4px)" : "translateX(0)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: hovered ? `${GREEN}18` : "rgba(255,255,255,0.04)", border: `1px solid ${hovered ? GREEN + "40" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: hovered ? GREEN : "rgba(255,255,255,0.4)", transition: "all 0.2s" }}>{c.icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: hovered ? "#fff" : "rgba(255,255,255,0.7)", transition: "color 0.2s" }}>{c.value}</div>
      </div>
      <div style={{ marginLeft: "auto", color: hovered ? GREEN : "rgba(255,255,255,0.2)", fontSize: 18, transition: "color 0.2s" }}>→</div>
    </a>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div style={{ background: "#111", border: `1px solid ${open ? GREEN + "45" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{item.q}</span>
        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: open ? `${GREEN}20` : "rgba(255,255,255,0.05)", border: `1px solid ${open ? GREEN + "50" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: open ? GREEN : "rgba(255,255,255,0.3)", fontSize: 18, transition: "all 0.2s" }}>{open ? "−" : "+"}</div>
      </button>
      {open && <div style={{ padding: "0 22px 20px" }}><p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.a}</p></div>}
    </div>
  );
}

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
      {/* Green glow */}
      <div style={{ position: "fixed", top: -200, left: -200, width: isMobile ? 500 : 900, height: isMobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.10) 35%, transparent 68%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(8,8,8,0.90)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: isMobile ? "0 20px" : "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>TT MUN</span>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: 24 }}>
            {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
              <span key={item} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", color: item === "CONTACT" ? ORANGE : "rgba(255,255,255,0.5)", borderBottom: item === "CONTACT" ? `2px solid ${ORANGE}` : "2px solid transparent", paddingBottom: 2, whiteSpace: "nowrap" }}>{item}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!isMobile && <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>RU</button>}
          <button style={{ background: ORANGE, border: "none", color: "#fff", padding: "8px 14px", borderRadius: 7, fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>REGISTER NOW</button>
          {isMobile && <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 16, cursor: "pointer" }}>☰</button>}
        </div>
      </nav>
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 49, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
            <span key={item} onClick={() => setMenuOpen(false)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: item === "CONTACT" ? ORANGE : "rgba(255,255,255,0.6)", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
      )}

      <main style={{ position: "relative", zIndex: 1, paddingTop: isMobile ? 80 : 96, paddingBottom: 100, paddingLeft: isMobile ? 16 : "clamp(32px,5vw,80px)", paddingRight: isMobile ? 16 : "clamp(32px,5vw,80px)", maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 2, background: GREEN, borderRadius: 2 }} />
            <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>Get in Touch</span>
          </div>
          <h1 style={{ margin: 0, fontWeight: 900, textTransform: "uppercase", fontSize: isMobile ? "clamp(30px,9vw,44px)" : "clamp(38px,5vw,56px)", color: "#fff", lineHeight: 1.05 }}>
            CONTACT <span style={{ color: GREEN }}>US</span>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 64, alignItems: "start" }}>
          {/* LEFT */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Direct Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {contacts.map((c, i) => <ContactCard key={i} c={c} />)}
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Location</div>
            <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.9106699755757!2d69.2494268!3d41.3108069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b05774c5969%3A0xd6f6eef4c05c280!2sTashkent%20State%20University%20of%20Economics!5e0!3m2!1sen!2s!4v1779662828383!5m2!1sen!2s"
                width="100%"
                height="200"
                style={{ border: 0, display: "block", borderRadius: 10, marginBottom: 16, filter: "invert(90%) hue-rotate(180deg) saturate(0.8)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>📍 Islom Karimov street 49, Tashkent, Uzbekistan</div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Quick Answers</div>
            <h2 style={{ margin: "0 0 28px", fontWeight: 900, textTransform: "uppercase", fontSize: isMobile ? 22 : 26, color: "#fff", letterSpacing: "-0.01em" }}>FREQUENTLY ASKED QUESTIONS</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faq.map((item, i) => (
                <FaqItem key={i} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
