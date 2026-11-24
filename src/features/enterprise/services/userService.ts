import API from "../../../services/http";
import type { ZoneAdmin } from "../types/zoneAdmin";
import type { EndUser } from "../types/endUser";

export const getZoneAdmins = () =>
  API.get<ZoneAdmin[]>("/zoneAdmins");

export const getAllEndUsers = () =>
  API.get<EndUser[]>("/endUsers");