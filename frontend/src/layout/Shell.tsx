import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Shell() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      {/* top bar */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 18px" }}>
          <div style={{ fontWeight: 900 }}>Unified Modernization & Cybersecurity Platform — MVP</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            Frontend-only demo: separate pages per feature under each layer.
          </div>
        </div>
      </div>

      {/* body */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: 18,
          display: "grid",
          gridTemplateColumns: "270px 1fr",
          gap: 16
        }}
      >
        <Sidebar />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
