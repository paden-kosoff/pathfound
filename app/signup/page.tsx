"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://pathfound.app/welcome",
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to confirm your account.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-3">Create your account</h1>
        <p className="text-gray-600 mb-8">
          Start organizing your opportunities, interviews, and follow-ups.
        </p>

        <input
          className="border rounded-lg px-4 py-3 w-full mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border rounded-lg px-4 py-3 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-green-900 text-white rounded-lg px-6 py-3 w-full"
        >
          Create Account
        </button>

        {message && <p className="mt-4 text-green-700">{message}</p>}
      </div>
    </main>
  );
}