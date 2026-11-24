
import { useEffect, useMemo, useState } from "react";

import { getAlerts } from "../services/alertService";
import { getZones } from "../services/zoneService";

import type { Alert } from "../types/alert";
import type { Zone } from "../types/zone";

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAlerts(), getZones()])
      .then(([alertResponse, zoneResponse]) => {
        setAlerts(alertResponse.data);
        setZones(zoneResponse.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Unable to load alerts.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const query = search.toLowerCase();

      const matchesSearch =
        alert.id.toLowerCase().includes(query) ||
        alert.meterId.toLowerCase().includes(query) ||
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query);

      const matchesSeverity =
        severityFilter === "All" ||
        alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        alert.status === statusFilter;

      const matchesZone =
        zoneFilter === "All" ||
        alert.zoneId === zoneFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesZone
      );
    });
  }, [alerts, search, severityFilter, statusFilter, zoneFilter]);

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const openCount = alerts.filter(
    (alert) => alert.status === "Open"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  const getZoneName = (zoneId: string) =>
    zones.find((zone) => zone.id === zoneId)?.name || zoneId;

  if (loading) return <p>Loading alerts...</p>;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="enterprise-dashboard alerts-page">

      <section className="alerts-hero">
        <div>
          <span className="alerts-eyebrow">SYSTEM MONITORING</span>
          <h2>Alert Management Center</h2>
          <p>
            Monitor operational alerts and identify issues across
            all distribution zones.
          </p>
        </div>

        <div className="alerts-hero-icon">⚠</div>
      </section>

      <section className="alerts-kpi-grid">
        <article className="alert-kpi">
          <span>Total Alerts</span>
          <h3>{alerts.length}</h3>
          <small>All recorded alerts</small>
        </article>

        <article className="alert-kpi critical-kpi">
          <span>Critical Alerts</span>
          <h3>{criticalCount}</h3>
          <small>Requires attention</small>
        </article>

        <article className="alert-kpi open-kpi">
          <span>Open Alerts</span>
          <h3>{openCount}</h3>
          <small>Awaiting resolution</small>
        </article>

        <article className="alert-kpi resolved-kpi">
          <span>Resolved Alerts</span>
          <h3>{resolvedCount}</h3>
          <small>Marked as resolved</small>
        </article>
      </section>

      <section className="report-panel alerts-table-panel">

        <div className="report-panel-heading">
          <div>
            <span className="panel-eyebrow">ALERT MONITORING</span>
            <h3>All System Alerts</h3>
            <p>
              Search and filter alerts across distribution zones.
            </p>
          </div>

          <span className="record-count">
            {filteredAlerts.length} Records
          </span>
        </div>

        <div className="alerts-filters">
          <input
            type="text"
            placeholder="Search alert ID, meter or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={zoneFilter}
            onChange={(event) => setZoneFilter(event.target.value)}
          >
            <option value="All">All Zones</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value)
            }
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="zones-table alerts-table">
            <thead>
              <tr>
                <th>ALERT</th>
                <th>ZONE</th>
                <th>METER</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>DATE & TIME</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <div className="alert-title-cell">
                      <strong>{alert.title}</strong>
                      <span>{alert.id}</span>
                    </div>
                  </td>

                  <td>{getZoneName(alert.zoneId)}</td>

                  <td>{alert.meterId}</td>

                  <td>
                    <span
                      className={`severity-badge ${alert.severity.toLowerCase()}`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`alert-status ${alert.status.toLowerCase()}`}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td>
                    {new Date(alert.timestamp).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No alerts match your filters.
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

export default Alerts;
