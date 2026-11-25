import API from "../../../services/http";
import {
  ZONE_ID,
  type ConsumptionPoint,
  type ListQuery,
  type MeterReading,
  type PaginatedResponse,
  type ZoneAlert,
  type ZoneMeter,
  type ZoneSettings,
  type ZoneStats,
  type ZoneUser,
} from "../types/zone";

type JsonServerWhere = Record<string, unknown>;

function listParams(query: ListQuery, filters: JsonServerWhere[]) {
  const where: JsonServerWhere = { zoneId: { eq: ZONE_ID } };
  for (const filter of filters) Object.assign(where, filter);

  if (query.status && query.status !== "All") {
    where["status"] = { eq: query.status };
  }
  if (query.severity && query.severity !== "All") {
    where["severity"] = { eq: query.severity };
  }
  if (query.search?.trim()) {
    const search = query.search.trim();
    where["or"] = [
      { id: { contains: search } },
      { ownerName: { contains: search } },
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { customerName: { contains: search } },
      { meterId: { contains: search } },
    ];
  }

  return {
    _where: JSON.stringify(where),
    _page: query.page,
    _per_page: query.perPage,
    _sort: "-id",
  };
}

export const getZoneStats = () =>
  API.get<ZoneStats[]>("/zoneStats", { params: { zoneId: ZONE_ID } });

export const getConsumption = (range: "Week" | "Month") =>
  API.get<ConsumptionPoint[]>("/zoneConsumption", {
    params: { zoneId: ZONE_ID, range, _sort: "date" },
  });

export const getMeters = (query: ListQuery) =>
  API.get<PaginatedResponse<ZoneMeter>>("/meters", {
    params: listParams(query, []),
  });

export const getMeter = async (meterId: string) => {
  const response = await API.get<ZoneMeter>(`/meters/${encodeURIComponent(meterId)}`);
  if (response.data.zoneId !== ZONE_ID) {
    throw new Error(`Meter ${meterId} is not assigned to Mangalore Zone.`);
  }
  return response;
};

export const getMeterReadings = (meterId: string, page = 1, perPage = 10) =>
  API.get<PaginatedResponse<MeterReading>>("/meterReadings", {
    params: {
      _where: JSON.stringify({
        zoneId: { eq: ZONE_ID },
        meterId: { eq: meterId },
      }),
      _page: page,
      _per_page: perPage,
      _sort: "-date",
    },
  });

export const getUsers = (query: ListQuery) =>
  API.get<PaginatedResponse<ZoneUser>>("/users", {
    params: listParams(query, [{ role: { eq: "Customer" } }]),
  });

export const getUser = async (userId: string) => {
  const response = await API.get<ZoneUser>(`/users/${encodeURIComponent(userId)}`);
  if (response.data.zoneId !== ZONE_ID || response.data.role !== "Customer") {
    throw new Error(`Customer ${userId} is not assigned to Mangalore Zone.`);
  }
  return response;
};

export const getUserMeters = (userId: string) =>
  API.get<ZoneMeter[]>("/meters", {
    params: {
      _where: JSON.stringify({
        zoneId: { eq: ZONE_ID },
        ownerId: { eq: userId },
      }),
      _sort: "id",
    },
  });

export const getAlerts = (query: ListQuery) =>
  API.get<PaginatedResponse<ZoneAlert>>("/alerts", {
    params: listParams(query, []),
  });

export const getReportReadings = (query: ListQuery & { from: string; to: string; meterId: string }) =>
  API.get<PaginatedResponse<MeterReading>>("/meterReadings", {
    params: {
      _where: JSON.stringify({
        zoneId: { eq: ZONE_ID },
        date: { gte: query.from, lte: query.to },
        ...(query.meterId === "All" ? {} : { meterId: { eq: query.meterId } }),
      }),
      _page: query.page,
      _per_page: query.perPage,
      _sort: "-date",
    },
  });

export const getZoneSettings = () =>
  API.get<ZoneSettings[]>("/zoneSettings", { params: { zoneId: ZONE_ID } });
