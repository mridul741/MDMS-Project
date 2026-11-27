export type ConsumptionPeriod = "daily" | "weekly" | "monthly";

export interface ZoneConsumption {
  id: string;
  zoneId: string;
  daily: number;
  weekly: number;
  monthly: number;
}