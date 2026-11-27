export interface EnterpriseSettings {
  dataRetention: {
    meterDataRetentionDays: number;
    auditLogRetentionDays: number;
    reportRetentionDays: number;
  };

  security: {
    autoLogoutMinutes: number;
    requireStrongPassword: boolean;
    auditLoggingEnabled: boolean;
  };

  localisation: {
    timezone: string;
    language: string;
    currency: string;
  };

  notifications: {
    criticalAlerts: boolean;
    highPriorityAlerts: boolean;
    dailySummary: boolean;
    emailNotifications: boolean;
  };
}