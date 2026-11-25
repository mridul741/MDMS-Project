import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { DataTable, Modal, PageHeader, StatusBadge } from "../components/ZoneShared";
import { getAlerts, getZoneStats } from "../services/zoneService";
import type { PaginatedResponse, ZoneAlert, ZoneStats } from "../types/zone";

export default function Alerts() {
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState<ZoneAlert[]>([]);
  const [result, setResult] = useState<PaginatedResponse<ZoneAlert> | null>(null);
  const [stats, setStats] = useState<ZoneStats | null>(null);
  const [selected, setSelected] = useState<ZoneAlert | null>(null);
  const queryKey = JSON.stringify([page, severity, status]);
  const [loadState, setLoadState] = useState<{ key: string; error?: string } | null>(null);
  const loading = loadState?.key !== queryKey;
  const error = loadState?.key === queryKey ? loadState.error ?? "" : "";

  useEffect(() => {
    let active = true;
    getAlerts({ page, perPage: 10, status, severity })
      .then(({ data }) => {
        if (!active) return;
        setAlerts(data.data);
        setResult(data);
        setLoadState({ key: queryKey });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ key: queryKey, error: "Unable to load alerts. Confirm JSON Server is running." });
      })
    return () => { active = false; };
  }, [page, queryKey, severity, status]);

  useEffect(() => {
    let active = true;
    getZoneStats()
      .then(({ data }) => { if (active) setStats(data[0] ?? null); })
      .catch((cause: unknown) => console.error("Unable to load alert summary.", cause));
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeader title="Alerts & Notifications" subtitle="Review abnormal meter activity and consumption alerts in Mangalore Zone." />
      {error && <p className="zone-error" role="alert">{error}</p>}
      <div className="zone-alert-summary">
        <article><i className="zone-stat-icon red"><Bell size={19} /></i><span><strong>{stats?.criticalAlerts ?? "—"}</strong><small>Critical alerts</small></span></article>
        <article><i className="zone-stat-icon amber"><Bell size={19} /></i><span><strong>{stats?.warningAlerts ?? "—"}</strong><small>Warnings</small></span></article>
        <article><i className="zone-stat-icon blue"><Bell size={19} /></i><span><strong>{stats?.lowAlerts ?? "—"}</strong><small>Low priority</small></span></article>
        <article><i className="zone-stat-icon teal"><CheckCircle2 size={19} /></i><span><strong>{stats?.resolvedAlerts ?? "—"}</strong><small>Resolved</small></span></article>
      </div>
      <section className="zone-panel">
        <div className="zone-table-toolbar">
          <div><h2>Zone alerts <span className="zone-count-badge">{result?.items ?? "—"}</span></h2><p>Recent meter events in Mangalore Zone</p></div>
          <div className="zone-table-filters">
            <select className="zone-select" aria-label="Filter alert severity" value={severity} onChange={(event) => { setSeverity(event.target.value); setPage(1); }}><option value="All">All severities</option><option>Critical</option><option>Warning</option><option>Low</option></select>
            <select className="zone-select" aria-label="Filter alert status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="All">All statuses</option><option>Pending</option><option>Resolved</option></select>
          </div>
        </div>
        <DataTable
          rows={alerts}
          rowKey={(alert) => alert.id}
          result={result}
          page={page}
          onPageChange={setPage}
          loading={loading}
          columns={[
            { label: "ALERT ID", render: (alert) => <span className="zone-id">{alert.id}</span> },
            { label: "METER / CUSTOMER", render: (alert) => <div><strong>{alert.meterId}</strong><small className="zone-cell-subtitle">{alert.customerName}</small></div> },
            { label: "ALERT TYPE", render: (alert) => alert.type },
            { label: "SEVERITY", render: (alert) => <StatusBadge value={alert.severity} /> },
            { label: "DATE & TIME", render: (alert) => new Date(alert.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) },
            { label: "STATUS", render: (alert) => <StatusBadge value={alert.status} /> },
            { label: "DETAILS", render: (alert) => <button type="button" className="zone-row-button" onClick={() => setSelected(alert)}>View</button> },
          ]}
        />
      </section>
      <Modal title="Alert details" description="Meter event details for Mangalore Zone." open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <dl className="zone-detail-grid zone-customer-details">
              <div><dt>Alert ID</dt><dd>{selected.id}</dd></div><div><dt>Meter ID</dt><dd>{selected.meterId}</dd></div>
              <div><dt>Customer</dt><dd>{selected.customerName}</dd></div><div><dt>Severity</dt><dd><StatusBadge value={selected.severity} /></dd></div>
              <div><dt>Date & time</dt><dd>{new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd></div><div><dt>Status</dt><dd><StatusBadge value={selected.status} /></dd></div>
            </dl>
            <div className="zone-alert-description"><h3>{selected.type}</h3><p>{selected.description}</p></div>
          </>
        )}
      </Modal>
    </>
  );
}
