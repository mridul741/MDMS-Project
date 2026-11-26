import { useEffect, useState, type FormEvent } from "react";
import { Eye, Gauge, MoreHorizontal, Pencil, Plus, Power } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { DataTable, Modal, PageHeader, SearchField, StatusBadge } from "../components/ZoneShared";
import { getMeters, getUsers } from "../services/zoneService";
import type { PaginatedResponse, ZoneMeter, ZoneUser } from "../types/zone";

type FormMode = "add" | ZoneMeter | null;
type MeterFormValues = {
  id: string;
  ownerId: string;
  address: string;
  installedAt: string;
  tariffCategory: string;
  lastReading: string;
};

const initialValues: MeterFormValues = {
  id: "",
  ownerId: "",
  address: "",
  installedAt: "",
  tariffCategory: "",
  lastReading: "",
};

export default function MeterManagement() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormMode>(() => searchParams.get("add") === "true" ? "add" : null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ZoneMeter[]>([]);
  const [result, setResult] = useState<PaginatedResponse<ZoneMeter> | null>(null);
  const [customers, setCustomers] = useState<ZoneUser[]>([]);
  const [customerError, setCustomerError] = useState("");
  const queryKey = JSON.stringify([page, search, status]);
  const [loadState, setLoadState] = useState<{ key: string; error?: string } | null>(null);
  const loading = loadState?.key !== queryKey;
  const error = loadState?.key === queryKey ? loadState.error ?? "" : "";
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState<ZoneMeter | null>(null);

  useEffect(() => {
    let active = true;
    getMeters({ page, perPage: 10, search, status })
      .then(({ data }) => {
        if (!active) return;
        setRows(data.data);
        setResult(data);
        setLoadState({ key: queryKey });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ key: queryKey, error: "Unable to load meters. Confirm JSON Server is running." });
      })
    return () => { active = false; };
  }, [page, queryKey, search, status]);

  useEffect(() => {
    let active = true;
    getUsers({ page: 1, perPage: 100 })
      .then(({ data }) => {
        if (!active) return;
        setCustomers(data.data);
        setCustomerError("");
      })
      .catch((cause: unknown) => {
        console.error("Unable to load customers for the meter form.", cause);
        if (active) setCustomerError("Customer options could not be loaded.");
      });
    return () => { active = false; };
  }, []);

  const updateFilter = (callback: () => void) => {
    callback();
    setPage(1);
  };
  const closeForm = () => setForm(null);

  return (
    <>
      <PageHeader
        title="Meter Management"
        subtitle="Monitor and manage the smart meters assigned to Mangalore Zone."
        actions={<button type="button" className="zone-button" onClick={() => { setMessage(""); setForm("add"); }}><Plus size={17} /> Add meter</button>}
      />
      {error && <p className="zone-error" role="alert">{error}</p>}
      {message && <p className="zone-inline-message" role="status">{message}</p>}
      <section className="zone-panel">
        <div className="zone-table-toolbar">
          <div><h2>Smart meters <span className="zone-count-badge">{result?.items ?? "—"} total</span></h2><p><Gauge size={13} /> Mangalore Zone</p></div>
          <div className="zone-table-filters">
            <SearchField value={search} onChange={(value) => updateFilter(() => setSearch(value))} placeholder="Search meter ID or owner..." />
            <select className="zone-select" aria-label="Filter meter status" value={status} onChange={(event) => updateFilter(() => setStatus(event.target.value))}>
              <option value="All">All statuses</option><option>Active</option><option>Deactivated</option>
            </select>
          </div>
        </div>
        <DataTable
          rows={rows}
          rowKey={(meter) => meter.id}
          result={result}
          page={page}
          onPageChange={setPage}
          loading={loading}
          columns={[
            { label: "METER ID", render: (meter) => <Link className="zone-meter-link" to={`/zone/meters/${meter.id}`}><Gauge size={16} /> {meter.id}</Link> },
            { label: "OWNER", render: (meter) => <div className="zone-person-cell"><span className="zone-small-avatar">{meter.ownerName.split(" ").map((part) => part[0]).join("")}</span><span><strong>{meter.ownerName}</strong><small>{meter.ownerId}</small></span></div> },
            { label: "STATUS", render: (meter) => <StatusBadge value={meter.status} /> },
            { label: "LAST READING", render: (meter) => <div><strong>{meter.lastReading.toLocaleString()} <span className="zone-muted">kWh</span></strong><small className="zone-cell-subtitle">{new Date(meter.lastReadingAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</small></div> },
            { label: "ACTIONS", render: (meter) => (
              <details className="zone-row-menu">
                <summary aria-label={`Actions for ${meter.id}`}><MoreHorizontal size={19} /></summary>
                <div>
                  <Link to={`/zone/meters/${meter.id}`}><Eye size={15} /> View details</Link>
                  <button type="button" onClick={() => { setMessage(""); setForm(meter); }}><Pencil size={15} /> Edit details</button>
                  <button type="button" onClick={() => setConfirm(meter)}><Power size={15} /> {meter.status === "Active" ? "Deactivate" : "Activate"}</button>
                </div>
              </details>
            ) },
          ]}
        />
      </section>
      <MeterForm
        key={form === null ? "closed" : form === "add" ? "add" : form.id}
        mode={form}
        customers={customers}
        customerError={customerError}
        onClose={closeForm}
        onValidated={() => {
          setForm(null);
          setMessage("Meter details are valid. This Phase 1 preview does not save changes.");
        }}
      />
      <Modal title={`${confirm?.status === "Active" ? "Deactivate" : "Activate"} meter?`} description="Meter status changes are not persisted in this read-only phase." open={confirm !== null} onClose={() => setConfirm(null)}>
        <p>Confirm the status action for <strong>{confirm?.id}</strong>?</p>
        <div className="zone-form-actions"><button type="button" className="zone-button zone-button-outline" onClick={() => setConfirm(null)}>Cancel</button><button type="button" className="zone-button" onClick={() => { setMessage(`Status action previewed for ${confirm?.id}. No data was changed.`); setConfirm(null); }}>Confirm action</button></div>
      </Modal>
    </>
  );
}

function MeterForm({
  mode,
  customers,
  customerError,
  onClose,
  onValidated,
}: {
  mode: FormMode;
  customers: ZoneUser[];
  customerError: string;
  onClose: () => void;
  onValidated: () => void;
}) {
  const initial = mode && mode !== "add"
    ? {
        id: mode.id,
        ownerId: mode.ownerId,
        address: mode.address,
        installedAt: mode.installedAt,
        tariffCategory: mode.tariffCategory,
        lastReading: String(mode.lastReading),
      }
    : initialValues;
  const [values, setValues] = useState<MeterFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const edit = mode !== null && mode !== "add";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    for (const [field, value] of Object.entries(values)) {
      if (!value.trim()) next[field] = "This field is required.";
    }
    if (values.id && !/^MTR-\d{5}$/.test(values.id)) next.id = "Use MTR- followed by five digits.";
    if (values.lastReading && (!Number.isFinite(Number(values.lastReading)) || Number(values.lastReading) < 0)) {
      next.lastReading = "Enter a valid non-negative reading.";
    }
    setErrors(next);
    if (!Object.keys(next).length) onValidated();
  };

  return (
    <Modal title={edit ? "Edit meter" : "Add meter"} description="Complete the form to validate meter information. Changes are not saved." open={mode !== null} onClose={onClose}>
      <form className="zone-form" noValidate onSubmit={submit}>
        {customerError && <p className="zone-error" role="alert">{customerError}</p>}
        <div className="zone-form-grid">
          <label>Meter ID<input disabled={edit} value={values.id} onChange={(event) => setValues({ ...values, id: event.target.value })} placeholder="MTR-10029" />{errors.id && <small className="zone-field-error">{errors.id}</small>}</label>
          <label>Customer / owner<select value={values.ownerId} onChange={(event) => setValues({ ...values, ownerId: event.target.value })}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select>{errors.ownerId && <small className="zone-field-error">{errors.ownerId}</small>}</label>
          <label className="zone-form-wide">Installation address<input value={values.address} onChange={(event) => setValues({ ...values, address: event.target.value })} placeholder="Street address, Mangalore" />{errors.address && <small className="zone-field-error">{errors.address}</small>}</label>
          <label>Installed date<input type="date" value={values.installedAt} onChange={(event) => setValues({ ...values, installedAt: event.target.value })} />{errors.installedAt && <small className="zone-field-error">{errors.installedAt}</small>}</label>
          <label>Tariff category<select value={values.tariffCategory} onChange={(event) => setValues({ ...values, tariffCategory: event.target.value })}><option value="">Select category</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select>{errors.tariffCategory && <small className="zone-field-error">{errors.tariffCategory}</small>}</label>
          <label>Last reading (kWh)<input type="number" min="0" step="0.1" value={values.lastReading} onChange={(event) => setValues({ ...values, lastReading: event.target.value })} />{errors.lastReading && <small className="zone-field-error">{errors.lastReading}</small>}</label>
        </div>
        <div className="zone-form-actions"><button type="button" className="zone-button zone-button-outline" onClick={onClose}>Cancel</button><button type="submit" className="zone-button">Validate meter</button></div>
      </form>
    </Modal>
  );
}
