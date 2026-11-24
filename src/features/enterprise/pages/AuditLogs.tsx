import { useEffect, useMemo, useState } from "react";
import { getAuditLogs } from "../services/auditLogService";
import type { AuditLog } from "../types/auditLog";

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await getAuditLogs();
        setLogs(response.data);
        setError("");
      } catch {
        setError("Unable to load audit logs. Please check JSON Server.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const users = useMemo(
    () => [...new Set(logs.map((log) => log.user))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        log.id.toLowerCase().includes(searchText) ||
        log.user.toLowerCase().includes(searchText) ||
        log.action.toLowerCase().includes(searchText) ||
        log.resource.toLowerCase().includes(searchText);

      const matchesUser =
        userFilter === "All" || log.user === userFilter;

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      const matchesDate =
        !dateFilter || log.timestamp.startsWith(dateFilter);

      return (
        matchesSearch &&
        matchesUser &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [logs, search, userFilter, statusFilter, dateFilter]);

  const successCount = logs.filter(
    (log) => log.status === "Success"
  ).length;

  const failedCount = logs.filter(
    (log) => log.status === "Failed"
  ).length;

  const uniqueUserCount = users.length;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="page-loading">Loading audit logs...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="audit-page">
      <section className="audit-hero">
        <div>
          <span className="audit-eyebrow">SECURITY & MONITORING</span>
          <h2>Audit Logs</h2>
          <p>
            Monitor user activities and review system access history
            across the enterprise.
          </p>
        </div>

        <div className="audit-hero-icon">⌁</div>
      </section>

      <section className="audit-kpi-grid">
        <div className="audit-kpi">
          <span>Total Activities</span>
          <strong>{logs.length}</strong>
          <small>Recorded events</small>
        </div>

        <div className="audit-kpi">
          <span>Successful Activities</span>
          <strong>{successCount}</strong>
          <small>Completed successfully</small>
        </div>

        <div className="audit-kpi">
          <span>Failed Activities</span>
          <strong>{failedCount}</strong>
          <small>Unsuccessful events</small>
        </div>

        <div className="audit-kpi">
          <span>Unique Users</span>
          <strong>{uniqueUserCount}</strong>
          <small>Users in this log dataset</small>
        </div>
      </section>

      <section className="audit-table-panel">
        <div className="audit-panel-heading">
          <div>
            <h3>Activity History</h3>
            <p>Review and filter recorded system activities.</p>
          </div>
          <span className="audit-record-count">
            {filteredLogs.length} records
          </span>
        </div>

        <div className="audit-filters">
          <input
            type="text"
            placeholder="Search ID, user, action or resource..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
          >
            <option value="All">All Users</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />

          <button
            type="button"
            className="audit-reset-button"
            onClick={() => {
              setSearch("");
              setUserFilter("All");
              setStatusFilter("All");
              setDateFilter("");
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-container">
          <table className="enterprise-table audit-table">
            <thead>
              <tr>
                <th>LOG ID</th>
                <th>TIMESTAMP</th>
                <th>USER</th>
                <th>ACTION</th>
                <th>RESOURCE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="audit-log-id">{log.id}</td>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>{log.user}</td>
                  <td>
                    <span className="audit-action">{log.action}</span>
                  </td>
                  <td>{log.resource}</td>
                  <td>
                    <span
                      className={`audit-status ${
                        log.status === "Success" ? "success" : "failed"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-table-message">
                    No audit records match your filters.
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

export default AuditLogs;