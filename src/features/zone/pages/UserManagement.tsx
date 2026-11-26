import { useEffect, useState } from "react";
import { Eye, UserRound } from "lucide-react";
import { DataTable, Modal, PageHeader, SearchField, StatusBadge } from "../components/ZoneShared";
import { getUser, getUserMeters, getUsers } from "../services/zoneService";
import type { PaginatedResponse, ZoneMeter, ZoneUser } from "../types/zone";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ZoneUser[]>([]);
  const [result, setResult] = useState<PaginatedResponse<ZoneUser> | null>(null);
  const queryKey = JSON.stringify([page, search, status]);
  const [loadState, setLoadState] = useState<{ key: string; error?: string } | null>(null);
  const loading = loadState?.key !== queryKey;
  const error = loadState?.key === queryKey ? loadState.error ?? "" : "";
  const [selected, setSelected] = useState<ZoneUser | null>(null);
  const [ownedMeters, setOwnedMeters] = useState<ZoneMeter[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let active = true;
    getUsers({ page, perPage: 10, search, status })
      .then(({ data }) => {
        if (!active) return;
        setRows(data.data);
        setResult(data);
        setLoadState({ key: queryKey });
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) setLoadState({ key: queryKey, error: "Unable to load customers. Confirm JSON Server is running." });
      })
    return () => { active = false; };
  }, [page, queryKey, search, status]);

  const viewCustomer = (customer: ZoneUser) => {
    setSelected(customer);
    setDetailLoading(true);
    setDetailError("");
    Promise.all([getUser(customer.id), getUserMeters(customer.id)])
      .then(([userResponse, meterResponse]) => {
        setSelected(userResponse.data);
        setOwnedMeters(meterResponse.data);
      })
      .catch((cause: unknown) => {
        console.error(cause);
        setDetailError("Unable to load customer details.");
      })
      .finally(() => setDetailLoading(false));
  };

  return (
    <>
      <PageHeader title="User Management" subtitle="View customers and their meters registered under Mangalore Zone." />
      {error && <p className="zone-error" role="alert">{error}</p>}
      <section className="zone-panel">
        <div className="zone-table-toolbar">
          <div><h2>Customers <span className="zone-count-badge">{result?.items ?? "—"} total</span></h2><p><UserRound size={13} /> Mangalore Zone</p></div>
          <div className="zone-table-filters">
            <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search name, ID, email..." />
            <select className="zone-select" aria-label="Filter customer status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
              <option value="All">All statuses</option><option>Active</option><option>Deactivated</option>
            </select>
          </div>
        </div>
        <DataTable
          rows={rows}
          rowKey={(customer) => customer.id}
          result={result}
          page={page}
          onPageChange={setPage}
          loading={loading}
          columns={[
            { label: "CUSTOMER ID", render: (customer) => <span className="zone-id">{customer.id}</span> },
            { label: "CUSTOMER NAME", render: (customer) => <div className="zone-person-cell"><span className="zone-small-avatar">{customer.name.split(" ").map((part) => part[0]).join("")}</span><strong>{customer.name}</strong></div> },
            { label: "EMAIL", render: (customer) => <span className="zone-muted">{customer.email}</span> },
            { label: "PHONE", render: (customer) => customer.phone },
            { label: "METERS", render: (customer) => <span className="zone-count-badge">{customer.meterCount}</span> },
            { label: "STATUS", render: (customer) => <StatusBadge value={customer.status} /> },
            { label: "ACTIONS", render: (customer) => <button type="button" className="zone-row-button" onClick={() => viewCustomer(customer)}><Eye size={15} /> View</button> },
          ]}
        />
      </section>
      <Modal title="Customer details" description="Customer profile and meters assigned in this zone." open={selected !== null} onClose={() => { setSelected(null); setOwnedMeters([]); }}>
        {detailLoading && <div className="zone-table-message">Loading customer details…</div>}
        {detailError && <p className="zone-error" role="alert">{detailError}</p>}
        {selected && !detailLoading && (
          <>
            <dl className="zone-detail-grid zone-customer-details">
              <div><dt>Customer ID</dt><dd>{selected.id}</dd></div><div><dt>Full name</dt><dd>{selected.name}</dd></div>
              <div><dt>Email</dt><dd>{selected.email}</dd></div><div><dt>Phone</dt><dd>{selected.phone}</dd></div>
              <div className="zone-form-wide"><dt>Address</dt><dd>{selected.address}</dd></div><div><dt>Account status</dt><dd><StatusBadge value={selected.status} /></dd></div>
            </dl>
            <div className="zone-modal-subheading"><h3>Owned meters</h3><span>{ownedMeters.length}</span></div>
            {ownedMeters.length === 0 ? <p className="zone-muted">No meters are currently assigned.</p> : (
              <div className="zone-owned-meters">{ownedMeters.map((meter) => <div key={meter.id}><span>{meter.id}<small>{meter.tariffCategory}</small></span><StatusBadge value={meter.status} /><strong>{meter.lastReading.toLocaleString()} kWh</strong></div>)}</div>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
