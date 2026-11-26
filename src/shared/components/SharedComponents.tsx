import { useId, type ReactNode } from "react";
import { Inbox, Search, X } from "lucide-react";
import "./shared-components.css";

export function PageHeading({
  title,
  description,
  actions,
  className = "",
  actionsClassName = "",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  actionsClassName?: string;
}) {
  return (
    <header className={`mdms-page-heading ${className}`.trim()}>
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && (
        <div className={`mdms-page-heading-actions ${actionsClassName}`.trim()}>{actions}</div>
      )}
    </header>
  );
}

export function StatusBadge({ value, className = "mdms-status" }: {
  value: string;
  className?: string;
}) {
  const tone =
    value === "Active" || value === "Resolved" || value === "Normal"
      ? "success"
      : value === "Critical"
        ? "critical"
        : value === "Warning" || value === "Pending"
          ? "warning"
          : value === "Low"
            ? "info"
            : "muted";

  return <span className={`${className} ${className}-${tone}`}><i />{value}</span>;
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className = "mdms-search-field",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <Search size={16} aria-hidden="true" />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}
    </label>
  );
}

export function Modal({
  title,
  description,
  open,
  onClose,
  children,
  className = "mdms-modal",
  backdropClassName = "mdms-modal-backdrop",
  closeButtonClassName = "mdms-modal-close",
}: {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
  closeButtonClassName?: string;
}) {
  const titleId = useId();
  if (!open) return null;

  return (
    <div
      className={backdropClassName}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section aria-labelledby={titleId} aria-modal="true" className={className} role="dialog">
        <header>
          <div>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <button type="button" className={closeButtonClassName} aria-label="Close dialog" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mdms-section-card">
      {(title || description || actions) && (
        <header className="mdms-section-card-heading">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <article className="mdms-metric-card">
      <div className="mdms-metric-card-heading">
        <span>{label}</span>
        {icon && <span className="mdms-metric-card-icon" aria-hidden="true">{icon}</span>}
      </div>
      <strong>{value}</strong>
      {detail && <div className="mdms-metric-card-detail">{detail}</div>}
    </article>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mdms-empty-state">
      <Inbox size={25} aria-hidden="true" />
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action && <div>{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div className="mdms-loading-state" role="status">{label}</div>;
}
