// Single source of truth for portfolio content (from Mujtaba_CV.pdf).

export const PROFILE = {
  name: "Mujtaba Tariq",
  handle: "MUJTABA.EXE",
  title: "AI / Full-Stack Developer",
  tagline: "LLM Fine-Tuning · Automation Systems",
  location: "Islamabad, Pakistan",
  email: "mujtabatariq01@gmail.com",
  site: "mujtabatariq.dev",
  cv: "/Mujtaba_CV.pdf",
  summary:
    "AI and Full-Stack Developer with 2+ years building production-grade machine learning, LLM, and automation systems across healthcare, e-commerce, and bioinformatics. I ship end-to-end: from fine-tuning Phi-3 Mini on consumer hardware via QLoRA to multi-source data pipelines that combine Shopify, third-party APIs and local LLM inference. Looking for applied ML, AI Engineering or LLM tooling roles where I can deliver measurable business impact.",
  education: {
    school: "Bahria University",
    degree: "BS Information Technology",
    dates: "Mar 2021 – Feb 2025",
    cgpa: "3.25 / 4.00",
    coursework: [
      "Data Structures",
      "Object-Oriented Programming",
      "Database Design & Management",
      "Software Requirements Engineering",
    ],
  },
  languages: ["English (Professional)", "Urdu (Native)"],
};

export const LINKS = [
  { id: "email", label: "EMAIL", href: "mailto:mujtabatariq01@gmail.com", text: "mujtabatariq01@gmail.com" },
  { id: "linkedin", label: "LINKEDIN", href: "https://www.linkedin.com/in/mujtabatariq09", text: "in/mujtabatariq09" },
  { id: "github", label: "GITHUB", href: "https://github.com/MujtabaIT2002", text: "MujtabaIT2002" },
  { id: "chess", label: "CHESS.COM", href: "https://www.chess.com/member/Mujju2002", text: "Mujju2002" },
  { id: "instagram", label: "INSTAGRAM", href: "https://www.instagram.com/mujtaba.tariq.184", text: "@mujtaba.tariq.184" },
  { id: "reddit", label: "REDDIT", href: "https://www.reddit.com/user/Mujjutariq", text: "u/Mujjutariq" },
] as const;

export interface Role {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  bullets: string[];
  loot: string[];
}

