
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getZones } from "../services/zoneService";
import type {
  Zone,
  ZoneStatus,
  CreateZoneInput,
} from "../types/zone";

function Zones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Zone form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [formData, setFormData] = useState<CreateZoneInput>({
    name: "",
    admin: "",
    location: "",
    pincode: "",
    description: "",
  });

  useEffect(() => {
    getZones()
      .then((response) => setZones(response.data))
      .catch((err: unknown) => {
        console.error(err);
        setError(
          "Unable to load zones. Check whether JSON Server is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSearch =
        zone.name.toLowerCase().includes(search.toLowerCase()) ||
        zone.id.toLowerCase().includes(search.toLowerCase()) ||
        zone.admin.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || zone.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [zones, search, statusFilter]);

  const handleStatusAction = (zone: Zone) => {
    const nextStatus: ZoneStatus =
      zone.status === "Active" ? "Inactive" : "Active";

    alert(
      `Phase 1 demo: ${zone.name} would be changed to ${nextStatus}. No data was saved.`
    );
  };

  // Handle Add Zone input changes
  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Validate Add Zone form (no database save in Phase 1)
  const handleAddZone = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormMessage(
      "Zone details validated successfully. No data was saved in Phase 1."
    );

    setFormData({
      name: "",
      admin: "",
      location: "",
      pincode: "",
      description: "",
    });
  };

  return (
    <div className="enterprise-dashboard">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <h2>Zone Management</h2>
          <p>View and manage electricity distribution zones.</p>
        </div>

        <div className="zones-heading-actions">
          <span className="dashboard-date">
            Total Zones: {zones.length}
          </span>

          <button
            type="button"
            className="add-zone-button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setFormMessage("");
            }}
          >
            + Add Zone
          </button>
        </div>
      </div>

      {/* Add Zone Form */}
      {showAddForm && (
        <section className="add-zone-card">
          <div className="add-zone-heading">
            <div>
              <h3>Add New Zone</h3>
              <p>Enter the distribution zone details.</p>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={() => setShowAddForm(false)}
              aria-label="Close Add Zone form"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddZone}>
            <div className="zone-form-grid">
              <div className="form-field">
                <label htmlFor="name">Zone Name *</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Kadapa North"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="admin">Zone Admin *</label>
                <input
                  id="admin"
                  name="admin"
                  value={formData.admin}
                  onChange={handleFormChange}
                  placeholder="Enter admin name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="Enter city or location"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleFormChange}
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe this distribution zone"
                  rows={3}
                />
              </div>
            </div>

            {formMessage && (
              <p className="success-message" role="status">
                {formMessage}
              </p>
            )}

            <div className="zone-form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormMessage("");
                }}
              >
                Cancel
              </button>

              <button type="submit" className="submit-zone-button">
                Validate Zone
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search and Status Filter */}
      <section className="zones-toolbar">
        <input
          type="search"
          placeholder="Search by zone, ID or admin..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search zones"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter zones by status"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </section>

      {/* Loading and Error States */}
      {loading && <p>Loading zones...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Zones Table */}
      {!loading && !error && (
        <section className="zones-table-card">
          <div className="zones-table-heading">
            <h3>All Zones</h3>
            <span>{filteredZones.length} results</span>
          </div>

          <div className="table-scroll">
            <table className="zones-table">
              <thead>
                <tr>
                  <th>Zone ID</th>
                  <th>Zone Name</th>
                  <th>Zone Admin</th>
                  <th>Location</th>
                  <th>Meters</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredZones.map((zone) => (
                  <tr key={zone.id}>
                    <td>{zone.id}</td>
                    <td>
                      <strong>{zone.name}</strong>
                    </td>
                    <td>{zone.admin}</td>
                    <td>{zone.location}</td>
                    <td>{zone.meterCount.toLocaleString()}</td>

                    <td>
                      <span
                        className={`zone-status ${
                          zone.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {zone.status}
                      </span>
                    </td>

                    <td>
                      <div className="zone-actions">
                        <Link to={`/enterprise/zones/${zone.id}`}>
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleStatusAction(zone)}
                        >
                          {zone.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredZones.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No zones match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default Zones;
