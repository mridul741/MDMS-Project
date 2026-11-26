import { useEffect, useState } from "react";
import { ArrowLeft, Gauge, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DataTable, PageHeader, StatusBadge, UsageChart } from "../components/ZoneShared";
import { getMeter, getMeterReadings } from "../services/zoneService";
import type { MeterReading, PaginatedResponse, ZoneMeter } from "../types/zone";

export default function MeterDetails() {
  const { meterId = "" } = useParams();
  const [meter, setMeter] = useState<ZoneMeter | null>(null);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [result, setResult] = useState<PaginatedResponse<MeterReading> | null>(null);
  const [loadState, setLoadState] = useState<{ meterId: string; error?: string } | null>(null);
  const loading = loadState?.meterId !== meterId;
  const error = loadState?.meterId === meterId ? loadState.error ?? "" : "";

  useEffect(() => {
    let active = true;
    Promise.all([getMeter(meterId), getMeterReadings(meterId)])
      .then(([meterResponse, readingsResponse]) => {
        if (!active) return;
        setMeter(meterResponse.data);
        setReadings(readingsResponse.data.data);
        setResult(readingsResponse.data);
        setLoadState({ meterId });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ meterId, error: "Unable to load this meter. It may not belong to Mangalore Zone." });
      })
    return () => { active = false; };
  }, [meterId]);

  return (
    <>
      <Link to="/zone/meters" className="zone-back-link"><ArrowLeft size={16} /> Back to meter management</Link>
      {error && <p className="zone-error" role="alert">{error}</p>}
      {loading && <div className="zone-page-loading">Loading meter details…</div>}
      {!loading && !error && !meter && <p className="zone-error" role="alert">Meter not found.</p>}
      {meter && (
        <>
          <PageHeader title={meter.id} subtitle={`Meter details · ${meter.ownerName} · Mangalore Zone`} actions={<StatusBadge value={meter.status} />} />
          <section className="zone-panel zone-detail-panel">
            <header className="zone-panel-heading"><div><h2>Meter information</h2><p>Registration and service details for this device.</p></div><Gauge size={19} /></header>
            <dl className="zone-detail-grid">
              <div><dt>Meter ID</dt><dd>{meter.id}</dd></div>
              <div><dt>Owner</dt><dd>{meter.ownerName}</dd></div>
              <div><dt>Installation address</dt><dd><MapPin size={14} /> {meter.address}</dd></div>
              <div><dt>Current status</dt><dd><StatusBadge value={meter.status} /></dd></div>
              <div><dt>Installation date</dt><dd>{new Date(meter.installedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
              <div><dt>Tariff category</dt><dd>{meter.tariffCategory}</dd></div>
              <div><dt>Last meter reading</dt><dd>{meter.lastReading.toLocaleString()} kWh</dd></div>
              <div><dt>Last synced</dt><dd>{new Date(meter.lastReadingAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
            </dl>
          </section>
          <UsageChart
            title="Meter consumption"
            subtitle={`Daily energy usage for ${meter.id}`}
            comparison={false}
            data={[...readings].reverse().map((reading) => ({
              label: new Date(`${reading.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
              value: reading.consumption,
            }))}
          />
          <section className="zone-panel">
            <div className="zone-panel-heading"><div><h2>Recent readings</h2><p>Latest smart meter readings and consumption.</p></div><span className="zone-muted">November 2026</span></div>
            <DataTable
              rows={readings}
              rowKey={(reading) => reading.id}
              result={result}
              page={1}
              onPageChange={() => undefined}
              loading={false}
              showPagination={false}
              columns={[
                { label: "READING DATE", render: (reading) => new Date(`${reading.date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
                { label: "METER READING", render: (reading) => `${reading.reading.toLocaleString()} kWh` },
                { label: "CONSUMPTION", render: (reading) => <strong>{reading.consumption.toFixed(1)} kWh</strong> },
                { label: "NOTES", render: (reading) => <span className="zone-muted">{reading.note}</span> },
              ]}
            />
          </section>
        </>
      )}
    </>
  );
}
