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

// Primary navigation. CONTACT is rendered separately as the pill CTA.
export const NAV_LINKS = [
  { name: "Work", id: "work" },
  { name: "About", id: "about" },
  { name: "Stack", id: "stack" },
  { name: "Path", id: "path" },
];

// Sections in scroll order (used for active-link tracking).
export const SECTIONS = ["top", "work", "about", "stack", "path", "contact"];

export const HERO_STATS = [
  { value: 4, suffix: "", label: "MAJOR SYSTEMS" },
  { value: 2, suffix: "nd", label: "BEST THESIS" },
  { value: 12, suffix: "+", label: "TECHNOLOGIES" },
];

export const PROJECTS = [
  {
    id: 1,
    featured: true,
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
  portraitCaption: "CX / SYSTEM ARCHITECT",
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

// `brand` is the official logo color, revealed on hover in the Stack tiles.
export const LANGUAGES = [
  { name: "Python", icon: "devicon-python-plain", brand: "#4b8bbe" },
  { name: "C++", icon: "devicon-cplusplus-plain", brand: "#659ad2" },
  { name: "C#", icon: "devicon-csharp-plain", brand: "#9b4f96" },
  { name: "Java", icon: "devicon-java-plain", brand: "#f89820" },
  { name: "JavaScript", icon: "devicon-javascript-plain", brand: "#f7df1e" },
  { name: "PHP", icon: "devicon-php-plain", brand: "#8892bf" },
];

export const FRAMEWORKS = [
  { name: "Django", icon: "devicon-django-plain", brand: "#44b78b" },
  { name: "Laravel", icon: "devicon-laravel-original", brand: "#ff2d20" },
  { name: "Tailwind", icon: "devicon-tailwindcss-original", brand: "#06b6d4" },
  { name: "Node.js", icon: "devicon-nodejs-plain", brand: "#83cd29" },
  { name: "Vue", icon: "devicon-vuejs-plain", brand: "#42b883" },
  { name: "React", icon: "devicon-react-original", brand: "#61dafb" },
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

export const SOCIAL_LINKS = [
  { name: "GITHUB", url: "https://github.com/err-ebus", icon: "ri-github-fill" },
  { name: "FACEBOOK", url: "https://www.facebook.com/john.bayer.965/", icon: "ri-facebook-circle-fill" },
  { name: "INSTAGRAM", url: "https://www.instagram.com/p.rd_/", icon: "ri-instagram-line" },
  { name: "RESUME", url: "/resume_bayer.pdf", icon: "ri-file-text-line" },
];

// Keyword fallback for the assistant when no Gemini key is configured.
export const FAQ_RESPONSES = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response:
      "Hi, I'm the CUSTIX assistant. Ask me about John's skills, projects, education, or how to get in touch.",
  },
  {
    keywords: ["who", "about", "custix", "john", "yourself"],
    response:
      "John Eric G. Bayer (CUSTIX) is a Full-Stack Software Engineer from Bacolod City, Philippines. A BSCS graduate of STI West Negros University, he currently works as a Software Engineer at a US-based company and specializes in resilient backend architectures paired with polished frontend interfaces.",
  },
  {
    keywords: ["skill", "technology", "tech", "stack", "programming", "language", "framework"],
    response:
      "John builds with React, Vue, Node.js, and Tailwind on the front, and Python (Django), Laravel, PostgreSQL, Java, and C# on the back. Deepest strengths: React and Django (9/10), Node.js and Postgres (8/10).",
  },
  {
    keywords: ["project", "work", "built", "portfolio", "flood", "dhsud", "sentinels"],
    response:
      "Highlights: the Bacolod City Flood Map & Alert System (real-time geospatial alerts for 10,000+ residents), two DHSUD government systems (HOA CDD registry and the ELUPDD geospatial dashboard), and SENTINELS, an awarded 2nd Best Thesis. Scroll to Engineered works to expand each one.",
  },
  {
    keywords: ["education", "school", "degree", "university", "thesis", "award"],
    response:
      "BS Computer Science, STI West Negros University (2022-2026). Outstanding Freshman 2022-2023, 2nd Best Thesis for SENTINELS, plus Google DevFest and a Machine Learning workshop.",
  },
  {
    keywords: ["contact", "email", "hire", "reach", "message", "available"],
    response:
      "Use the contact form at the bottom of the page and John will reply directly. You can also reach him on GitHub, Facebook, or Instagram via the links there.",
  },
];
