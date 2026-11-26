import API from "../../../services/http";
import type { Meter } from "../types/meter";

export const getMetersByZone = (zoneId: string) =>
  API.get<Meter[]>(`/meters?zoneId=${zoneId}`);

export const getAllMeters = () =>
  API.get<Meter[]>("/meters");