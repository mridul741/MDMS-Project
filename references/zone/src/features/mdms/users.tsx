import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customers, meters } from "./data";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  SearchInput,
  FilterDropdown,
  Modal,
  DetailGrid,
} from "./shared";
export function UserManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<(typeof customers)[number] | null>(null);
  const rows = customers.filter(
    (c) =>
      (c.name + " " + c.id + " " + c.email).toLowerCase().includes(search.toLowerCase()) &&
      (status === "All" || c.status === status),
  );
  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="View and manage customers registered under Mangalore Zone."
      />
      <section className="panel">
        <div className="table-toolbar">
          <div>
            <h2>
              Customers <span className="count-badge">1,824 total</span>
            </h2>
            <p>
              <MapPin size={13} /> Mangalore Zone
            </p>
          </div>
          <div className="table-filters">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search name, ID or email..."
            />
            <FilterDropdown
              label="Status"
              value={status}
              onChange={setStatus}
              options={["All", "Active", "Deactivated"]}
            />
          </div>
        </div>
        <DataTable
          rows={rows}
          keyOf={(c) => c.id}
          columns={[
            { label: "CUSTOMER ID", render: (c) => <span className="id-text">{c.id}</span> },
            { label: "CUSTOMER NAME", render: (c) => <strong>{c.name}</strong> },
            { label: "EMAIL", render: (c) => <span className="muted-cell">{c.email}</span> },
            { label: "PHONE", render: (c) => c.phone },
            {
              label: "METERS",
              render: (c) => (
                <span className="count-badge">
                  {meters.filter((m) => m.customerId === c.id).length}
                </span>
              ),
            },
            { label: "STATUS", render: (c) => <StatusBadge value={c.status} /> },
            {
              label: "ACTIONS",
              render: (c) => (
                <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>
                  <Eye />
                  View
                </Button>
              ),
            },
          ]}
        />
      </section>
      <Modal title="Customer Details" open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DetailGrid
              items={[
                ["Customer ID", selected.id],
                ["Full name", selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Address", selected.address],
                ["Account status", <StatusBadge value={selected.status} />],
              ]}
            />
            <h2>Owned meters</h2>
            <DataTable
              rows={meters.filter((m) => m.customerId === selected.id)}
              keyOf={(m) => m.id}
              paginate={false}
              columns={[
                {
                  label: "METER ID",
                  render: (m) => (
                    <Link
                      className="meter-link"
                      to="/zone/meters/$meterId"
                      params={{ meterId: m.id }}
                    >
                      {m.id}
                    </Link>
                  ),
                },
                { label: "STATUS", render: (m) => <StatusBadge value={m.status} /> },
                { label: "LAST READING", render: (m) => `${m.reading.toFixed(1)} kWh` },
              ]}
            />
          </>
        )}
      </Modal>
    </>
  );
}
