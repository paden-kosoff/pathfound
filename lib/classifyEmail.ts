export function classifyEmail(subject: string, snippet: string) {
  const text = `${subject} ${snippet}`.toLowerCase();

  if (
    text.includes("offer letter") ||
    text.includes("official offer") ||
    text.includes("employment offer")
  ) {
    return "offer";
  }

  if (
    text.includes("unfortunately") ||
    text.includes("we regret") ||
    text.includes("move forward with other candidates") ||
    text.includes("not moving forward")
  ) {
    return "rejection";
  }

  if (
    text.includes("interview") ||
    text.includes("hiring manager") ||
    text.includes("meet with") ||
    text.includes("speak with") ||
    text.includes("schedule a call")
  ) {
    return "interview";
  }

  if (
    text.includes("recruiter screen") ||
    text.includes("phone screen") ||
    text.includes("initial screen") ||
    text.includes("intro call")
  ) {
    return "screening";
  }

  if (
    text.includes("thank you for applying") ||
    text.includes("application received") ||
    text.includes("received your application") ||
    text.includes("thank you for your interest")
  ) {
    return "application";
  }

  if (
    text.includes("coffee") ||
    text.includes("networking") ||
    text.includes("introduction") ||
    text.includes("intro")
  ) {
    return "networking";
  }

  return "unknown";
}