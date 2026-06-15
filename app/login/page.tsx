"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/welcome";
    }
  }

async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://pathfound.app/welcome",
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    setMessage(error.message);
  }
}

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-3">Log in</h1>

        <p className="text-gray-600 mb-8">
          Welcome back to PathFound.
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
          onClick={handleLogin}
          className="bg-green-900 text-white rounded-lg px-6 py-3 w-full"
        >
          Log In
        </button>

        <div className="my-6 text-center text-gray-400">
          — or —
        </div>

        <button
          onClick={handleGoogleLogin}
          className="border rounded-lg px-6 py-3 w-full hover:bg-gray-50"
        >
          Continue with Google
        </button>

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </main>
  );
}