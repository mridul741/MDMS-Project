
import "./UserAlerts.css";
import { useState } from "react";

type Alert = {
  id: number;
  title: string;
  message: string;
  date: string;
  type: "High Consumption" | "Payment Due" | "Meter Issue";
  read: boolean;
};

const initialAlerts: Alert[] = [
  {
    id: 1,
    title: "High Electricity Consumption",
    message: "Your electricity consumption is higher than your usual usage.",
    date: "26 Nov 2026",
    type: "High Consumption",
    read: false,
  },
  {
    id: 2,
    title: "Upcoming Bill Payment",
    message: "Your November electricity bill of ₹1,850 is due on 05 Dec 2026.",
    date: "25 Nov 2026",
    type: "Payment Due",
    read: false,
  },
  {
    id: 3,
    title: "Meter Reading Updated",
    message: "Your latest meter reading has been successfully recorded.",
    date: "23 Nov 2026",
    type: "Meter Issue",
    read: true,
  },
  {
    id: 4,
    title: "Previous Payment Successful",
    message: "Your October electricity bill payment was successful.",
    date: "04 Nov 2026",
    type: "Payment Due",
    read: true,
  },
];

function UserAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("All");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "Read") return alert.read;
    if (filter === "Unread") return !alert.read;
    return true;
  });

  const markAsRead = (id: number) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  return (
    <div className="user-alerts-page">
      <div className="user-alerts-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated about your electricity service.</p>
        </div>

        <span className="unread-count">
          {unreadCount} Unread
        </span>
      </div>

      <div className="alerts-toolbar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter notifications"
        >
          <option value="All">All Notifications</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>

        <button
          onClick={() =>
            setAlerts((previous) =>
              previous.map((alert) => ({ ...alert, read: true }))
            )
          }
        >
          Mark All as Read
        </button>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${alert.read ? "read" : "unread"}`}
            >
              <div className="alert-card-content">
                <div className="alert-card-heading">
                  <h2>{alert.title}</h2>
                  <span className={`alert-type ${alert.type.toLowerCase().replace(" ", "-")}`}>
                    {alert.type}
                  </span>
                </div>

                <p>{alert.message}</p>

                <div className="alert-card-footer">
                  <span>{alert.date}</span>
                  {alert.read ? (
                    <span className="read-label">Read</span>
                  ) : (
                    <button onClick={() => markAsRead(alert.id)}>
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alerts-empty">
            <h2>No notifications found</h2>
            <p>There are no notifications in this category.</p>
          </div>
        )}
      </div>

      <p className="alerts-demo-note">
        Sample notifications for the Phase 1 prototype.
      </p>
    </div>
  );
}

export default UserAlerts;
