import { useEffect, useState, type FormEvent } from "react";
import { Bell, Mail, Save, SlidersHorizontal, Smartphone } from "lucide-react";
import { PageHeader } from "../components/ZoneShared";
import { getZoneSettings } from "../services/zoneService";
import type { ZoneSettings as Settings } from "../types/zone";

type SettingsForm = Omit<Settings, "id" | "zoneId">;
const initialSettings: SettingsForm = {
  highConsumption: 300,
  lowConsumption: 10,
  readingFrequencyMinutes: 60,
  inactiveMeterHours: 24,
  notifications: { email: true, sms: false, inApp: true },
};

const thresholdFields: {
  key: "highConsumption" | "lowConsumption" | "readingFrequencyMinutes" | "inactiveMeterHours";
  label: string;
  unit: string;
  hint: string;
}[] = [
  { key: "highConsumption", label: "High consumption threshold", unit: "kWh", hint: "Alert when meter usage exceeds this value." },
  { key: "lowConsumption", label: "Low consumption threshold", unit: "kWh", hint: "Alert when usage drops below this value." },
  { key: "readingFrequencyMinutes", label: "Abnormal reading frequency", unit: "minutes", hint: "Expected interval between meter readings." },
  { key: "inactiveMeterHours", label: "Inactive meter duration", unit: "hours", hint: "Alert after this period without a reading." },
];

export default function ZoneSettings() {
  const [values, setValues] = useState<SettingsForm>(initialSettings);
  const [loaded, setLoaded] = useState(false);
  const loading = !loaded;
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getZoneSettings()
      .then(({ data }) => {
        if (!active) return;
        const settings = data[0];
        if (settings) {
          setValues({
            highConsumption: settings.highConsumption,
            lowConsumption: settings.lowConsumption,
            readingFrequencyMinutes: settings.readingFrequencyMinutes,
            inactiveMeterHours: settings.inactiveMeterHours,
            notifications: settings.notifications,
          });
        } else {
          setLoadError("No settings were found for Mangalore Zone.");
        }
        setLoaded(true);
      })
      .catch((cause: unknown) => {
        console.error(cause);
        if (active) {
          setLoadError("Unable to load zone settings. Confirm JSON Server is running.");
          setLoaded(true);
        }
      })
    return () => { active = false; };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    for (const field of thresholdFields) {
      if (!Number.isFinite(values[field.key]) || values[field.key] <= 0) {
        next[field.key] = "Enter a value greater than zero.";
      }
    }
    if (values.lowConsumption >= values.highConsumption) {
      next.lowConsumption = "Low threshold must be less than high threshold.";
    }
    setErrors(next);
    setMessage(Object.keys(next).length ? "" : "Settings are valid. No changes were saved in this read-only phase.");
  };

  return (
    <>
      <PageHeader title="Zone Settings" subtitle="Configure alert thresholds and notification preferences for Mangalore Zone." />
      {loadError && <p className="zone-error" role="alert">{loadError}</p>}
      {message && <p className="zone-inline-message" role="status">{message}</p>}
      {loading ? <div className="zone-page-loading">Loading zone settings…</div> : (
        <div className="zone-settings-grid">
          <section className="zone-panel zone-settings-panel">
            <header className="zone-panel-heading">
              <span className="zone-stat-icon blue"><SlidersHorizontal size={19} /></span>
              <div><h2>Alert threshold configuration</h2><p>Set the normal operating limits for your meters.</p></div>
            </header>
            <form className="zone-form" noValidate onSubmit={submit}>
              <div className="zone-settings-fields">
                {thresholdFields.map((field) => (
                  <label key={field.key}>
                    {field.label}<small>{field.hint}</small>
                    <span className="zone-unit-input">
                      <input type="number" min="1" value={values[field.key]} onChange={(event) => {
                        const value = Number(event.target.value);
                        setValues({ ...values, [field.key]: value });
                        setMessage("");
                      }} />
                      <i>{field.unit}</i>
                    </span>
                    {errors[field.key] && <em className="zone-field-error">{errors[field.key]}</em>}
                  </label>
                ))}
              </div>
              <div className="zone-form-actions zone-settings-save"><span>Validation only · Settings are not persisted</span><button className="zone-button" type="submit"><Save size={16} /> Validate settings</button></div>
            </form>
          </section>
          <section className="zone-panel zone-settings-panel">
            <header className="zone-panel-heading">
              <span className="zone-stat-icon teal"><Bell size={19} /></span>
              <div><h2>Notification preferences</h2><p>Choose how zone notifications should be delivered.</p></div>
            </header>
            <div className="zone-preference-list">
              {([
                { key: "email", label: "Email notifications", hint: "Receive alerts in your email inbox.", icon: Mail },
                { key: "sms", label: "SMS notifications", hint: "Receive critical alerts on your phone.", icon: Smartphone },
                { key: "inApp", label: "In-app notifications", hint: "View alerts in the notification centre.", icon: Bell },
              ] as const).map(({ key, label, hint, icon: Icon }) => (
                <label key={key} className="zone-preference-row">
                  <Icon size={19} />
                  <span><strong>{label}</strong><small>{hint}</small></span>
                  <input type="checkbox" checked={values.notifications[key]} onChange={(event) => {
                    setValues({ ...values, notifications: { ...values.notifications, [key]: event.target.checked } });
                    setMessage("");
                  }} />
                </label>
              ))}
            </div>
            <div className="zone-form-actions zone-settings-save"><span>Sample preferences</span><button className="zone-button zone-button-outline" type="button" onClick={() => setMessage("Notification preferences previewed. No settings were saved.")}><Save size={16} /> Preview preferences</button></div>
          </section>
        </div>
      )}
    </>
  );
}
