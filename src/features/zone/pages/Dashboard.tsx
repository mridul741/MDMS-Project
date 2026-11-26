import { useEffect, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronRight, FileChartColumn, Gauge, MapPin, Plus, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable, PageHeader, StatusBadge, UsageChart } from "../components/ZoneShared";
import { getAlerts, getConsumption, getZoneStats } from "../services/zoneService";
import type { ConsumptionPoint, PaginatedResponse, ZoneAlert, ZoneStats } from "../types/zone";

export default function Dashboard() {
  const [range, setRange] = useState<"Week" | "Month">("Week");
  const [stats, setStats] = useState<ZoneStats | null>(null);
  const [chart, setChart] = useState<ConsumptionPoint[]>([]);
  const [alerts, setAlerts] = useState<ZoneAlert[]>([]);
  const [alertResult, setAlertResult] = useState<PaginatedResponse<ZoneAlert> | null>(null);
  const [loadState, setLoadState] = useState<{ range: "Week" | "Month"; error?: string } | null>(null);
  const loading = loadState?.range !== range;
  const error = loadState?.range === range ? loadState.error ?? "" : "";

  useEffect(() => {
    let active = true;
    Promise.all([
      getZoneStats(),
      getConsumption(range),
      getAlerts({ page: 1, perPage: 5, status: "Pending" }),
    ])
      .then(([statsResponse, chartResponse, alertResponse]) => {
        if (!active) return;
        setStats(statsResponse.data[0] ?? null);
        setChart(chartResponse.data);
        setAlerts(alertResponse.data.data);
        setAlertResult(alertResponse.data);
        setLoadState({ range });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ range, error: "Unable to load zone dashboard data. Confirm JSON Server is running." });
      });
    return () => { active = false; };
  }, [range]);

  const changeRange = (next: "Week" | "Month") => setRange(next);
  const displayDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <PageHeader
        title="Zone Dashboard"
        subtitle="Monitor meter performance, customer activity and electricity consumption."
        actions={<><span className="zone-chip"><MapPin size={14} /> Mangalore Zone</span><span className="zone-date-chip">{displayDate}</span></>}
      />
      {error && <p className="zone-error" role="alert">{error}</p>}
      <div className="zone-overview-label"><i /> Zone overview <span>Last updated: Today, 10:30 AM</span></div>
      <div className="zone-stats-grid">
        <article className="zone-stat-card">
          <div className="zone-stat-top"><span>Active meters</span><i className="zone-stat-icon blue"><Gauge size={20} /></i></div>
          <strong>{loading ? "—" : stats?.activeMeters.toLocaleString() ?? "0"}</strong>
          <div className="zone-stat-foot"><span className="zone-trend-up"><ArrowUpRight size={14} /> {stats?.connectivity ?? 0}%</span><span>connectivity</span><small>{stats?.totalMeters ?? 0} total</small></div>
        </article>
        <article className="zone-stat-card">
          <div className="zone-stat-top"><span>Average usage</span><i className="zone-stat-icon teal"><Zap size={20} /></i></div>
          <strong>{loading ? "—" : stats?.averageUsage ?? 0}<small> kWh</small></strong>
          <div className="zone-stat-foot"><span className="zone-trend-down"><ArrowDownRight size={14} /> {stats ? Math.abs(Math.round(((stats.averageUsage - stats.previousAverageUsage) / stats.previousAverageUsage) * 100)) : 0}%</span><span>vs. last month</span><small>previous {stats?.previousAverageUsage ?? 0} kWh</small></div>
        </article>
        <article className="zone-stat-card">
          <div className="zone-stat-top"><span>Pending alerts</span><i className="zone-stat-icon amber"><Bell size={20} /></i></div>
          <strong>{loading ? "—" : stats?.pendingAlerts ?? 0}</strong>
          <div className="zone-stat-foot"><span className="zone-critical-text">{stats?.criticalAlerts ?? 0} critical</span><span className="zone-divider" /><span>{stats?.warningAlerts ?? 0} warning</span><span className="zone-divider" /><span>{stats?.lowAlerts ?? 0} low</span></div>
        </article>
      </div>
      <div className="zone-dashboard-grid">
        {loading ? (
          <section className="zone-panel zone-chart-panel">
            <header className="zone-panel-heading">
              <div><h2>Zone consumption</h2><p>Electricity usage across Mangalore Zone</p></div>
              <div className="zone-segmented" aria-label="Consumption range">
                {(["Week", "Month"] as const).map((value) => <button key={value} type="button" className={range === value ? "active" : ""} onClick={() => changeRange(value)}>{value}</button>)}
              </div>
            </header>
            <div className="zone-chart-loading">Loading consumption…</div>
          </section>
        ) : (
          <UsageChart
            title="Zone consumption"
            subtitle="Electricity usage across Mangalore Zone"
            data={chart.map((point) => ({ label: point.label, value: point.usage, previous: point.previous }))}
            actions={<div className="zone-segmented" aria-label="Consumption range">{(["Week", "Month"] as const).map((value) => <button key={value} type="button" className={range === value ? "active" : ""} onClick={() => changeRange(value)}>{value}</button>)}</div>}
          />
        )}
        <section className="zone-panel zone-overview-card">
          <div className="zone-panel-heading"><div><h2>Zone overview</h2><p>Your assigned service area</p></div><MapPin size={18} /></div>
          <div className="zone-map-art" role="img" aria-label="Mangalore service area illustration">
            <svg viewBox="0 0 300 120" aria-hidden="true">
              <path d="M32 0 70 17 89 43 118 45 140 70 134 120H300V0Z" className="zone-map-land" />
              <path d="m42 0 41 35 28 3 35 38-5 44M99 0l7 42 39 25 6 53m45-120-25 46 32 37-8 37M233 0l-19 42 27 35-6 43M0 39l99 2 65 21 93-20M21 88l92-20 66 13 86 31" className="zone-map-road" />
              <path d="m113 26 53-11 38 32-9 42-49 14-35-32Z" className="zone-map-boundary" />
              <circle cx="160" cy="58" r="11" className="zone-map-pin" /><path d="M160 53v10m-5-5h10" className="zone-map-pin-cross" />
              <text x="177" y="62">Mangalore</text>
            </svg>
            <span><i /> Mangalore Zone</span>
          </div>
          <div className="zone-summary-list">
            <div><span>Total customers</span><strong>{stats?.customerCount ?? "—"}</strong></div>
            <div><span>Meter connectivity</span><strong className="zone-trend-up">{stats?.connectivity ?? "—"}% <Activity size={14} /></strong></div>
            <div><span>Zone status</span><StatusBadge value="Normal" /></div>
          </div>
          <div className="zone-positive-note"><i /> Readings are up to date</div>
        </section>
      </div>
      <section className="zone-quick-actions">
        <div><span className="zone-quick-icon"><Zap size={18} /></span><span><strong>Quick actions</strong><small>Keep your zone running smoothly.</small></span></div>
        <div className="zone-action-buttons">
          <Link className="zone-button zone-button-outline" to="/zone/reports"><FileChartColumn size={17} /> Generate report</Link>
          <Link className="zone-button" to="/zone/meters?add=true"><Plus size={17} /> Add meter</Link>
        </div>
      </section>
      <section className="zone-panel">
        <div className="zone-panel-heading">
          <div className="zone-panel-title"><h2>Recent alerts</h2><span className="zone-count-badge">{alertResult?.items ?? 0} pending</span></div>
          <Link className="zone-text-link" to="/zone/alerts">View all alerts <ChevronRight size={16} /></Link>
        </div>
        <DataTable
          rows={alerts}
          rowKey={(alert) => alert.id}
          result={alertResult}
          page={1}
          onPageChange={() => undefined}
          pageSize={5}
          showPagination={false}
          loading={loading}
          columns={[
            { label: "ALERT ID", render: (alert) => <span className="zone-id">{alert.id}</span> },
            { label: "METER ID", render: (alert) => <Link className="zone-text-link" to={`/zone/meters/${alert.meterId}`}>{alert.meterId}</Link> },
            { label: "DESCRIPTION", render: (alert) => <span className="zone-alert-description">{alert.type}</span> },
            { label: "SEVERITY", render: (alert) => <StatusBadge value={alert.severity} /> },
            { label: "DATE", render: (alert) => new Date(alert.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) },
            { label: "STATUS", render: (alert) => <StatusBadge value={alert.status} /> },
          ]}
        />
      </section>
    </>
  );
}
