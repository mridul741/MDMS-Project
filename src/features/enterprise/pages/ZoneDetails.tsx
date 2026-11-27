
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getZoneById } from "../services/zoneService";
import { getEndUsersByZone } from "../services/endUserService";
import { getMetersByZone } from "../services/meterService";

import type { Zone } from "../types/zone";
import type { EndUser } from "../types/endUser";
import type { Meter } from "../types/meter";

type ActiveTab = "meters" | "users";

function ZoneDetails() {
  const { zoneId } = useParams<{ zoneId: string }>();

  const [zone, setZone] = useState<Zone | null>(null);
  const [endUsers, setEndUsers] = useState<EndUser[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("meters");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!zoneId) return;

    let isMounted = true;

    const loadZoneDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          zoneResponse,
          usersResponse,
          metersResponse,
        ] = await Promise.all([
          getZoneById(zoneId),
          getEndUsersByZone(zoneId),
          getMetersByZone(zoneId),
        ]);

        if (!isMounted) return;

        setZone(zoneResponse.data);
        setEndUsers(usersResponse.data);
        setMeters(metersResponse.data);
      } catch (err: unknown) {
        console.error(err);

        if (isMounted) {
          setError("Unable to load zone information. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadZoneDetails();

    return () => {
      isMounted = false;
    };
  }, [zoneId]);

  // Handle missing route parameter
  if (!zoneId) {
    return (
      <div className="zone-details-error">
        <p>Zone ID is missing.</p>
        <Link to="/enterprise/zones">Back to Zones</Link>
      </div>
    );
  }

  if (loading) {
    return <p>Loading zone details...</p>;
  }

  if (error || !zone) {
    return (
      <div className="zone-details-error">
        <p>{error || "Zone not found."}</p>
        <Link to="/enterprise/zones">Back to Zones</Link>
      </div>
    );
  }

  return (
    <div className="enterprise-dashboard">
      {/* Breadcrumb */}
      <div className="zone-details-breadcrumb">
        <Link to="/enterprise/zones">Zones</Link>
        <span>/</span>
        <span>{zone.name}</span>
      </div>

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <h2>{zone.name}</h2>
          <p>View distribution zone information and assigned resources.</p>
        </div>

        <span
          className={`zone-status ${
            zone.status === "Active" ? "active" : "inactive"
          }`}
        >
          {zone.status}
        </span>
      </div>

      {/* Zone Information */}
      <section className="zone-info-card">
        <div className="zone-info-heading">
          <div>
            <span className="zone-info-label">ZONE ID</span>
            <h3>{zone.id}</h3>
          </div>

          <div className="zone-location-icon">⌖</div>
        </div>

        <div className="zone-info-grid">
          <div className="zone-info-item">
            <span>Zone Name</span>
            <strong>{zone.name}</strong>
          </div>

          <div className="zone-info-item">
            <span>Zone Administrator</span>
            <strong>{zone.admin}</strong>
          </div>

          <div className="zone-info-item">
            <span>Location</span>
            <strong>{zone.location}</strong>
          </div>

          <div className="zone-info-item">
            <span>Pincode</span>
            <strong>{zone.pincode || "Not provided"}</strong>
          </div>

          <div className="zone-info-item">
            <span>Total End Users</span>
            <strong>{endUsers.length}</strong>
          </div>

          <div className="zone-info-item">
            <span>Total Meters</span>
            <strong>{meters.length}</strong>
          </div>

          <div className="zone-info-item full-width">
            <span>Description</span>
            <strong>
              {zone.description || "No description available"}
            </strong>
          </div>
        </div>
      </section>

      {/* Meters and End Users */}
      <section className="zone-resources-card">
        <div className="zone-tabs">
          <button
            type="button"
            className={activeTab === "meters" ? "active" : ""}
            onClick={() => setActiveTab("meters")}
          >
            Meters ({meters.length})
          </button>

          <button
            type="button"
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            End Users ({endUsers.length})
          </button>
        </div>

        {/* Meters Tab */}
        {activeTab === "meters" && (
          <div className="zone-tab-content">
            <h3>Zone Meters</h3>
            <p>All meters registered under {zone.name}.</p>

            <div className="table-scroll">
              <table className="zones-table">
                <thead>
                  <tr>
                    <th>Meter ID</th>
                    <th>Meter Number</th>
                    <th>Meter Type</th>
                    <th>End User ID</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {meters.map((meter) => (
                    <tr key={meter.id}>
                      <td>{meter.id}</td>
                      <td><strong>{meter.meterNumber}</strong></td>
                      <td>{meter.type}</td>
                      <td>{meter.endUserId}</td>
                      <td>
                        <span
                          className={`zone-status ${
                            meter.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {meter.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {meters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        No meters found in this zone.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* End Users Tab */}
        {activeTab === "users" && (
          <div className="zone-tab-content">
            <h3>Zone End Users</h3>
            <p>All end users registered under {zone.name}.</p>

            <div className="table-scroll">
              <table className="zones-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {endUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`zone-status ${
                            user.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {endUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty-state">
                        No end users found in this zone.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <Link className="back-to-zones" to="/enterprise/zones">
        ← Back to All Zones
      </Link>
    </div>
  );
}

export default ZoneDetails;
