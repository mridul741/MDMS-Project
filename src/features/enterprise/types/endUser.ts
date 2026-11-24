export type RecordStatus = "Active" | "Inactive";

export interface EndUser {
  id: string;
  name: string;
  email: string;
  zoneId: string;
  status: RecordStatus;
}