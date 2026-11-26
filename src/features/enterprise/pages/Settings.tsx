
import { useEffect, useState } from "react";
import { getEnterpriseSettings } from "../services/settingsService";
import type { EnterpriseSettings } from "../types/enterpriseSettings";

// Reusable status component - declared outside Settings
function Status({ enabled }: { enabled: boolean }) {
  return (
    <span className={`setting-status ${enabled ? "enabled" : "disabled"}`}>
      <span className="setting-status-dot" />
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}

function Settings() {
  const [settings, setSettings] = useState<EnterpriseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await getEnterpriseSettings();

        if (isMounted) {
          setSettings(response.data);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load enterprise settings. Check JSON Server.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="page-loading">Loading enterprise settings...</div>;
  }

  if (error || !settings) {
    return <div className="page-error">{error || "Settings not found."}</div>;
  }

  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div>
          <span className="settings-eyebrow">ENTERPRISE CONFIGURATION</span>
          <h2>System Settings</h2>
          <p>
            Review enterprise-wide configuration, security policies,
            localisation, and notification preferences.
          </p>
        </div>

        <div className="settings-hero-icon">⚙</div>
      </section>

      <div className="settings-notice">
        <span className="settings-notice-icon">ⓘ</span>
        <div>
          <strong>Read-only configuration</strong>
          <p>
            These are demonstration settings for Phase 1. Configuration
            changes are not available in this release.
          </p>
        </div>
      </div>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="settings-section-icon">▤</span>
          <div>
            <h3>Data Retention</h3>
            <p>Review how long different categories of records are retained.</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="setting-card">
            <span>Meter Data Retention</span>
            <strong>{settings.dataRetention.meterDataRetentionDays} Days</strong>
            <small>Meter readings and consumption records</small>
          </div>

          <div className="setting-card">
            <span>Audit Log Retention</span>
            <strong>{settings.dataRetention.auditLogRetentionDays} Days</strong>
            <small>System activity and access records</small>
          </div>

          <div className="setting-card">
            <span>Report Retention</span>
            <strong>{settings.dataRetention.reportRetentionDays} Days</strong>
            <small>Generated report records</small>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="settings-section-icon">♙</span>
          <div>
            <h3>Security Policies</h3>
            <p>Review enterprise security-related configuration.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="setting-row">
            <div>
              <strong>Automatic Session Logout</strong>
              <p>Configured inactivity timeout</p>
            </div>
            <span className="setting-value">
              {settings.security.autoLogoutMinutes} minutes
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Strong Password Policy</strong>
              <p>Require passwords to follow stronger security rules</p>
            </div>
            <Status enabled={settings.security.requireStrongPassword} />
          </div>

          <div className="setting-row">
            <div>
              <strong>Audit Logging</strong>
              <p>Record system activity for monitoring and review</p>
            </div>
            <Status enabled={settings.security.auditLoggingEnabled} />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="settings-section-icon">◎</span>
          <div>
            <h3>Localisation</h3>
            <p>Regional preferences used across the enterprise portal.</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="setting-card">
            <span>Timezone</span>
            <strong className="setting-text-value">
              {settings.localisation.timezone}
            </strong>
            <small>Regional time configuration</small>
          </div>

          <div className="setting-card">
            <span>Language</span>
            <strong className="setting-text-value">
              {settings.localisation.language}
            </strong>
            <small>Portal display language</small>
          </div>

          <div className="setting-card">
            <span>Currency</span>
            <strong className="setting-text-value">
              {settings.localisation.currency}
            </strong>
            <small>Default currency code</small>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="settings-section-icon">♧</span>
          <div>
            <h3>Notification Preferences</h3>
            <p>Review the default notification configuration.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="setting-row">
            <div>
              <strong>Critical Alerts</strong>
              <p>Notifications for critical-severity alerts</p>
            </div>
            <Status enabled={settings.notifications.criticalAlerts} />
          </div>

          <div className="setting-row">
            <div>
              <strong>High Priority Alerts</strong>
              <p>Notifications for high-severity alerts</p>
            </div>
            <Status enabled={settings.notifications.highPriorityAlerts} />
          </div>

          <div className="setting-row">
            <div>
              <strong>Daily Summary</strong>
              <p>Daily summary notification preference</p>
            </div>
            <Status enabled={settings.notifications.dailySummary} />
          </div>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Email notification preference</p>
            </div>
            <Status enabled={settings.notifications.emailNotifications} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
