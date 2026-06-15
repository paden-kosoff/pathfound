export function classifyEmail(subject: string, snippet: string) {
  const text = `${subject} ${snippet}`.toLowerCase();

  if (
    text.includes("schedule") &&
    text.includes("interview")
  ) {
    return "interview_request";
  }

  if (
    text.includes("thank you for applying")
  ) {
    return "application_submitted";
  }

  if (
    text.includes("unfortunately") &&
    text.includes("move forward")
  ) {
    return "rejection";
  }

  if (
    text.includes("offer")
  ) {
    return "offer";
  }

  return "unknown";
}