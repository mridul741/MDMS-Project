export const ZONE_ID = "zone-mangalore";

export type RecordStatus = "Active" | "Deactivated";
export type AlertSeverity = "Critical" | "Warning" | "Low";
export type AlertStatus = "Pending" | "Resolved";
export type ConsumptionRange = "Week" | "Month";

export interface ZoneUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Zone Admin" | "Customer";
  zoneId: string;
  status: RecordStatus;
  address: string;
  meterCount: number;
}

export interface MeterReading {
  id: string;
  meterId: string;
  zoneId: string;
  date: string;
  reading: number;
  consumption: number;
  note: string;
}

export interface ZoneMeter {
  id: string;
  ownerId: string;
  ownerName: string;
  zoneId: string;
  status: RecordStatus;
  lastReading: number;
  lastReadingAt: string;
  installedAt: string;
  tariffCategory: "Residential" | "Commercial" | "Industrial";
  address: string;
}

export interface ZoneAlert {
  id: string;
  meterId: string;
  customerName: string;
  zoneId: string;
  type: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
}

export interface ConsumptionPoint {
  id: string;
  zoneId: string;
  range: ConsumptionRange;
  label: string;
  date: string;
  usage: number;
  previous: number;
}

export interface ZoneSettings {
  id: string;
  zoneId: string;
  highConsumption: number;
  lowConsumption: number;
  readingFrequencyMinutes: number;
  inactiveMeterHours: number;
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface ZoneStats {
  id: string;
  zoneId: string;
  name: string;
  activeMeters: number;
  totalMeters: number;
  averageUsage: number;
  previousAverageUsage: number;
  pendingAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  lowAlerts: number;
  resolvedAlerts: number;
  customerCount: number;
  connectivity: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  first: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
  items: number;
}

export interface ListQuery {
  page: number;
  perPage: number;
  search?: string;
  status?: string;
  severity?: string;
}
