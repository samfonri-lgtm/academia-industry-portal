import React, { useState } from "react";

function CompanySettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    placementUpdates: true,
    profileVisibility: true,
    twoFactor: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <div>
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Header */}
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Company Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your company account, notifications and security
              preferences.
            </p>
          </div>

          {/* Notifications */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose which updates you want to receive.
              </p>
            </div>

            <div className="mt-6 divide-y divide-slate-100">

              <SettingRow
                title="Email Notifications"
                description="Receive important company updates by email."
                enabled={settings.emailNotifications}
                onToggle={() => toggleSetting("emailNotifications")}
              />

              <SettingRow
                title="Application Alerts"
                description="Get notified when students apply to your opportunities."
                enabled={settings.applicationAlerts}
                onToggle={() => toggleSetting("applicationAlerts")}
              />

              <SettingRow
                title="Placement Updates"
                description="Receive updates related to placement activities."
                enabled={settings.placementUpdates}
                onToggle={() => toggleSetting("placementUpdates")}
              />

            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Privacy
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control how your company information is displayed.
              </p>
            </div>

            <div className="mt-6">
              <SettingRow
                title="Public Company Profile"
                description="Allow students and institutions to view your company profile."
                enabled={settings.profileVisibility}
                onToggle={() => toggleSetting("profileVisibility")}
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your organization account secure.
              </p>
            </div>

            <div className="mt-6 divide-y divide-slate-100">

              <SettingRow
                title="Two-Factor Authentication"
                description="Add an additional security layer to your account."
                enabled={settings.twoFactor}
                onToggle={() => toggleSetting("twoFactor")}
              />

            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-4">
              <p className="text-sm font-semibold text-slate-200">
                Password
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Change your company account password regularly.
              </p>

              <button
                className="mt-4 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                onClick={() =>
                  alert("Password change flow will be connected later.")
                }
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-6">
            <h2 className="text-lg font-bold text-red-700">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These actions can affect your company account.
            </p>

            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-red-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Deactivate Company Account
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Temporarily disable access to this company portal.
                </p>
              </div>

              <button
                onClick={() =>
                  alert("Account deactivation will be connected later.")
                }
                className="w-fit rounded-xl border border-rose-400/20 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10"
              >
                Deactivate
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onToggle,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-semibold text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default CompanySettings;