export interface ZoneAdmin {
  id: string;
  name: string;
  email: string;
  zoneId: string;
  status: "Active" | "Inactive";
}