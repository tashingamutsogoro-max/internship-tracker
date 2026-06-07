import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("All fields are required");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      navigate("/");
    } catch {
      toast.error("Email already in use");
    }
    setLoading(false);
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={{ color:"#e94560", marginBottom:4 }}>🎯 InternTrack</h1>
        <p style={{ color:"#888", marginBottom:"1.5rem" }}>Create your account</p>
        <input placeholder="Full Name" style={input}
          onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" type="email" style={input}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" style={input}
          onChange={e => setForm({...form, password: e.target.value})}
          onKeyDown={e => e.key === "Enter" && handle()} />
        <button style={btn} onClick={handle} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p style={{ textAlign:"center", fontSize:14 }}>
          Have an account? <Link to="/login" style={{ color:"#e94560" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const wrapper = { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f0f2f5" };
const card = { background:"white", padding:"2.5rem", borderRadius:16, width:380, display:"flex", flexDirection:"column", gap:"1rem", boxShadow:"0 8px 32px rgba(0,0,0,0.1)" };
const input = { padding:"0.75rem", borderRadius:8, border:"1px solid #ddd", fontSize:14, outline:"none" };
const btn = { background:"#e94560", color:"white", border:"none", padding:"0.8rem", borderRadius:8, cursor:"pointer", fontWeight:"bold", fontSize:15 };