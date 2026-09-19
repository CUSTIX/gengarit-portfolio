import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  ABOUT_DATA,
  BRAND,
  FAQ_RESPONSES,
  FEATURED_PROJECT,
  FRAMEWORKS,
  LANGUAGES,
  PROFICIENCY,
  PROJECTS,
  TIMELINE,
} from "../constants";

// Questions per page load before the assistant points to the contact form.
const MAX_QUESTIONS = 12;
const LIMIT_REPLY = "That's plenty for this session — use the contact form below for anything else.";

const DEFAULT_RESPONSE =
  "I can help with questions about John's skills, projects, education, and how to get in touch. Try asking about one of those.";

// SECURITY NOTE: Vite inlines all VITE_* env vars into the client bundle, so
// this key is publicly visible on the deployed site. For production, proxy
// the Gemini calls through a serverless function and restrict the key
// (HTTP referrer + quota limits) in Google Cloud.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const SYSTEM_PROMPT = `
You are the ${BRAND.name} assistant on the portfolio site of ${BRAND.fullName} (brand: ${BRAND.name}), a ${BRAND.role} from ${BRAND.location}.
Answer questions from visitors and recruiters about John using ONLY the data below. Keep answers short (2-4 sentences), friendly, and specific; plain sentences, no headings, no emoji.
If asked something unrelated to John or his work, or not covered below, say so and redirect politely to the contact form at the bottom of the page.

ABOUT: ${JSON.stringify(ABOUT_DATA)}
LANGUAGES: ${JSON.stringify(LANGUAGES.map((l) => l.name))}
FRAMEWORKS: ${JSON.stringify(FRAMEWORKS.map((f) => f.name))}
PROFICIENCY (1-10): ${JSON.stringify(PROFICIENCY)}
FEATURED_CASE_STUDY: ${JSON.stringify({ ...FEATURED_PROJECT, gallery: undefined, logo: undefined })}
PROJECT_ARCHIVE: ${JSON.stringify(PROJECTS.map((p) => ({ ...p, image: undefined })))}
EXPERIENCE_AND_EDUCATION: ${JSON.stringify(TIMELINE)}
LINKS: GitHub ${BRAND.github}
`;

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
    setMessages((prev) => [...prev, msg("user", text)]);
    if (asked >= MAX_QUESTIONS) {
      setMessages((prev) => [...prev, msg("bot", LIMIT_REPLY)]);
      return;
    }
    setLoading(true);

    try {
      if (genAI) {
        const chat = genAI.chats.create({
          model: GEMINI_MODEL,
          config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 300 },
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        });
        const result = await chat.sendMessage({ message: text });
        const reply = result.text?.trim();
        if (!reply) throw new Error("empty reply");
        setMessages((prev) => [...prev, msg("bot", reply)]);
      } else {
        // No API key configured: answer from the keyword FAQ instead.
        await new Promise((r) => setTimeout(r, 600));
        setMessages((prev) => [...prev, msg("bot", keywordReply(text))]);
      }
    } catch (error) {
      console.error("Assistant error:", error);
      setMessages((prev) => [
        ...prev,
        msg("bot", "Couldn't reach the assistant right now — use the contact form below and John will get back to you directly."),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, reset, questionsLeft: Math.max(0, MAX_QUESTIONS - asked) };
};
