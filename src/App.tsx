import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  Code,
  Globe,
  Server,
  Layers,
  Brain,
  FileText,
  Award,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Calendar,
  Download,
} from "lucide-react";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";
// import GitHubCalendar from "react-github-calendar"; // <--- Commented out to fix the crash
import { TypeAnimation } from "react-type-animation";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMemo(() => window.innerWidth < 768, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);

          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;
          setScrollProgress(scrollPercent);

          const sections = [
            "home",
            "about",
            "skills",
            "projects",
            "certifications",
            "contact",
          ];
          const scrollPosition = window.scrollY + 100;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (
                scrollPosition >= offsetTop &&
                scrollPosition < offsetTop + offsetHeight
              ) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // --- DATA ---
  const programmingSkills = [
    { name: "C++", icon: Code },
    { name: "Python", icon: Code },
    { name: "Java", icon: Code },
    { name: "JavaScript", icon: Code },
  ];

  const webDevSkills = [
    { name: "HTML", icon: Globe },
    { name: "CSS", icon: Globe },
    { name: "Node.js", icon: Server },
    { name: "Express.js", icon: Server },
  ];

  const education = [
    {
      degree: "B.Tech, Information Technology",
      school: "ABES Engineering College",
      year: "2024-Present",
      score: "CGPA: 8.0",
    },
    {
      degree: "Intermediate (CBSE)",
      school: "Sant Atulanand Convent School",
      year: "2022-2023",
      score: "Percentage: 89.02%",
    },
    {
      degree: "High School (CBSE)",
      school: "Sant Atulanand Convent School",
      year: "2020-2021",
      score: "Percentage: 94.6%",
    },
  ];

  const certifications = [
    {
      name: "Data Structures and Algorithms",
      source: "Infosys Springboard",
      year: "2025",
      icon: FileText,
    },
    {
      name: "Problem Solving (Intermediate)",
      source: "HackerRank",
      year: "2024",
      icon: Award,
    },
    {
      name: "Python for Data Science",
      source: "NPTEL",
      year: "2025",
      icon: FileText,
    },
    {
      name: "Google Arcade Cloud Skills Badges",
      source: "Google Cloud",
      year: "2025",
      badges: ["Cloud Essentials", "Generative AI", "Kubernetes Basics"],
      icon: Award,
    },
  ];

  const projects = [
    {
      title: "Blinkit Clone",
      description:
        "A full-stack clone of Blinkit providing seamless user experience. Implemented product listings, cart management, and responsive UI with real-time updates.",
      tech: ["JavaScript", "Node.js", "HTML", "CSS"],
      github: "https://github.com/deveshsingh641/Blinkit-clone",
      live: "#",
      image: "/image.png",
    },
    {
      title: "Online Fraud Detection (ML)",
      description:
        "Machine learning model detecting fraudulent transactions with 95% accuracy using Scikit-learn and Pandas.",
      tech: ["Python", "Scikit-learn", "Pandas"],
      github: "https://github.com/deveshsingh641/Data-Science-Project-",
      live: "#",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 selection:bg-violet-600 selection:text-white">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>Devesh Singh | Portfolio</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          h1, h2, h3, h4, button { font-family: 'Outfit', sans-serif; }
        `}</style>
      </Helmet>

      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 via-emerald-500 via-cyan-400 to-violet-600 z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="text-2xl font-extrabold tracking-tight cursor-pointer flex items-center gap-2"
              onClick={() => scrollToSection("home")}
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-emerald-500 to-cyan-400 flex items-center justify-center text-white text-lg shadow-lg shadow-violet-500/50">
                D
              </span>
              <span className="bg-gradient-to-r from-violet-700 via-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                Devesh
              </span>
            </div>

            <div className="hidden md:flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-gray-200/50">
              {[
                "home",
                "about",
                "skills",
                "projects",
                "certifications",
                "contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`px-5 py-2 rounded-full capitalize transition-all font-medium text-sm ${
                    activeSection === item
                      ? "bg-white text-violet-700 shadow-md transform scale-105 font-bold"
                      : "text-gray-600 hover:text-violet-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl absolute w-full animate-fade-in-down">
            <div className="px-4 py-4 space-y-2">
              {[
                "home",
                "about",
                "skills",
                "projects",
                "certifications",
                "contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-3 capitalize text-gray-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* HERO SECTION */}
        <section
          id="home"
          className="min-h-screen h-auto flex flex-col md:flex-row items-center justify-center relative overflow-hidden px-6 md:px-20 py-10 gap-10"
        >
          <div className="hidden md:block absolute top-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob motion-reduce:animate-none"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 motion-reduce:animate-none"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 motion-reduce:animate-none"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-violet-200 text-violet-700 text-xs font-bold tracking-wide uppercase mb-8 animate-fade-in-up shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse"></span>
              Open to Work
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight animate-slideInUp">
              Crafting{" "}
              <span className="bg-gradient-to-r from-violet-400 via-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
                Digital Reality
              </span>{" "}
              with Code.
            </h1>

            {/* TYPEWRITER EFFECT */}
            <div className="text-xl md:text-2xl text-gray-200 font-medium mb-10 max-w-3xl mx-auto leading-relaxed h-20 md:h-auto">
              I am a{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent font-bold block md:inline mt-2 md:mt-0">
                <TypeAnimation
                  sequence={[
                    "Full Stack Developer",
                    2000,
                    "Machine Learning Enthusiast",
                    2000,
                    "Problem Solver",
                    2000,
                    "App developer",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideInUp">
              <button
                onClick={() => scrollToSection("projects")}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 rounded-full text-white font-semibold shadow-2xl shadow-violet-500/50 hover:shadow-3xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-700 via-emerald-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  View Projects <ChevronRight size={18} />
                </span>
              </button>

              {/* FIXED RESUME LINK - Uses %20 for spaces */}
              <a
                href="/Updated_resume%20(1).pdf"
                download="Devesh_Singh_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white rounded-full text-gray-900 font-bold border-2 border-indigo-200 shadow-md hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105"
              >
                Resume <Download size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="py-24 bg-gradient-to-b from-slate-900/50 via-violet-900/20 to-slate-900/50 backdrop-blur-sm relative px-6 md:px-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                  About Me{" "}
                  <Sparkles
                    className="text-transparent bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text animate-pulse"
                    size={28}
                  />
                </h2>

                <div className="space-y-6 text-lg text-gray-200 leading-relaxed mb-10">
                  <p>
                    I am a developer who{" "}
                    <span className="text-gray-900 font-bold">
                      thinks in data
                    </span>
                    . Currently pursuing my B.Tech in IT at{" "}
                    <span className="bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent font-semibold">
                      ABES Engineering College
                    </span>
                    , I focus on building applications that are not just
                    functional, but intelligent.
                  </p>
                  <p>
                    My passion lies at the intersection of{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent font-semibold">
                      Full-Stack Engineering
                    </span>{" "}
                    and{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent font-semibold">
                      Machine Learning
                    </span>
                    . Whether it's architecting a seamless e-commerce frontend
                    or training a fraud detection model, I love turning complex
                    logic into user-friendly reality.
                  </p>
                  <p>
                    When I'm not debugging, I'm refining my{" "}
                    <span className="text-emerald-300 font-semibold">
                      DSA skills
                    </span>{" "}
                    (solving problems on LeetCode) or exploring Cloud
                    architectures. I am eager to join a forward-thinking team
                    where I can deploy my analytical skills to solve real-world
                    challenges.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="text-transparent bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text" size={24} />{" "}
                  <span className="bg-gradient-to-r from-violet-700 to-emerald-600 bg-clip-text text-transparent">Education Journey</span>
                </h3>

                <div className="space-y-4 relative pl-4 border-l-2 border-gradient-to-b from-violet-400/50 to-emerald-400/50">
                  {education.map((edu, index) => (
                    <Tilt
                      key={index}
                      tiltEnable={false}
                      scale={1.03}
                      transitionSpeed={200}
                    >
                      <div className="relative group p-6 bg-gradient-to-br from-slate-800 via-violet-900/40 to-slate-900 rounded-xl border border-violet-500/30 shadow-md hover:shadow-xl hover:border-emerald-400/50 transition-all cursor-default mb-4 hover:-translate-y-1">
                        <div className="absolute top-7 -left-[25px] w-5 h-5 bg-gradient-to-br from-violet-500 via-emerald-500 to-cyan-400 border-4 border-slate-950 rounded-full shadow-lg shadow-violet-400/50 group-hover:scale-125 transition-transform"></div>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                              {edu.degree}
                            </h4>
                            <p className="text-gray-300 font-medium">
                              {edu.school}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-violet-500/30 to-emerald-500/30 text-gray-200 text-xs font-bold rounded-full border border-violet-400/50 group-hover:border-emerald-400/50 transition-all shadow-sm">
                              {edu.year}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Award size={16} className="text-emerald-400" />
                          <span className="text-sm text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-md border border-emerald-400/50">
                            {edu.score}
                          </span>
                        </div>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </div>

              {/* Profile Image */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
                <Tilt
                  tiltMaxAngleX={12}
                  tiltMaxAngleY={12}
                  perspective={1200}
                  transitionSpeed={1000}
                  scale={1.05}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  disabled={isMobile}
                >
                  <div className="w-[220px] md:w-[380px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-gradient-to-br from-violet-600 via-emerald-500 to-cyan-400 p-1 hover:shadow-3xl hover:shadow-violet-400/50 transition-all duration-300">
                    <div className="rounded-3xl overflow-hidden bg-white">
                      <img
                        src="/profile.jpg"
                        alt="Profile"
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center md:justify-end">
                    <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 animate-float w-fit hover:shadow-xl transition-all">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-bold text-gray-800">
                        Open to Work
                      </span>
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 bg-gradient-to-b from-slate-900/40 via-emerald-900/20 to-slate-900/40 relative overflow-hidden">
          <div className="hidden lg:block absolute right-0 top-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>
          <div className="hidden lg:block absolute left-0 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Technical Arsenal
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 will-change-auto stagger-animation">
              {[
                {
                  title: "Languages",
                  icon: Code,
                  skills: programmingSkills,
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  gradient: "from-violet-500 to-violet-600",
                },
                {
                  title: "Web Development",
                  icon: Globe,
                  skills: webDevSkills,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  gradient: "from-emerald-500 to-emerald-600",
                },
                {
                  title: "Core Concepts",
                  icon: Brain,
                  skills: [
                    { name: "DSA", icon: Brain },
                    { name: "OOP", icon: Brain },
                  ],
                  color: "text-cyan-600",
                  bg: "bg-cyan-50",
                  gradient: "from-cyan-500 to-cyan-600",
                },
                {
                  title: "Tools",
                  icon: Layers,
                  skills: [
                    { name: "Git", icon: Layers },
                    { name: "Figma", icon: Layers },
                  ],
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  gradient: "from-violet-500 via-emerald-500 to-cyan-500",
                },
              ].map((category, idx) => (
                <Tilt
                  key={idx}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  scale={1.03}
                  className="h-full"
                >
                  <div className="glass p-8 rounded-2xl h-full border border-violet-400/40 shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 backdrop-blur-md transition-all duration-300 group hover:-translate-y-2 bg-gradient-to-br from-slate-800 via-violet-900/40 to-slate-800">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-6 text-white">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-violet-600/40 to-emerald-600/40 border border-emerald-300/70 rounded-lg text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-110 transition-all cursor-default hover:bg-gradient-to-r hover:from-violet-600/60 hover:to-emerald-600/60 hover:border-emerald-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="py-24 bg-gradient-to-b from-slate-900/50 via-violet-900/20 to-slate-900/50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Certifications & Badges
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-emerald-400/50"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 stagger-animation">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <Tilt
                    key={index}
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    scale={1.02}
                    glareEnable={true}
                    glareMaxOpacity={0.1}
                  >
                    <div className="glass p-6 rounded-2xl shadow-lg border border-cyan-400/50 group h-full backdrop-blur-md hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-slate-800 via-slate-800 to-violet-900/30">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-emerald-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-400/60 shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                          <IconComponent size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-cyan-300 transition-colors">
                            {cert.name}
                          </h3>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-cyan-300">
                              {cert.source}
                            </p>
                            {cert.year && (
                              <span className="text-xs text-emerald-300 flex items-center gap-1">
                                <Calendar size={12} /> {cert.year}
                              </span>
                            )}
                          </div>

                          {cert.badges && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {cert.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="px-2 py-1 bg-gradient-to-r from-emerald-600/50 to-cyan-600/50 border border-cyan-300/70 text-white text-[11px] uppercase tracking-wider font-bold rounded-md shadow-md hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:from-cyan-600/70 hover:to-emerald-600/70 hover:border-cyan-200"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tilt>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 bg-gradient-to-b from-slate-900/40 via-cyan-900/20 to-slate-900/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Featured Work
              </h2>
              <p className="text-gray-300">Some things I've built</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 stagger-animation">
              {projects.map((project, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={isMobile ? 0 : 10}
                  tiltMaxAngleY={isMobile ? 0 : 10}
                  glareEnable={!isMobile}
                  glareMaxOpacity={0.3}
                  scale={1.05}
                  className="h-full"
                  disabled={isMobile}
                >
                  <div className="group relative bg-gradient-to-br from-slate-800 via-violet-900/40 to-slate-800 rounded-3xl overflow-hidden border border-emerald-400/40 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 h-full flex flex-col transform-style-3d transition-all duration-300 hover:-translate-y-3 hover:border-emerald-300/60">
                    <div className="h-64 overflow-hidden relative">
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"
                        style={{ opacity: 0.3 }}
                      ></div>

                      {project.title === "Blinkit Clone" && (
                        <div className="absolute top-4 left-4 z-30 bg-violet-500/90 text-xs md:text-sm font-bold px-3 py-1 rounded-md shadow-lg backdrop-blur-sm text-white border border-violet-300/60">
                          Featured Project
                        </div>
                      )}

                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute bottom-4 left-4 z-20 flex gap-2 flex-wrap"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        {project.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/30 backdrop-blur-md text-white text-xs rounded-md border border-white/30 font-semibold hover:bg-white/50 transition-all"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-3 flex justify-between items-center group-hover:text-emerald-300 transition-colors">
                        {project.title}
                        <div
                          className="flex gap-3"
                          style={{ transform: "translateZ(50px)" }}
                        >
                          <div
                            className="text-cyan-400 hover:text-cyan-300 hover:scale-125 transition-all duration-300 z-50 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.github,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            title="View Code"
                          >
                            <Github size={24} />
                          </div>
                          <div
                            className="text-emerald-400 hover:text-emerald-300 hover:scale-125 transition-all duration-300 z-50 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.live,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            title="Live Demo"
                          >
                            <ExternalLink size={24} />
                          </div>
                        </div>
                      </h3>
                      <p className="text-gray-300 leading-relaxed flex-grow">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="py-24 bg-gradient-to-b from-slate-900/40 via-violet-900/30 to-slate-900/40 relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Tilt
              tiltMaxAngleX={isMobile ? 0 : 2}
              tiltMaxAngleY={isMobile ? 0 : 2}
              glareEnable={!isMobile}
              glareMaxOpacity={0.05}
              disabled={isMobile}
            >
              <div className="bg-gradient-to-br from-slate-800 via-violet-900/40 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-violet-500/30">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    Let's Work Together
                  </h2>
                  <p className="text-gray-300 mt-3 text-lg">
                    Have a project in mind? Let's discuss and create something amazing.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-slate-700/50 border border-violet-400/30 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-slate-700/80 outline-none transition-all shadow-sm hover:border-emerald-400/30 text-white placeholder-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-slate-700/50 border border-violet-400/30 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-slate-700/80 outline-none transition-all shadow-sm hover:border-emerald-400/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full px-6 py-4 bg-slate-700/50 border border-violet-400/30 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-slate-700/80 outline-none transition-all resize-none shadow-sm hover:border-emerald-400/30 text-white placeholder-gray-400"
                  ></textarea>
                  <button className="w-full bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all transform active:scale-95 shadow-lg hover:shadow-violet-500/50">
                    Send Message
                  </button>
                </form>

                <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 pt-8 border-t border-violet-500/30">
                  <a
                    href="mailto:deveshsingh20666@gmail.com"
                    className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-emerald-400 transition-all hover:scale-105 font-semibold group"
                  >
                    <Mail size={18} className="group-hover:animate-pulse" /> deveshsingh20666@gmail.com
                  </a>
                  <a
                    href="https://linkedin.com/in/devesh-singh-0b234928b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-emerald-400 transition-all hover:scale-105 font-semibold group"
                  >
                    <Linkedin size={18} className="group-hover:animate-pulse" /> LinkedIn
                  </a>
                </div>
              </div>
            </Tilt>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 py-8 border-t border-violet-500/30 text-center text-gray-400 text-sm">
          <p>© 2025 Devesh Singh. Crafted with React & Tailwind.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
