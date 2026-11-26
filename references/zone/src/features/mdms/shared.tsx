import { useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, X, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { weekData, monthData } from "./data";
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`status-badge ${value === "Active" || value === "Resolved" || value === "Normal" ? "status-success" : value === "Critical" ? "status-critical" : value === "Warning" || value === "Pending" ? "status-warning" : value === "Low" ? "status-info" : "status-muted"}`}
    >
      <span className="status-dot" />
      {value}
    </span>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-input">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </Button>
      )}
    </div>
  );
}
export function FilterDropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <select
      className="form-select"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((v) => (
        <option key={v} value={v}>
          {v === "All" ? `All ${label.toLowerCase()}` : v}
        </option>
      ))}
    </select>
  );
}
export function Modal({
  title,
  description,
  open,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="mdms-modal">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? "Mangalore Zone"}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function DataTable<T>({
  rows,
  columns,
  keyOf,
  paginate = true,
}: {
  rows: T[];
  columns: { label: string; render: (row: T) => ReactNode }[];
  keyOf: (row: T) => string;
  paginate?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pages);
  const shown = paginate ? rows.slice((current - 1) * size, current * size) : rows;
  return (
    <>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.label}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={keyOf(row)}>
                {columns.map((c) => (
                  <td key={c.label}>{c.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && (
          <div className="empty-state">
            <Inbox />
            <strong>No results found</strong>
            <span>Try a different search or filter.</span>
          </div>
        )}
      </div>
      {paginate && (
        <div className="pagination">
          <span>
            Showing {rows.length ? (current - 1) * size + 1 : 0}–
            {Math.min(current * size, rows.length)} of {rows.length} results
          </span>
          <div className="pagination-controls">
            <span>Rows per page</span>
            <select
              aria-label="Rows per page"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[6, 10, 20].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft />
            </Button>
            <span>
              {current} / {pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export function ConsumptionChart({
  title = "Zone Consumption",
  subtitle = "Electricity usage across your zone",
  line = false,
  multiplier = 1,
  data: custom,
}: {
  title?: string;
  subtitle?: string;
  line?: boolean;
  multiplier?: number;
  data?: typeof weekData;
}) {
  const [range, setRange] = useState("Week");
  const data = (custom ?? (range === "Week" ? weekData : monthData)).map((d) => ({
    ...d,
    usage: Math.round(d.usage * multiplier),
    previous: Math.round(d.previous * multiplier),
  }));
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="segmented">
          {["Week", "Month"].map((v) => (
            <Button
              key={v}
              variant="ghost"
              size="sm"
              className={range === v ? "segment-active" : ""}
              onClick={() => setRange(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot current" />
          This {range.toLowerCase()}
        </span>
        <span>
          <i className="legend-dot previous" />
          Previous {range.toLowerCase()}
        </span>
        <span className="chart-unit">Consumption (kWh)</span>
      </div>
      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          {line ? (
            <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: 6,
                }}
                formatter={(v: number) => [`${v.toLocaleString()} kWh`, "Consumption"]}
              />
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="usage"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <defs>
                <linearGradient id="consumptionFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: 6,
                }}
                formatter={(v: number, name: string) => [
                  `${v.toLocaleString()} kWh`,
                  name === "usage" ? "This period" : "Previous period",
                ]}
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="previous"
                stroke="var(--chart-2)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="usage"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="url(#consumptionFill)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="chart-footer">
        <span>
          <span className="live-dot" /> Readings updated every 15 minutes
        </span>
        <span>
          <ArrowUpRight size={14} /> 12.8% vs. previous period
        </span>
      </div>
    </section>
  );
}
export function DetailGrid({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="detail-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
