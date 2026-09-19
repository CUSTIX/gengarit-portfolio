// Vercel serverless function: proxies the CX assistant to Gemini so the API
// key stays on the server. Set GEMINI_API_KEY (and optionally GEMINI_MODEL)
// in the Vercel project settings. The browser calls POST /api/chat with
// { messages: [{ role: "user"|"bot", content }], text }.
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL, MAX_MESSAGE_CHARS, MAX_OUTPUT_TOKENS, SYSTEM_PROMPT, toGeminiHistory } from "../src/lib/assistant.js";

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

// Soft per-instance rate limit: 20 requests per 10 minutes per IP.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!KEY) return res.status(503).json({ error: "Assistant not configured" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "Too many requests" });

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  const text = typeof body.text === "string" ? body.text.trim().slice(0, MAX_MESSAGE_CHARS) : "";
  const messages = Array.isArray(body.messages) ? body.messages.filter((m) => m && typeof m.content === "string") : [];
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const ai = new GoogleGenAI({ apiKey: KEY });
    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: MAX_OUTPUT_TOKENS },
      history: toGeminiHistory(messages),
    });
    const result = await chat.sendMessage({ message: text });
    const reply = result.text?.trim();
    if (!reply) throw new Error("empty reply");
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("assistant proxy failed:", err?.message || err);
    return res.status(502).json({ error: "Upstream failure" });
  }
}

const safeJson = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
};
