export type AlertSeverity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

export type AlertStatus =
  | "Open"
  | "Acknowledged"
  | "Resolved";

export interface Alert {
  id: string;
  meterId: string;
  zoneId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
}