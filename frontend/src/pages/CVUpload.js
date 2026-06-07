import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function CVUpload() {
  const [cv, setCv] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadCv = () => API.get("/cv/").then(r => r.data.id && setCv(r.data));
  useEffect(() => { loadCv(); }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf")) return toast.error("Only PDF files allowed");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      await API.post("/cv/upload", fd, { headers:{ "Content-Type":"multipart/form-data" }});
      toast.success("CV uploaded successfully!");
      loadCv();
    } catch { toast.error("Upload failed. Try again."); }
    setUploading(false);
  };

  return (
    <div>
      <h1 style={{ marginBottom:"1.5rem" }}>📄 My CV</h1>
      <div style={{ maxWidth:520 }}>
        {cv && (
          <div style={{ background:"white", borderRadius:12, padding:"1.25rem 1.5rem", marginBottom:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", display:"flex", alignItems:"center", gap:"1rem" }}>
            <span style={{ fontSize:36 }}>📑</span>
            <div>
              <div style={{ fontWeight:700 }}>{cv.filename}</div>
              <div style={{ color:"#888", fontSize:13 }}>Uploaded: {new Date(cv.uploaded_at).toLocaleDateString()}</div>
            </div>
            <span style={{ marginLeft:"auto", color:"#198754", fontWeight:600 }}>✅ Active</span>
          </div>
        )}
        <label style={{
          display:"block", border:"2px dashed #ccc", borderRadius:12,
          padding:"3rem 2rem", textAlign:"center", cursor:"pointer",
          background: uploading ? "#f9f9f9" : "white",
          boxShadow:"0 2px 8px rgba(0,0,0,0.07)"
        }}>
          <div style={{ fontSize:48, marginBottom:"0.75rem" }}>☁️</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>
            {uploading ? "Uploading..." : cv ? "Replace CV" : "Upload your CV"}
          </div>
          <div style={{ color:"#aaa", fontSize:13 }}>PDF only · Max 5MB</div>
          <input type="file" accept=".pdf" style={{ display:"none" }} onChange={upload} disabled={uploading} />
        </label>
        <div style={{ background:"#f8f9ff", borderRadius:12, padding:"1.25rem 1.5rem", marginTop:"1.5rem" }}>
          <h4 style={{ margin:"0 0 0.75rem 0" }}>💡 Tips for a strong CV</h4>
          <ul style={{ margin:0, paddingLeft:"1.25rem", color:"#555", fontSize:14, lineHeight:2 }}>
            <li>Keep it to 1–2 pages max</li>
            <li>Tailor it for each role you apply to</li>
            <li>Use action verbs: built, led, designed, improved</li>
            <li>Include measurable results where possible</li>
            <li>Always export as PDF before uploading</li>
          </ul>
        </div>
      </div>
    </div>
  );
}