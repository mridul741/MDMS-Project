import { describe, expect, it } from "vitest";
import {
  meters,
  customers,
  alerts,
  validateMeter,
  validateThresholds,
  initialSettings,
} from "@/features/mdms/data";
describe("Phase 1 zone boundaries", () => {
  it("only exposes Mangalore Zone meters", () => {
    expect(meters.length).toBeGreaterThan(0);
    expect(meters.every((m) => m.zone === "Mangalore Zone")).toBe(true);
  });
  it("only exposes Mangalore Zone customers", () => {
    expect(customers.length).toBeGreaterThan(0);
    expect(customers.every((c) => c.zone === "Mangalore Zone")).toBe(true);
  });
  it("only exposes Mangalore Zone alerts", () => {
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.every((a) => a.zone === "Mangalore Zone")).toBe(true);
  });
  it("requires all six meter fields", () => {
    expect(Object.keys(validateMeter({}))).toEqual([
      "id",
      "owner",
      "address",
      "installed",
      "tariff",
      "reading",
    ]);
  });
  it("rejects a negative initial reading", () => {
    expect(
      validateMeter({
        id: "MTR-10029",
        owner: "CUS-1001",
        address: "Kadri",
        installed: "2026-11-24",
        tariff: "Residential",
        reading: "-1",
      })["reading"],
    ).toBeDefined();
  });
  it("accepts a valid validation-only meter submission without mutating data", () => {
    const before = JSON.stringify(meters);
    expect(
      validateMeter({
        id: "MTR-10029",
        owner: "CUS-1001",
        address: "Kadri",
        installed: "2026-11-24",
        tariff: "Residential",
        reading: "0",
      }),
    ).toEqual({});
    expect(JSON.stringify(meters)).toBe(before);
  });
  it("requires positive alert thresholds", () => {
    expect(validateThresholds({ ...initialSettings, high: 0 })["high"]).toBeDefined();
    expect(validateThresholds(initialSettings)).toEqual({});
  });
});
