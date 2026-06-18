import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { classifyEmail } from "../../../../lib/classifyEmail";

export async function POST(request: Request) {
  const body = await request.json();

  const accessToken = body.accessToken;
  const userId = body.userId;
  const importMode = body.importMode || "smart";

  if (!accessToken || !userId) {
    return NextResponse.json(
      {
        error: `Missing fields: accessToken=${accessToken ? "yes" : "no"}, userId=${
          userId ? "yes" : "no"
        }`,
      },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const smartQuery =
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

  const debugQuery =
    "newer_than:6m (category:primary OR category:updates) -category:promotions -category:social -from:ctasubs -from:cta -subject:tennis";

  const query = importMode === "debug_6m_all" ? debugQuery : smartQuery;

  const pageSize = 500;
  const maxPages = importMode === "debug_6m_all" ? 10 : 2;

  let allMessages: { id: string; threadId: string }[] = [];
  let nextPageToken: string | undefined = undefined;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");

    url.searchParams.set("q", query);
    url.searchParams.set("maxResults", String(pageSize));

    if (nextPageToken) {
      url.searchParams.set("pageToken", nextPageToken);
    }

    const listRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const listData = await listRes.json();

    if (!listRes.ok) {
      return NextResponse.json(
        { error: listData.error?.message || "Failed to list Gmail messages" },
        { status: 500 }
      );
    }

    allMessages = allMessages.concat(listData.messages || []);

    if (!listData.nextPageToken) {
      break;
    }

    nextPageToken = listData.nextPageToken;
  }

  const importedMessagesRaw = await Promise.all(
    allMessages.map(async (message: { id: string; threadId: string }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const msg = await msgRes.json();

      if (!msgRes.ok) {
        return null;
      }

      const headers = msg.payload?.headers || [];

      const subject =
        headers.find((h: { name: string }) => h.name === "Subject")?.value ||
        "";

      const sender =
        headers.find((h: { name: string }) => h.name === "From")?.value || "";

      const date =
        headers.find((h: { name: string }) => h.name === "Date")?.value || null;

      const snippet = msg.snippet || "";

      if (!subject || !sender || !date) {
        return null;
      }

      return {
        user_id: userId,
        gmail_message_id: message.id,
        thread_id: message.threadId,
        sender,
        subject,
        snippet,
        message_date: new Date(date).toISOString(),
        category:
          importMode === "debug_6m_all"
            ? "unreviewed"
            : classifyEmail(subject, snippet),
        import_mode: importMode,
        reviewed: false,
      };
    })
  );



const importedMessages = importedMessagesRaw.filter(
  (message): message is NonNullable<typeof message> => message !== null
);

const { error: insertError } = await supabase
  .from("gmail_messages")
  .upsert(importedMessages, {
    onConflict: "user_id,gmail_message_id",
  });

  return NextResponse.json({
    imported: importedMessages.length,
    skipped: importedMessagesRaw.length - importedMessages.length,
    totalFetched: allMessages.length,
    pagesRequested: maxPages,
    importMode,
    query,
  });
}