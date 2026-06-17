"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Welcome() {
  const [email, setEmail] = useState<string | undefined>("");
  const [checking, setChecking] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [targetTitles, setTargetTitles] = useState("");
  const [pastIndustries, setPastIndustries] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("Find a new job");
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(data.user.email);
      setChecking(false);
    }

    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function saveProfile(userId: string) {
    await supabase.from("profiles").upsert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      target_titles: targetTitles,
      years_experience: yearsExperience,
      past_industries: pastIndustries,
      primary_goal: primaryGoal,
      gmail_sync_enabled: gmailSyncEnabled,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    });
  }

  async function handleImportGmail() {
    setImporting(true);
    setImportMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.provider_token;

    if (!accessToken || !userId) {
      setImportMessage(
        "Missing Google access. Please log out and sign back in with Google."
      );
      setImporting(false);
      return;
    }

    await saveProfile(userId);

    const response = await fetch("/api/gmail/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        userId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setImportMessage(result.error || "Something went wrong importing Gmail.");
    } else {
      setImportMessage(`Saved ${result.imported} Gmail messages to PathFound.`);
      setStep(5);
    }

    setImporting(false);
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking your account...</p>
      </main>
    );
  }

  const progressPercent = (step / 5) * 100;

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

          <a href="/account" className="text-gray-700 hover:text-black">
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

      <section className="max-w-3xl mx-auto px-8 py-12">
        <p className="text-sm text-gray-500 mb-3">Signed in as {email}</p>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Welcome setup</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-900"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {step === 1 && (
            <>
              <h1 className="text-4xl font-bold mb-4">
                Welcome to PathFound
              </h1>

              <p className="text-gray-700 mb-8">
                Let's build your career dashboard so PathFound can help organize
                applications, interviews, recruiter conversations, and next
                steps.
              </p>

              <div className="grid gap-4">
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

                <input
                  className="border rounded-lg px-4 py-3"
                  placeholder="Years of experience"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-8 bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold mb-4">
                What are you working toward?
              </h1>

              <p className="text-gray-700 mb-6">
                This helps PathFound understand what kind of support matters
                most right now.
              </p>

              <select
                className="border rounded-lg px-4 py-3 w-full mb-4"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
              >
                <option>Find a new job</option>
                <option>Prepare for interviews</option>
                <option>Grow my professional network</option>
                <option>Track certifications and training</option>
                <option>Negotiate an offer</option>
              </select>

              <textarea
                className="border rounded-lg px-4 py-3 w-full mb-4"
                placeholder="Target roles, separated by commas. Example: Marketing Analytics Manager, BI Manager"
                value={targetTitles}
                onChange={(e) => setTargetTitles(e.target.value)}
              />

              <textarea
                className="border rounded-lg px-4 py-3 w-full"
                placeholder="Past industries. Example: DTC, Ecommerce, Healthcare"
                value={pastIndustries}
                onChange={(e) => setPastIndustries(e.target.value)}
              />

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-3xl font-bold mb-4">
                Here's what PathFound will do
              </h1>

              <p className="text-gray-700 mb-6">
                PathFound turns job-search email noise into a focused career
                workspace.
              </p>

              <div className="space-y-4 text-gray-800">
                <p>✓ Track applications from your Gmail</p>
                <p>✓ Organize recruiter and hiring manager conversations</p>
                <p>✓ Surface interview activity and offers</p>
                <p>✓ Help identify follow-ups and next steps</p>
                <p>✓ Keep everything tied to your career goals</p>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
                >
                  Connect Gmail
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-3xl font-bold mb-4">
                Connect your Gmail history
              </h1>

              <p className="text-gray-700 mb-6">
                PathFound will import job-related messages so your dashboard can
                identify applications, interviews, offers, and rejections.
              </p>

              <label className="flex gap-3 items-start border rounded-xl p-4 mb-6">
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
                    PathFound can periodically check for new job-related emails.
                    You can turn this off anytime.
                  </span>
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={handleImportGmail}
                  disabled={importing}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-60"
                >
                  {importing ? "Importing..." : "Import Gmail History"}
                </button>
              </div>

              {importMessage && (
                <p className="mt-6 text-gray-700">{importMessage}</p>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h1 className="text-4xl font-bold mb-4">
                You're ready, {firstName || "there"}.
              </h1>

              <p className="text-gray-700 mb-8">
                PathFound has started organizing your job-search activity. Your
                Home page will show your current application pipeline and career
                signals.
              </p>

              <div className="bg-stone-50 border rounded-xl p-5 mb-8">
                <p className="font-medium">Setup complete</p>
                <p className="text-sm text-gray-600 mt-1">
                  Automatic updates: {gmailSyncEnabled ? "Enabled" : "Off"}
                </p>
              </div>

              <a
                href="/home"
                className="inline-block bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800"
              >
                Go to Home
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
}