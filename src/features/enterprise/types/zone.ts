
export type ZoneStatus = "Active" | "Inactive";

export interface Zone {
  id: string;
  name: string;
  admin: string;
  location: string;
  pincode: string;
  description: string;
  meterCount: number;
  status: ZoneStatus;
}

export interface CreateZoneInput {
  name: string;
  admin: string;
  location: string;
  pincode: string;
  description: string;
}
