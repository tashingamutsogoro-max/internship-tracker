import { useState, useEffect } from "react";
import API from "../api";

const STATUS_COLORS = {
  Saved:"#6c757d", Applied:"#0d6efd",
  Interview:"#fd7e14", Offer:"#198754", Rejected:"#dc3545"
};

export default function Dashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => { API.get("/applications/").then(r => setApps(r.data)); }, []);

  const counts = ["Saved","Applied","Interview","Offer","Rejected"].map(s => ({
    status: s, count: apps.filter(a => a.status === s).length
  }));

  return (
    <div>
      <h1 style={{ marginBottom:"1.5rem" }}>📊 Dashboard</h1>
      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2rem" }}>
        <div style={{ ...statCard, borderTop:"4px solid #e94560" }}>
          <div style={{ fontSize:32, fontWeight:"bold" }}>{apps.length}</div>
          <div style={{ color:"#666", fontSize:14 }}>Total Applications</div>
        </div>
        {counts.map(c => (
          <div key={c.status} style={{ ...statCard, borderTop:`4px solid ${STATUS_COLORS[c.status]}` }}>
            <div style={{ fontSize:32, fontWeight:"bold" }}>{c.count}</div>
            <div style={{ color:"#666", fontSize:14 }}>{c.status}</div>
          </div>
        ))}
      </div>
      <h2 style={{ marginBottom:"1rem" }}>Recent Applications</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
        {apps.slice(0, 5).map(a => (
          <div key={a.id} style={appRow}>
            <div>
              <strong>{a.company_name}</strong>
              <span style={{ color:"#666", marginLeft:10 }}>{a.role_title}</span>
              {a.location && <span style={{ color:"#aaa", marginLeft:10, fontSize:13 }}>📍 {a.location}</span>}
            </div>
            <span style={{ ...badge, background: STATUS_COLORS[a.status] }}>{a.status}</span>
          </div>
        ))}
        {apps.length === 0 && (
          <p style={{ color:"#aaa", textAlign:"center", padding:"2rem" }}>
            No applications yet. Head to Applications to add your first one!
          </p>
        )}
      </div>
    </div>
  );
}

const statCard = { background:"white", borderRadius:12, padding:"1.25rem 1.5rem", minWidth:130, boxShadow:"0 2px 8px rgba(0,0,0,0.07)" };
const appRow = { background:"white", borderRadius:10, padding:"1rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" };
const badge = { color:"white", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 };