export const EXPERIENCE: Role[] = [
  {
    id: "motive",
    role: "Data Annotator",
    company: "Motive",
    location: "Islamabad, Pakistan",
    start: "Jan 2026",
    end: null,
    bullets: [
      "Designed an internal workflow optimisation process that improved task allocation and lifted pod throughput by an estimated 70%, adopted across the annotation team.",
      "Contribute to training-data pipelines for fleet computer-vision models: bounding boxes on large-scale video for object detection, scene understanding and motion tracking.",
      "Drive frame-level QA across dynamic scenes, improving annotation consistency and reducing downstream retraining cycles.",
      "Operate in a pod-based delivery model, consistently meeting SLA targets for throughput, accuracy and guideline compliance.",
    ],
    loot: ["Computer Vision", "Video Annotation", "QA", "Process Design"],
  },
  {
    id: "rebiz",
    role: "AI Solutions Developer",
    company: "Rebiz (Oxiliry)",
    location: "Remote / Pakistan",
    start: "Jun 2025",
    end: "Sep 2025",
    bullets: [
      "Architected and shipped AI automation for daily summaries, email triage, uptime monitoring and weekly executive reporting, saving an estimated 5 hours/week of manual reporting.",
      "Engineered a multi-source data pipeline unifying Shopify Admin API, search feeds, news APIs and local LLM inference into structured operational-intelligence reports.",
      "Delivered a competitor price-matching and normalisation engine powering pricing-intelligence dashboards across competitor SKUs.",
      "Containerised backend workflows with Docker and exposed them via Flask REST APIs for reliable hand-off to dashboards.",
    ],
    loot: ["Python", "Flask", "Docker", "Shopify Admin API", "Local LLMs", "REST APIs"],
  },
  {
    id: "macrosoar",
    role: "MERN Stack Developer",
    company: "Macro Soar",
    location: "Pakistan",
    start: "Mar 2025",
    end: "May 2025",
    bullets: [
      "Shipped core features of ormo.ai, an AI consultancy platform where consultants register and deploy custom AI chatbots without writing code.",
      "Built responsive React.js interfaces for onboarding, chatbot configuration and end-user flows, increasing self-service completion and reducing support load.",
      "Developed Node.js + MongoDB services managing users, consultancy sessions and chatbot metadata with a focus on scalability and data integrity.",
    ],
    loot: ["React.js", "Node.js", "MongoDB", "Express.js"],
  },
  {
    id: "digital",
    role: "Front-End Developer Intern",
    company: "Digital Empowerment",
    location: "Pakistan",
    start: "Sep 2024",
    end: "Feb 2025",
    bullets: [
      "Built a production-ready React search engine on an external API, structured around reusable components and predictable state.",
      "Used React Hooks + Context API to centralise state, optimise data fetching and cut redundant re-renders.",
      "Implemented dynamic form handling and client-side validation, improving input reliability.",
    ],
    loot: ["React.js", "Context API", "JavaScript"],
  },
  {
    id: "insafdaar",
    role: "JavaScript Developer",
    company: "Insafdaar",
    location: "Pakistan",
    start: "Jul 2024",
    end: "Sep 2024",
    bullets: [
      "Led a small engineering team delivering Google Workspace automation across Drive, Sheets, Gmail and Calendar.",
      "Engineered Google Apps Script automations integrated with third-party APIs, consolidating workflows into one automation layer.",
      "Built dynamic web forms wired into Google Sheets for real-time capture, tracking and reporting.",
    ],
    loot: ["Google Apps Script", "JavaScript", "Team Lead"],
  },
];

