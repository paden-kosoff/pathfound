"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Account() {
  const [email, setEmail] = useState<string | undefined>("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
      } else {
        setEmail(data.user.email);
      }

      setChecking(false);
    }

    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
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
          <a href="/" className="text-gray-700 hover:text-black">
            Home
          </a>
          <a href="/welcome" className="text-gray-700 hover:text-black">
            Welcome
          </a>
          <a href="/account" className="text-gray-900 font-medium">
            Account
          </a>
          <button onClick={handleLogout} className="text-gray-700 hover:text-black">
            Log out
          </button>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Account</h1>
        <p className="text-gray-600 mb-8">
          Manage your PathFound account.
        </p>

        <div className="bg-white border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>

          <p className="text-sm text-gray-500 mb-2">Email</p>
          <p className="font-medium">{email}</p>
        </div>
      </section>
    </main>
  );
}