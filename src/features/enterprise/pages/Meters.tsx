
import { useEffect, useMemo, useState } from "react";

import { getAllMeters } from "../services/meterService";
import { getZones } from "../services/zoneService";

import type { Meter } from "../types/meter";
import type { Zone } from "../types/zone";

function Meters() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllMeters(), getZones()])
      .then(([meterResponse, zoneResponse]) => {
        setMeters(meterResponse.data);
        setZones(zoneResponse.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Unable to load meter information. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMeters = useMemo(() => {
    return meters.filter((meter) => {
      const matchesSearch =
        meter.id.toLowerCase().includes(search.toLowerCase()) ||
        meter.meterNumber.toLowerCase().includes(search.toLowerCase()) ||
        meter.endUserId.toLowerCase().includes(search.toLowerCase());

      const matchesZone =
        zoneFilter === "All" || meter.zoneId === zoneFilter;

      const matchesStatus =
        statusFilter === "All" || meter.status === statusFilter;

      return matchesSearch && matchesZone && matchesStatus;
    });
  }, [meters, search, zoneFilter, statusFilter]);

  const totalPages = Math.ceil(filteredMeters.length / pageSize);

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safeCurrentPage - 1) * pageSize;

  const paginatedMeters = filteredMeters.slice(
    startIndex,
    startIndex + pageSize
  );

  const activeCount = meters.filter(
    (meter) => meter.status === "Active"
  ).length;

  const inactiveCount = meters.length - activeCount;

  const getZoneName = (zoneId: string) => {
    return zones.find((zone) => zone.id === zoneId)?.name || zoneId;
  };

  if (loading) {
    return <p>Loading meters...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="enterprise-dashboard">
      <div className="page-heading">
        <div>
          <h2>Meter Management</h2>
          <p>View and monitor meters across all distribution zones.</p>
        </div>
      </div>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Meters</span>
          <h3>{meters.length}</h3>
        </div>

        <div className="summary-card">
          <span>Active Meters</span>
          <h3>{activeCount}</h3>
        </div>

        <div className="summary-card">
          <span>Inactive Meters</span>
          <h3>{inactiveCount}</h3>
        </div>
      </section>

      <section className="zones-table-card">
        <div className="zones-table-heading">
          <div>
            <h3>All Meters</h3>
            <p>Meter records from every distribution zone.</p>
          </div>
        </div>

        <div className="zones-toolbar">
          <input
            type="text"
            placeholder="Search by meter ID, number or user ID..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={zoneFilter}
            onChange={(event) => {
              setZoneFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Zones</option>

            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="zones-table">
            <thead>
              <tr>
                <th>Meter ID</th>
                <th>Meter Number</th>
                <th>Meter Type</th>
                <th>Zone</th>
                <th>End User ID</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMeters.map((meter) => (
                <tr key={meter.id}>
                  <td>{meter.id}</td>
                  <td><strong>{meter.meterNumber}</strong></td>
                  <td>{meter.type}</td>
                  <td>{getZoneName(meter.zoneId)}</td>
                  <td>{meter.endUserId}</td>
                  <td>
                    <span
                      className={`zone-status ${
                        meter.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {meter.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredMeters.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No meters found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="meters-pagination">
          <span>
            Showing {filteredMeters.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(startIndex + pageSize, filteredMeters.length)}
            {" of "}
            {filteredMeters.length} meters
          </span>

          <div>
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>
              Page {safeCurrentPage} of {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Meters;
