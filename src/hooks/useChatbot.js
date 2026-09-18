import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ABOUT_DATA,
  BRAND,
  FAQ_RESPONSES,
  FRAMEWORKS,
  LANGUAGES,
  PROFICIENCY,
  PROJECTS,
  TIMELINE,
} from "../constants";

const DEFAULT_RESPONSE =
  "I can help with questions about John's skills, projects, education, and how to get in touch. Try asking about one of those.";

// SECURITY NOTE: Vite inlines all VITE_* env vars into the client bundle, so
// this key is publicly visible on the deployed site. For production, proxy
// the Gemini calls through a serverless function and restrict the key
// (HTTP referrer + quota limits) in Google Cloud.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `
You are the ${BRAND.name} assistant on the portfolio site of ${BRAND.fullName} (brand: ${BRAND.name}), a ${BRAND.role} from ${BRAND.location}.
Answer questions from visitors and recruiters about John using ONLY the data below. Be concise, warm, and professional; plain sentences, no headings, at most one emoji per reply and only when it fits.
If something is not covered, say you don't have that detail and suggest using the contact form at the bottom of the page.

ABOUT: ${JSON.stringify(ABOUT_DATA)}
LANGUAGES: ${JSON.stringify(LANGUAGES.map((l) => l.name))}
FRAMEWORKS: ${JSON.stringify(FRAMEWORKS.map((f) => f.name))}
PROFICIENCY (1-10): ${JSON.stringify(PROFICIENCY)}
PROJECTS: ${JSON.stringify(PROJECTS.map((p) => ({ ...p, image: undefined })))}
EXPERIENCE_AND_EDUCATION: ${JSON.stringify(TIMELINE)}
LINKS: GitHub ${BRAND.github}
`;

const keywordReply = (text) => {
  const lower = text.toLowerCase();
  const match = FAQ_RESPONSES.find((faq) => faq.keywords.some((k) => lower.includes(k)));
  return match ? match.response : DEFAULT_RESPONSE;
};

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: SYSTEM_PROMPT });
        const chat = model.startChat({
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        });
        const result = await chat.sendMessage(text);
        setMessages((prev) => [...prev, { role: "bot", content: result.response.text() }]);
      } else {
        // No API key configured: answer from the keyword FAQ instead.
        await new Promise((r) => setTimeout(r, 600));
        setMessages((prev) => [...prev, { role: "bot", content: keywordReply(text) }]);
      }
    } catch (error) {
      console.error("Assistant error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I hit a connection problem. Please try again in a moment, or use the contact form below." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
