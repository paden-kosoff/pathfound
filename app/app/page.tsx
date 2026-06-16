export default function AppDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Pathfound Dashboard</h1>

      <section className="w-full max-w-md">
        <h2 className="mb-4 text-2xl font-bold">
          Current Status Dashboard
        </h2>

        <div className="border-2 border-gray-800 bg-white p-6">
          <div className="space-y-5">
            {[
              ["50", "Applications Sent"],
              ["10", "1st Round Screenings"],
              ["15", "Intermediate Rounds"],
              ["45", "Rejections"],
              ["1", "Offers"],
              ["2", "Pending Interviews"],
              ["3", "Networking Chains"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="flex items-center rounded-2xl border-2 border-gray-800 px-6 py-4"
              >
                <div className="w-20 text-center text-2xl font-bold">
                  {value}
                </div>
                <div className="flex-1 text-center text-sm font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}