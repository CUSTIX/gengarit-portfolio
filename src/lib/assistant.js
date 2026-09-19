// Shared by the browser hook (src/hooks/useChatbot.js) and the Vercel
// function (api/chat.js). Keep this file free of React / browser globals.
import { ABOUT_DATA, BRAND, FEATURED_PROJECT, FRAMEWORKS, LANGUAGES, PROFICIENCY, PROJECTS, TIMELINE, TOOLS } from "../constants/index.js";

export const DEFAULT_MODEL = "gemini-2.5-flash";
export const MAX_OUTPUT_TOKENS = 300;
// Questions per page load before the assistant points to the contact form.
export const MAX_QUESTIONS = 12;
// Hard caps on what the proxy will accept from a client.
export const MAX_HISTORY = 24;
export const MAX_MESSAGE_CHARS = 600;

export const SYSTEM_PROMPT = `
You are the ${BRAND.name} assistant on the portfolio site of ${BRAND.fullName} (brand: ${BRAND.name}), a ${BRAND.role} from ${BRAND.location}.
Answer questions from visitors and recruiters about John using ONLY the data below. Keep answers short (2-4 sentences), friendly, and specific; plain sentences, no headings, no emoji.
If asked something unrelated to John or his work, or not covered below, say so and redirect politely to the contact form at the bottom of the page.

ABOUT: ${JSON.stringify(ABOUT_DATA)}
LANGUAGES: ${JSON.stringify(LANGUAGES.map((l) => l.name))}
FRAMEWORKS: ${JSON.stringify(FRAMEWORKS.map((f) => f.name))}
TOOLS: ${JSON.stringify(TOOLS)}
PROFICIENCY (1-10): ${JSON.stringify(PROFICIENCY)}
FEATURED_CASE_STUDY: ${JSON.stringify({ ...FEATURED_PROJECT, gallery: undefined, logo: undefined })}
PROJECT_ARCHIVE: ${JSON.stringify(PROJECTS.map((p) => ({ ...p, image: undefined })))}
EXPERIENCE_AND_EDUCATION: ${JSON.stringify(TIMELINE)}
LINKS: GitHub ${BRAND.github}
`;

/** Convert our {role: "user"|"bot", content} history to Gemini's shape. */
export const toGeminiHistory = (messages) =>
  messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: String(m.content).slice(0, MAX_MESSAGE_CHARS) }],
  }));
