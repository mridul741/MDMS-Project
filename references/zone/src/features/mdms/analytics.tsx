import { useState } from "react";
import {
  FileChartColumn,
  CalendarDays,
  CheckCircle2,
  Bell,
  Mail,
  Smartphone,
  SlidersHorizontal,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  FilterDropdown,
  Modal,
  DetailGrid,
  ConsumptionChart,
} from "./shared";
import {
  meters,
  alerts,
  weekData,
  monthData,
  initialSettings,
  validateThresholds,
  type Alert,
} from "./data";
export function Reports() {
  const [meter, setMeter] = useState("All");
  const [start, setStart] = useState("2026-11-01");
  const [end, setEnd] = useState("2026-11-24");
  const [generated, setGenerated] = useState(false);
  const valid = Boolean(start && end && start <= end);
  const rows = meters.filter((m) => meter === "All" || m.id === meter);
  const periodDays = valid ? Math.floor((Date.parse(end) - Date.parse(start)) / 86400000) + 1 : 0;
  const data = (periodDays <= 7 ? weekData : monthData).map((d, i) => ({
    ...d,
    date: valid
      ? new Date(
          Date.parse(start) + Math.floor((i * periodDays) / (periodDays <= 7 ? 7 : 12)) * 86400000,
        ).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
      : d.date,
  }));
  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Analyse electricity consumption trends and meter performance in your zone."
      />
      <section className="report-filters">
        <label className="form-field">
          From date
          <input
            aria-label="From date"
            type="date"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setGenerated(false);
            }}
          />
        </label>
        <label className="form-field">
          To date
          <input
            aria-label="To date"
            type="date"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              setGenerated(false);
            }}
          />
        </label>
        <label className="form-field">
          Meter
          <FilterDropdown
            label="Meters"
            options={["All", ...meters.map((m) => m.id)]}
            value={meter}
            onChange={(v) => {
              setMeter(v);
              setGenerated(false);
            }}
          />
        </label>
        <Button
          onClick={() => {
            if (!valid) {
              toast.error(
                "Choose a valid date range. The end date must be on or after the start date.",
              );
              return;
            }
            setGenerated(true);
            toast.success("Report preview generated. No file or backend report was created.");
          }}
        >
          <FileChartColumn />
          Generate Report
        </Button>
      </section>
      {!valid && <p className="field-error">Choose a valid start and end date.</p>}
      {generated && (
        <div className="inline-success">
          <CheckCircle2 size={17} /> Report preview · {start} to {end} · {rows.length} meters
        </div>
      )}
      <div className="report-summary">
        <div>
          <span>Total Consumption</span>
          <strong>
            {Math.round((rows.length * 185 * periodDays) / 24).toLocaleString()} <small>kWh</small>
          </strong>
        </div>
        <div>
          <span>Average per Meter</span>
          <strong>
            {Math.round((185 * periodDays) / 24)} <small>kWh</small>
          </strong>
        </div>
        <div>
          <span>Reporting Period</span>
          <strong>
            {periodDays} <small>days</small>
          </strong>
        </div>
      </div>
      <ConsumptionChart
        title="Energy Consumption Trend"
        subtitle={`Mangalore Zone · ${meter === "All" ? "All meters" : meter} · ${start} to ${end}`}
        line
        data={data}
        multiplier={rows.length / meters.length}
      />
      <section className="panel">
        <div className="panel-heading">
          <h2>Consumption Summary</h2>
          <span className="muted-cell">
            <CalendarDays size={14} /> Selected period
          </span>
        </div>
        <DataTable
          rows={rows}
          keyOf={(m) => m.id}
          columns={[
            { label: "METER ID", render: (m) => <span className="id-text">{m.id}</span> },
            { label: "CUSTOMER NAME", render: (m) => m.owner },
            {
              label: "TOTAL CONSUMPTION",
              render: (m) =>
                `${(((185 + Number(m.id.slice(-2)) * 2) * periodDays) / 24).toFixed(1)} kWh`,
            },
            {
              label: "AVERAGE CONSUMPTION",
              render: (m) => `${((185 + Number(m.id.slice(-2)) * 2) / 24).toFixed(1)} kWh / day`,
            },
            { label: "READING PERIOD", render: () => `${start} – ${end}` },
          ]}
        />
      </section>
    </>
  );
}
export function Alerts() {
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<Alert | null>(null);
  const rows = alerts.filter(
    (a) =>
      (severity === "All" || a.severity === severity) && (status === "All" || a.status === status),
  );
  return (
    <>
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Monitor abnormal meter activity and consumption alerts in your zone."
      />
      <div className="alert-summary">
        <div>
          <span className="stat-icon red">
            <Bell size={20} />
          </span>
          <div>
            <strong>6</strong>
            <span>Critical alerts</span>
          </div>
        </div>
        <div>
          <span className="stat-icon amber">
            <Bell size={20} />
          </span>
          <div>
            <strong>9</strong>
            <span>Warnings</span>
          </div>
        </div>
        <div>
          <span className="stat-icon blue">
            <Bell size={20} />
          </span>
          <div>
            <strong>3</strong>
            <span>Low priority</span>
          </div>
        </div>
        <div>
          <span className="stat-icon teal">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <strong>4</strong>
            <span>Resolved</span>
          </div>
        </div>
      </div>
      <section className="panel">
        <div className="table-toolbar">
          <div>
            <h2>
              Zone alerts <span className="count-badge">{rows.length}</span>
            </h2>
            <p>Recent meter events in Mangalore Zone</p>
          </div>
          <div className="table-filters">
            <FilterDropdown
              label="Severity"
              value={severity}
              onChange={setSeverity}
              options={["All", "Critical", "Warning", "Low"]}
            />
            <FilterDropdown
              label="Status"
              value={status}
              onChange={setStatus}
              options={["All", "Pending", "Resolved"]}
            />
          </div>
        </div>
        <DataTable
          rows={rows}
          keyOf={(a) => a.id}
          columns={[
            { label: "ALERT ID", render: (a) => <span className="id-text">{a.id}</span> },
            {
              label: "METER / CUSTOMER",
              render: (a) => (
                <div>
                  <strong>{a.meterId}</strong>
                  <small className="cell-subtitle">{a.customer}</small>
                </div>
              ),
            },
            { label: "ALERT TYPE", render: (a) => a.type },
            { label: "SEVERITY", render: (a) => <StatusBadge value={a.severity} /> },
            { label: "DATE & TIME", render: (a) => <span className="muted-cell">{a.date}</span> },
            { label: "STATUS", render: (a) => <StatusBadge value={a.status} /> },
            {
              label: "",
              render: (a) => (
                <Button variant="ghost" size="sm" onClick={() => setSelected(a)}>
                  View Details
                </Button>
              ),
            },
          ]}
        />
      </section>
      <Modal title="Alert Details" open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DetailGrid
              items={[
                ["Alert ID", selected.id],
                ["Meter ID", selected.meterId],
                ["Customer", selected.customer],
                ["Severity", <StatusBadge value={selected.severity} />],
                ["Date & time", selected.date],
                ["Current status", <StatusBadge value={selected.status} />],
              ]}
            />
            <div className="alert-detail-description">
              <h3>{selected.type}</h3>
              <p>{selected.description}</p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
export function ZoneSettings() {
  const [values, setValues] = useState(initialSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState({ email: true, sms: false, inapp: true });
  const fields = [
    {
      key: "high",
      label: "High Consumption Threshold",
      unit: "kWh",
      hint: "Trigger an alert when consumption exceeds this value.",
    },
    {
      key: "low",
      label: "Low Consumption Threshold",
      unit: "kWh",
      hint: "Trigger an alert when consumption falls below this value.",
    },
    {
      key: "frequency",
      label: "Abnormal Reading Frequency",
      unit: "minutes",
      hint: "Maximum expected interval between meter readings.",
    },
    {
      key: "inactive",
      label: "Inactive Meter Duration",
      unit: "hours",
      hint: "Trigger an alert after this period without a reading.",
    },
  ] as const;
  return (
    <>
      <PageHeader
        title="Zone Settings"
        subtitle="Configure alert thresholds and notification preferences for your zone."
      />
      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div className="section-title">
              <span className="stat-icon blue">
                <SlidersHorizontal size={20} />
              </span>
              <div>
                <h2>Alert Threshold Configuration</h2>
                <p>Set the normal operating range for your meters.</p>
              </div>
            </div>
          </div>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const next = validateThresholds(values);
              if (!next["high"] && !next["low"] && values.low >= values.high)
                next["low"] = "Low threshold must be less than high threshold.";
              setErrors(next);
              if (!Object.keys(next).length)
                toast.success("Settings validated. No settings were saved.");
            }}
          >
            <div className="settings-fields">
              {fields.map((f) => (
                <label className="form-field" key={f.key}>
                  {f.label}
                  <span className="field-hint">{f.hint}</span>
                  <div className="unit-input">
                    <input
                      aria-label={f.label}
                      type="number"
                      value={Number.isNaN(values[f.key]) ? "" : values[f.key]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [f.key]: e.target.value === "" ? NaN : Number(e.target.value),
                        })
                      }
                    />
                    <span>{f.unit}</span>
                  </div>
                  <span className="field-error">{errors[f.key]}</span>
                </label>
              ))}
            </div>
            <div className="settings-save">
              <span>Validation only · No changes are persisted</span>
              <Button type="submit">
                <Save />
                Save Settings
              </Button>
            </div>
          </form>
        </section>
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div className="section-title">
              <span className="stat-icon teal">
                <Bell size={20} />
              </span>
              <div>
                <h2>Notification Preferences</h2>
                <p>Choose how you receive zone notifications.</p>
              </div>
            </div>
          </div>
          <div className="preference-list">
            {[
              {
                key: "email",
                label: "Email Notifications",
                hint: "Receive alerts in your email inbox.",
                icon: Mail,
              },
              {
                key: "sms",
                label: "SMS Notifications",
                hint: "Receive critical alerts on your phone.",
                icon: Smartphone,
              },
              {
                key: "inapp",
                label: "In-App Notifications",
                hint: "See alerts in the notification centre.",
                icon: Bell,
              },
            ].map((p) => (
              <div className="preference-row" key={p.key}>
                <p.icon size={20} />
                <div>
                  <strong>{p.label}</strong>
                  <span>{p.hint}</span>
                </div>
                <Switch
                  aria-label={p.label}
                  checked={prefs[p.key as keyof typeof prefs]}
                  onCheckedChange={(v) => setPrefs({ ...prefs, [p.key]: v })}
                />
              </div>
            ))}
          </div>
          <div className="settings-save">
            <span>Sample preferences</span>
            <Button
              onClick={() =>
                toast.success(
                  "Preferences previewed. No notifications will be sent or settings saved.",
                )
              }
            >
              <Save />
              Save Preferences
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
