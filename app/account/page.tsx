"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Account() {
  const [email, setEmail] = useState<string | undefined>("");
  const [userId, setUserId] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [targetTitles, setTargetTitles] = useState("");
  const [pastIndustries, setPastIndustries] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("Find a new job");
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(false);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] =
    useState(false);

  useEffect(() => {
    async function getUserAndProfile() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(data.user.email);
      setUserId(data.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setYearsExperience(profile.years_experience || "");
        setTargetTitles(profile.target_titles || "");
        setPastIndustries(profile.past_industries || "");
        setPrimaryGoal(profile.primary_goal || "Find a new job");
        setGmailSyncEnabled(profile.gmail_sync_enabled || false);
        setDesktopNotificationsEnabled(
          profile.desktop_notifications_enabled || false
        );
      }

      setChecking(false);
    }

    getUserAndProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleSaveProfile() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      years_experience: yearsExperience,
      target_titles: targetTitles,
      past_industries: pastIndustries,
      primary_goal: primaryGoal,
      gmail_sync_enabled: gmailSyncEnabled,
      desktop_notifications_enabled: desktopNotificationsEnabled,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account settings saved.");
    }

    setSaving(false);
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="border-b bg-white px-8 py-4 flex justify-between items-center">
        <a href="/" className="font-bold text-green-950 text-xl">
          PathFound
        </a>

        <div className="flex gap-6 text-sm">
          <a href="/home" className="text-gray-700 hover:text-black">
            Home
          </a>

          <a href="/welcome" className="text-gray-700 hover:text-black">
            Welcome
          </a>

          <a href="/account" className="text-gray-900 font-medium">
            Account
          </a>

          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-black"
          >
            Log out
          </button>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Account</h1>

        <p className="text-gray-600 mb-8">
          Manage your PathFound profile and preferences.
        </p>

        <div className="bg-white border rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Profile</h2>

          <p className="text-sm text-gray-500 mb-2">Email</p>
          <p className="font-medium mb-6">{email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded-lg px-4 py-3"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="border rounded-lg px-4 py-3"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className="border rounded-lg px-4 py-3 w-full mb-4"
            placeholder="Years of experience"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
          />

          <textarea
            className="border rounded-lg px-4 py-3 w-full mb-4"
            placeholder="Target roles, separated by commas"
            value={targetTitles}
            onChange={(e) => setTargetTitles(e.target.value)}
          />

          <textarea
            className="border rounded-lg px-4 py-3 w-full mb-4"
            placeholder="Past industries"
            value={pastIndustries}
            onChange={(e) => setPastIndustries(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-3 w-full"
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
          >
            <option>Find a new job</option>
            <option>Prepare for interviews</option>
            <option>Grow my professional network</option>
            <option>Track certifications and training</option>
            <option>Negotiate an offer</option>
          </select>
        </div>

        <div className="bg-white border rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>

          <label className="flex gap-3 items-start border rounded-xl p-4 mb-4">
            <input
              type="checkbox"
              checked={gmailSyncEnabled}
              onChange={(e) => setGmailSyncEnabled(e.target.checked)}
              className="mt-1"
            />

            <span>
              <span className="font-medium block">
                Automatically keep PathFound updated
              </span>
              <span className="text-sm text-gray-600">
                Periodically check Gmail for new job-related emails.
              </span>
            </span>
          </label>

          <label className="flex gap-3 items-start border rounded-xl p-4">
            <input
              type="checkbox"
              checked={desktopNotificationsEnabled}
              onChange={(e) =>
                setDesktopNotificationsEnabled(e.target.checked)
              }
              className="mt-1"
            />

            <span>
              <span className="font-medium block">Desktop notifications</span>
              <span className="text-sm text-gray-600">
                Notify me about important PathFound actions and updates.
              </span>
            </span>
          </label>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Account Settings"}
        </button>

        {message && <p className="mt-6 text-gray-700">{message}</p>}
      </section>
    </main>
  );
}