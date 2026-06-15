export default function Home() {
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

          <a
            href="/signup"
            className="inline-block bg-green-900 text-white px-7 py-3 rounded-lg text-lg hover:bg-green-800"
          >
            Create Account
          </a>
        </div>
      </section>
    </main>
  );
}