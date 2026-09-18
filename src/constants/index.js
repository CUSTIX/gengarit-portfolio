export const BRAND = {
  name: "CUSTIX",
  fullName: "John Eric G. Bayer",
  role: "Software Engineer",
  location: "Bacolod City, Philippines",
  tagline:
    "Computer Science graduate and software engineer focused on building web applications, backend systems, and interactive digital experiences.",
  github: "https://github.com/err-ebus",
  year: 2026,
};

// Top bar links, in order. CONTACT is rendered separately as the pill CTA.
export const NAV_LINKS = [
  { name: "About", id: "about" },
  { name: "Stack", id: "stack" },
  { name: "Work", id: "work" },
  { name: "Path", id: "path" },
];

// Left rail (desktop scrollspy), in scroll order.
export const RAIL_LINKS = [
  { name: "Home", id: "top" },
  ...NAV_LINKS,
  { name: "Contact", id: "contact" },
];

// Sections in scroll order (drives scrollspy for the nav and rail).
export const SECTIONS = RAIL_LINKS.map((l) => l.id);

export const HERO_STATS = [
  { value: 4, suffix: "", label: "MAJOR SYSTEMS" },
  { value: 12, suffix: "+", label: "TECHNOLOGIES" },
];

// Case study shown in "Engineered works".
export const FEATURED_PROJECT = {
  title: "ProSupport Squad",
  subtitle: "Virtual Assistant Marketplace Platform",
  description:
    "A U.S.-based marketplace connecting clients with pre-screened, highly educated virtual assistants. Covers the full lifecycle: browsing verified profiles, hiring, live work sessions, and billing.",
  features: [
    "Verified Profile & Hiring Flow",
    "Live Agent Dashboard & Time Tracking",
    "Secure Payments & Transparent Billing",
  ],
  impact:
    "End-to-end platform connecting clients with virtual assistants, from verified hiring through active work sessions and billing.",
  tags: ["Laravel", "Blade", "Stripe", "Twilio", "Wise", "DigitalOcean", "Cloudflare"],
  logo: "/pictures/prosupport-logo.png",
  gallery: [
    { src: "/pictures/prosupport-hero.png", alt: "ProSupport Squad hero section" },
    { src: "/pictures/prosupport-login.png", alt: "ProSupport Squad sign in screen" },
    { src: "/pictures/prosupport-dashboard.png", alt: "ProSupport Squad agent dashboard" },
    { src: "/pictures/prosupport-marketplace.png", alt: "ProSupport Squad marketplace features" },
    { src: "/pictures/prosupport-howitworks.png", alt: "ProSupport Squad how it works steps" },
    { src: "/pictures/prosupport-why.png", alt: "ProSupport Squad why us section" },
  ],
};

// "Project archive": one row per system; the shared panel shows the open one.
// `attention` rows carry a slow glow pulse to invite a click.
export const PROJECTS = [
  {
    id: 1,
    title: "Bacolod City Flood Map & Alert System",
    subtitle: "Real-time Monitoring & Alert System",
    description:
      "A specialized web application for real-time flood monitoring in Bacolod City. Integrates Open-Meteo API for live weather data and features an interactive map for community alerts and risk assessment.",
    image: "/pictures/FLOOD_SS.webp",
    tags: ["React", "Leaflet", "Open-Meteo API", "Node.js", "Tailwind"],
    features: ["Real-time Precipitation Tracking", "Interactive Risk Mapping", "Automated Alerts"],
    impact:
      "Delivered real-time geospatial alerts to over 10,000+ residents, reducing emergency response latency by approximately 30%.",
  },
  {
    id: 2,
    title: "DHSUD HOA CDD",
    subtitle: "Government Enterprise System",
    description:
      "Engineered and deployed a comprehensive registry system for the DHSUD Negros Island Region. Built to handle robust data processing with offline server environment capabilities.",
    image: "/pictures/HOA_CDD_SS.webp",
    tags: ["React", "Vue", "PostgreSQL", "Django", "Tailwind"],
    features: ["Offline Server Architecture", "Cloud Media Storage", "Government Deployment"],
    impact:
      "Successfully digitized 500+ housing association records, automating 65% of manual registry workflows for the DHSUD Negros Island Region.",
  },
  {
    id: 3,
    title: "DHSUD ELUPDD",
    subtitle: "Geospatial Dashboard & AI Analytics",
    attention: true,
    description:
      "Engineered and deployed an interactive geospatial dashboard for the DHSUD Negros Island Region. Built to monitor regional LGU compliance through dynamic choropleth mapping and integrated AI-driven analytics.",
    image: "/pictures/ELUPDD_SS.webp",
    tags: ["Vue", "Django", "PostgreSQL", "Tailwind", "Leaflet", "AI"],
    features: ["Geospatial Mapping", "Compliance Monitoring", "AI Analytics"],
    impact: "Optimized regional compliance monitoring and geospatial data rendering efficiency by 40%.",
  },
  {
    id: 4,
    title: "SENTINELS",
    subtitle: "2nd Best Thesis // RPG System",
    badge: "AWARDED",
    attention: true,
    description:
      "A massive year-and-a-half development cycle. Awarded 2nd Best Thesis, this cybersecurity-focused educational platform features interactive gameplay, a complex multi-role system, and a secure backend dashboard.",
    image: "/pictures/SENTINELS_SS.webp",
    tags: ["React", "Django", "PostgreSQL", "Python"],
    features: ["Awarded 2nd Best Thesis", "Complex State Management", "Multi-role Auth"],
    impact:
      "Awarded 2nd Best Thesis among 50+ innovative engineering entries for technical complexity and real-world relevance.",
  },
];

