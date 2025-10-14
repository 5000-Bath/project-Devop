import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const sceneRef = useRef(null);

  // parallax ตามเมาส์
  useEffect(() => {
    const el = sceneRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;  // -1..1
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        .landing-wrap{
          --mx: 0; --my: 0;
          position: relative;
          min-height: calc(100vh - 80px); /* ต่ำกว่า navbar */
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 56px 24px 96px;
          isolation: isolate;
          background: #0b1020;
        }

        /* พื้นหลังไล่สีเคลื่อนไหว */
        .bg-gradient{
          position:absolute; inset:-10%;
          background:
            radial-gradient(1200px 800px at 0% -10%, #a78bfa33, transparent 60%),
            radial-gradient(900px 600px at 110% 0%, #60a5fa33, transparent 60%),
            radial-gradient(800px 500px at 50% 120%, #34d39933, transparent 60%),
            linear-gradient(180deg, #0b1020, #0e172a);
          filter: hue-rotate(calc(var(--mx) * 10deg));
          transform: scale(1.05) translate3d(calc(var(--mx)*10px), calc(var(--my)*-8px), 0);
          animation: drift 18s ease-in-out infinite alternate;
          z-index:-3;
        }
        @keyframes drift {
          0%{ opacity:.95; }
          100%{ opacity:1; filter: hue-rotate(20deg) saturate(1.2); }
        }

        /* กริดเรืองแสง */
        .grid{
          position:absolute; inset:-20%;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,.18), transparent 60%),
            repeating-linear-gradient(transparent 0 38px, rgba(255,255,255,.06) 38px 39px),
            repeating-linear-gradient(90deg, transparent 0 38px, rgba(255,255,255,.06) 38px 39px);
          transform: perspective(900px) rotateX(65deg)
             translate3d(calc(var(--mx)*-12px), calc(var(--my)*-8px), 0);
          animation: gridPan 30s linear infinite;
          z-index:-2;
          opacity:.6;
        }
        @keyframes gridPan {
          0%{ background-position: 0 0, 0 0, 0 0; }
          100%{ background-position: 0 0, 0 600px, 600px 0; }
        }

        /* orbs เรืองแสงลอยๆ */
        .orb{
          position:absolute; width:42vmin; height:42vmin; border-radius:50%;
          filter: blur(28px); opacity:.35; mix-blend-mode: screen; z-index:-1;
          transform: translate3d(0,0,0);
        }
        .o1{ top:8%; left:6%; background:#a78bfa; animation: float1 14s ease-in-out infinite; }
        .o2{ right:8%; bottom:10%; background:#60a5fa; animation: float2 18s ease-in-out infinite; }
        .o3{ left:55%; top:40%; background:#34d399; animation: float3 20s ease-in-out infinite; }
        @keyframes float1 { 0%{transform:translate(0,0)} 50%{transform:translate(20px,-22px)} 100%{transform:translate(-12px,10px)} }
        @keyframes float2 { 0%{transform:translate(0,0)} 50%{transform:translate(-26px,12px)} 100%{transform:translate(12px,-18px)} }
        @keyframes float3 { 0%{transform:translate(0,0)} 50%{transform:translate(14px,22px)} 100%{transform:translate(-18px,-12px)} }

        /* ฮีโร่ */
        .hero{ text-align:center; color:#e5e7eb; max-width: 980px; padding-inline: 8px; }
        .hello{
          display:inline-flex; gap:10px; align-items:center;
          padding:10px 16px; border-radius:14px;
          background:linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.12));
          border:1px solid rgba(139,92,246,.35); backdrop-filter: blur(6px);
          box-shadow:0 8px 24px rgba(17,24,39,.25); margin-bottom:14px;
          font-weight:800; letter-spacing:.5px;
          color:transparent; -webkit-background-clip:text; background-clip:text;
          background-image:linear-gradient(90deg,#a78bfa,#60a5fa,#34d399,#f472b6);
          position: relative;
        }
        .hello:after{
          content:""; position:absolute; inset:0; border-radius:14px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
          transform: translateX(-120%); filter: blur(2px);
          animation: shine 4s ease-in-out infinite;
        }
        @keyframes shine { 0%{transform:translateX(-120%)} 60%{transform:translateX(120%)} 100%{transform:translateX(120%)} }

        .title{
          font-size: clamp(36px, 6vw, 88px);
          line-height: 1.02; font-weight: 900;
          letter-spacing: .4px; margin: 6px 0 10px;
        }
        .title .grad{
          background-image:linear-gradient(90deg,#a78bfa,#60a5fa,#34d399);
          -webkit-background-clip:text; background-clip:text; color:transparent;
          filter: drop-shadow(0 10px 32px rgba(96,165,250,.35));
          background-size: 200% 100%;
          animation: hue 8s ease-in-out infinite alternate;
        }
        @keyframes hue { 0%{background-position:0%} 100%{background-position:100%} }

        .subtitle{
          color:#cbd5e1; font-size: clamp(14px, 2.2vw, 20px);
          margin: 12px auto 28px; max-width: 780px;
          opacity:.95;
        }

        /* ปุ่ม CTA */
        .cta{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .btn{
          padding:12px 18px; border-radius:12px; font-weight:800; letter-spacing:.2px;
          transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
          text-decoration:none; display:inline-flex; align-items:center; gap:10px;
          will-change: transform;
        }
        .btn.primary{
          background: linear-gradient(90deg,#6366f1,#22c55e);
          color:white; box-shadow:0 14px 34px rgba(34,197,94,.25);
          transform: translate3d(calc(var(--mx)*3px), calc(var(--my)*2px), 0);
        }
        .btn.ghost{
          background:rgba(255,255,255,.06); color:#e5e7eb;
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(6px);
          transform: translate3d(calc(var(--mx)*1px), calc(var(--my)*1px), 0);
        }
        .btn:hover{ transform: translateY(-2px) scale(1.02); opacity:.96 }

        /* สะเก็ดแสงเล็กๆ */
        .spark{
          position:absolute; width:2px; height:2px; background:#fff; opacity:.55; border-radius:50%;
          top: var(--t, 50%); left: var(--l, 50%);
          box-shadow: 0 0 10px 2px #fff, 0 0 20px 6px #60a5fa66;
          animation: sparkMove var(--dur, 8s) linear infinite;
        }
        @keyframes sparkMove {
          0%{ transform: translate3d(-10vw, -5vh, 0) scale(1) }
          100%{ transform: translate3d(110vw, 10vh, 0) scale(.8) }
        }
      `}</style>

      <section ref={sceneRef} className="landing-wrap" aria-label="Hero landing">
        <div className="bg-gradient" aria-hidden="true"></div>
        <div className="grid" aria-hidden="true"></div>
        <div className="orb o1" aria-hidden="true"></div>
        <div className="orb o2" aria-hidden="true"></div>
        <div className="orb o3" aria-hidden="true"></div>

        {/* สะเก็ดแสง 8 ดวง */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="spark"
            style={{
              "--t": `${15 + i * 10}%`,
              "--l": `${(i * 12) % 100}%`,
              "--dur": `${6 + (i % 5)}s`,
            }}
          />
        ))}

        <div className="hero">
          <div className="hello">hello ✨</div>
          <h1 className="title">
            Welcome to <span className="grad">Crayon&nbsp;Shinchan</span> Foodstore
          </h1>
          <p className="subtitle">
            Fresh. Fast. Fun. อิ่มอร่อยในไม่กี่คลิก — เริ่มสั่งได้เลย!
          </p>
          <div className="cta">
            <Link className="btn primary" to="/Home">🍜 Browse Menu</Link>
            <Link className="btn ghost" to="/Status">🧾 Go to Orders Status</Link>
          </div>
        </div>
      </section>
    </>
  );
}
