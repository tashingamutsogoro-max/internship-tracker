import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Segoe UI', sans-serif" }}>
      <nav style={sidebar}>
        <div>
          <h2 style={{ color:"#e94560", marginBottom:"0.25rem", fontSize:22 }}>🎯 InternTrack</h2>
          <p style={{ color:"#aaa", fontSize:12, marginBottom:"2rem" }}>Internship Tracker</p>
          <Link to="/" style={{ ...linkStyle, background: location.pathname === "/" ? "#e94560" : "transparent" }}>📊 Dashboard</Link>
          <Link to="/applications" style={{ ...linkStyle, background: location.pathname === "/applications" ? "#e94560" : "transparent" }}>📋 Applications</Link>
          <Link to="/cv" style={{ ...linkStyle, background: location.pathname === "/cv" ? "#e94560" : "transparent" }}>📄 My CV</Link>
        </div>
        <div>
          <p style={{ color:"#aaa", fontSize:12, marginBottom:"0.5rem" }}>👋 {name}</p>
          <button onClick={logout} style={logoutBtn}>Logout</button>
        </div>
      </nav>
      <main style={{ flex:1, padding:"2rem", background:"#f0f2f5", overflowY:"auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

const sidebar = {
  width:220, background:"#1a1a2e", color:"white",
  padding:"2rem 1rem", display:"flex",
  flexDirection:"column", justifyContent:"space-between"
};
const linkStyle = {
  color:"white", textDecoration:"none", padding:"0.6rem 0.75rem",
  borderRadius:8, display:"block", marginBottom:"0.25rem", fontSize:14
};
const logoutBtn = {
  background:"#e94560", color:"white", border:"none",
  padding:"0.5rem 1rem", borderRadius:8, cursor:"pointer", width:"100%"
};