export interface Project {
  id: string;
  title: string;
  tag: string;
  img: string;
  blurb: string;
  points: string[];
  stack: string[];
  code?: string;
  demo?: string;
  demoLabel?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "phi3",
    title: "Phi-3 Mini Marketing AI",
    tag: "LLM FINE-TUNING / QLORA",
    img: "/px/marketing_chatbot.webp",
    blurb: "Fine-tuned Phi-3 Mini 4k-Instruct into a domain-specific marketing assistant for captions, ad copy, slogans and brand content.",
    points: [
      "Curated 400 structured samples; clearly better tone control and brand phrasing than the base model.",
      "Full training stack on a 4GB GTX 1650: 4-bit NF4, QLoRA, PEFT, gradient checkpointing, paged AdamW.",
    ],
    stack: ["Python", "Transformers", "PEFT", "QLoRA", "4-bit Quantization", "CUDA"],
    code: "https://github.com/MujtabaIT2002/Marketing_bot",
  },
  {
    id: "construction",
    title: "Smart Construction Model",
    tag: "FULL-STACK ML SYSTEM",
    img: "/px/smart_construction.webp",
    blurb: "Full-stack platform for construction cost estimation, real-estate recommendation and society analytics behind one UX.",
    points: [
      "XGBoost price-prediction engine for house and plot price trends.",
      "K-means + KNN recommender on Google Maps geolocation data to surface relevant societies.",
    ],
    stack: ["React.js", "Node.js", "Flask", "PostgreSQL", "Prisma", "XGBoost", "K-means", "KNN", "Google Maps API", "JWT"],
    code: "https://github.com/MujtabaIT2002/Smart_Construction_Model",
    demo: "https://www.youtube.com/watch?v=QcEYbaHG06I",
    demoLabel: "VIDEO",
  },
  {
    id: "protein",
    title: "Protein Antigenicity Predictor",
    tag: "BIOINFORMATICS / DEEP LEARNING",
    img: "/px/protein_antigenecity.webp",
    blurb: "Flask web app predicting protein antigenicity from FASTA input with UniRep-style embeddings and a CNN classifier.",
    points: [
      "Embeddings + CNN classifier for immunogenicity prediction with confidence output.",
      "Containerised with Docker + Gunicorn into a deployment-ready service.",
    ],
    stack: ["Python", "Flask", "PyTorch", "TensorFlow", "CNN", "UniRep", "Docker"],
    code: "https://github.com/MujtabaIT2002/ProteinSequence",
    demo: "https://huggingface.co/spaces/Mujju2002/protein-antigenicity-predictor",
    demoLabel: "LIVE DEMO",
  },
  {
    id: "medical",
    title: "Medical AI Assistant Bot",
    tag: "AI ASSISTANT / HEALTHCARE",
    img: "/px/medical_assistant.webp",
    blurb: "AI triage assistant that collects symptoms, asks severity-based follow-ups and routes users to guidance, urgent care or doctors.",
    points: [
      "Triage-style conversation flow: general guidance, urgent messaging, doctor recommendation.",
      "Playwright scraper ingests top-doctor data from Marham for doctor discovery and matching.",
    ],
    stack: ["Python", "Playwright", "LLM Integration", "REST APIs"],
  },
  {
    id: "solace",
    title: "Solace Pixel",
    tag: "AUTOMATION / META GRAPH API",
    img: "/px/solace.webp",
    blurb: "Streamlit tool that generates portrait-format social posts, uploads to Cloudinary and publishes to Instagram and Facebook.",
    points: [
      "End-to-end pipeline: design → caption + hashtags → Cloudinary → Meta Graph API publish.",
      "Powers the live account @solace.in.pixel.",
    ],
    stack: ["Python", "Streamlit", "Cloudinary", "Meta Graph API", "Pillow"],
    code: "https://github.com/MujtabaIT2002/solace-pixel",
    demo: "https://www.instagram.com/solace.in.pixel/",
    demoLabel: "INSTAGRAM",
  },
  {
    id: "xray",
    title: "X-ray Image Classification",
    tag: "COMPUTER VISION / ML",
    img: "/px/xray.webp",
    blurb: "Web app classifying chest X-rays as Normal or COVID-19 with an OpenCV preprocessing pipeline and a KNN classifier.",
    points: [
      "Grayscale conversion, resizing and normalisation with OpenCV.",
      "Accuracy, confusion matrix and ROC curve surfaced in the UI next to live predictions.",
    ],
    stack: ["Python", "Flask", "OpenCV", "Scikit-learn", "KNN"],
  },
  {
    id: "daraz",
    title: "Terminal Daraz Scraper",
    tag: "SCRAPING / CLI",
    img: "/px/scrapper.webp",
    blurb: "Playwright-driven CLI extracting product titles, prices, ratings, reviews and screenshots as structured JSON.",
    points: ["Search → paginate → extract → JSON export for market and price intelligence."],
    stack: ["Node.js", "Playwright", "JavaScript"],
    code: "https://github.com/MujtabaIT2002/terminal_based_daraz_scrappe",
  },
  {
    id: "prayer",
    title: "Prayer Time Engine",
    tag: "ALGORITHMS / CLI",
    img: "/px/prayer.webp",
    blurb: "CLI engine computing Fajr, Dhuhr, Asr, Maghrib and Isha from astronomical inputs with zero external dependencies.",
    points: ["Solar declination, equation of time, solar noon and hour-angle rules, fully offline."],
    stack: ["Python", "Node.js", "Astronomical Algorithms"],
  },
];

export interface SkillGroup {
  id: string;
  label: string;
  color: string;
  items: { name: string; abbr: string }[];
}

