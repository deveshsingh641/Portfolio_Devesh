export interface Quote {
  text: string;
  subtext: string;
  author: string;
}

export const INSPIRATIONAL_QUOTES: Quote[] = [
  // 1-10: Modern Tech Titans & Visionaries
  {
    text: "The people who are crazy enough to think they can change the world are the ones who do.",
    subtext: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs — Co-Founder & CEO, Apple"
  },
  {
    text: "Software is eating the world, but AI is going to eat software.",
    subtext: "Run, don't walk. Remember, either you are running for food, or you are running from being food.",
    author: "Jensen Huang — Founder & CEO, NVIDIA"
  },
  {
    text: "Our industry does not respect tradition — it only respects innovation.",
    subtext: "Don't be a know-it-all; be a learn-it-all. The opportunity ahead for each of us is unbounded.",
    author: "Satya Nadella — Chairman & CEO, Microsoft"
  },
  {
    text: "The most successful people believe in themselves almost to the point of delusion.",
    subtext: "Compound growth is magic. Iterate rapidly, aim for massive leverage, and never stop building.",
    author: "Sam Altman — CEO, OpenAI"
  },
  {
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    subtext: "Great companies are built on great products. If you build something people love, everything else follows.",
    author: "Elon Musk — Founder, SpaceX & Tesla"
  },
  {
    text: "If you double the number of experiments you do per year, you're going to double your inventiveness.",
    subtext: "It's always Day 1. In Day 2 comes stasis, followed by irrelevance, followed by excruciating decline.",
    author: "Jeff Bezos — Founder, Amazon"
  },
  {
    text: "Wear your failure as a badge of honor. It's always good to work with people who make you feel insecure.",
    subtext: "AI is probably the most profound technology humanity is working on — more fundamental than electricity or fire.",
    author: "Sundar Pichai — CEO, Google & Alphabet"
  },
  {
    text: "The biggest risk is not taking any risk in a world that is changing really quickly.",
    subtext: "Move fast with stable infra. Build things that connect humanity at planetary scale.",
    author: "Mark Zuckerberg — Founder & CEO, Meta"
  },
  {
    text: "Always deliver more than expected. If you're changing the world, you're working on important things.",
    subtext: "You don't need a 100-person company to develop that idea. You just need relentless execution.",
    author: "Larry Page — Co-Founder, Google"
  },
  {
    text: "Solving big problems is easier than solving little problems.",
    subtext: "Too many people spend too much time on incremental tweaks rather than bold, non-linear breakthroughs.",
    author: "Sergey Brin — Co-Founder, Google"
  },

  // 11-20: Startup Luminaries & Thinkers
  {
    text: "Make something people want.",
    subtext: "It's better to make a few people really happy than to make a lot of people semi-happy. Do things that don't scale.",
    author: "Paul Graham — Co-Founder, Y Combinator"
  },
  {
    text: "Seek wealth, not money or status. Wealth is having assets that earn while you sleep.",
    subtext: "Code and media are permissionless leverage. You can multiply your effort a million times without asking anyone.",
    author: "Naval Ravikant — Co-Founder, AngelList"
  },
  {
    text: "Competition is for losers. If you want to create and capture lasting value, build a monopoly.",
    subtext: "Every great business is built on a secret: an important truth that very few people agree with you on.",
    author: "Peter Thiel — Co-Founder, PayPal & Palantir"
  },
  {
    text: "Software is eating the world. Cycles of innovation are getting faster and more compressed.",
    subtext: "The future is already here — it's just not evenly distributed yet.",
    author: "Marc Andreessen — General Partner, Andreessen Horowitz"
  },
  {
    text: "An entrepreneur is someone who jumps off a cliff and builds a plane on the way down.",
    subtext: "If you are not embarrassed by the first version of your product, you've launched too late.",
    author: "Reid Hoffman — Co-Founder, LinkedIn"
  },
  {
    text: "Build something 100 people love, not something 1 million people kind of like.",
    subtext: "When you start with what the customer deeply feels, architecture becomes clear.",
    author: "Brian Chesky — Co-Founder & CEO, Airbnb"
  },
  {
    text: "The most important things are often the hardest to measure.",
    subtext: "Raise your ambition level. Most great software companies start as tiny, obsessive technical projects.",
    author: "Patrick Collison — Co-Founder & CEO, Stripe"
  },
  {
    text: "Don't worry about failure; you only have to be right once.",
    subtext: "Success comes from being relentless in curiosity and resilient in adversity.",
    author: "Drew Houston — Co-Founder & CEO, Dropbox"
  },
  {
    text: "Every company's greatest asset is its willingness to rethink its own assumptions.",
    subtext: "Communication is the work. Great tools dissolve friction between human thoughts.",
    author: "Stewart Butterfield — Co-Founder, Slack"
  },
  {
    text: "The secret to growth is discovering what is truly essential and eliminating everything else.",
    subtext: "Execution is 99% of the battle. Consistency outpaces raw talent every single time.",
    author: "Daniel Ek — Founder & CEO, Spotify"
  },

  // 21-30: Computer Science Giants & Language Architects
  {
    text: "Talk is cheap. Show me the code.",
    subtext: "Bad programmers worry about the code. Good programmers worry about data structures and their relationships.",
    author: "Linus Torvalds — Creator of Linux & Git"
  },
  {
    text: "The best way to predict the future is to invent it.",
    subtext: "Simple things should be simple, complex things should be possible. Perspective is worth 80 IQ points.",
    author: "Alan Kay — Turing Award Laureate & Smalltalk Pioneer"
  },
  {
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    subtext: "A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.",
    author: "Alan Turing — Father of Modern Computing"
  },
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    subtext: "UNIX is very simple, it just needs a genius to understand its simplicity.",
    author: "Dennis Ritchie — Creator of C & Co-Creator of UNIX"
  },
  {
    text: "You can't trust code that you did not totally create yourself.",
    subtext: "Simplicity is prerequisite for reliability. Complex systems always evolve from simple systems that worked.",
    author: "Ken Thompson — Co-Creator of UNIX, B & Go"
  },
  {
    text: "Premature optimization is the root of all evil in programming.",
    subtext: "Science is what we understand well enough to explain to a computer. Art is everything else we do.",
    author: "Donald Knuth — Author of The Art of Computer Programming"
  },
  {
    text: "Simplicity is prerequisite for reliability.",
    subtext: "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    author: "Edsger W. Dijkstra — Turing Award Laureate"
  },
  {
    text: "It is not that we have so little time, but that we lose so much. Focus on the core loop.",
    subtext: "Programming is not about typing, it's about thinking. The faster you iterate, the faster you discover the truth.",
    author: "John Carmack — Legendary Game Engine Architect & VR Pioneer"
  },
  {
    text: "The most dangerous phrase in the language is: 'We've always done it this way.'",
    subtext: "A ship in port is safe, but that's not what ships are built for. Sail out to sea and do new things.",
    author: "Grace Hopper — Computer Science Pioneer & US Navy Rear Admiral"
  },
  {
    text: "The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.",
    subtext: "That brain of mine is something more than merely mortal; as time will prove.",
    author: "Ada Lovelace — World's First Computer Programmer"
  },

  // 31-40: Web & Open Source Architects
  {
    text: "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
    subtext: "You affect the world by what you browse, but more importantly, by what you build.",
    author: "Tim Berners-Lee — Inventor of the World Wide Web"
  },
  {
    text: "There are only two kinds of languages: the ones people complain about and the ones nobody uses.",
    subtext: "Design and programming are human activities; forget that and all is lost.",
    author: "Bjarne Stroustrup — Creator of C++"
  },
  {
    text: "Readability counts. Beautiful is better than ugly. Simple is better than complex.",
    subtext: "Explicit is better than implicit. In the face of ambiguity, refuse the temptation to guess.",
    author: "Guido van Rossum — Creator of Python"
  },
  {
    text: "Make it work, make it right, make it fast.",
    subtext: "I'm not a great programmer; I'm just a good programmer with great habits.",
    author: "Kent Beck — Pioneer of Extreme Programming & TDD"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    subtext: "When to use patterns? Apply them when they simplify the code, not because they look clever.",
    author: "Martin Fowler — Author of Refactoring"
  },
  {
    text: "Clean code always looks like it was written by someone who cares.",
    subtext: "The ratio of time spent reading code versus writing new code is well over 10 to 1.",
    author: "Robert C. Martin — Author of Clean Code"
  },
  {
    text: "What one programmer can do in one month, two programmers can do in two months.",
    subtext: "Adding manpower to a late software project makes it later. Plan to throw one away; you will, anyhow.",
    author: "Fred Brooks — Author of The Mythical Man-Month"
  },
  {
    text: "Shipping is a feature. A prototype is worth a thousand meetings.",
    subtext: "Real artists ship. You don't know what you have until real users break it.",
    author: "Tony Fadell — Inventor of the iPod & Co-Founder, Nest"
  },
  {
    text: "The best code is no code at all. Every line you write is a line you have to maintain.",
    subtext: "Delete code aggressively. Simplify the architecture before you attempt to optimize it.",
    author: "Jeff Atwood — Co-Founder, Stack Overflow"
  },
  {
    text: "Simplicity is about subtracting the obvious and adding the meaningful.",
    subtext: "When you eliminate the clutter, the signal emerges with crystalline clarity.",
    author: "John Maeda — Author of The Laws of Simplicity"
  },

  // 41-50: Legendary Scientists & Polymaths
  {
    text: "What I cannot create, I do not understand.",
    subtext: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman — Nobel Laureate in Physics"
  },
  {
    text: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
    subtext: "The measure of intelligence is the ability to change when the facts change.",
    author: "Albert Einstein — Theoretical Physicist"
  },
  {
    text: "The present is theirs; the future, for which I really worked, is mine.",
    subtext: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
    author: "Nikola Tesla — Pioneer of Alternating Current & Electromagnetism"
  },
  {
    text: "Information is the resolution of uncertainty.",
    subtext: "I just wondered how things were put together. That simple curiosity changed communication forever.",
    author: "Claude Shannon — Father of Information Theory"
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    subtext: "We are a way for the cosmos to know itself. Keep seeking with empirical rigor.",
    author: "Carl Sagan — Astronomer & Science Communicator"
  },
  {
    text: "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.",
    subtext: "Integrity is the essence of everything successful in nature and technology.",
    author: "Buckminster Fuller — Architect, Inventor & Futurist"
  },
  {
    text: "Never trust a computer you can't throw out a window.",
    subtext: "If you love what you do and are willing to do what it takes, it's within your reach. Do it for the joy of creating.",
    author: "Steve Wozniak — Co-Founder, Apple"
  },
  {
    text: "You don't understand anything until you learn it more than one way.",
    subtext: "Will robots inherit the earth? Yes, but they will be our children.",
    author: "Marvin Minsky — Co-Founder, MIT AI Laboratory"
  },
  {
    text: "In the end, you should only measure and optimize what directly changes the world.",
    subtext: "Depth of understanding beats breadth of trivia every single time.",
    author: "John von Neumann — Pioneer of Computer Architecture & Game Theory"
  },
  {
    text: "Details matter, it's worth waiting to get it right.",
    subtext: "Life is fragile. We're not guaranteed a tomorrow so give it everything you've got today.",
    author: "Tim Cook — CEO, Apple"
  },

  // 51-60: Business Builders & Master Strategists
  {
    text: "Price is what you pay. Value is what you get.",
    subtext: "The best investment you can make is an investment in yourself. Nobody can tax or steal your knowledge.",
    author: "Warren Buffett — Chairman & CEO, Berkshire Hathaway"
  },
  {
    text: "The big money is not in the buying and the selling, but in the waiting.",
    subtext: "Invert, always invert: Turn a situation upside down. What causes failure? Avoid that.",
    author: "Charlie Munger — Vice Chairman, Berkshire Hathaway"
  },
  {
    text: "Pain plus reflection equals progress.",
    subtext: "If you don't look back at yourself a year ago and think how foolish you were, you haven't learned much.",
    author: "Ray Dalio — Founder, Bridgewater Associates"
  },
  {
    text: "Only the paranoid survive.",
    subtext: "Bad companies are destroyed by crises. Good companies survive them. Great companies are improved by them.",
    author: "Andy Grove — Former CEO & Chairman, Intel"
  },
  {
    text: "The best way to predict the future is to create it.",
    subtext: "There is nothing so useless as doing efficiently that which should not be done at all.",
    author: "Peter Drucker — Father of Modern Management"
  },
  {
    text: "Whether you think you can, or you think you can't — you're right.",
    subtext: "If I had asked people what they wanted, they would have said faster horses. Build the future.",
    author: "Henry Ford — Founder, Ford Motor Company"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    subtext: "It's kind of fun to do the impossible. Laughter is timeless, imagination has no age, and dreams are forever.",
    author: "Walt Disney — Founder, The Walt Disney Company"
  },
  {
    text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
    subtext: "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten.",
    author: "Bill Gates — Co-Founder, Microsoft"
  },
  {
    text: "A person who never made a mistake never tried anything new.",
    subtext: "The true sign of intelligence is not knowledge but imagination and relentless execution.",
    author: "Albert Einstein — Nobel Laureate"
  },
  {
    text: "Great things in business are never done by one person. They're done by a team of people.",
    subtext: "Stay hungry. Stay foolish. There is always another horizon waiting to be cracked open.",
    author: "Steve Jobs — Apple"
  },

  // 61-70: Engineering Discipline & Architecture
  {
    text: "Ideas are easy. Execution is everything.",
    subtext: "Measure what matters. Set audacious objectives and hold yourself to measurable, relentless key results.",
    author: "John Doerr — Chairman, Kleiner Perkins & Author of Measure What Matters"
  },
  {
    text: "Fast software is not created by fast coders; it is created by engineers who reject unnecessary complexity.",
    subtext: "Every millisecond of latency eliminated is respect paid to the user's attention.",
    author: "Systems Architecture Principle"
  },
  {
    text: "A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.",
    subtext: "Design for failure from day one. Fault tolerance is not an afterthought; it is the foundation.",
    author: "Leslie Lamport — Turing Award Laureate & Author of Paxos"
  },
  {
    text: "There are 2 hard problems in computer science: cache invalidation and naming things.",
    subtext: "And off-by-one errors. Keep abstractions clean, boundaries sharp, and interfaces unambiguous.",
    author: "Phil Karlton — Netscape Architect"
  },
  {
    text: "It's not enough for code to work. It must be resilient against the chaos of production.",
    subtext: "Unit tests tell you if your logic works; observability tells you if your business survives.",
    author: "Site Reliability Engineering Principle"
  },
  {
    text: "Premature optimization is a distraction; intentional performance architecture is mastery.",
    subtext: "Know your bottlenecks: memory bandwidth, network round-trips, and serialization overhead.",
    author: "High-Performance Computing Maxim"
  },
  {
    text: "The function of good software is to make the complex appear effortlessly simple.",
    subtext: "Underneath every intuitive user experience lies deep technical rigor and disciplined engineering.",
    author: "Full-Stack Design Philosophy"
  },
  {
    text: "A language that doesn't affect the way you think about programming is not worth knowing.",
    subtext: "Expand your cognitive toolkit: procedural, functional, object-oriented, and declarative paradigms.",
    author: "Alan Perlis — First Recipient of the Turing Award"
  },
  {
    text: "The art of programming is the art of organizing complexity, of mastering multitude and avoiding chaos.",
    subtext: "Modularity, separation of concerns, and clean contracts make software immortal.",
    author: "Edsger W. Dijkstra — Computing Pioneer"
  },
  {
    text: "Every great piece of software starts with someone scratching their own itch.",
    subtext: "Build tools you personally love using every single day. Passion translates directly into quality.",
    author: "Open Source Engineering Maxim"
  },

  // 71-80: Timeless Mindset & Stoic Focus
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    subtext: "Obstacles are not interruptions to your work; they are the raw material of your growth.",
    author: "Marcus Aurelius — Roman Emperor & Stoic Philosopher"
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    subtext: "Life is long enough if you know how to invest your energy and focus without distraction.",
    author: "Seneca — Stoic Philosopher"
  },
  {
    text: "We suffer more often in imagination than in reality.",
    subtext: "Keep your mind centered on what you can control: your discipline, your code, and your integrity.",
    author: "Seneca — Letters from a Stoic"
  },
  {
    text: "He who has a why to live can bear almost any how.",
    subtext: "Purpose fuels resilience through late-night debugging sessions and ambitious zero-to-one launches.",
    author: "Friedrich Nietzsche — Philosopher"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    subtext: "Art and engineering meet when everything non-essential has been ruthlessly stripped away.",
    author: "Leonardo da Vinci — Renaissance Polymath"
  },
  {
    text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    subtext: "Theory without execution is a daydream. Real capability is forged in live environments.",
    author: "Johann Wolfgang von Goethe — Polymath"
  },
  {
    text: "It is not the critic who counts; the credit belongs to the person who is actually in the arena.",
    subtext: "Those whose face is marred by dust and sweat, who err and come short again and again, but keep building.",
    author: "Theodore Roosevelt — 26th US President"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    subtext: "The courage to continue through setbacks is what separates builders from commentators.",
    author: "Winston Churchill — Statesman"
  },
  {
    text: "The secret of getting ahead is getting started.",
    subtext: "The secret of getting started is breaking your complex, overwhelming tasks into small manageable steps.",
    author: "Mark Twain — Author & Humorist"
  },
  {
    text: "Small deeds done are better than great deeds planned.",
    subtext: "Ship a small feature today instead of debating a massive architecture next quarter.",
    author: "Peter Marshall — Statesman"
  },

  // 81-90: Mastery, Deep Work & Focus
  {
    text: "Deep work is the ability to focus without distraction on a cognitively demanding task.",
    subtext: "In an age of endless notifications, the ability to concentrate deeply is a superpower that generates massive value.",
    author: "Cal Newport — Author of Deep Work"
  },
  {
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    subtext: "Focus not on what you want to achieve, but on who you wish to become through daily deliberate practice.",
    author: "James Clear — Author of Atomic Habits"
  },
  {
    text: "First principle thinking is the act of boiling things down to the most fundamental truths and reasoning up from there.",
    subtext: "Never accept things just because 'that's how it's always been done.' Question every layer.",
    author: "First Principles Engineering Paradigm"
  },
  {
    text: "Mastery is not a destination; it is a continuous, daily process of refinement.",
    subtext: "The master has failed more times than the beginner has even attempted.",
    author: "Stephen McCranie — Author & Creator"
  },
  {
    text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.",
    subtext: "Invest in your tools, your mental models, and your developer environment.",
    author: "Abraham Lincoln — 16th US President"
  },
  {
    text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    subtext: "Minimalism in software architecture is the ultimate form of robustness.",
    author: "Antoine de Saint-Exupéry — Aviator & Writer"
  },
  {
    text: "If you want to go fast, go alone. If you want to go far, build open architectures with great people.",
    subtext: "Collaborative systems outperform isolated brilliance over any meaningful timescale.",
    author: "African Proverb & Engineering Collaboration Axiom"
  },
  {
    text: "Focus is a decision to say NO to a hundred other good ideas in order to make one great thing.",
    subtext: "Deciding what NOT to do is as important as deciding what to do.",
    author: "Steve Jobs — Apple"
  },
  {
    text: "Do not pray for an easy life, pray for the strength to endure a difficult one.",
    subtext: "High-pressure engineering environments forge the world's most capable problem-solvers.",
    author: "Bruce Lee — Martial Artist & Philosopher"
  },
  {
    text: "The ultimate metric of an engineer is not lines of code written, but leverage created.",
    subtext: "Automate repetitive toil. Build abstractions that empower thousands of developers to ship faster.",
    author: "Modern DevOps Axiom"
  },

  // 91-105: Innovation, AI Frontiers & Future Builders
  {
    text: "AI will not replace humans, but humans who leverage AI will replace humans who do not.",
    subtext: "The frontier of software engineering is human intent orchestrated through autonomous agents.",
    author: "Artificial Intelligence Frontier Axiom"
  },
  {
    text: "The best programmers are not marginally better than average ones; they are 10x or 100x more impactful.",
    subtext: "They don't write 100x more code; they architect systems that eliminate the need for 100x more code.",
    author: "Fred Brooks — Computer Scientist"
  },
  {
    text: "Technology is best when it brings people together and removes unnecessary friction.",
    subtext: "Every clean API and intuitive UI gives people back their most valuable non-renewable asset: time.",
    author: "Matt Mullenweg — Founder, WordPress & Automattic"
  },
  {
    text: "You can't connect the dots looking forward; you can only connect them looking backwards.",
    subtext: "So you have to trust that the dots will somehow connect in your future. Trust in your curiosity.",
    author: "Steve Jobs — Stanford Commencement Address"
  },
  {
    text: "Be stubbornly persistent on your vision, but flexible on the details.",
    subtext: "If you're not stubborn, you'll give up on experiments too soon. If you're not flexible, you will pound your head against a wall.",
    author: "Jeff Bezos — Amazon"
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    subtext: "Move forward with strong, active faith in the systems and software you build.",
    author: "Franklin D. Roosevelt — 32nd US President"
  },
  {
    text: "Work hard, have fun, make history.",
    subtext: "When you pour your authentic energy into engineering, the work becomes its own reward.",
    author: "Amazon Cultural Motto"
  },
  {
    text: "The future belongs to those who learn more skills and combine them in creative ways.",
    subtext: "Full-stack mastery is not just frontend + backend; it is systems thinking, product intuition, and user empathy.",
    author: "Robert Greene — Author of Mastery"
  },
  {
    text: "Build for the long term. Short-term hacks compound technical debt; disciplined architectures compound speed.",
    subtext: "Every clean commit is a gift to your future self and your engineering teammates.",
    author: "Software Craftsmanship Principle"
  },
  {
    text: "Speed of iteration beats quality of iteration, which is why speed of iteration solves for quality.",
    subtext: "Ship early, measure real latency, listen to user signals, and refine aggressively.",
    author: "Modern Silicon Valley Builder Maxim"
  },
  {
    text: "Software engineering is the art of turning coffee into scalable distributed systems.",
    subtext: "Embrace the debugging sessions, honor the edge cases, and keep shipping world-class products.",
    author: "Engineering Community Lore"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    subtext: "Resilience is the ultimate algorithm. It converts every failure into training data for success.",
    author: "Nelson Mandela — Statesman & Philanthropist"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    subtext: "Every complex architectural constraint is an invitation to invent a breakthrough solution.",
    author: "Albert Einstein — Theoretical Physicist"
  },
  {
    text: "The internet is a reflection of our society, and that mirror is going to be what we build it to be.",
    subtext: "Keep pushing packets, keep questioning protocols, and never stop interconnecting humanity.",
    author: "Vint Cerf — Father of the Internet & Turing Laureate"
  },
  {
    text: "Dream big, build relentlessly, and leave the code cleaner than you found it.",
    subtext: "The world is built by people no smarter than you. Go build something that outlasts you.",
    author: "The Builder's Creed"
  }
];
