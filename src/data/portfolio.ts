import { INSPIRATIONAL_QUOTES } from "./quotes";

export interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  badge?: string;
  thumbnail: string;
  cardImage?: string;
  demoUrl?: string;
  live?: string;
  github?: string;
  tags: string[];
  summary: string;
  role?: string;
  team?: string;
  timeline?: string;
  featured?: boolean;
  caseStudy: {
    problem: string;
    solution: string;
    keyFeatures: string[];
    architecture: {
      frontend: string;
      backend: string;
      data: string;
    };
    metrics?: { label: string; value: string }[];
  };
}

export interface EducationDetail {
  institution: string;
  location: string;
  degree: string;
  affiliation?: string;
  period: string;
  score: string;
}

export interface ToolCategory {
  category: string;
  items: { name: string; logo?: string }[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  image: string;
  link: string;
  subtitle?: string;
}

export const PORTFOLIO_DATA = {
  hero: {
    greeting: "Hello, I'm Devesh 👋",
    headline: "Building Digital Experiences That Feel Effortless",
    description: "Crafting high-throughput full-stack web applications, real-time WebSocket engines, and robust REST APIs that deliver measurable real-world impact.",
    email: "deveshsingh20666@gmail.com",
    endTitle: "Let's build something great",
    endBadge: "Available for work",
    endSubline: "Full-stack MERN systems, robust APIs & high-velocity delivery — end to end.",
    endMeta: "DELHI NCR / REMOTE · AVAILABLE NOW",
    rotatingHeadlines: [
      "Architecting Scalable Systems",
      "Full-Stack MERN Engineering",
      "High-Performance Web Apps"
    ],
  },
  cvDownloads: {
    label: "Download CV",
    title: "Download Resume",
    description: "Latest updated resume (Software Development Engineer)",
    options: [
      {
        label: "Software Development Engineer (SDE) Resume",
        fileName: "Devesh_Singh_SDE.pdf",
        href: "/Devesh_Singh_SDE.pdf",
        type: "sde"
      }
    ]
  },
  education: {
    sectionLabel: "ACADEMICS",
    headline: "Education",
    subline: "Academic background & qualifications",
    items: [
      {
        institution: "ABES Engineering College",
        location: "Ghaziabad",
        degree: "B.Tech. in Information Technology",
        affiliation: "Dr. A.P.J. Abdul Kalam Technical University",
        period: "Aug 2023 – Present",
        score: "CGPA: 8.0 / 10.0"
      },
      {
        institution: "Sant Atulanand Convent School",
        location: "Varanasi",
        degree: "Senior Secondary (Class XII)",
        affiliation: "CBSE",
        period: "2023",
        score: "89.02%"
      },
      {
        institution: "Sant Atulanand Convent School",
        location: "Varanasi",
        degree: "Secondary (Class X)",
        affiliation: "CBSE",
        period: "2021",
        score: "94.6%"
      }
    ] as EducationDetail[]
  },
  projects: [
    {
      id: "p1",
      slug: "classintel",
      name: "ClassIntel",
      title: "ClassIntel",
      subtitle: "Classroom Feedback & Proctoring Analytics System",
      category: "Full-Stack MERN",
      year: "2025",
      badge: "FEATURED",
      thumbnail: "/projects/classintel_ui.webp",
      cardImage: "/projects/classintel_ui.webp",
      demoUrl: "https://lecture-feedback-system.vercel.app",
      live: "https://lecture-feedback-system.vercel.app",
      github: "https://github.com/deveshsingh641/ClassIntel",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "TypeScript", "JWT", "REST APIs"],
      summary: "Full-stack feedback and proctoring platform with 3-tier role-based access control (Student, Instructor, Admin), browser tab-switch detection heuristics, copy-paste restriction, and MongoDB text search.",
      role: "Lead Full-Stack SDE",
      team: "Solo / Core Dev",
      timeline: "Dec 2024 – May 2025",
      featured: true,
      caseStudy: {
        problem: "Manual examination and lecture feedback systems suffer from lack of integrity verification and noisy, delayed feedback collection. Educators need reliable focus monitoring without intrusive kernel-level software.",
        solution: "Built a full-stack feedback and proctoring platform with granular 3-tier RBAC, browser-native tab-switch and clipboard listeners, and MongoDB text-indexed search for sub-50ms course feedback discovery.",
        keyFeatures: [
          "3-Tier Role-Based Access Control (Student, Instructor, Admin) with secure JWT authentication",
          "Browser tab-switch detection and copy-paste interception via native DOM event listeners",
          "MongoDB text search and compound indexing for rapid course-level filtering",
          "Real-time student comprehension telemetry and pacing anomaly indicators",
          "Comprehensive administrative reporting dashboards with aggregated metric exports"
        ],
        architecture: {
          frontend: "React.js SPA with TypeScript, responsive charts, and optimistic UI mutations.",
          backend: "Node.js + Express.js RESTful API with centralized error handling and JWT middleware.",
          data: "MongoDB replica set with compound indexes (courseId, timestamp) and text search catalog."
        },
        metrics: [
          { label: "RBAC Levels", value: "3 Roles" },
          { label: "Search Engine", value: "MongoDB Index" },
          { label: "Anti-Cheat", value: "Tab Listeners" }
        ]
      }
    },
    {
      id: "p2",
      slug: "agrisense",
      name: "AgriSense",
      title: "AgriSense",
      subtitle: "Precision Agriculture Management Platform",
      category: "Full-Stack MERN & GIS",
      year: "2026",
      badge: "FEATURED",
      thumbnail: "/projects/agrisense_ui.webp",
      cardImage: "/projects/agrisense_ui.webp",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LightGBM", "Random Forest", "GIS"],
      summary: "Precision agriculture management platform integrating 6 heterogeneous data sources (weather, soil, remote sensing, terrain, crop, and spatial data) with interactive GIS visualizations, achieving 0.93 R² and 91% accuracy.",
      role: "Lead Full-Stack SDE",
      team: "Jul 2026 – Present",
      timeline: "Jul 2026 – Present",
      featured: true,
      caseStudy: {
        problem: "Agricultural analytics typically operate in isolated silos, preventing farmers from correlating soil chemistry with satellite vegetation indices and hyper-local weather shifts.",
        solution: "Engineered a scalable full-stack management platform that ingests and normalizes 6 distinct field data streams, rendering interactive GIS heatmaps and automated risk assessments on high-performance React dashboards.",
        keyFeatures: [
          "Multi-source ingestion pipeline fusing 6 data modalities (soil, weather, terrain, satellite, crop logs)",
          "Interactive GIS geospatial field boundary mapping with NDVI vegetative index layers",
          "Real-time crop yield forecasts achieving 0.93 R² and 91% pest-risk classification accuracy",
          "Automated agronomic alert engine with customizable moisture and nutrient thresholds",
          "Offline-first mobile responsive interface optimized for low-bandwidth rural connectivity"
        ],
        architecture: {
          frontend: "React SPA with GIS map rendering, Recharts telemetry curves, and responsive state caching.",
          backend: "Node.js + Express REST API orchestrating geospatial data processing and aggregation microservices.",
          data: "MongoDB geospatial collections (2dsphere indexes) storing geo-referenced field boundaries and telemetry points."
        },
        metrics: [
          { label: "Yield Fit", value: "0.93 R²" },
          { label: "Pest Accuracy", value: "91%" },
          { label: "Data Streams", value: "6 Modalities" }
        ]
      }
    },
    {
      id: "p3",
      slug: "resume-roast",
      name: "Resume Roast 🔥",
      title: "Resume Roast 🔥",
      subtitle: "AI-Powered Resume Critique & Voice Notes Platform",
      category: "Full-Stack Web App",
      year: "2026",
      badge: "FASTAPI & GEMINI",
      thumbnail: "/projects/resume_roast_ui.webp",
      cardImage: "/projects/resume_roast_ui.webp",
      demoUrl: "https://resume-roast-lemon.vercel.app",
      live: "https://resume-roast-lemon.vercel.app",
      github: "https://github.com/deveshsingh641/ResumeRoast",
      tags: ["React 19", "FastAPI", "Python", "Google Gemini", "Tailwind CSS", "Wavesurfer.js"],
      summary: "AI-powered resume auditing platform that tears apart formatting flaws and ATS red flags, featuring simulated WhatsApp-style audio voice notes, head-to-head resume battles, and community roasts.",
      role: "Full-Stack SDE",
      team: "Solo Project",
      timeline: "Jan 2026 – Present",
      featured: true,
      caseStudy: {
        problem: "Generic resume feedback is boring, lacks depth, and fails to identify the exact ATS disqualifiers and formatting flaws that prevent candidates from securing interviews.",
        solution: "Built an interactive full-stack critique platform using React 19 and FastAPI, parsing multi-format resumes with Google Gemini AI to generate actionable critique reports, simulated voice notes via Wavesurfer.js, and head-to-head battles.",
        keyFeatures: [
          "Brutally honest AI resume evaluations with ATS compliance score and line-by-line red flag callouts",
          "Simulated WhatsApp-style voice note critiques with interactive waveform audio playback via Wavesurfer.js",
          "Head-to-head resume battle arena to benchmark candidate competitiveness and formatting",
          "Multi-format document parsing supporting PDF and DOCX resume uploads via PyPDF2 and python-docx",
          "Public Community Wall of Shame and client-side social roast card generator"
        ],
        architecture: {
          frontend: "React 19 + Tailwind CSS with Lucide Icons, Wavesurfer.js audio waveforms, and Canvas-Confetti.",
          backend: "FastAPI (Python) microservice integrating Google Gemini 1.5 Flash API with PyPDF2 and python-docx pipelines.",
          data: "Stateless REST pipeline deployed on Vercel (frontend) and Render (backend) with ephemeral document processing."
        },
        metrics: [
          { label: "Critique Model", value: "Gemini 1.5" },
          { label: "Voice Notes", value: "Wavesurfer.js" },
          { label: "File Support", value: "PDF & DOCX" }
        ]
      }
    },
    {
      id: "p4",
      slug: "taskflow",
      name: "TaskFlow",
      title: "TaskFlow",
      subtitle: "Real-Time WebSocket Kanban & Task Management",
      category: "Full-Stack Systems",
      year: "2025",
      badge: "WEBSOCKET ENGINE",
      thumbnail: "/projects/taskflow_ui.webp",
      cardImage: "/projects/taskflow_ui.webp",
      github: "https://github.com/deveshsingh641/TaskFlow",
      tags: ["React.js", "WebSockets", "Node.js", "Express.js", "SQLite", "JWT Auth"],
      summary: "Full-stack collaborative task management platform featuring real-time WebSocket synchronization, interactive drag-and-drop Kanban boards, 1-click guest login, and dynamic subtask progress.",
      role: "Full-Stack SDE",
      team: "Solo Project",
      timeline: "8 Weeks",
      featured: true,
      caseStudy: {
        problem: "Traditional task management tools often require full page reloads to sync changes across devices, causing desynchronization, stale boards, and redundant manual refreshes.",
        solution: "Architected a full-stack real-time task manager using native WebSockets on top of Node.js/Express and SQLite, broadcasting atomic task events across multiple open tabs and devices instantly.",
        keyFeatures: [
          "Real-time WebSocket event broadcasting (TASK_CREATED, TASK_UPDATED, TASK_STATUS_CHANGED, TASK_DELETED) without page refresh",
          "Interactive Drag-and-Drop Kanban board across To Do, In Progress, In Review, and Completed columns with completion confetti",
          "1-Click Guest Demo Login for instant zero-friction review with pre-seeded test data",
          "Granular task management: priority levels (Low to Urgent), due dates, custom tags, and checklist subtasks with progress tracking",
          "Multi-attribute filtering (by status, priority, tags) and multi-mode sorting (due date, priority, title)"
        ],
        architecture: {
          frontend: "React SPA with optimistic state updates, native WebSocket client listeners, and drag-and-drop board interactions.",
          backend: "Node.js + Express REST API paired with a dedicated WebSocket server (ws) for live bi-directional event distribution.",
          data: "SQLite database providing reliable relational schema integrity, indexed task queries, and ACID transactional persistence."
        },
        metrics: [
          { label: "Sync Engine", value: "WebSockets (ws)" },
          { label: "Board Workflow", value: "Drag & Drop" },
          { label: "Authentication", value: "JWT + 1-Click" }
        ]
      }
    },
    {
      id: "p5",
      slug: "developer-portfolio",
      name: "Cosmic Portfolio",
      title: "Cosmic Portfolio",
      subtitle: "High-Craft Engineering Portfolio & Case Studies",
      category: "Frontend Architecture",
      year: "2026",
      badge: "FRONTEND SDE",
      thumbnail: "/projects/portfolio_ui.webp",
      cardImage: "/projects/portfolio_ui.webp",
      github: "https://github.com/deveshsingh641/Portfolio_Devesh",
      demoUrl: "https://portfolio-devesh-six.vercel.app",
      live: "https://portfolio-devesh-six.vercel.app",
      tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lenis Scroll"],
      summary: "Modern developer portfolio featuring 2-stage cosmic scroll hero, fluid bento project decks, and clean theme transitions.",
      role: "Frontend SDE",
      team: "Solo Project",
      timeline: "Ongoing",
      featured: true,
      caseStudy: {
        problem: "Developer portfolios often feel cookie-cutter or bloated with heavy 3D assets that compromise mobile performance.",
        solution: "Designed and engineered an ultra-fast, premium portfolio with video-masked cosmic hero, smooth scroll transitions, and accessible case study dialogs.",
        keyFeatures: [
          "200vh dual-stage video hero with scroll snap synchronization",
          "Fluid horizontal bento carousel with keyboard navigation",
          "Accessible full-screen slide deck case study drawer",
          "Expanding circular view transition theme toggle",
          "Sub-second page load times with optimized asset streaming"
        ],
        architecture: {
          frontend: "React 18 + Vite + Tailwind CSS with Framer Motion transitions.",
          backend: "Static edge CDN deployment on Vercel with automated analytics beaconing.",
          data: "Self-contained typed repository schema with instant client hydration."
        },
        metrics: [
          { label: "Lighthouse", value: "99/100" },
          { label: "Animations", value: "Framer Motion" },
          { label: "Architecture", value: "React 18 + Vite" }
        ]
      }
    }
  ] as ProjectItem[],
  quotes: INSPIRATIONAL_QUOTES,
  quote: INSPIRATIONAL_QUOTES[0],
  about: {
    badge: "ABOUT ME",
    title: "Architecting Scalable Systems &",
    titleHighlight: "Next-Gen Full-Stack Applications",
    description: "Pursuing B.Tech in Information Technology at ABES Engineering College (Class of 2027) with hands-on internship experience in Full-Stack Development. I specialize in architecting high-concurrency MERN applications, resilient Node.js backends, real-time WebSocket systems, and Vertex AI integrations. Driven by HackerRank-certified problem solving, I bridge algorithmic rigor with production-grade engineering.",
    image: "/profile.jpg",
    stats: [
      { label: "Expected Graduation", value: 2027, suffix: "" },
      { label: "DSA Problems Solved", value: 300, suffix: "+" },
      { label: "Google Cloud Badges", value: 112, suffix: "+" },
      { label: "HackerRank SQL", value: 3, suffix: "★ Star" }
    ]
  },
  tools: [
    {
      category: "Languages",
      items: [
        { name: "C++" },
        { name: "JavaScript (ES6+)" },
        { name: "TypeScript" },
        { name: "SQL" }
      ]
    },
    {
      category: "Core Concepts",
      items: [
        { name: "Data Structures & Algorithms" },
        { name: "Object-Oriented Programming" },
        { name: "RESTful APIs" }
      ]
    },
    {
      category: "Frontend",
      items: [
        { name: "React.js" },
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "Tailwind CSS" },
        { name: "Vite" },
        { name: "Responsive Web Design" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "JWT Authentication" },
        { name: "RBAC" },
        { name: "CRUD Operations" }
      ]
    },
    {
      category: "Databases",
      items: [
        { name: "MongoDB" },
        { name: "MySQL" },
        { name: "Mongoose ODM" }
      ]
    },
    {
      category: "Tools",
      items: [
        { name: "Git" },
        { name: "GitHub" },
        { name: "Vercel" },
        { name: "Postman" }
      ]
    }
  ] as ToolCategory[],
  certifications: [
    {
      title: "Build Real World AI Applications with Gemini and Imagen",
      issuer: "Google Cloud (Verified on Credly)",
      date: "Issued 2025",
      image: "/certificates/gemini-imagen-credly.png",
      link: "https://www.credly.com/badges/e33261b3-be22-43a2-a193-ca6ece7000fa/public_url"
    },
    {
      title: "Problem Solving (Intermediate)",
      issuer: "HackerRank (Verified Skill)",
      date: "Issued 2025",
      image: "/certificates/hackerrank-cert.svg",
      link: "https://www.hackerrank.com/certificates/325d3fb086d5"
    },
    {
      title: "Mastering Agentic Design Patterns with Hands-on Projects",
      issuer: "Udemy",
      date: "Issued 2026",
      image: "/certificates/udemy-cert.svg",
      link: "https://ude.my/UC-836cf942-ca3a-41ef-bae4-8a56027d7b10"
    }
  ] as CertificationItem[],
  contact: {
    headline: "Thank you",
    headlineItalic: "for visiting!",
    subline: "Have an opportunity, an idea to discuss, or just want to say hi? Reach out anytime.",
    email: "deveshsingh20666@gmail.com",
    socials: [
      { label: "Email", href: "mailto:deveshsingh20666@gmail.com", icon: "email" },
      { label: "LinkedIn", href: "https://linkedin.com/in/deveshsingh64", icon: "linkedin" },
      { label: "GitHub", href: "https://github.com/deveshsingh641", icon: "github" }
    ]
  },
  nav: {
    brand: "Devesh S.",
    links: [
      { label: "Projects", href: "#projects" },
      { label: "Education", href: "#education" },
      { label: "About", href: "#about" },
      { label: "Expertise", href: "#expertise" },
      { label: "Certifications", href: "#certifications" },
      { label: "Thoughts", href: "#thoughts" },
      { label: "Contact", href: "#contact" }
    ]
  }
};
