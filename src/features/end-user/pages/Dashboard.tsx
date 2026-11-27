import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

import {
  getDailyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "../services/consumptionService";

import type { DailyData, MonthlyData, WeeklyData } from "../types/consumption";

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
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    Promise.all([
      getDailyConsumption(),
      getWeeklyConsumption(),
      getMonthlyConsumption(),
    ])
      .then(([daily, weekly, monthly]) => {
        setDailyData(daily.data);
        setWeeklyData(weekly.data);
        setMonthlyData(monthly.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Unable to load consumption data. Is JSON Server running?");
      });
  }, []);

  const chartData =
    period === "day"
      ? dailyData.map((item) => ({
          label: item.date,
          value: item.units,
        }))
      : period === "month"
        ? monthlyData.map((item) => ({
            label: item.month,
            value: item.units,
          }))
        : weeklyData.map((item) => ({
            label: item.week,
            value: item.units,
          }));

  const maxConsumption = Math.max(...chartData.map((item) => item.value), 1);

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

            <select
              aria-label="Consumption period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          {error && <p role="alert">{error}</p>}

          <div className="chart">
            {chartData.map((item) => (
              <div className="chart-column" key={item.label}>
                <span className="chart-value">{item.value}</span>
                <div className="chart-bar-area">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(item.value / maxConsumption) * 100}%`,
                    }}
                  />
                </div>
                <span className="chart-label">{item.label}</span>
              </div>
            ))}
          </div>

          {!error && chartData.length === 0 && (
            <p>No consumption data available.</p>
          )}

          <p className="chart-note">Consumption shown in kWh</p>
        </article>

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
