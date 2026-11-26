import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, FileChartColumn } from "lucide-react";
import { DataTable, PageHeader, UsageChart } from "../components/ZoneShared";
import { getMeters, getReportReadings } from "../services/zoneService";
import type { MeterReading, PaginatedResponse, ZoneMeter } from "../types/zone";

export default function Reports() {
  const [from, setFrom] = useState("2026-11-18");
  const [to, setTo] = useState("2026-11-24");
  const [meterId, setMeterId] = useState("All");
  const [page, setPage] = useState(1);
  const [meters, setMeters] = useState<ZoneMeter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [result, setResult] = useState<PaginatedResponse<MeterReading> | null>(null);
  const [meterLoadError, setMeterLoadError] = useState("");
  const validRange = Boolean(from && to && from <= to);
  const queryKey = JSON.stringify([page, from, to, meterId]);
  const [loadState, setLoadState] = useState<{ key: string; error?: string } | null>(null);
  const loading = validRange && loadState?.key !== queryKey;
  const error = loadState?.key === queryKey ? loadState.error ?? "" : "";
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    let active = true;
    getMeters({ page: 1, perPage: 100 })
      .then(({ data }) => { if (active) setMeters(data.data); })
      .catch((cause: unknown) => {
        console.error("Unable to load meter filter options.", cause);
        if (active) setMeterLoadError("Unable to load meter filter options.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!validRange) return;
    let active = true;
    getReportReadings({ page, perPage: 10, from, to, meterId })
      .then(({ data }) => {
        if (!active) return;
        setReadings(data.data);
        setResult(data);
        setLoadState({ key: queryKey });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ key: queryKey, error: "Unable to load report readings. Confirm JSON Server is running." });
      })
    return () => { active = false; };
  }, [from, to, meterId, page, queryKey, validRange]);

  const visibleReadings = validRange ? readings : [];
  const visibleResult = validRange ? result : null;
  const pageConsumption = visibleReadings.reduce((total, reading) => total + reading.consumption, 0);

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Analyse electricity consumption and meter performance across your zone." />
      {error && <p className="zone-error" role="alert">{error}</p>}
      {meterLoadError && <p className="zone-error" role="alert">{meterLoadError}</p>}
      <section className="zone-report-filters">
        <label>From date<input type="date" value={from} max={to || undefined} onChange={(event) => { setFrom(event.target.value); setPage(1); setGenerated(false); }} /></label>
        <label>To date<input type="date" value={to} min={from || undefined} onChange={(event) => { setTo(event.target.value); setPage(1); setGenerated(false); }} /></label>
        <label>Meter<select className="zone-select" value={meterId} onChange={(event) => { setMeterId(event.target.value); setPage(1); setGenerated(false); }}><option value="All">All meters</option>{meters.map((meter) => <option key={meter.id} value={meter.id}>{meter.id} · {meter.ownerName}</option>)}</select></label>
        <button type="button" className="zone-button" disabled={!validRange} onClick={() => setGenerated(true)}><FileChartColumn size={17} /> Generate report</button>
      </section>
      {!validRange && <p className="zone-field-error">Choose a valid date range. The end date must be on or after the start date.</p>}
      {generated && <div className="zone-inline-message"><CheckCircle2 size={17} /> Report preview generated for {from} to {to}. No file was created.</div>}
      <div className="zone-report-summary">
        <article><span>{meterId === "All" ? "Readings in range" : "Meter readings in range"}</span><strong>{visibleResult?.items ?? 0}</strong></article>
        <article><span>Consumption on this page</span><strong>{pageConsumption.toFixed(1)} <small>kWh</small></strong></article>
        <article><span>Selected period</span><strong>{validRange ? Math.floor((Date.parse(to) - Date.parse(from)) / 86400000) + 1 : 0} <small>days</small></strong></article>
      </div>
      <UsageChart
        title="Energy consumption trend"
        subtitle={`Mangalore Zone · ${meterId === "All" ? "All meters" : meterId} · ${from} to ${to}`}
        comparison={false}
        data={[...visibleReadings].reverse().map((reading) => ({
          label: new Date(`${reading.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          value: reading.consumption,
        }))}
      />
      <section className="zone-panel">
        <div className="zone-panel-heading"><div><h2>Consumption summary</h2><p>Reading-level detail for the selected period.</p></div><span className="zone-muted"><CalendarDays size={14} /> {from} – {to}</span></div>
        <DataTable
          rows={visibleReadings}
          rowKey={(reading) => reading.id}
          result={visibleResult}
          page={page}
          onPageChange={setPage}
          loading={loading}
          columns={[
            { label: "METER ID", render: (reading) => <span className="zone-id">{reading.meterId}</span> },
            { label: "READING DATE", render: (reading) => new Date(`${reading.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
            { label: "METER READING", render: (reading) => `${reading.reading.toLocaleString()} kWh` },
            { label: "CONSUMPTION", render: (reading) => <strong>{reading.consumption.toFixed(1)} kWh</strong> },
            { label: "NOTES", render: (reading) => <span className="zone-muted">{reading.note}</span> },
          ]}
        />
      </section>
    </>
  );
}
