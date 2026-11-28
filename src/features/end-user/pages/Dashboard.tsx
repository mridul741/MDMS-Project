
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Current Consumption",
    value: "245.8 kWh",
    detail: "This month",
    icon: "⚡",
  },
  {
    label: "Monthly Bill",
    value: "₹1,850",
    detail: "Due: 05 Dec 2026",
    icon: "🧾",
  },
  {
    label: "Outstanding Balance",
    value: "₹1,850",
    detail: "Payment pending",
    icon: "₹",
  },
  {
    label: "Last Payment",
    value: "₹1,620",
    detail: "Paid on 05 Nov 2026",
    icon: "✓",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <section className="welcome-banner">
        <div>
          <p className="welcome-label">CUSTOMER DASHBOARD</p>
          <h1>Welcome back, Customer!</h1>
          <p>Here's an overview of your electricity usage and account.</p>
        </div>

        <div className="meter-info">
          <span>Meter information</span>
          <strong>Zone: Bangalore</strong>
          <strong>Meter ID: MTR-1001</strong>
          <span>Last synced: Today</span>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className="stat-card-top">
              <span>{stat.label}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <h2>{stat.value}</h2>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-content">
        <article className="dashboard-panel quick-actions-panel">
          <h2>Quick Actions</h2>
          <p>Access your account services</p>

          <div className="quick-actions">
            <button type="button" onClick={() => navigate("/user/bills/1")}>
              Pay Bill <span>→</span>
            </button>

            <button type="button" onClick={() => navigate("/user/bills")}>
              View Bill History <span>→</span>
            </button>

            <button type="button" onClick={() => navigate("/user/meter-data")}>
              View Detailed Usage <span>→</span>
            </button>

            <button type="button" onClick={() => navigate("/user/alerts")}>
              Manage Notifications <span>→</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
