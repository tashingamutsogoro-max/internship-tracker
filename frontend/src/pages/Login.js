import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={{ color:"#e94560", marginBottom:4 }}>🎯 InternTrack</h1>
        <p style={{ color:"#888", marginBottom:"1.5rem" }}>Sign in to your account</p>
        <input placeholder="Email" style={input} type="email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" style={input}
          onChange={e => setForm({...form, password: e.target.value})}
          onKeyDown={e => e.key === "Enter" && handle()} />
        <button style={btn} onClick={handle} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p style={{ textAlign:"center", fontSize:14 }}>
          No account? <Link to="/register" style={{ color:"#e94560" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const wrapper = { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f0f2f5" };
const card = { background:"white", padding:"2.5rem", borderRadius:16, width:380, display:"flex", flexDirection:"column", gap:"1rem", boxShadow:"0 8px 32px rgba(0,0,0,0.1)" };
const input = { padding:"0.75rem", borderRadius:8, border:"1px solid #ddd", fontSize:14, outline:"none" };
const btn = { background:"#e94560", color:"white", border:"none", padding:"0.8rem", borderRadius:8, cursor:"pointer", fontWeight:"bold", fontSize:15 };