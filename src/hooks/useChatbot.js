import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { FAQ_RESPONSES } from "../constants";
import { DEFAULT_MODEL, MAX_OUTPUT_TOKENS, MAX_QUESTIONS, SYSTEM_PROMPT, toGeminiHistory } from "../lib/assistant";

const LIMIT_REPLY = "That's plenty for this session — use the contact form below for anything else.";
const OFFLINE_REPLY = "Couldn't reach the assistant right now — use the contact form below and John will get back to you directly.";
const DEFAULT_RESPONSE =
  "I can help with questions about John's skills, projects, education, and how to get in touch. Try asking about one of those.";

// Answer sources, in order:
//   1. /api/chat  — Vercel function holding the key server-side (production)
//   2. VITE_GEMINI_API_KEY — direct browser call; the key ships in the bundle,
//      so only for local development
//   3. keyword FAQ — always available, no network
const CLIENT_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const CLIENT_MODEL = import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL;
const genAI = CLIENT_KEY ? new GoogleGenAI({ apiKey: CLIENT_KEY }) : null;

// Remember for the session when the proxy isn't deployed (404/503) so we
// don't pay a failed request per message.
let proxyAvailable = true;

const askProxy = async (messages, text) => {
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, text }),
  });
  // Not deployed (404/503/405) or a static host answering with index.html
  // for unknown routes (dev server / preview): treat as unavailable.
  const isJson = (r.headers.get("content-type") || "").includes("application/json");
  if (r.status === 404 || r.status === 503 || r.status === 405 || !isJson) {
    proxyAvailable = false;
    return null;
  }
  if (!r.ok) throw new Error(`proxy ${r.status}`);
  const data = await r.json();
  return typeof data.reply === "string" && data.reply.trim() ? data.reply.trim() : null;
};

const askBrowser = async (messages, text) => {
  const chat = genAI.chats.create({
    model: CLIENT_MODEL,
    config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: MAX_OUTPUT_TOKENS },
    history: toGeminiHistory(messages),
  });
  const result = await chat.sendMessage({ message: text });
  return result.text?.trim() || null;
};

const keywordReply = (text) => {
  const lower = text.toLowerCase();
  const match = FAQ_RESPONSES.find((faq) => faq.keywords.some((k) => lower.includes(k)));
  return match ? match.response : DEFAULT_RESPONSE;
};

const msg = (role, content) => ({ role, content, at: Date.now() });

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const asked = messages.filter((m) => m.role === "user").length;

  const reset = () => setMessages([]);

  const sendMessage = async (text) => {
    const history = messages;
    setMessages((prev) => [...prev, msg("user", text)]);
    if (asked >= MAX_QUESTIONS) {
      setMessages((prev) => [...prev, msg("bot", LIMIT_REPLY)]);
      return;
    }
    setLoading(true);
    try {
      let reply = null;
      if (proxyAvailable) reply = await askProxy(history, text);
      if (!reply && genAI) reply = await askBrowser(history, text);
      if (!reply) {
        // No model available: answer from the keyword FAQ after a short beat.
        await new Promise((r) => setTimeout(r, 500));
        reply = keywordReply(text);
      }
      setMessages((prev) => [...prev, msg("bot", reply)]);
    } catch (error) {
      console.error("Assistant error:", error);
      setMessages((prev) => [...prev, msg("bot", OFFLINE_REPLY)]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, reset, questionsLeft: Math.max(0, MAX_QUESTIONS - asked) };
};
