
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getZones } from "../services/zoneService";
import { getAllMeters } from "../services/meterService";
import { getAllEndUsers } from "../services/userService";
import { getZoneAdmins } from "../services/userService";
import { getZoneConsumption } from "../services/reportService";
import { getAlerts } from "../services/alertService";
import { getAuditLogs } from "../services/auditLogService";

import type { Zone } from "../types/zone";
import type { Meter } from "../types/meter";
import type { EndUser } from "../types/endUser";
import type { ZoneAdmin } from "../types/zoneAdmin";
import type { ZoneConsumption } from "../types/zoneConsumption";
import type { Alert } from "../types/alert";
import type { AuditLog } from "../types/auditLog";

function Dashboard() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [consumers, setConsumers] = useState<EndUser[]>([]);
  const [admins, setAdmins] = useState<ZoneAdmin[]>([]);
  const [consumption, setConsumption] = useState<ZoneConsumption[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          zoneRes,
          meterRes,
          consumerRes,
          adminRes,
          consumptionRes,
          alertRes,
          logRes,
        ] = await Promise.all([
          getZones(),
          getAllMeters(),
          getAllEndUsers(),
          getZoneAdmins(),
          getZoneConsumption(),
          getAlerts(),
          getAuditLogs(),
        ]);

        setZones(zoneRes.data);
        setMeters(meterRes.data);
        setConsumers(consumerRes.data);
        setAdmins(adminRes.data);
        setConsumption(consumptionRes.data);
        setAlerts(alertRes.data);
        setLogs(logRes.data);
      } catch {
        setError("Unable to load dashboard data. Please check JSON Server.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeMeters = meters.filter((m) => m.status === "Active").length;
  const inactiveMeters = meters.length - activeMeters;

  const activeConsumers = consumers.filter(
    (u) => u.status === "Active"
  ).length;

  const activeAdmins = admins.filter(
    (u) => u.status === "Active"
  ).length;

  const openAlerts = alerts.filter((a) => a.status === "Open");
  const criticalAlerts = alerts.filter(
    (a) => a.severity === "Critical" && a.status !== "Resolved"
  );

  const monthlyTotal = consumption.reduce(
    (sum, item) => sum + item.monthly,
    0
  );

  const highestZone = [...consumption].sort(
    (a, b) => b.monthly - a.monthly
  )[0];

  const lowestZone = [...consumption].sort(
    (a, b) => a.monthly - b.monthly
  )[0];

  const getZoneName = (zoneId: string) =>
    zones.find((z) => z.id === zoneId)?.name ?? zoneId;

  const formatNumber = (value: number) =>
    value.toLocaleString("en-IN");

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const recentAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  const recentLogs = [...logs]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  const sortedConsumption = [...consumption].sort(
    (a, b) => b.monthly - a.monthly
  );

  const maxConsumption = Math.max(
    ...sortedConsumption.map((item) => item.monthly),
    1
  );

  if (loading) {
    return <div className="page-loading">Loading enterprise overview...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="command-dashboard">
      <section className="command-hero">
        <div>
          <span className="command-eyebrow">ENTERPRISE CONTROL CENTER</span>
          <h2>Good day, Enterprise Admin</h2>
          <p>
            Here's an overview of your electricity distribution operations.
          </p>
        </div>

        <div className="command-date">
          <span>REPORTING PERIOD</span>
          <strong>{new Date().toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}</strong>
        </div>
      </section>

      <section className="command-kpis">
        <Link to="/enterprise/zones" className="command-kpi">
          <div className="command-kpi-top">
            <span className="command-kpi-icon blue">⌖</span>
            <span className="command-kpi-label">ZONE NETWORK</span>
          </div>
          <strong>{zones.length}</strong>
          <span className="command-kpi-caption">
            Distribution zones managed
          </span>
        </Link>

        <Link to="/enterprise/meters" className="command-kpi">
          <div className="command-kpi-top">
            <span className="command-kpi-icon purple">▤</span>
            <span className="command-kpi-label">METER NETWORK</span>
          </div>
          <strong>{formatNumber(meters.length)}</strong>
          <span className="command-kpi-caption">
            {activeMeters} active · {inactiveMeters} inactive
          </span>
        </Link>

        <Link to="/enterprise/users" className="command-kpi">
          <div className="command-kpi-top">
            <span className="command-kpi-icon green">♙</span>
            <span className="command-kpi-label">CONSUMERS</span>
          </div>
          <strong>{formatNumber(consumers.length)}</strong>
          <span className="command-kpi-caption">
            {activeConsumers} active consumers
          </span>
        </Link>

        <Link to="/enterprise/alerts" className="command-kpi">
          <div className="command-kpi-top">
            <span className="command-kpi-icon red">⚠</span>
            <span className="command-kpi-label">OPEN ALERTS</span>
          </div>
          <strong>{openAlerts.length}</strong>
          <span className="command-kpi-caption">
            {criticalAlerts.length} unresolved critical alerts
          </span>
        </Link>
      </section>

      <section className="command-analytics-grid">
        <div className="command-panel consumption-panel">
          <div className="command-panel-heading">
            <div>
              <span className="command-section-label">ENERGY ANALYTICS</span>
              <h3>Zone Consumption</h3>
              <p>Monthly consumption across distribution zones</p>
            </div>
            <Link to="/enterprise/reports">View reports →</Link>
          </div>

          <div className="consumption-total">
            <strong>{formatNumber(monthlyTotal)}</strong>
            <span>kWh total monthly consumption</span>
          </div>

          <div className="command-bars">
            {sortedConsumption.map((item, index) => (
              <div className="command-bar-row" key={item.id}>
                <div className="command-bar-label">
                  <span>{getZoneName(item.zoneId)}</span>
                  <strong>{formatNumber(item.monthly)} kWh</strong>
                </div>
                <div className="command-bar-track">
                  <div
                    className={`command-bar-fill bar-${index % 4}`}
                    style={{
                      width: `${(item.monthly / maxConsumption) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {sortedConsumption.length === 0 && (
              <p className="command-empty">No consumption data available.</p>
            )}
          </div>

          <div className="consumption-insights">
            <div>
              <span>Highest consumption</span>
              <strong>
                {highestZone ? getZoneName(highestZone.zoneId) : "—"}
              </strong>
            </div>
            <div>
              <span>Lowest consumption</span>
              <strong>
                {lowestZone ? getZoneName(lowestZone.zoneId) : "—"}
              </strong>
            </div>
          </div>
        </div>

        <div className="command-panel health-panel">
          <div className="command-panel-heading">
            <div>
              <span className="command-section-label">SYSTEM HEALTH</span>
              <h3>Operational Status</h3>
              <p>Current status of registered resources</p>
            </div>
          </div>

          <div className="health-metric">
            <div className="health-metric-heading">
              <span>Active meters</span>
              <strong>{activeMeters}/{meters.length}</strong>
            </div>
            <div className="health-track">
              <div
                className="health-fill green-fill"
                style={{
                  width: `${meters.length ? (activeMeters / meters.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="health-metric">
            <div className="health-metric-heading">
              <span>Active consumers</span>
              <strong>{activeConsumers}/{consumers.length}</strong>
            </div>
            <div className="health-track">
              <div
                className="health-fill blue-fill"
                style={{
                  width: `${consumers.length ? (activeConsumers / consumers.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="health-metric">
            <div className="health-metric-heading">
              <span>Active zone admins</span>
              <strong>{activeAdmins}/{admins.length}</strong>
            </div>
            <div className="health-track">
              <div
                className="health-fill purple-fill"
                style={{
                  width: `${admins.length ? (activeAdmins / admins.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="health-footer">
            <span className="health-live-dot" />
            Data loaded from configured API endpoints
          </div>
        </div>
      </section>

      <section className="command-lower-grid">
        <div className="command-panel">
          <div className="command-panel-heading">
            <div>
              <span className="command-section-label">ATTENTION REQUIRED</span>
              <h3>Recent Alerts</h3>
              <p>Latest meter and network notifications</p>
            </div>
            <Link to="/enterprise/alerts">View all →</Link>
          </div>

          <div className="command-list">
            {recentAlerts.map((alert) => (
              <div className="command-list-item" key={alert.id}>
                <span
                  className={`command-severity ${alert.severity.toLowerCase()}`}
                />
                <div className="command-list-content">
                  <strong>{alert.title}</strong>
                  <span>
                    {alert.meterId} · {getZoneName(alert.zoneId)}
                  </span>
                </div>
                <div className="command-list-meta">
                  <span
                    className={`command-alert-status ${alert.status.toLowerCase()}`}
                  >
                    {alert.status}
                  </span>
                  <small>{formatDate(alert.timestamp)}</small>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="command-empty">No alerts available.</p>
            )}
          </div>
        </div>

        <div className="command-panel">
          <div className="command-panel-heading">
            <div>
              <span className="command-section-label">ZONE MANAGEMENT</span>
              <h3>Zone Overview</h3>
              <p>Distribution coverage and meter allocation</p>
            </div>
            <Link to="/enterprise/zones">View all →</Link>
          </div>

          <div className="command-list">
            {zones.map((zone) => {
              const zoneMeters = meters.filter(
                (meter) => meter.zoneId === zone.id
              ).length;

              return (
                <Link
                  to={`/enterprise/zones/${zone.id}`}
                  className="command-zone-item"
                  key={zone.id}
                >
                  <div className="command-zone-avatar">
                    {zone.name.charAt(0)}
                  </div>
                  <div className="command-list-content">
                    <strong>{zone.name}</strong>
                    <span>{zone.id} · {zone.admin}</span>
                  </div>
                  <div className="command-list-meta">
                    <strong>{zoneMeters} meters</strong>
                    <span className={`zone-state ${zone.status.toLowerCase()}`}>
                      {zone.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="command-panel activity-panel">
        <div className="command-panel-heading">
          <div>
            <span className="command-section-label">SYSTEM MONITORING</span>
            <h3>Recent Activity</h3>
            <p>Latest recorded events from the audit log</p>
          </div>
          <Link to="/enterprise/audit-logs">View audit logs →</Link>
        </div>

        <div className="activity-table-wrap">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>LOG ID</th>
                <th>USER</th>
                <th>ACTION</th>
                <th>RESOURCE</th>
                <th>TIME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>
                    <span className={`audit-status ${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="command-empty">
                    No activity records available.
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

export default Dashboard;
