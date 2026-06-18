"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type GmailMessage = {
  id: number;
  sender: string | null;
  subject: string | null;
  snippet: string | null;
  message_date: string | null;
  category: string | null;
  import_mode: string | null;
  reviewed: boolean | null;
  is_career_related: boolean | null;
  confidence_score: number | null;
  company_guess: string | null;
  role_guess: string | null;
  classification_reason: string | null;
};

export default function ImportReviewPage() {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMessages();
  }, [filter]);

  async function loadMessages() {
    setLoading(true);

    let query = supabase
      .from("gmail_messages")
      .select("*")
      .order("message_date", { ascending: false })
      .limit(200);

    if (filter === "unreviewed") {
      query = query.eq("reviewed", false);
    }

    if (filter === "career") {
      query = query.eq("is_career_related", true);
    }

    if (filter === "not_career") {
      query = query.eq("is_career_related", false);
    }

    if (filter === "debug") {
      query = query.eq("import_mode", "debug_6m_all");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading gmail messages:", error);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  }

  async function markMessage(id: number, isCareerRelated: boolean) {
    const { error } = await supabase
      .from("gmail_messages")
      .update({
        reviewed: true,
        is_career_related: isCareerRelated,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating message:", error);
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? {
              ...message,
              reviewed: true,
              is_career_related: isCareerRelated,
            }
          : message
      )
    );
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>Import Review</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Review raw Gmail messages before they become opportunities.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {["all", "unreviewed", "career", "not_career", "debug"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            style={{
              padding: "8px 12px",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              background: filter === item ? "#1f2937" : "white",
              color: filter === item ? "white" : "#1f2937",
              cursor: "pointer",
            }}
          >
            {item.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "16px",
                background: "white",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>
                {message.message_date
                  ? new Date(message.message_date).toLocaleString()
                  : "No date"}
              </div>

              <h3 style={{ margin: "8px 0" }}>
                {message.subject || "(No subject)"}
              </h3>

              <p style={{ margin: "4px 0", color: "#333" }}>
                <strong>From:</strong> {message.sender || "Unknown sender"}
              </p>

              <p style={{ color: "#555" }}>{message.snippet}</p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  marginTop: "12px",
                  fontSize: "13px",
                }}
              >
                <div>
                  <strong>Category:</strong>
                  <br />
                  {message.category || "—"}
                </div>

                <div>
                  <strong>Company:</strong>
                  <br />
                  {message.company_guess || "—"}
                </div>

                <div>
                  <strong>Confidence:</strong>
                  <br />
                  {message.confidence_score ?? "—"}
                </div>

                <div>
                  <strong>Import:</strong>
                  <br />
                  {message.import_mode || "—"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button
                  onClick={() => markMessage(message.id, true)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #064e3b",
                    background: "#ecfdf5",
                    cursor: "pointer",
                  }}
                >
                  Career
                </button>

                <button
                  onClick={() => markMessage(message.id, false)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #7f1d1d",
                    background: "#fef2f2",
                    cursor: "pointer",
                  }}
                >
                  Not Career
                </button>

                {message.reviewed && (
                  <span style={{ alignSelf: "center", color: "#555" }}>
                    Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}