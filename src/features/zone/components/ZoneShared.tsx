import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Modal as SharedModal,
  PageHeading,
  SearchField as SharedSearchField,
  StatusBadge as SharedStatusBadge,
} from "../../../shared/components/SharedComponents";
import type { PaginatedResponse } from "../types/zone";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <PageHeading
      title={title}
      description={subtitle}
      actions={actions}
      className="zone-page-heading"
      actionsClassName="zone-heading-actions"
    />
  );
}

export function StatusBadge({ value }: { value: string }) {
  return <SharedStatusBadge value={value} className="zone-status" />;
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return <SharedSearchField value={value} onChange={onChange} placeholder={placeholder} className="zone-search" />;
}

export function Modal({
  title,
  description,
  open,
  onClose,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <SharedModal
      title={title}
      description={description}
      open={open}
      onClose={onClose}
      className="zone-modal"
      backdropClassName="zone-modal-backdrop"
      closeButtonClassName="zone-icon-button"
    >
      {children}
    </SharedModal>
  );
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  result,
  page,
  onPageChange,
  loading,
  pageSize = 10,
  showPagination = true,
  emptyText = "No records match your filters.",
}: {
  rows: T[];
  columns: { label: string; render: (row: T) => ReactNode }[];
  rowKey: (row: T) => string;
  result: PaginatedResponse<T> | null;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  pageSize?: number;
  showPagination?: boolean;
  emptyText?: string;
}) {
  return (
    <>
      <div className="zone-table-scroll">
        <table className="zone-table">
          <thead>
            <tr>{columns.map((column) => <th key={column.label}>{column.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => <td key={column.label}>{column.render(row)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="zone-table-message">Loading records…</div>}
        {!loading && rows.length === 0 && (
          <div className="zone-empty">
            <Inbox size={25} />
            <strong>{emptyText}</strong>
            <span>Try changing the search or filters.</span>
          </div>
        )}
      </div>
      {showPagination && (
        <div className="zone-pagination">
          <span>
            Showing {result?.items ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, result?.items ?? 0)} of {result?.items ?? 0}
          </span>
          <div>
            <button
              type="button"
              className="zone-icon-button"
              aria-label="Previous page"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span>{page} / {Math.max(result?.pages ?? 0, 1)}</span>
            <button
              type="button"
              className="zone-icon-button"
              aria-label="Next page"
              disabled={loading || page >= (result?.pages ?? 1)}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export function UsageChart({
  title,
  subtitle,
  data,
  comparison = true,
  actions,
}: {
  title: string;
  subtitle: string;
  data: { label: string; value: number; previous?: number }[];
  comparison?: boolean;
  actions?: ReactNode;
}) {
  return (
    <section className="zone-panel zone-chart-panel">
      <header className="zone-panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {actions ?? <span className="zone-chart-unit">Consumption · kWh</span>}
      </header>
      <div className="zone-chart-legend">
        <span><i className="zone-legend-current" /> Current period</span>
        {comparison && <span><i className="zone-legend-previous" /> Previous period</span>}
      </div>
      <div className="zone-chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          {comparison ? (
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <defs>
                <linearGradient id="zoneUsageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--zone-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--zone-primary)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--zone-border)" strokeDasharray="4 4" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--zone-muted)", fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--zone-muted)", fontSize: 11 }} width={42} />
              <Tooltip
                contentStyle={{ background: "var(--zone-card)", borderColor: "var(--zone-border)", borderRadius: 8 }}
                formatter={(value, name) => [`${Number(value).toLocaleString()} kWh`, name === "value" ? "Current period" : "Previous period"]}
              />
              <Area isAnimationActive={false} type="monotone" dataKey="previous" stroke="var(--zone-chart-previous)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              <Area isAnimationActive={false} type="monotone" dataKey="value" stroke="var(--zone-primary)" strokeWidth={3} fill="url(#zoneUsageFill)" />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--zone-border)" strokeDasharray="4 4" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--zone-muted)", fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--zone-muted)", fontSize: 11 }} width={42} />
              <Tooltip
                contentStyle={{ background: "var(--zone-card)", borderColor: "var(--zone-border)", borderRadius: 8 }}
                formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Consumption"]}
              />
              <Line isAnimationActive={false} type="monotone" dataKey="value" stroke="var(--zone-primary)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
