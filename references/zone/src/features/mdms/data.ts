export const zone = "Mangalore Zone";
export type Meter = {
  id: string;
  owner: string;
  customerId: string;
  status: "Active" | "Deactivated";
  reading: number;
  address: string;
  installed: string;
  tariff: string;
  zone: string;
};
const names = [
  "Ananya Rao",
  "Vikram Shetty",
  "Priya Nair",
  "Arjun Kumar",
  "Sneha Pai",
  "Rohan D’Souza",
  "Meera Bhat",
  "Aditya Hegde",
  "Kavya Shenoy",
  "Nikhil Acharya",
  "Divya Kamath",
  "Rahul Nayak",
];
export const customers = names.map((name, i) => ({
  id: `CUS-${1001 + i}`,
  name,
  email: name.toLowerCase().split(" ")[0] + "@gmail.com",
  phone: `+91 9845 ${String(321000 + i * 123).slice(-6)}`,
  address: `${24 + i}, ${["Bejai", "Kadri", "Kankanady", "Hampankatta"][i % 4]}, Mangalore, Karnataka 575001`,
  status: i === 5 ? "Deactivated" : "Active",
  zone,
}));
export const meters: Meter[] = Array.from({ length: 28 }, (_, i) => {
  const c = customers[i % customers.length];
  return {
    id: `MTR-${10001 + i}`,
    owner: c?.name ?? "",
    customerId: c?.id ?? "",
    status: i % 7 === 5 ? "Deactivated" : "Active",
    reading: 1245.8 + i * 138.4,
    address: c?.address ?? "",
    installed: `2025-${String((i % 9) + 1).padStart(2, "0")}-12`,
    tariff: i % 4 === 0 ? "Commercial" : "Residential",
    zone,
  };
});
export type Alert = {
  id: string;
  meterId: string;
  customer: string;
  type: string;
  description: string;
  severity: "Critical" | "Warning" | "Low";
  date: string;
  status: "Pending" | "Resolved";
  zone: string;
};
const types = [
  "High consumption detected",
  "Meter communication failure",
  "Abnormal reading frequency",
  "Low consumption detected",
  "Meter inactive for extended period",
];
export const alerts: Alert[] = Array.from({ length: 22 }, (_, i) => ({
  id: `ALT-${2048 - i}`,
  meterId: meters[i]?.id ?? "MTR-10001",
  customer: meters[i]?.owner ?? "",
  type: types[i % 5] ?? "",
  description:
    i % 5 === 0
      ? "Energy usage exceeded the configured threshold of 300 kWh. Consumption is 38% above the previous period."
      : i % 5 === 1
        ? "The meter has not transmitted a reading in 24 hours. Check the network connection and device power."
        : "Meter activity is outside the configured normal range. Review the recent readings for this device.",
  severity: i % 5 === 0 || i % 5 === 1 ? "Critical" : i % 5 === 3 ? "Low" : "Warning",
  date: `2026-11-${String(24 - Math.floor(i / 3)).padStart(2, "0")} ${String(10 + (i % 9)).padStart(2, "0")}:30`,
  status: i < 18 ? "Pending" : "Resolved",
  zone,
}));
export const weekData = [
  { date: "Mon", usage: 14200, previous: 11200 },
  { date: "Tue", usage: 16800, previous: 13500 },
  { date: "Wed", usage: 15400, previous: 12300 },
  { date: "Thu", usage: 21400, previous: 16400 },
  { date: "Fri", usage: 18200, previous: 15100 },
  { date: "Sat", usage: 24800, previous: 19400 },
  { date: "Sun", usage: 22400, previous: 18000 },
];
export const monthData = Array.from({ length: 12 }, (_, i) => ({
  date: `Nov ${i * 2 + 1}`,
  usage: 12000 + Math.sin(i * 1.4) * 3000 + i * 750,
  previous: 10000 + Math.sin(i * 1.4) * 2200 + i * 600,
}));
export const initialSettings = { high: 300, low: 10, frequency: 60, inactive: 24 };
export function validateThresholds(values: typeof initialSettings) {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([, v]) => !Number.isFinite(v) || v <= 0)
      .map(([k]) => [k, "Enter a value greater than zero."]),
  );
}
export function validateMeter(values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const k of ["id", "owner", "address", "installed", "tariff", "reading"])
    if (!values[k]?.trim()) errors[k] = "This field is required.";
  if (values["id"] && !/^MTR-\d{5}$/.test(values["id"]))
    errors["id"] = "Use MTR- followed by five digits.";
  if (
    values["reading"] &&
    (Number(values["reading"]) < 0 || !Number.isFinite(Number(values["reading"])))
  )
    errors["reading"] = "Enter a valid non-negative reading.";
  return errors;
}
