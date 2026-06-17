"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type StrengthScores = {
  strategic?: number;
  analytical?: number;
  relationship?: number;
  communication?: number;
  execution?: number;
  learning?: number;
};

const strengthLabels: Record<string, string> = {
  strategic: "Strategic Navigator",
  analytical: "Analytical Problem Solver",
  relationship: "Relationship Builder",
  communication: "Clear Communicator",
  execution: "Execution Driver",
  learning: "Learning Adapter",
};

const strengthWatchouts: Record<string, string> = {
  "Strategic Navigator":
    "Watch out for moving too quickly to the big picture before proving the details.",
  "Analytical Problem Solver":
    "Watch out for over-explaining the analysis before making the business point.",
  "Relationship Builder":
    "Watch out for underselling your hard skills and measurable impact.",
  "Clear Communicator":
    "Watch out for sounding polished without enough proof underneath.",
  "Execution Driver":
    "Watch out for making your work sound task-oriented instead of strategic.",
  "Learning Adapter":
    "Watch out for sounding too open-ended instead of already capable.",
};

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

  const [careerStrengthPrimary, setCareerStrengthPrimary] = useState("");
  const [careerStrengthSecondary, setCareerStrengthSecondary] = useState("");
  const [careerStrengthSummary, setCareerStrengthSummary] = useState("");
  const [careerStrengthScores, setCareerStrengthScores] =
    useState<StrengthScores | null>(null);
  const [careerStrengthCompletedAt, setCareerStrengthCompletedAt] =
    useState<string | null>(null);

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

        setCareerStrengthPrimary(profile.career_strength_primary || "");
        setCareerStrengthSecondary(profile.career_strength_secondary || "");
        setCareerStrengthSummary(profile.career_strength_summary || "");
        setCareerStrengthScores(profile.career_strength_scores || null);
        setCareerStrengthCompletedAt(
          profile.career_strength_completed_at || null
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

          <a href="/assessment" className="text-gray-700 hover:text-black">
            Assessment
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
          Manage your PathFound profile, preferences, and coaching profile.
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
          <h2 className="text-xl font-semibold mb-2">Career Strengths</h2>

          <p className="text-gray-600 mb-6">
            These results help PathFound personalize coaching, interview prep,
            and career guidance.
          </p>

          {careerStrengthPrimary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-2">Primary strength</p>
                  <p className="text-xl font-semibold">
                    {careerStrengthPrimary}
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-2">
                    Secondary strength
                  </p>
                  <p className="text-xl font-semibold">
                    {careerStrengthSecondary}
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-5 mb-6">
                <h3 className="font-semibold mb-2">What this says about you</h3>
                <p className="text-gray-700">{careerStrengthSummary}</p>
              </div>

              <div className="border rounded-xl p-5 mb-6">
                <h3 className="font-semibold mb-2">Likely stretch area</h3>
                <p className="text-gray-700">
                  {strengthWatchouts[careerStrengthPrimary] ||
                    "PathFound will use your results to identify where you may need to stretch in interviews."}
                </p>
              </div>

              {careerStrengthScores && (
                <details className="bg-stone-50 border rounded-xl p-5 mb-6">
                  <summary className="cursor-pointer font-medium">
                    View strength signal breakdown
                  </summary>

                  <div className="space-y-2 text-sm text-gray-700 mt-4">
                    {Object.entries(careerStrengthScores).map(
                      ([key, score]) => (
                        <div key={key} className="flex justify-between">
                          <span>{strengthLabels[key] || key}</span>
                          <span>{score}</span>
                        </div>
                      )
                    )}
                  </div>
                </details>
              )}

              {careerStrengthCompletedAt && (
                <p className="text-sm text-gray-500">
                  Completed{" "}
                  {new Date(careerStrengthCompletedAt).toLocaleDateString()}
                </p>
              )}
            </>
          ) : (
            <div className="border rounded-xl p-5">
              <p className="text-gray-700 mb-4">
                You have not completed your Career Strengths Assessment yet.
              </p>

              <a
                href="/assessment"
                className="inline-block bg-green-900 text-white px-5 py-3 rounded-lg hover:bg-green-800"
              >
                Take Assessment
              </a>
            </div>
          )}
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