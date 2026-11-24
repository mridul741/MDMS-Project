
import { useEffect, useMemo, useState } from "react";

import { getZoneAdmins, getAllEndUsers } from "../services/userService";

import type { ZoneAdmin } from "../types/zoneAdmin";
import type { EndUser } from "../types/endUser";

type UserTab = "admins" | "consumers";

function Users() {
  const [activeTab, setActiveTab] = useState<UserTab>("admins");

  const [admins, setAdmins] = useState<ZoneAdmin[]>([]);
  const [consumers, setConsumers] = useState<EndUser[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getZoneAdmins(), getAllEndUsers()])
      .then(([adminResponse, consumerResponse]) => {
        setAdmins(adminResponse.data);
        setConsumers(consumerResponse.data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Unable to load users. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const currentUsers = activeTab === "admins" ? admins : consumers;

  const filteredUsers = useMemo(() => {
    return currentUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.zoneId.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [currentUsers, search, statusFilter]);

  const activeCount = currentUsers.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveCount = currentUsers.length - activeCount;

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="enterprise-dashboard">
      <div className="page-heading">
        <div>
          <h2>User Management</h2>
          <p>View and monitor zone administrators and consumers.</p>
        </div>
      </div>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Users</span>
          <h3>{admins.length + consumers.length}</h3>
        </div>

        <div className="summary-card">
          <span>Active Users</span>
          <h3>{admins.filter(u => u.status === "Active").length +
            consumers.filter(u => u.status === "Active").length}</h3>
        </div>

        <div className="summary-card">
          <span>Inactive Users</span>
          <h3>{admins.filter(u => u.status === "Inactive").length +
            consumers.filter(u => u.status === "Inactive").length}</h3>
        </div>
      </section>

      <section className="users-card">
        <div className="zone-tabs">
          <button
            className={activeTab === "admins" ? "active" : ""}
            onClick={() => {
              setActiveTab("admins");
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Zone Admins ({admins.length})
          </button>

          <button
            className={activeTab === "consumers" ? "active" : ""}
            onClick={() => {
              setActiveTab("consumers");
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Consumers ({consumers.length})
          </button>
        </div>

        <div className="users-summary">
          <span>Active: <strong>{activeCount}</strong></span>
          <span>Inactive: <strong>{inactiveCount}</strong></span>
        </div>

        <div className="zones-toolbar">
          <input
            type="text"
            placeholder="Search by name, email, ID or zone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Zone ID</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.zoneId}</td>
                  <td>
                    <span
                      className={`zone-status ${
                        user.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Users;
