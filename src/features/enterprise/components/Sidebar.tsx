
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/enterprise/dashboard", icon: "▦" },
  { label: "Zones", path: "/enterprise/zones", icon: "⌖" },
  { label: "Meters", path: "/enterprise/meters", icon: "▤" },
  { label: "Users", path: "/enterprise/users", icon: "♙" },
  { label: "Reports", path: "/enterprise/reports", icon: "▥" },
  { label: "Alerts", path: "/enterprise/alerts", icon: "⚠" },
  { label: "Audit Logs", path: "/enterprise/audit-logs", icon: "☷" },
  { label: "Settings", path: "/enterprise/settings", icon: "⚙" },
];

function Sidebar() {
  return (
    <aside className="enterprise-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">M</div>
        <div>
          <h2>MDMS</h2>
          <span>Management System</span>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        Enterprise Portal
      </div>
    </aside>
  );
}

export default Sidebar;
