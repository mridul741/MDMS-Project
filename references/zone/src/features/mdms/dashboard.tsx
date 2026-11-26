import { Link } from "@tanstack/react-router";
import {
  Gauge,
  Zap,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileChartColumn,
  MapPin,
  ChevronRight,
  CalendarDays,
  CircleCheck,
  TriangleAlert,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, ConsumptionChart, StatusBadge, DataTable } from "./shared";
import { alerts } from "./data";
export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Zone Dashboard"
        subtitle="Monitor meter performance, customer activity and electricity consumption."
      >
        <span className="zone-chip">
          <MapPin size={14} />
          Mangalore Zone
        </span>
        <span className="date-chip">
          <CalendarDays size={15} />
          24 November, 2026
        </span>
      </PageHeader>
      <div className="overview-label">
        <span className="live-dot" /> Zone overview <span>Last updated: Today, 10:30 AM</span>
      </div>
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span>Active Meters</span>
            <span className="stat-icon blue">
              <Gauge size={21} />
            </span>
          </div>
          <div className="stat-value">
            2,450
            <span className="mini-spark blue-spark">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="stat-bottom">
            <span className="trend-up">
              <ArrowUpRight size={14} /> 8.2%
            </span>
            <span>vs. last month</span>
            <span className="stat-total">of 2,520 total</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-top">
            <span>Average Usage</span>
            <span className="stat-icon teal">
              <Zap size={21} />
            </span>
          </div>
          <div className="stat-value">
            185 <small>kWh</small>
            <span className="mini-spark teal-spark">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="stat-bottom">
            <span className="trend-up">
              <ArrowDownRight size={14} /> 4.6%
            </span>
            <span>vs. 194 kWh last month</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-top">
            <span>Pending Alerts</span>
            <span className="stat-icon amber">
              <Bell size={21} />
            </span>
          </div>
          <div className="stat-value">
            18
            <span className="alert-stat">
              <TriangleAlert size={15} /> Needs attention
            </span>
          </div>
          <div className="stat-bottom">
            <span className="critical-text">6 critical</span>
            <span className="tiny-divider" />
            <span>9 warning</span>
            <span className="tiny-divider" />
            <span>3 low priority</span>
          </div>
        </article>
      </div>
      <div className="dashboard-middle">
        <ConsumptionChart />
        <section className="panel zone-summary">
          <div className="panel-heading">
            <div>
              <h2>Zone Overview</h2>
              <p>Your assigned service area</p>
            </div>
            <MapPin size={19} />
          </div>
          <div className="zone-map">
            <svg viewBox="0 0 300 116" role="img" aria-label="Mangalore service zone map">
              <path className="map-land" d="M45 0L70 20 75 36 98 47 94 70 118 84 129 116H300V0Z" />
              <path
                className="map-road"
                d="M91 0L110 25 101 54 133 77 142 116M65 38L155 42 212 19 275 31M109 63L202 66 258 95M167 0L170 42 190 77 186 116M246 0L231 45 249 79 236 116"
              />
              <path className="map-zone" d="M112 26L166 18 207 46 198 86 142 95 115 64Z" />
              <circle cx="158" cy="57" r="12" className="map-marker" />
              <path d="M158 51V63M152 57H164" className="map-marker-inner" />
              <text x="177" y="59" className="map-label">
                Mangalore
              </text>
            </svg>
            <span>
              <span className="live-dot" /> Mangalore Zone
            </span>
          </div>
          <div className="zone-summary-rows">
            <div>
              <span>Total customers</span>
              <strong>1,824</strong>
            </div>
            <div>
              <span>Meter connectivity</span>
              <strong className="trend-up">
                97.2% <Activity size={14} />
              </strong>
            </div>
            <div>
              <span>Zone status</span>
              <StatusBadge value="Normal" />
            </div>
          </div>
          <div className="zone-bottom">
            <CircleCheck size={16} />
            <span>All readings are up to date</span>
          </div>
        </section>
      </div>
      <section className="quick-actions">
        <div className="quick-label">
          <span className="quick-icon">
            <Zap size={19} />
          </span>
          <div>
            <h2>Quick Actions</h2>
            <p>Keep your zone running smoothly.</p>
          </div>
        </div>
        <div>
          <Button variant="outline" asChild>
            <Link to="/zone/reports">
              <FileChartColumn />
              Generate Report
              <ArrowUpRight />
            </Link>
          </Button>
          <Button asChild>
            <Link to="/zone/meters" search={{ add: true }}>
              <Plus />
              Add Meter
            </Link>
          </Button>
        </div>
      </section>
      <section className="panel recent-alerts">
        <div className="panel-heading">
          <div className="section-title">
            <h2>Recent Alerts</h2>
            <span className="count-badge">18 pending</span>
          </div>
          <Button variant="link" asChild>
            <Link to="/zone/alerts">
              View all alerts
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <DataTable
          rows={alerts.slice(0, 4)}
          keyOf={(a) => a.id}
          paginate={false}
          columns={[
            { label: "ALERT ID", render: (a) => <span className="id-text">{a.id}</span> },
            {
              label: "METER ID",
              render: (a) => (
                <Link
                  className="meter-link"
                  to="/zone/meters/$meterId"
                  params={{ meterId: a.meterId }}
                >
                  {a.meterId}
                </Link>
              ),
            },
            {
              label: "DESCRIPTION",
              render: (a) => (
                <span className="alert-description">
                  <span
                    className={`alert-type-icon ${a.severity === "Critical" ? "critical-text" : "warning-text"}`}
                  >
                    <TriangleAlert size={15} />
                  </span>
                  {a.type}
                </span>
              ),
            },
            { label: "SEVERITY", render: (a) => <StatusBadge value={a.severity} /> },
            { label: "DATE", render: (a) => <span className="muted-cell">24 Nov, 2026</span> },
            { label: "STATUS", render: (a) => <StatusBadge value={a.status} /> },
            {
              label: "",
              render: (a) => (
                <Button variant="ghost" size="icon" asChild aria-label={`View ${a.id}`}>
                  <Link to="/zone/alerts">
                    <ChevronRight />
                  </Link>
                </Button>
              ),
            },
          ]}
        />
      </section>
    </>
  );
}
