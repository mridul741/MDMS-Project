import API from "../../../services/http";
import type { Alert } from "../types/alert";

export const getAlerts = () =>
  API.get<Alert[]>("/alerts");