export const ABOUT_DATA = {
  eyebrow: "ABOUT",
  title: "The full-stack engineer",
  portraitStatus: "OPEN TO WORK",
  portraitCaption: "CX / SOFTWARE ENGINEER",
  bio: "I am a Computer Science graduate and Full-Stack Developer, currently working as a Software Engineer at a US-based company. My approach blends the reliability of backend engineering with the precision of modern frontend interfaces.",
  philosophy:
    "Building systems that don't just work, but excel under pressure. I prioritize clean, secure data pipelines, and resilient architectures.",
  status:
    "BSCS Graduate, currently a Software Engineer at a US-based company. Still accepting project inquiries while actively expanding my technical stack through R&D.",
  capabilities: [
    { label: "API_DESIGN", value: "RESTful & Async Architectures", icon: "ri-terminal-window-line" },
    { label: "SYSTEM_INTEGRATION", value: "Cross-Platform Sync", icon: "ri-links-line" },
    { label: "DATABASE_MODELING", value: "Relational & NoSQL Scaling", icon: "ri-database-2-line" },
    { label: "SECURITY_PROTOCOLS", value: "RBAC & JWT Auth", icon: "ri-shield-keyhole-line" },
    { label: "SERVER_ADMIN", value: "Offline-First Environments", icon: "ri-server-line" },
    { label: "CLOUD_DEPLOYMENT", value: "CI/CD & System Ops", icon: "ri-instance-line" },
  ],
};

export const LANGUAGES = [
  { name: "Python", icon: "devicon-python-plain" },
  { name: "C++", icon: "devicon-cplusplus-plain" },
  { name: "C#", icon: "devicon-csharp-plain" },
  { name: "Java", icon: "devicon-java-plain" },
  { name: "JavaScript", icon: "devicon-javascript-plain" },
  { name: "PHP", icon: "devicon-php-plain" },
];

export const FRAMEWORKS = [
  { name: "Django", icon: "devicon-django-plain" },
  { name: "Laravel", icon: "devicon-laravel-original" },
  { name: "Tailwind", icon: "devicon-tailwindcss-original" },
  { name: "Node.js", icon: "devicon-nodejs-plain" },
  { name: "Vue", icon: "devicon-vuejs-plain" },
  { name: "React", icon: "devicon-react-original" },
];

export const PROFICIENCY = [
  { name: "REACT", level: 9 },
  { name: "NODE.JS", level: 8 },
  { name: "DJANGO", level: 9 },
  { name: "POSTGRES", level: 8 },
  { name: "LINUX", level: 7 },
];

export const TIMELINE = [
  {
    period: "2024",
    org: "DHSUD",
    role: "Geospatial Systems Engineer",
    description:
      "Engineered and deployed an interactive geospatial dashboard (ELUPDD) for regional LGU compliance monitoring. Integrated AI-driven analytics and dynamic choropleth mapping.",
    tone: "accent",
  },
  {
    period: "2024",
    org: "DHSUD",
    role: "Software Engineer Intern",
    description:
      "Engineered and deployed a comprehensive registry system (HOA CDD). Implemented offline server architectures and managed cloud media storage pipelines.",
    tone: "deep",
  },
  {
    period: "2022 — 2026",
    org: "STI WEST NEGROS UNIVERSITY",
    role: "BS Computer Science",
    awards: ["Outstanding Freshman (2022-2023)", "Attended Machine Learning Workshop", "Attended Google DevFest"],
    tone: "muted",
  },
];

