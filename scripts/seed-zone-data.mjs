import { readFileSync, writeFileSync } from "node:fs";

const databasePath = new URL("../db.json", import.meta.url);
const database = JSON.parse(readFileSync(databasePath, "utf8"));
const zoneId = "zone-mangalore";
const zoneName = "Mangalore Zone";
const customers = [
  "Ananya Rao",
  "Vikram Shetty",
  "Priya Nair",
  "Arjun Kumar",
  "Sneha Pai",
  "Rohan D'Souza",
  "Meera Bhat",
  "Aditya Hegde",
  "Kavya Shenoy",
  "Nikhil Acharya",
  "Divya Kamath",
  "Rahul Nayak",
];
const localities = ["Bejai", "Kadri", "Kankanady", "Hampankatta"];
const users = [
  {
    id: "zone-admin-mangalore",
    name: "Rahul Sharma",
    email: "rahul.sharma@mdms.in",
    phone: "+91 98450 32100",
    role: "Zone Admin",
    zoneId,
    status: "Active",
    address: "Mangalore, Karnataka 575001",
    meterCount: 0,
  },
  ...customers.map((name, index) => ({
    id: `customer-${1001 + index}`,
    name,
    email: `${name.toLowerCase().split(" ")[0]}@gmail.com`,
    phone: `+91 9845 ${String(321000 + index * 123).slice(-6)}`,
    role: "Customer",
    zoneId,
    status: index === 5 ? "Deactivated" : "Active",
    address: `${24 + index}, ${localities[index % localities.length]}, Mangalore, Karnataka 575001`,
    meterCount: index < 3 ? 2 : 1,
  })),
];
const meters = Array.from({ length: 15 }, (_, index) => {
  const ownerIndex = index < 6 ? Math.floor(index / 2) : index - 3;
  const owner = users[ownerIndex + 1];
  const id = `MTR-${10001 + index}`;
  const lastReading = Number((1245.8 + index * 138.4).toFixed(1));
  return {
    id,
    ownerId: owner.id,
    ownerName: owner.name,
    zoneId,
    status: index % 7 === 5 ? "Deactivated" : "Active",
    lastReading,
    lastReadingAt: "2026-11-24T10:30:00+05:30",
    installedAt: `2025-${String((index % 9) + 1).padStart(2, "0")}-12`,
    tariffCategory: index % 4 === 0 ? "Commercial" : "Residential",
    address: owner.address,
  };
});

for (const user of users.slice(1)) {
  user.meterCount = meters.filter((meter) => meter.ownerId === user.id).length;
}

const meterReadings = meters.flatMap((meter, meterIndex) =>
  Array.from({ length: 7 }, (_, readingIndex) => {
    const day = 24 - readingIndex;
    const consumption = Number((5.2 + ((meterIndex * 7 + readingIndex * 3) % 46) / 10).toFixed(1));
    return {
      id: `${meter.id}-2026-11-${String(day).padStart(2, "0")}`,
      meterId: meter.id,
      zoneId,
      date: `2026-11-${String(day).padStart(2, "0")}`,
      reading: Number((meter.lastReading - readingIndex * consumption).toFixed(1)),
      consumption,
      note: readingIndex === 0 ? "Scheduled smart reading" : "Regular reading",
    };
  }),
);

const alerts = Array.from({ length: 20 }, (_, index) => {
  const meter = meters[index % meters.length];
  const types = [
    "High consumption detected",
    "Meter communication failure",
    "Abnormal reading frequency",
    "Low consumption detected",
    "Meter inactive for extended period",
  ];
  const severity = index % 5 === 0 || index % 5 === 1
    ? "Critical"
    : index % 5 === 3
      ? "Low"
      : "Warning";
  return {
    id: `ALT-${2048 - index}`,
    meterId: meter.id,
    customerName: meter.ownerName,
    zoneId,
    type: types[index % types.length],
    description:
      severity === "Critical"
        ? "Meter activity requires prompt review. Check the latest reading and device connectivity."
        : "The latest meter readings are outside the configured operating range.",
    severity,
    status: index < 15 ? "Pending" : "Resolved",
    createdAt: `2026-11-${String(24 - Math.floor(index / 3)).padStart(2, "0")}T${String(10 + (index % 9)).padStart(2, "0")}:30:00+05:30`,
  };
});

const zoneConsumption = [
  ...[
    ["Mon", 142, 128],
    ["Tue", 168, 141],
    ["Wed", 154, 137],
    ["Thu", 214, 176],
    ["Fri", 182, 159],
    ["Sat", 248, 198],
    ["Sun", 224, 184],
  ].map(([label, usage, previous], index) => ({
    id: `week-${index + 1}`,
    zoneId,
    range: "Week",
    label,
    date: `2026-11-${String(18 + index).padStart(2, "0")}`,
    usage,
    previous,
  })),
  ...[
    ["Week 1", 860, 792],
    ["Week 2", 924, 846],
    ["Week 3", 888, 820],
    ["Week 4", 1012, 934],
    ["Week 5", 376, 342],
  ].map(([label, usage, previous], index) => ({
    id: `month-${index + 1}`,
    zoneId,
    range: "Month",
    label,
    date: `2026-11-${String(7 + index * 4).padStart(2, "0")}`,
    usage,
    previous,
  })),
];

database.users = users;
database.zones = [
  {
    id: zoneId,
    name: zoneName,
    location: "Mangalore, Karnataka",
    pincode: "575001",
    description: "Coastal service area covering central Mangalore.",
    adminId: "zone-admin-mangalore",
    status: "Active",
  },
];
database.meters = meters;
database.meterReadings = meterReadings;
database.alerts = alerts;
database.zoneConsumption = zoneConsumption;
database.zoneStats = [
  {
    id: zoneId,
    zoneId,
    name: zoneName,
    activeMeters: meters.filter((meter) => meter.status === "Active").length,
    totalMeters: meters.length,
    averageUsage: 185,
    previousAverageUsage: 194,
    pendingAlerts: alerts.filter((alert) => alert.status === "Pending").length,
    criticalAlerts: alerts.filter((alert) => alert.severity === "Critical" && alert.status === "Pending").length,
    warningAlerts: alerts.filter((alert) => alert.severity === "Warning" && alert.status === "Pending").length,
    lowAlerts: alerts.filter((alert) => alert.severity === "Low" && alert.status === "Pending").length,
    resolvedAlerts: alerts.filter((alert) => alert.status === "Resolved").length,
    customerCount: customers.length,
    connectivity: Number(((meters.filter((meter) => meter.status === "Active").length / meters.length) * 100).toFixed(1)),
  },
];
database.zoneSettings = [
  {
    id: zoneId,
    zoneId,
    highConsumption: 300,
    lowConsumption: 10,
    readingFrequencyMinutes: 60,
    inactiveMeterHours: 24,
    notifications: { email: true, sms: false, inApp: true },
  },
];

writeFileSync(databasePath, `${JSON.stringify(database, null, 2)}\n`);
console.log(`Seeded ${users.length} users, ${meters.length} meters, ${meterReadings.length} readings and ${alerts.length} alerts for ${zoneName}.`);
