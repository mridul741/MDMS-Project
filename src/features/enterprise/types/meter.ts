export interface Meter {
  id: string;
  meterNumber: string;
  endUserId: string;
  zoneId: string;
  type: string;
  status: "Active" | "Inactive";
}