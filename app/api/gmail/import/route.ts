import { NextResponse } from "next/server";
import { classifyEmail } from "../../../../lib/classifyEmail";

export async function POST(request: Request) {
  const { accessToken, userId } = await request.json();

  if (!accessToken || !userId) {
    return NextResponse.json(
      { error: "Missing accessToken or userId" },
      { status: 400 }
    );
  }

const query =
  'newer_than:12m (' +
  'subject:"thank you for applying" OR ' +
  'subject:"thank you for your interest" OR ' +
  'subject:"application received" OR ' +
  'subject:"next steps" OR ' +
  'subject:interview OR ' +
  'subject:"schedule a call" OR ' +
  'subject:"hiring manager" OR ' +
  'subject:"head of sales" OR ' +
  '"we regret to inform you" OR ' +
  '"unfortunately we" OR ' +
  '"move forward with other candidates" OR ' +
  '"thank you for your interest"' +
  ')';

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
      query
    )}&maxResults=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const listData = await listRes.json();

  if (!listRes.ok) {
    return NextResponse.json(
      { error: listData.error?.message || "Failed to list Gmail messages" },
      { status: 500 }
    );
  }

  const messages = listData.messages || [];

  const importedMessages = await Promise.all(
    messages.map(async (message: { id: string; threadId: string }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const msg = await msgRes.json();

      const headers = msg.payload?.headers || [];

      const subject =
        headers.find((h: { name: string }) => h.name === "Subject")?.value ||
        "";

      const sender =
        headers.find((h: { name: string }) => h.name === "From")?.value || "";

      const date =
        headers.find((h: { name: string }) => h.name === "Date")?.value || null;

      return {
        user_id: userId,
        gmail_message_id: msg.id,
        thread_id: msg.threadId,
        sender,
        subject,
        snippet: msg.snippet || "",
        message_date: date ? new Date(date).toISOString() : null,
        category: classifyEmail(subject, msg.snippet || ""),
      };
    })
  );

  return NextResponse.json({
    imported: importedMessages.length,
    messages: importedMessages,
  });
}