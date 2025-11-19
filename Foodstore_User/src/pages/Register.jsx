import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import shinchanLogo from "../assets/shinchan.png";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username:"", password:"", name:"", lastname:"", email:"",
    phone:"", birth_date:"", profile_image_url:"", address:""
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e){
    const {name,value}=e.target;
    setForm((f)=>({...f,[name]:value}));
  }

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
    setOk("");
    if (!form.username.trim() || !form.password.trim()) {
      setErr("กรุณากรอก username และ password");
      return;
    }

    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/api/auth/register`,{
        method:"POST",
        credentials: "include",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => ({}));

      if(!res.ok) {
        const msg = data?.message || data?.error || (typeof data === "string" ? data : `HTTP ${res.status}`);
        throw new Error(msg);
      }

      if (data?.ok === false) throw new Error(data?.message || "Register failed");

      setOk("สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...");
      setTimeout(()=>nav("/login"), 800);
    }catch(e2){
      setErr(String(e2?.message || e2 || "Register failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <img src={shinchanLogo} alt="Crayon Shinchan" />
        <div className="brand">CRAYON<br/>SHINCHAN</div>
      </div>

      <div className="auth-card">
        <div className="auth-rule" />
        <h2 className="auth-title">Create your account</h2>

        <form onSubmit={onSubmit} className="auth-form" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 12px"}}>
          <label className="auth-label">Username</label>
          <input className="auth-input" name="username" value={form.username} onChange={onChange} required autoComplete="username" />
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" name="password" value={form.password} onChange={onChange} required autoComplete="new-password" />
          <label className="auth-label">Name</label>
          <input className="auth-input" name="name" value={form.name} onChange={onChange} />
          <label className="auth-label">Lastname</label>
          <input className="auth-input" name="lastname" value={form.lastname} onChange={onChange} />
          <label className="auth-label">Email</label>
          <input className="auth-input" name="email" value={form.email} onChange={onChange} type="email" />
          <label className="auth-label">Phone</label>
          <input className="auth-input" name="phone" value={form.phone} onChange={onChange} />
          <label className="auth-label">Birth date</label>
          <input className="auth-input" type="date" name="birth_date" value={form.birth_date} onChange={onChange} />
          <label className="auth-label">Profile image URL</label>
          <input className="auth-input" name="profile_image_url" value={form.profile_image_url} onChange={onChange} />
          <label className="auth-label" style={{gridColumn:"1/-1"}}>Address</label>
          <input className="auth-input" name="address" value={form.address} onChange={onChange} style={{gridColumn:"1/-1"}} />

          {err && <div className="auth-error" style={{gridColumn:"1/-1"}}>{err}</div>}
          {ok &&  <div className="auth-error" style={{gridColumn:"1/-1",background:"#e6ffed",color:"#087443",borderColor:"#b9efc9"}}>{ok}</div>}

          <button type="submit" className="auth-btn" style={{gridColumn:"1/-1"}} disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth-links"><span>มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></span></div>
      </div>
    </div>
  );
}