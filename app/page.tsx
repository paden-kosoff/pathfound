"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("waitlist").insert([{ email }]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("You're on the waitlist!");
      setEmail("");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <nav className="w-full px-8 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-green-950">
          PathFound
        </a>

        <a
          href="/login"
          className="rounded-lg border border-green-900 px-5 py-2 text-green-950 hover:bg-green-50"
        >
          Log In
        </a>
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-6xl font-bold mb-8">
            Never let an opportunity slip through the cracks.
          </h1>

          <p className="text-xl text-gray-600 mb-10">
            PathFound organizes applications, interviews, recruiter
            conversations, and follow-ups so you always know what comes next.
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="/signup"
              className="bg-green-900 text-white px-7 py-3 rounded-lg text-lg hover:bg-green-800"
            >
              Create Account
            </a>

            <div className="flex gap-3 justify-center">
              <input
                type="email"
                placeholder="Or enter your email for the waitlist"
                className="border rounded-lg px-4 py-3 w-80"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-stone-900 text-white px-6 py-3 rounded-lg disabled:opacity-60"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </div>

            {message && <p className="mt-2 text-green-700">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}