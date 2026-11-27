
import API from "../../../services/http";
import type { Zone } from "../types/zone";

export const getZones = () => API.get<Zone[]>("/zones");

export const getZoneById = (zoneId: string) =>
  API.get<Zone>(`/zones/${zoneId}`);
