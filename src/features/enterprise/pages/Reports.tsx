
import { useEffect, useMemo, useState } from "react";

import { getZoneConsumption } from "../services/reportService";
import { getZones } from "../services/zoneService";

import type { Zone } from "../types/zone";
import type {
  ConsumptionPeriod,
  ZoneConsumption,
} from "../types/zoneConsumption";

function Reports() {
  const [records, setRecords] = useState<ZoneConsumption[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [period, setPeriod] = useState<ConsumptionPeriod>("monthly");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getZoneConsumption(), getZones()])
      .then(([consumptionResponse, zoneResponse]) => {
        setRecords(consumptionResponse.data);
        setZones(zoneResponse.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Unable to load consumption reports.");
      })
      .finally(() => setLoading(false));
  }, []);

  const reportData = useMemo(() => {
    return records.map((record) => {
      const zone = zones.find((item) => item.id === record.zoneId);

      return {
        zoneId: record.zoneId,
        zoneName: zone?.name || record.zoneId,
        consumption: record[period],
      };
    });
  }, [records, zones, period]);

  const totalConsumption = reportData.reduce(
    (total, item) => total + item.consumption,
    0
  );

  const highestZone = reportData.reduce<
    (typeof reportData)[number] | null
  >(
    (highest, item) =>
      !highest || item.consumption > highest.consumption
        ? item
        : highest,
    null
  );

  const lowestZone = reportData.reduce<
    (typeof reportData)[number] | null
  >(
    (lowest, item) =>
      !lowest || item.consumption < lowest.consumption
        ? item
        : lowest,
    null
  );

  const maxConsumption = Math.max(
    ...reportData.map((item) => item.consumption),
    1
  );

  const rankedZones = [...reportData].sort(
    (a, b) => b.consumption - a.consumption
  );

  if (loading) {
    return <p>Loading consumption reports...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="enterprise-dashboard reports-page">

      {/* Page heading */}
      <section className="reports-hero">
        <div>
          <span className="reports-eyebrow">
            ENTERPRISE ANALYTICS
          </span>

          <h2>Consumption Intelligence</h2>

          <p>
            Monitor energy consumption, compare distribution zones,
            and understand consumption patterns across your network.
          </p>
        </div>

        <div className="reports-period">
          <label htmlFor="report-period">
            Reporting Period
          </label>

          <select
            id="report-period"
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as ConsumptionPeriod)
            }
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="reports-kpi-grid">

        <article className="report-kpi primary-kpi">
          <span className="kpi-icon">⚡</span>
          <p>Total Consumption</p>

          <h3>
            {totalConsumption.toLocaleString("en-IN")}
          </h3>

          <span className="kpi-unit">
            kWh · Selected period
          </span>
        </article>

        <article className="report-kpi">
          <span className="kpi-icon">↗</span>
          <p>Highest Consumption</p>

          <h3>{highestZone?.zoneName || "N/A"}</h3>

          <span className="kpi-unit">
            {highestZone
              ? `${highestZone.consumption.toLocaleString("en-IN")} kWh`
              : "No data available"}
          </span>
        </article>

        <article className="report-kpi">
          <span className="kpi-icon">↘</span>
          <p>Lowest Consumption</p>

          <h3>{lowestZone?.zoneName || "N/A"}</h3>

          <span className="kpi-unit">
            {lowestZone
              ? `${lowestZone.consumption.toLocaleString("en-IN")} kWh`
              : "No data available"}
          </span>
        </article>

        <article className="report-kpi">
          <span className="kpi-icon">▦</span>
          <p>Reporting Zones</p>

          <h3>{reportData.length}</h3>

          <span className="kpi-unit">
            Zones with consumption records
          </span>
        </article>

      </section>

      {/* Charts and Ranking */}
      <section className="reports-main-grid">

        {/* Consumption Comparison */}
        <article className="report-panel consumption-panel">

          <div className="report-panel-heading">
            <div>
              <span className="panel-eyebrow">
                PERFORMANCE OVERVIEW
              </span>

              <h3>Zone Consumption Analysis</h3>

              <p>
                Compare electricity consumption across distribution zones.
              </p>
            </div>

            <span className="chart-unit">kWh</span>
          </div>

          <div className="modern-chart">

            {reportData.length === 0 ? (
              <p className="empty-state">
                No consumption records available.
              </p>
            ) : (
              rankedZones.map((item, index) => {
                const width =
                  (item.consumption / maxConsumption) * 100;

                return (
                  <div
                    className="modern-chart-item"
                    key={item.zoneId}
                  >
                    <div className="modern-chart-label">

                      <div>
                        <span className="chart-rank">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>{item.zoneName}</strong>
                      </div>

                      <strong>
                        {item.consumption.toLocaleString("en-IN")}
                      </strong>

                    </div>

                    <div className="modern-chart-track">
                      <div
                        className="modern-chart-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </article>

        {/* Zone Ranking */}
        <article className="report-panel ranking-panel">

          <div className="report-panel-heading">
            <div>
              <span className="panel-eyebrow">
                ZONE PERFORMANCE
              </span>

              <h3>Consumption Ranking</h3>

              <p>
                Zones ranked from highest to lowest consumption.
              </p>
            </div>
          </div>

          <div className="ranking-list">

            {rankedZones.map((item, index) => (
              <div
                className="ranking-item"
                key={item.zoneId}
              >
                <div className="ranking-number">
                  {index + 1}
                </div>

                <div className="ranking-details">
                  <strong>{item.zoneName}</strong>
                  <span>{item.zoneId}</span>
                </div>

                <strong className="ranking-value">
                  {item.consumption.toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            {rankedZones.length === 0 && (
              <p className="empty-state">
                No ranking data available.
              </p>
            )}

          </div>
        </article>

      </section>

      {/* Detailed Consumption Table */}
      <section className="report-panel report-table-panel">

        <div className="report-panel-heading">
          <div>
            <span className="panel-eyebrow">
              DETAILED BREAKDOWN
            </span>

            <h3>Zone Consumption Records</h3>

            <p>
              Detailed consumption figures for the selected period.
            </p>
          </div>

          <span className="record-count">
            {reportData.length} Records
          </span>
        </div>

        <div className="table-scroll">

          <table className="zones-table modern-report-table">

            <thead>
              <tr>
                <th>ZONE</th>
                <th>ZONE ID</th>
                <th>PERIOD</th>
                <th>CONSUMPTION</th>
                <th>PERFORMANCE</th>
              </tr>
            </thead>

            <tbody>

              {rankedZones.map((item) => (
                <tr key={item.zoneId}>
                  <td>
                    <strong>{item.zoneName}</strong>
                  </td>

                  <td>{item.zoneId}</td>

                  <td>
                    <span className="period-tag">
                      {period}
                    </span>
                  </td>

                  <td>
                    <strong>
                      {item.consumption.toLocaleString("en-IN")} kWh
                    </strong>
                  </td>

                  <td>
                    <div className="table-performance-track">
                      <div
                        style={{
                          width: `${
                            (item.consumption / maxConsumption) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {rankedZones.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No consumption records found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </section>

    </div>
  );
}

export default Reports;
