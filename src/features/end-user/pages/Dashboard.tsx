import "./Dashboard.css";

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

const consumption = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 60 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 70 },
];

function Dashboard() {
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
        <article className="dashboard-panel consumption-panel">
          <div className="panel-heading">
            <div>
              <h2>Energy Consumption</h2>
              <p>Track your electricity usage</p>
            </div>

            <select aria-label="Consumption period" defaultValue="week">
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="chart">
            {consumption.map((item) => (
              <div className="chart-column" key={item.day}>
                <span className="chart-value">{item.value}</span>
                <div className="chart-bar-area">
                  <div
                    className="chart-bar"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="chart-label">{item.day}</span>
              </div>
            ))}
          </div>

          <p className="chart-note">Consumption shown in kWh</p>
        </article>

        <article className="dashboard-panel quick-actions-panel">
          <h2>Quick Actions</h2>
          <p>Access your account services</p>

          <div className="quick-actions">
            <button type="button">
              Pay Bill <span>→</span>
            </button>
            <button type="button">
              View Bill History <span>→</span>
            </button>
            <button type="button">
              View Detailed Usage <span>→</span>
            </button>
            <button type="button">
              Manage Notifications <span>→</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