export const SKILLS: SkillGroup[] = [
  {
    id: "core",
    label: "CORE",
    color: "#00e5ff",
    items: [
      { name: "Python", abbr: "PY" },
      { name: "JavaScript", abbr: "JS" },
      { name: "React.js", abbr: "RX" },
      { name: "Node.js", abbr: "ND" },
      { name: "PyTorch", abbr: "PT" },
      { name: "Transformers", abbr: "HF" },
      { name: "PEFT", abbr: "PF" },
      { name: "QLoRA", abbr: "QL" },
      { name: "REST APIs", abbr: "RS" },
      { name: "PostgreSQL", abbr: "PG" },
      { name: "Docker", abbr: "DK" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    color: "#ff2e88",
    items: [
      { name: "TensorFlow", abbr: "TF" },
      { name: "Scikit-learn", abbr: "SK" },
      { name: "OpenCV", abbr: "CV" },
      { name: "XGBoost", abbr: "XG" },
      { name: "KNN", abbr: "KN" },
      { name: "K-means", abbr: "KM" },
      { name: "CNN", abbr: "CN" },
      { name: "LLM Fine-Tuning", abbr: "FT" },
      { name: "4-bit Quantization", abbr: "Q4" },
      { name: "Model Deployment", abbr: "MD" },
    ],
  },
  {
    id: "web",
    label: "WEB & BACKEND",
    color: "#ffd319",
    items: [
      { name: "Express.js", abbr: "EX" },
      { name: "Flask", abbr: "FL" },
      { name: "Streamlit", abbr: "ST" },
      { name: "JWT", abbr: "JW" },
      { name: "Prisma", abbr: "PR" },
      { name: "MongoDB", abbr: "MG" },
      { name: "MySQL", abbr: "MY" },
    ],
  },
  {
    id: "auto",
    label: "AUTOMATION",
    color: "#7cff4f",
    items: [
      { name: "Playwright", abbr: "PW" },
      { name: "Web Scraping", abbr: "WS" },
      { name: "Google Apps Script", abbr: "GS" },
      { name: "Shopify Admin API", abbr: "SH" },
      { name: "Meta Graph API", abbr: "MT" },
      { name: "Google Maps API", abbr: "GM" },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    color: "#b967ff",
    items: [
      { name: "Git", abbr: "GT" },
      { name: "GitHub", abbr: "GH" },
      { name: "Postman", abbr: "PM" },
      { name: "Cloudinary", abbr: "CL" },
      { name: "CUDA", abbr: "CU" },
      { name: "Hugging Face Hub", abbr: "HB" },
    ],
  },
];

/** Where a skill shows up across projects and roles (case-insensitive match on stack/loot/bullets). */
export function skillUsage(skill: string): string[] {
  const key = skill.toLowerCase().replace(/\.js$/, "");
  const aliases: Record<string, string[]> = {
    transformers: ["transformers"],
    "hugging face hub": ["hugging face", "huggingface"],
    "llm fine-tuning": ["fine-tun", "qlora"],
    "4-bit quantization": ["4-bit", "nf4"],
    "model deployment": ["docker", "deploy", "hugging face"],
    "web scraping": ["scrap", "playwright"],
    "google maps api": ["google maps"],
    "rest apis": ["rest api"],
    cnn: ["cnn"],
    jwt: ["jwt"],
    git: ["github"],
  };
  const needles = aliases[key] ?? [key];
  const hit = (s: string) => needles.some((n) => s.toLowerCase().includes(n));
  const out: string[] = [];
  for (const p of PROJECTS) {
    if ([...p.stack, p.blurb, ...p.points].some(hit)) out.push(p.title);
  }
  for (const r of EXPERIENCE) {
    if ([...r.loot, ...r.bullets].some(hit)) out.push(`${r.role} @ ${r.company}`);
  }
  return out;
}

export const ZONES = [
  { id: "about", label: "HOME", name: "About", key: "1", color: "#ff5a3c" },
  { id: "quests", label: "QUESTS", name: "Experience", key: "2", color: "#b967ff" },
  { id: "arcade", label: "ARCADE", name: "Projects", key: "3", color: "#ff2e88" },
  { id: "skills", label: "SKILLS", name: "Skills", key: "4", color: "#00e5ff" },
  { id: "chess", label: "CHESS", name: "Chess", key: "5", color: "#ffd319" },
  { id: "mail", label: "MAIL", name: "Contact", key: "6", color: "#7cff4f" },
  { id: "terminal", label: "TERM", name: "Terminal", key: "7", color: "#c6fbff" },
] as const;

export type ZoneId = (typeof ZONES)[number]["id"];
