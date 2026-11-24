import API from "../../../services/http";
import type { AuditLog } from "../types/auditLog";

export const getAuditLogs = () =>
  API.get<AuditLog[]>("/auditLogs");