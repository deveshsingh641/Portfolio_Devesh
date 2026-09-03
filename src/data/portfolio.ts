import { Award, FileText } from "lucide-react";
import type { CertificationItem, EducationItem, ProjectItem, TechCategory } from "../types";

export const SITE = {
  name: "Devesh Singh",
  title: "Full-Stack Developer",
  tagline: "Building AI-powered tools for education & analytics",
  proofLine: "ClassIntel — live feedback platform with sentiment analysis & real-time dashboards",
  url: "https://deveshdev.live",
  email: "deveshsingh20666@gmail.com",
  github: "deveshsingh641",
  linkedin: "deveshsingh64",
  twitter: "harshhere_666",
  location: "India",
  openTo: "Internships · Full-time · Remote-friendly",
} as const;

export const techCategories: TechCategory[] = [
  {
    title: "Languages",
    icon: "code",
    techs: [
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    ],
  },
  {
    title: "Frontend",
    icon: "globe",
    techs: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    ],
  },
  {
    title: "Backend & Databases",
    icon: "server",
    techs: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Mongoose ODM", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    ],
  },
  {
    title: "DevOps & Version Control",
    icon: "gitbranch",
    techs: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
      { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
    ],
  },
  {
    title: "Tools",
    icon: "wrench",
    techs: [
      { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "ESLint", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" },
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "B.Tech – Information Technology",
    school: "ABES Engineering College, Ghaziabad",
    year: "Aug 2023 – Present",
    score: "CGPA: 8.0 / 10.0",
  },
  {
    degree: "Senior Secondary (Class XII), CBSE",
    school: "Sant Atulanand Convent School, Varanasi",
    year: "2023",
    score: "89.02%",
  },
  {
    degree: "Secondary (Class X), CBSE",
    school: "Sant Atulanand Convent School, Varanasi",
    year: "2021",
    score: "94.6%",
  },
];

export const certifications: CertificationItem[] = [
  {
    name: "Mastering Agentic Design Patterns with Hands-on Projects",
    source: "Udemy",
    year: "2026",
    icon: Award,
  },
  {
    name: "Google Cloud: Essentials, Generative AI & Kubernetes",
    source: "Google",
    year: "2025",
    icon: Award,
  },
  {
    name: "Data Structures & Algorithms",
    source: "Infosys Springboard",
    year: "2025",
    icon: FileText,
  },
  {
    name: "Python for Data Science",
    source: "NPTEL",
    year: "2025",
    icon: FileText,
  },
];

export const projects: ProjectItem[] = [
  {
    title: "Classroom Feedback & Analytics System (ClassIntel)",
    slug: "classintel-ai",
    description:
      "AI-powered classroom intelligence platform that turns student feedback into actionable teaching insights. Supports text + voice feedback, sentiment analysis, topic extraction, risk prediction, real-time alerts, and dashboards with trends & top-performer analytics.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "AI/NLP", "Speech-to-Text"],
    github: "https://github.com/deveshsingh641/lecture_feedback_system",
    live: "https://lecture-feedback-system.vercel.app",
    demoUrl: "https://lecture-feedback-system.vercel.app",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    status: "Live",
    category: "AI",
    caseStudy: {
      problem:
        "Manual feedback collection is slow and often lacks actionable insight. Educators need a fast way to capture sentiment and surface risks/weak topics early.",
      solution:
        "Built a feedback-to-insights pipeline that collects text/voice feedback, analyzes sentiment/topics, and surfaces dashboards + alerts so educators can iterate quickly.",
      keyFeatures: [
        "Text + voice feedback submission",
        "Sentiment analysis and trend tracking",
        "Topic extraction to identify weak areas",
        "Risk prediction scoring and anomaly alerts",
        "Live activity feed + top performers dashboard",
        "Authentication flows (login/signup)",
      ],
      architecture: {
        frontend: "React UI with responsive dashboard views and optimized client rendering.",
        backend: "Node.js + Express APIs to ingest feedback, run analysis, and serve aggregated analytics.",
        data: "MongoDB for persistence + AI/NLP pipeline for sentiment/topic/risk computation.",
      },
    },
  },
  {
    title: "Developer Portfolio Website",
    slug: "personal-portfolio",
    description:
      "A modern, responsive personal portfolio built with React and Tailwind CSS. Features dark/light theme toggle, animated intro sequence, parallax effects, custom cursor, embedded blog with markdown rendering, live project previews, and glassmorphic design aesthetic.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/deveshsingh641/Portfolio_Devesh",
    live: "https://deveshdev.live",
    demoUrl: "https://deveshdev.live",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    status: "Live",
    category: "Frontend",
    caseStudy: {
      problem:
        "Recruiters skim fast. A portfolio needs strong storytelling, fast performance, and clear proof of skills without feeling cluttered.",
      solution:
        "Built a high-performance portfolio with a strong visual identity, section-based navigation, embedded blog, and project previews to showcase real work quickly.",
      keyFeatures: [
        "Dark/light mode with persistence",
        "Custom cursor + micro-interactions",
        "Markdown blog posts with routing-friendly bundles",
        "Project previews embedded on cards",
        "Command palette (Ctrl/Cmd+K)",
        "Optimized build output with Vite",
      ],
      architecture: {
        frontend: "React + TypeScript component architecture, Tailwind for consistent styling.",
        backend: "Static hosting optimized for speed; content lives in-repo and loads via bundles.",
        data: "Markdown content + local configuration; deploy pipeline handles static assets.",
      },
    },
  },
  {
    title: "Resume Roast 🔥 — AI Resume Critique & Voice Notes",
    slug: "resume-roast",
    description:
      "Brutally honest AI-powered resume critique platform built with React 19, FastAPI, and Google Gemini AI. Delivers savage yet actionable ATS feedback, WhatsApp-style audio voice notes, head-to-head resume battles, and a community wall of shame.",
    tech: ["React 19", "TypeScript", "FastAPI", "Python", "Google Gemini AI", "Tailwind CSS", "Edge TTS"],
    github: "https://github.com/deveshsingh641/ResumeRoast",
    live: "https://resume-roast-lemon.vercel.app",
    demoUrl: "https://resume-roast-lemon.vercel.app",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    status: "Live",
    category: "AI",
    caseStudy: {
      problem:
        "Job seekers struggle with generic, sugarcoated feedback that fails to identify real ATS red flags, buzzword bloat, and weak bullet points, leading to silent rejections.",
      solution:
        "Engineered an AI-first critique platform using Google Gemini and FastAPI to extract resume content from PDF/DOCX files, generate savage yet actionable feedback, and synthesize realistic audio voice notes.",
      keyFeatures: [
        "AI-driven line-by-line critique with overall score and concrete rewrite recommendations",
        "WhatsApp-style audio voice notes with simulated recruiter tone & interactive waveform playback",
        "Head-to-head resume battle arena to compare candidate viability",
        "Community 'Wall of Shame & Fame' featuring hilarious roast submissions",
        "High-resolution downloadable social share card generator built with HTML2Canvas",
        "Automated data expiration (7-day self-destruct) and PII redaction for privacy",
      ],
      architecture: {
        frontend: "React 19 + TypeScript with Vite, Zustand state management, and custom paper/stamp theme.",
        backend: "FastAPI microservice integrating Google Gemini API, PyPDF2 document parsing, and Edge TTS audio synthesis.",
        data: "SQLite/Supabase persistence with token-bucket rate limiting (SlowAPI) and ephemeral document lifecycles.",
      },
    },
  },
  {
    title: "TaskFlow — Real-Time Collaborative Task Management",
    slug: "taskflow-realtime",
    description:
      "A full-stack collaborative task management platform featuring real-time synchronization via WebSockets, interactive Kanban boards with drag-and-drop workflows, priority matrices, subtask progress tracking, and 1-click guest access.",
    tech: ["React", "Node.js", "Express.js", "SQLite", "WebSockets", "Tailwind CSS"],
    github: "https://github.com/deveshsingh641/TaskFlow",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    category: "Full Stack",
    caseStudy: {
      problem:
        "Traditional task managers require manual page refreshes to reflect team changes, leading to out-of-sync states, duplicate efforts, and lost project momentum.",
      solution:
        "Architected a real-time collaboration engine using WebSockets on top of Express and SQLite, allowing instantaneous state broadcast across all active clients alongside drag-and-drop Kanban workflows.",
      keyFeatures: [
        "Live WebSocket broadcasting for instant task mutations across multiple tabs and devices",
        "Interactive Kanban board workflow (To Do, In Progress, In Review, Completed)",
        "Granular task management: priorities, custom tags, due dates, and dynamic subtask checklists",
        "1-Click guest demo login with pre-seeded sample data for instant onboarding",
        "Multi-criteria filtering by priority, tags, status, and instant text search",
        "Live sync status indicator with automatic reconnection resilience",
      ],
      architecture: {
        frontend: "React SPA with reactive state handlers, drag-and-drop card interactions, and WebSocket event subscribers.",
        backend: "Node.js / Express server integrating WebSocket ('ws') gateway for low-latency broadcast events.",
        data: "Lightweight SQLite database providing fast relational queries, user data isolation, and ACID guarantees.",
      },
    },
  },
  {
    title: "Full-Stack E-Commerce Platform",
    slug: "ecommerce-web-app",
    description:
      "A complete MERN-stack e-commerce web application featuring dynamic product catalog browsing, multi-attribute filtering, persistent shopping cart, order tracking, admin analytics dashboard, and role-based JWT authentication.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT"],
    github: "https://github.com/deveshsingh641/E-Commerce-Web-Application",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    category: "Full Stack",
    caseStudy: {
      problem:
        "Online shopping requires seamless product discovery, reliable cart persistence across sessions, responsive checkout flows, and secure role-based administration without performance bottlenecks.",
      solution:
        "Engineered an end-to-end MERN-stack e-commerce system with modular REST APIs, MongoDB schema design for product variations, JWT authentication with role authorization, persistent cart state, and an interactive admin metrics dashboard.",
      keyFeatures: [
        "Dynamic product catalog with multi-facet filtering and real-time text search",
        "Persistent shopping cart state synchronized with client storage",
        "Role-based access control (Admin vs. Customer)",
        "Admin analytics dashboard tracking revenue, popular products, and order statuses",
        "Secure checkout simulation and order lifecycle tracking",
        "RESTful API backend with robust error handling and data seeding",
      ],
      architecture: {
        frontend: "React SPA styled with Tailwind CSS, leveraging component-driven state architecture for responsive shopping cart operations.",
        backend: "Express.js REST API with structured controllers, route middlewares, and JWT authentication.",
        data: "MongoDB with Mongoose ODM modeling users, products, categories, reviews, and transaction orders.",
      },
    },
  },
];

/** Primary nav: scroll targets or route paths */
export const navItems = [
  { id: "home", label: "home", type: "scroll" as const },
  { id: "about", label: "about", type: "scroll" as const },
  { id: "projects", label: "projects", type: "scroll" as const },
  { id: "skills", label: "skills", type: "scroll" as const },
  { id: "blog", label: "blog", type: "scroll" as const },
  { id: "certifications", label: "certifications", type: "scroll" as const },
  { id: "resume", label: "resume", type: "route" as const, path: "/resume" },
  { id: "contact", label: "contact", type: "scroll" as const },
];

export const scrollSections = [
  "home",
  "about",
  "projects",
  "skills",
  "certifications",
  "blog",
  "playground",
  "now-tracker",
  "contact",
] as const;
