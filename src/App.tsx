import { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener("scroll", handleScroll);
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
        "A full-stack clone of Blinkit providing seamless user experience. Implemented product listings, cart management, and responsive UI.",
      tech: ["JavaScript", "Node.js", "HTML", "CSS"],
      github: "https://github.com/deveshsingh641/blinkit_clone",
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
    <div className="min-h-screen font-sans text-gray-900 bg-slate-50 selection:bg-blue-500 selection:text-white">
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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-[100] transition-all duration-100 ease-out"
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
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
                D
              </span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
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
                      ? "bg-white text-blue-600 shadow-md transform scale-105"
                      : "text-gray-600 hover:text-blue-600"
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
          className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        >
          <div className="absolute top-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Open to Work
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Crafting{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                Digital Reality
              </span>{" "}
              with Code.
            </h1>

            {/* TYPEWRITER EFFECT */}
            <div className="text-xl md:text-2xl text-gray-600 font-medium mb-10 max-w-3xl mx-auto leading-relaxed h-20 md:h-auto">
              I am a{" "}
              <span className="text-blue-600 font-bold block md:inline mt-2 md:mt-0">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection("projects")}
                className="group relative px-8 py-4 bg-gray-900 rounded-full text-white font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                className="px-8 py-4 bg-white rounded-full text-gray-900 font-bold border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Resume <Download size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="py-24 bg-white/50 backdrop-blur-sm relative"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="sticky top-24 z-10">
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={1000}
                  transitionSpeed={1000}
                  scale={1.02}
                >
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <img
                        src="/profile.jpg"
                        alt="Profile"
                        className="relative rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-[3/4] border-2 border-white"
                      />
                      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce-slow">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-bold text-gray-800">
                          Open to Work
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  About Me{" "}
                  <Sparkles
                    className="text-yellow-500 animate-pulse"
                    size={28}
                  />
                </h2>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
                  <p>
                    I am a developer who{" "}
                    <span className="text-gray-900 font-bold">
                      thinks in data
                    </span>
                    . Currently pursuing my B.Tech in IT at{" "}
                    <span className="text-blue-600 font-semibold">
                      ABES Engineering College
                    </span>
                    , I focus on building applications that are not just
                    functional, but intelligent.
                  </p>
                  <p>
                    My passion lies at the intersection of{" "}
                    <span className="text-purple-600 font-semibold">
                      Full-Stack Engineering
                    </span>{" "}
                    and{" "}
                    <span className="text-purple-600 font-semibold">
                      Machine Learning
                    </span>
                    . Whether it's architecting a seamless e-commerce frontend
                    or training a fraud detection model, I love turning complex
                    logic into user-friendly reality.
                  </p>
                  <p>
                    When I'm not debugging, I'm refining my{" "}
                    <span className="text-gray-900 font-semibold">
                      DSA skills
                    </span>{" "}
                    (solving problems on LeetCode) or exploring Cloud
                    architectures. I am eager to join a forward-thinking team
                    where I can deploy my analytical skills to solve real-world
                    challenges.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="text-blue-600" size={24} />{" "}
                  Education Journey
                </h3>

                <div className="space-y-4 relative pl-4 border-l-2 border-gray-100">
                  {education.map((edu, index) => (
                    <Tilt
                      key={index}
                      tiltEnable={false}
                      scale={1.02}
                      transitionSpeed={200}
                    >
                      <div className="relative group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all cursor-default mb-4">
                        <div className="absolute top-6 -left-[25px] w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded-full"></div>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                              {edu.degree}
                            </h4>
                            <p className="text-gray-600 font-medium">
                              {edu.school}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full mb-1 border border-gray-200">
                              {edu.year}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Award size={16} className="text-green-600" />
                          <span className="text-sm text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md">
                            {edu.score}
                          </span>
                        </div>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Technical Arsenal
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Languages",
                  icon: Code,
                  skills: programmingSkills,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  title: "Web Development",
                  icon: Globe,
                  skills: webDevSkills,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  title: "Core Concepts",
                  icon: Brain,
                  skills: [
                    { name: "DSA", icon: Brain },
                    { name: "OOP", icon: Brain },
                  ],
                  color: "text-pink-600",
                  bg: "bg-pink-50",
                },
                {
                  title: "Tools",
                  icon: Layers,
                  skills: [
                    { name: "Git", icon: Layers },
                    { name: "Figma", icon: Layers },
                  ],
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((category, idx) => (
                <Tilt
                  key={idx}
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  glareEnable={true}
                  glareMaxOpacity={0.1}
                  scale={1.02}
                  className="h-full"
                >
                  <div className="glass p-8 rounded-2xl h-full border border-white/40 shadow-xl backdrop-blur-md">
                    <h3
                      className={`text-xl font-bold mb-6 flex items-center gap-3 ${category.color}`}
                    >
                      <div
                        className={`p-2 rounded-lg ${category.bg} shadow-inner`}
                      >
                        <category.icon size={20} />
                      </div>
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/80 border border-white/50 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all cursor-default"
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
        <section id="certifications" className="py-24 bg-white/60 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Certifications & Badges
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <Tilt
                    key={index}
                    tiltMaxAngleX={3}
                    tiltMaxAngleY={3}
                    scale={1.01}
                  >
                    <div className="glass p-6 rounded-2xl shadow-lg border border-white/60 group h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                            {cert.name}
                          </h3>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-blue-600">
                              {cert.source}
                            </p>
                            {cert.year && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> {cert.year}
                              </span>
                            )}
                          </div>

                          {cert.badges && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {cert.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-[11px] uppercase tracking-wider font-bold rounded-md shadow-sm"
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
        <section id="projects" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Work
              </h2>
              <p className="text-gray-500">Some things I've built</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {projects.map((project, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.25}
                  scale={1.02}
                  className="h-full"
                >
                  <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl h-full flex flex-col transform-style-3d">
                    <div className="h-64 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 z-10"></div>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div
                        className="absolute bottom-4 left-4 z-20"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        <div className="flex gap-2">
                          {project.tech.map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-md border border-white/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 flex justify-between items-center">
                        {project.title}
                        <div
                          className="flex gap-3"
                          style={{ transform: "translateZ(50px)" }}
                        >
                          <div
                            className="text-gray-400 hover:text-gray-900 transition-colors z-50 cursor-pointer"
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
                            className="text-gray-400 hover:text-blue-600 transition-colors z-50 cursor-pointer"
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
                      <p className="text-gray-600 leading-relaxed">
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
          className="py-24 bg-slate-50 relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Tilt
              tiltMaxAngleX={2}
              tiltMaxAngleY={2}
              glareEnable={true}
              glareMaxOpacity={0.05}
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Let's Work Together
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Have a project in mind? Let's discuss.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none shadow-sm"
                  ></textarea>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all transform active:scale-95">
                    Send Message
                  </button>
                </form>

                <div className="mt-12 flex justify-center gap-6 pt-8 border-t border-gray-100">
                  <a
                    href="mailto:deveshsingh20666@gmail.com"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={18} /> deveshsingh20666@gmail.com
                  </a>
                  <a
                    href="https://linkedin.com/in/devesh-singh-0b234928b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </a>
                </div>
              </div>
            </Tilt>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>© 2025 Devesh Singh. Crafted with React & Tailwind.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;