export type AuditLogStatus = "Success" | "Failed";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: AuditLogStatus;
}