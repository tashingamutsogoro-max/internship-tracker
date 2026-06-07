import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

const STATUSES = ["Saved","Applied","Interview","Offer","Rejected"];
const STATUS_COLORS = { Saved:"#6c757d", Applied:"#0d6efd", Interview:"#fd7e14", Offer:"#198754", Rejected:"#dc3545" };
const empty = { company_name:"", role_title:"", job_description:"", status:"Saved", applied_date:"", deadline:"", location:"", salary_range:"", notes:"" };

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");

  const load = () => API.get("/applications/").then(r => setApps(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.company_name || !form.role_title)
      return toast.error("Company and role are required");
    try {
      if (editing) {
        await API.put(`/applications/${editing}`, form);
        toast.success("Application updated!");
      } else {
        await API.post("/applications/", form);
        toast.success("Application added!");
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch { toast.error("Error saving application"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await API.delete(`/applications/${id}`);
    toast.success("Deleted"); load();
  };

  const edit = (app) => {
    setForm({
      ...app,
      applied_date: app.applied_date?.split("T")[0] || "",
      deadline: app.deadline?.split("T")[0] || ""
    });
    setEditing(app.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior:"smooth" });
  };

  const filtered = filter === "All" ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
        <h1>📋 Applications</h1>
        <button style={addBtn} onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }}>
          {showForm ? "✕ Cancel" : "+ Add Application"}
        </button>
      </div>

      {showForm && (
        <div style={formCard}>
          <h3 style={{ marginBottom:"1.25rem" }}>{editing ? "✏️ Edit" : "➕ New"} Application</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            {[["company_name","Company *","text"],["role_title","Role Title *","text"],
              ["location","Location","text"],["salary_range","Salary Range","text"],
              ["applied_date","Applied Date","date"],["deadline","Deadline","date"]
            ].map(([k, label, type]) => (
              <div key={k}>
                <label style={labelStyle}>{label}</label>
                <input type={type} style={inputStyle} value={form[k] || ""}
                  onChange={e => setForm({...form, [k]: e.target.value})} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <label style={labelStyle}>Job Description</label>
            <textarea rows={4} style={{...inputStyle, width:"100%", resize:"vertical", boxSizing:"border-box"}}
              value={form.job_description || ""}
              onChange={e => setForm({...form, job_description: e.target.value})} />
          </div>
          <div style={{ marginBottom:"1.25rem" }}>
            <label style={labelStyle}>Notes</label>
            <textarea rows={3} style={{...inputStyle, width:"100%", resize:"vertical", boxSizing:"border-box"}}
              value={form.notes || ""}
              onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <button style={addBtn} onClick={save}>💾 Save Application</button>
        </div>
      )}

      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer",
            fontWeight: filter===s ? 700 : 400, fontSize:13,
            background: filter===s ? (STATUS_COLORS[s] || "#1a1a2e") : "white",
            color: filter===s ? "white" : "#555",
            boxShadow:"0 1px 4px rgba(0,0,0,0.08)"
          }}>{s} {s==="All" ? `(${apps.length})` : `(${apps.filter(a=>a.status===s).length})`}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        {filtered.map(app => (
          <div key={app.id} style={appCard}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexWrap:"wrap", marginBottom:6 }}>
                <strong style={{ fontSize:17 }}>{app.company_name}</strong>
                <span style={{ color:"#555" }}>{app.role_title}</span>
                <span style={{ ...badgeStyle, background: STATUS_COLORS[app.status] }}>{app.status}</span>
              </div>
              <div style={{ display:"flex", gap:"1.5rem", fontSize:13, color:"#888", flexWrap:"wrap" }}>
                {app.location && <span>📍 {app.location}</span>}
                {app.salary_range && <span>💰 {app.salary_range}</span>}
                {app.applied_date && <span>📅 Applied: {app.applied_date.split("T")[0]}</span>}
                {app.deadline && <span>⏰ Deadline: {app.deadline.split("T")[0]}</span>}
              </div>
              {app.notes && <p style={{ margin:"6px 0 0", fontSize:13, color:"#666" }}>📝 {app.notes}</p>}
            </div>
            <div style={{ display:"flex", gap:"0.5rem", flexShrink:0 }}>
              <button style={iconBtn} onClick={() => edit(app)}>✏️ Edit</button>
              <button style={{...iconBtn, color:"#dc3545"}} onClick={() => del(app.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color:"#aaa", textAlign:"center", padding:"3rem" }}>
            {filter === "All" ? "No applications yet. Add your first one!" : `No applications with status "${filter}".`}
          </p>
        )}
      </div>
    </div>
  );
}

const addBtn = { background:"#e94560", color:"white", border:"none", padding:"0.6rem 1.25rem", borderRadius:8, cursor:"pointer", fontWeight:"bold" };
const formCard = { background:"white", borderRadius:12, padding:"1.75rem", marginBottom:"1.5rem", boxShadow:"0 4px 16px rgba(0,0,0,0.08)" };
const appCard = { background:"white", borderRadius:12, padding:"1.25rem 1.5rem", display:"flex", alignItems:"flex-start", gap:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" };
const badgeStyle = { color:"white", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 };
const iconBtn = { background:"#f0f2f5", border:"none", padding:"0.5rem 0.75rem", borderRadius:8, cursor:"pointer", fontSize:13 };
const inputStyle = { width:"100%", padding:"0.6rem 0.75rem", borderRadius:8, border:"1px solid #ddd", fontSize:14, boxSizing:"border-box" };
const labelStyle = { display:"block", marginBottom:4, fontSize:13, fontWeight:600, color:"#444" };