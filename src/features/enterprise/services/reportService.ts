import API from "../../../services/http";
import type { ZoneConsumption } from "../types/zoneConsumption";

export const getZoneConsumption = () =>
  API.get<ZoneConsumption[]>("/zoneConsumption");