export const CONTACT = {
  heading: "Get in touch",
  meta: "OPEN FOR WORK",
  title: "Let's build something resilient.",
  blurb:
    "Open for project inquiries, system audits, and collaboration requests. I read everything that comes through and reply personally.",
  replyNote: "Usually replies within 24 hours",
};

export const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/err-ebus", icon: "ri-github-fill", hint: "github.com/err-ebus" },
  { name: "Facebook", url: "https://www.facebook.com/john.bayer.965/", icon: "ri-facebook-circle-fill", hint: "Message directly" },
  { name: "Instagram", url: "https://www.instagram.com/p.rd_/", icon: "ri-instagram-line", hint: "@p.rd_" },
];

export const RESUME_LINK = { name: "Résumé (PDF)", url: "/resume_bayer.pdf", icon: "ri-file-text-line" };

// Command palette (Cmd/Ctrl+K) entries.
export const PALETTE_ITEMS = [
  { label: "Home", hint: "Hero", href: "#top", icon: "ri-home-5-line" },
  { label: "About", hint: "Who I am", href: "#about", icon: "ri-user-line" },
  { label: "Stack", hint: "Languages & frameworks", href: "#stack", icon: "ri-code-s-slash-line" },
  { label: "Engineered works", hint: "ProSupport Squad", href: "#work", icon: "ri-rocket-line" },
  { label: "Deployments", hint: "Experience timeline", href: "#path", icon: "ri-time-line" },
  { label: "Contact", hint: "Get in touch", href: "#contact", icon: "ri-mail-line" },
  ...SOCIAL_LINKS.map((s) => ({ label: s.name, hint: s.hint, href: s.url, icon: s.icon, external: true })),
];

// Keyword fallback for the assistant when no Gemini key is configured.
export const FAQ_RESPONSES = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hey — ask me anything about John's projects, stack, or experience.",
  },
  {
    keywords: ["prosupport", "squad", "marketplace", "virtual assistant"],
    response:
      "ProSupport Squad is a U.S.-based virtual-assistant marketplace John engineered on Laravel and Blade: verified profiles, hiring flow, a live agent dashboard with time tracking, and Stripe/Twilio/Wise integrations, deployed on DigitalOcean behind Cloudflare.",
  },
  {
    keywords: ["who", "about", "custix", "john", "yourself"],
    response:
      "John Eric G. Bayer (CUSTIX) is a Full-Stack Software Engineer from Bacolod City, Philippines. A BSCS graduate of STI West Negros University, he currently works as a Software Engineer at a US-based company and specializes in resilient backend architectures paired with polished frontend interfaces.",
  },
  {
    keywords: ["skill", "technology", "tech", "stack", "programming", "language", "framework"],
    response:
      "John builds with React, Vue, Node.js, and Tailwind on the front, and Python (Django), Laravel/Blade, PostgreSQL, Java, and C# on the back. Deepest strengths: React and Django (9/10), Node.js and Postgres (8/10).",
  },
  {
    keywords: ["project", "work", "built", "portfolio", "flood", "dhsud", "sentinels"],
    response:
      "Highlights: ProSupport Squad (the featured case study), the Bacolod City Flood Map & Alert System, two DHSUD government systems (HOA CDD registry and the ELUPDD geospatial dashboard), and SENTINELS, an awarded 2nd Best Thesis. Open the Project archive rows to see each one.",
  },
  {
    keywords: ["education", "school", "degree", "university", "thesis", "award"],
    response:
      "BS Computer Science, STI West Negros University (2022-2026). Outstanding Freshman 2022-2023, 2nd Best Thesis for SENTINELS, plus Google DevFest and a Machine Learning workshop.",
  },
  {
    keywords: ["contact", "email", "hire", "reach", "message", "available"],
    response:
      "Use the contact form at the bottom of the page and John will reply personally, usually within 24 hours. You can also reach him on GitHub, Facebook, or Instagram.",
  },
];
