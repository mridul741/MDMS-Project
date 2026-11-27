import API from "../../../services/http";
import type { EndUser } from "../types/endUser";

export const getEndUsersByZone = (zoneId: string) =>
  API.get<EndUser[]>(`/endUsers?zoneId=${zoneId}`);