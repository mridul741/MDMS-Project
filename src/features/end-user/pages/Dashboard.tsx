import { useEffect, useState } from "react";
import {
  getDailyConsumption,
  getMonthlyConsumption,
  getWeeklyConsumption,
} from "../services/consumptionService";
import type {
  DailyData,
  MonthlyData,
  WeeklyData,
} from "../types/consumption";

function Dashboard() {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [error, setError] = useState("");

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

  return (
    <main className="dashboard">
      <h1>MDMS Dashboard</h1>
      {error && <p className="error" role="alert">{error}</p>}

      <section>
        <h2>Daily Consumption</h2>
        {dailyData.map((item) => (
          <p key={item.id}>{item.date}: {item.units} units</p>
        ))}
      </section>

      <section>
        <h2>Weekly Consumption</h2>
        {weeklyData.map((item) => (
          <p key={item.id}>{item.week}: {item.units} units</p>
        ))}
      </section>

      <section>
        <h2>Monthly Consumption</h2>
        {monthlyData.map((item) => (
          <p key={item.id}>{item.month}: {item.units} units</p>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
