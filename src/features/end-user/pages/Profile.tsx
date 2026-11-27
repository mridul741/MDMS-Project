
import "./Profile.css";
import { useState } from "react";

type ProfileTab = "Personal Information" | "Security" | "Notifications";

function Profile() {
  const [activeTab, setActiveTab] =
    useState<ProfileTab>("Personal Information");

  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Mangalore, Karnataka");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [consumptionAlerts, setConsumptionAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profile information saved successfully (demo only).");
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must contain at least 8 characters.");
      return;
    }

    alert("Password change is a demo only. No password was changed.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationSave = () => {
    alert("Notification preferences saved successfully (demo only).");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings.</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar">RS</div>
          <h2>{name}</h2>
          <p>End User</p>

          <nav className="profile-tabs">
            {(
              [
                "Personal Information",
                "Security",
                "Notifications",
              ] as ProfileTab[]
            ).map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <main className="profile-content">
          {activeTab === "Personal Information" && (
            <section>
              <h2>Personal Information</h2>
              <p className="profile-description">
                Update your personal and contact details.
              </p>

              <form onSubmit={handleProfileSave}>
                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-phone">Phone Number</label>
                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-address">Address</label>
                    <input
                      id="profile-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="profile-save-button">
                  Save Changes
                </button>
              </form>
            </section>
          )}

          {activeTab === "Security" && (
            <section>
              <h2>Security Settings</h2>
              <p className="profile-description">
                Change your account password.
              </p>

              <form onSubmit={handlePasswordChange}>
                <div className="profile-password-fields">
                  <div className="profile-field">
                    <label htmlFor="current-password">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="profile-save-button">
                  Update Password
                </button>
              </form>
            </section>
          )}

          {activeTab === "Notifications" && (
            <section>
              <h2>Notification Preferences</h2>
              <p className="profile-description">
                Choose which notifications you want to receive.
              </p>

              <div className="notification-setting">
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive updates through email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  aria-label="Email notifications"
                />
              </div>

              <div className="notification-setting">
                <div>
                  <strong>SMS Notifications</strong>
                  <p>Receive updates through text messages.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  aria-label="SMS notifications"
                />
              </div>

              <div className="notification-setting">
                <div>
                  <strong>Bill Payment Reminders</strong>
                  <p>Get reminders about upcoming bill payments.</p>
                </div>
                <input
                  type="checkbox"
                  checked={billReminders}
                  onChange={(e) => setBillReminders(e.target.checked)}
                  aria-label="Bill payment reminders"
                />
              </div>

              <div className="notification-setting">
                <div>
                  <strong>Consumption Alerts</strong>
                  <p>Get notified about unusual electricity usage.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consumptionAlerts}
                  onChange={(e) => setConsumptionAlerts(e.target.checked)}
                  aria-label="Consumption alerts"
                />
              </div>

              <button
                className="profile-save-button"
                onClick={handleNotificationSave}
              >
                Save Preferences
              </button>
            </section>
          )}
        </main>
      </div>

      <p className="profile-demo-note">
        Demo profile information. Changes are not saved to a backend.
      </p>
    </div>
  );
}

export default Profile;
