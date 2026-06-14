"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setLoading(true);

    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("You're on the waitlist!");
      setEmail("");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-6xl font-bold mb-8">
          Never let an opportunity slip through the cracks.
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          PathFound organizes applications, interviews, recruiter
          conversations, and follow-ups so you always know what comes next.
        </p>

        <div className="flex gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded-lg px-4 py-3 w-80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-900 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
        </div>

        {message && (
          <p className="mt-6 text-green-700">{message}</p>
        )}
      </div>
    </main>
  );
}