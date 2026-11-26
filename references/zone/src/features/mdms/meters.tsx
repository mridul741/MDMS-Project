import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, MoreHorizontal, Eye, Pencil, Power, ArrowLeft, Gauge, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  PageHeader,
  DataTable,
  SearchInput,
  FilterDropdown,
  StatusBadge,
  Modal,
  DetailGrid,
  ConsumptionChart,
} from "./shared";
import { meters, customers, validateMeter, type Meter } from "./data";
export function MeterManagement({ initialAdd = false }: { initialAdd?: boolean }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState<Meter | "add" | null>(initialAdd ? "add" : null);
  const [confirm, setConfirm] = useState<{ meter: Meter; action: string } | null>(null);
  const rows = meters.filter(
    (m) =>
      (m.id + " " + m.owner).toLowerCase().includes(search.toLowerCase()) &&
      (status === "All" || m.status === status),
  );
  return (
    <>
      <PageHeader
        title="Meter Management"
        subtitle="Monitor and manage all smart meters assigned to your zone."
      >
        <Button onClick={() => setForm("add")}>
          <Plus />
          Add Meter
        </Button>
      </PageHeader>
      <section className="panel">
        <div className="table-toolbar">
          <div>
            <h2>
              Smart meters <span className="count-badge">2,520 total</span>
            </h2>
            <p>
              <MapPin size={13} /> Mangalore Zone
            </p>
          </div>
          <div className="table-filters">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search meter ID or owner..."
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
          keyOf={(m) => m.id}
          columns={[
            {
              label: "METER ID",
              render: (m) => (
                <Link
                  className="meter-link meter-id"
                  to="/zone/meters/$meterId"
                  params={{ meterId: m.id }}
                >
                  <Gauge size={17} />
                  {m.id}
                </Link>
              ),
            },
            {
              label: "OWNER",
              render: (m) => (
                <div className="person-cell">
                  <span className="small-avatar">
                    {m.owner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{m.owner}</strong>
                    <small>{m.customerId}</small>
                  </div>
                </div>
              ),
            },
            { label: "STATUS", render: (m) => <StatusBadge value={m.status} /> },
            {
              label: "LAST READING",
              render: (m) => (
                <div>
                  <strong>
                    {m.reading.toLocaleString(undefined, { maximumFractionDigits: 1 })}{" "}
                    <span className="muted-cell">kWh</span>
                  </strong>
                  <small className="cell-subtitle">24 Nov 2026, 10:30 AM</small>
                </div>
              ),
            },
            {
              label: "ACTIONS",
              render: (m) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${m.id}`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/zone/meters/$meterId" params={{ meterId: m.id }}>
                        <Eye />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setForm(m)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    {["Activate", "Deactivate"].map((action) => (
                      <DropdownMenuItem
                        key={action}
                        onSelect={() => setConfirm({ meter: m, action })}
                      >
                        <Power />
                        {action}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
        />
      </section>
      <MeterForm
        open={form !== null}
        meter={form && form !== "add" ? form : null}
        onClose={() => setForm(null)}
      />
      <Modal
        title={`${confirm?.action ?? ""} meter`}
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        description="Read-only prototype — device status will not change."
      >
        <p>
          Confirm {confirm?.action.toLowerCase()} for <strong>{confirm?.meter.id}</strong>?
        </p>
        <div className="form-actions">
          <Button variant="outline" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast.info("Action previewed. No meter status was changed.");
              setConfirm(null);
            }}
          >
            Confirm {confirm?.action}
          </Button>
        </div>
      </Modal>
    </>
  );
}
function MeterForm({
  open,
  meter,
  onClose,
}: {
  open: boolean;
  meter: Meter | null;
  onClose: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Modal
      title={meter ? "Edit Meter" : "Add Meter"}
      description="Validate meter information. Changes are not saved in this prototype."
      open={open}
      onClose={() => {
        setErrors({});
        onClose();
      }}
    >
      <form
        key={meter?.id ?? "new"}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const values = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
            string,
            string
          >;
          const found = validateMeter(values);
          setErrors(found);
          if (!Object.keys(found).length) {
            toast.success("Meter information validated. No changes have been saved.");
            onClose();
          }
        }}
      >
        <div className="form-grid">
          {[
            { name: "id", label: "Meter ID", value: meter?.id ?? "", placeholder: "MTR-10029" },
            {
              name: "owner",
              label: "Customer / Owner",
              value: meter?.customerId ?? "",
              select: customers.map((c) => ({ value: c.id, label: c.name })),
            },
            {
              name: "address",
              label: "Installation Address",
              value: meter?.address ?? "",
              placeholder: "Street address, Mangalore",
            },
            {
              name: "installed",
              label: "Installed Date",
              value: meter?.installed ?? "",
              type: "date",
            },
            {
              name: "tariff",
              label: "Tariff Category",
              value: meter?.tariff ?? "",
              select: ["Residential", "Commercial", "Industrial"].map((v) => ({
                value: v,
                label: v,
              })),
            },
            {
              name: "reading",
              label: "Initial Reading (kWh)",
              value: meter?.reading ?? "",
              type: "number",
            },
          ].map((f) => (
            <label className="form-field" key={f.name}>
              {f.label}
              {f.select ? (
                <select name={f.name} defaultValue={f.value} className="form-select">
                  <option value="">Select {f.name === "owner" ? "customer" : "category"}</option>
                  {f.select.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={f.name}
                  type={f.type ?? "text"}
                  defaultValue={f.value}
                  placeholder={f.placeholder}
                  min={f.type === "number" ? 0 : undefined}
                  step={f.type === "number" ? "0.1" : undefined}
                />
              )}
              <span className="field-error">{errors[f.name]}</span>
            </label>
          ))}
        </div>
        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Validate Meter</Button>
        </div>
      </form>
    </Modal>
  );
}
export function MeterDetails({ meterId }: { meterId: string }) {
  const meter = meters.find((m) => m.id === meterId);
  if (!meter)
    return (
      <>
        <PageHeader
          title="Meter not found"
          subtitle="This meter is not assigned to Mangalore Zone."
        />
        <Button asChild>
          <Link to="/zone/meters">
            <ArrowLeft />
            Back to Meter Management
          </Link>
        </Button>
      </>
    );
  return (
    <>
      <Button variant="link" asChild className="back-link">
        <Link to="/zone/meters">
          <ArrowLeft />
          Back to Meter Management
        </Link>
      </Button>
      <PageHeader title={meter.id} subtitle={`Meter details · ${meter.owner} · Mangalore Zone`}>
        <StatusBadge value={meter.status} />
      </PageHeader>
      <section className="panel detail-panel">
        <h2>Meter Information</h2>
        <DetailGrid
          items={[
            ["Meter ID", meter.id],
            ["Owner", meter.owner],
            ["Address", meter.address],
            ["Current status", <StatusBadge value={meter.status} />],
            ["Installation date", meter.installed],
            ["Tariff category", meter.tariff],
            ["Last reading", `${meter.reading.toLocaleString()} kWh`],
          ]}
        />
      </section>
      <ConsumptionChart
        title="Meter Consumption"
        subtitle={`Daily energy usage for ${meter.id}`}
        multiplier={0.0024}
      />
      <section className="panel">
        <div className="panel-heading">
          <h2>Recent Readings</h2>
          <span className="muted-cell">November 2026</span>
        </div>
        <DataTable
          rows={Array.from({ length: 10 }, (_, i) => ({
            date: `${24 - i} Nov 2026`,
            time: "10:30 AM",
            reading: meter.reading - i * 6.8,
            consumption: Math.round((6.8 + Math.sin(i) * 2) * 10) / 10,
          }))}
          keyOf={(r) => r.date}
          columns={[
            { label: "READING DATE", render: (r) => r.date },
            { label: "READING TIME", render: (r) => r.time },
            { label: "METER READING", render: (r) => `${r.reading.toFixed(1)} kWh` },
            { label: "CONSUMPTION (kWh)", render: (r) => r.consumption },
          ]}
        />
      </section>
    </>
  );
}
