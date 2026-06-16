"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Metric = {
  label: string;
  value: number;
};

export default function AppDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Applications Sent", value: 0 },
    { label: "1st Round Screenings", value: 0 },
    { label: "Intermediate Rounds", value: 0 },
    { label: "Rejections", value: 0 },
    { label: "Offers", value: 0 },
    { label: "Pending Interviews", value: 0 },
    { label: "Networking Chains", value: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("gmail_messages")
        .select("category")
        .eq("user_id", userData.user.id);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const categories = data || [];

      setMetrics([
        {
          label: "Applications Sent",
          value: categories.filter((m) => m.category === "application").length,
        },
        {
          label: "1st Round Screenings",
          value: categories.filter((m) => m.category === "screening").length,
        },
        {
          label: "Intermediate Rounds",
          value: categories.filter((m) => m.category === "interview").length,
        },
        {
          label: "Rejections",
          value: categories.filter((m) => m.category === "rejection").length,
        },
        {
          label: "Offers",
          value: categories.filter((m) => m.category === "offer").length,
        },
        {
          label: "Pending Interviews",
          value: categories.filter((m) => m.category === "interview").length,
        },
        {
          label: "Networking Chains",
          value: categories.filter((m) => m.category === "networking").length,
        },
      ]);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
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

      <section className="p-8">
        <h1 className="mb-6 text-3xl font-bold">Pathfound Dashboard</h1>

        <section className="w-full max-w-md">
          <h2 className="mb-4 text-2xl font-bold">
            Current Status Dashboard
          </h2>

          <div className="border-2 border-gray-800 bg-white p-6">
            {loading ? (
              <p className="text-gray-600">Loading dashboard...</p>
            ) : (
              <div className="space-y-5">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center rounded-2xl border-2 border-gray-800 px-6 py-4"
                  >
                    <div className="w-20 text-center text-2xl font-bold">
                      {metric.value}
                    </div>

                    <div className="flex-1 text-center text-sm font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}