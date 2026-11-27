
import "./MeterData.css";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MeterReading = {
  date: string;
  reading: number;
  consumption: number;
};

const readings: MeterReading[] = [
  { date: "01 Nov 2026", reading: 1250, consumption: 8 },
  { date: "05 Nov 2026", reading: 1290, consumption: 10 },
  { date: "10 Nov 2026", reading: 1345, consumption: 12 },
  { date: "15 Nov 2026", reading: 1390, consumption: 9 },
  { date: "20 Nov 2026", reading: 1445, consumption: 11 },
  { date: "25 Nov 2026", reading: 1495, consumption: 10 },
  { date: "30 Nov 2026", reading: 1525, consumption: 7 },
];

function MeterData() {
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");

  const filteredReadings = readings.filter((item) => {
    const [day, month, year] = item.date.split(" ");
    const date = `${year}-${{
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    }[month]}-${day}`;

    return date >= startDate && date <= endDate;
  });

  const totalConsumption = filteredReadings.reduce(
    (total, item) => total + item.consumption,
    0
  );

  return (
    <div className="meter-data-page">
      <div className="meter-data-header">
        <div>
          <h1>Meter Data</h1>
          <p>Monitor your electricity consumption and meter readings.</p>
        </div>
      </div>

      <section className="meter-data-filters">
        <div>
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </section>

      <section className="meter-data-summary">
        <div>
          <p>Total Consumption</p>
          <h2>{totalConsumption} kWh</h2>
        </div>
        <div>
          <p>Number of Readings</p>
          <h2>{filteredReadings.length}</h2>
        </div>
      </section>

      <section className="meter-chart-card">
        <h2>Electricity Consumption</h2>
        <p>Consumption recorded during the selected period.</p>

        {filteredReadings.length > 0 ? (
          <div className="meter-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredReadings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  name="Consumption (kWh)"
                  stroke="#aa3bff"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="meter-empty">No readings found for this date range.</p>
        )}
      </section>

      <section className="meter-readings-card">
        <h2>Meter Readings</h2>

        <div className="meter-table-container">
          <table className="meter-readings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meter Reading (kWh)</th>
                <th>Consumption (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.length > 0 ? (
                filteredReadings.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{item.reading}</td>
                    <td>{item.consumption}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No readings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="meter-demo-note">
        Sample meter readings for the Phase 1 prototype.
      </p>
    </div>
  );
}

export default MeterData;
