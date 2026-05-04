// ─── DEFAULT SITE CONTENT ────────────────────────────────────────────────────
// All editable content lives here. The admin panel writes to localStorage
// and the app reads from there first, falling back to these defaults.

export const DEFAULT_CONTENT = {
  hero: {
    badge: "AI Educator · Consultant · Speaker",
    headline: "Navigate the AI Revolution with Confidence.",
    photoUrl: "",   // ← paste a direct image URL here, or set it via Admin → Hero
    subheadline:
      "I help business leaders, teams, and curious professionals cut through the noise — understand what matters, adopt the right tools, and build AI-ready organizations.",
    ctaPrimary: "Work With Me",
    ctaSecondary: "Watch Free Content",
    showStats: true,
    stats: [
      { num: "500+", label: "Clients Advised" },
      { num: "50+", label: "Workshops Delivered" },
      { num: "100K+", label: "YouTube Views" },
      { num: "8+", label: "Years in AI" },
    ],
  },

  about: {
    heading: "Your Guide to the AI Landscape",
    bio1:
      "Todd Ponsky is a leading AI educator, consultant, and content creator helping individuals and organizations understand and harness artificial intelligence. With over 8 years of experience at the intersection of technology and business strategy, Todd translates complex AI concepts into practical, actionable frameworks.",
    bio2:
      "From Fortune 500 companies to growing startups, Todd has guided hundreds of teams through AI adoption — not as a technology project, but as a business transformation. His YouTube channel has become a go-to resource for professionals who want straight talk about what AI actually means for their work.",
    tags: [
      "AI Strategy",
      "Prompt Engineering",
      "Tool Selection",
      "Team Training",
      "Keynote Speaking",
      "YouTube Education",
    ],
    roles: [
      { icon: "🎓", title: "Educator", desc: "Simplifying AI for everyone" },
      { icon: "💼", title: "Consultant", desc: "Strategic AI implementation" },
      { icon: "🎤", title: "Speaker", desc: "Keynotes & conferences" },
      { icon: "📹", title: "Creator", desc: "YouTube AI education" },
    ],
  },

  tools: [
    { name: "ChatGPT", category: "Writing & Content", description: "OpenAI's flagship conversational AI for drafting, brainstorming, coding, and analysis.", url: "https://chat.openai.com", featured: true },
    { name: "Claude", category: "Writing & Content", description: "Anthropic's AI assistant known for nuanced reasoning, safety, and long-context tasks.", url: "https://claude.ai", featured: true },
    { name: "Jasper", category: "Writing & Content", description: "Marketing-focused AI copywriter with team collaboration features.", url: "https://jasper.ai", featured: false },
    { name: "Copy.ai", category: "Writing & Content", description: "Quickly generate sales copy, emails, and social posts with AI.", url: "https://copy.ai", featured: false },
    { name: "Midjourney", category: "Image Generation", description: "Industry-leading AI image generation via Discord with stunning artistic output.", url: "https://midjourney.com", featured: true },
    { name: "DALL·E 3", category: "Image Generation", description: "OpenAI's image generator integrated into ChatGPT Plus — great for beginners.", url: "https://openai.com/dall-e-3", featured: false },
    { name: "Adobe Firefly", category: "Image Generation", description: "Generative AI built into Creative Cloud, commercially safe outputs.", url: "https://firefly.adobe.com", featured: false },
    { name: "Ideogram", category: "Image Generation", description: "AI image generator with exceptional text-in-image accuracy.", url: "https://ideogram.ai", featured: false },
    { name: "Runway Gen-3", category: "Video", description: "State-of-the-art AI video generation and editing for professionals.", url: "https://runwayml.com", featured: true },
    { name: "HeyGen", category: "Video", description: "Create polished AI avatar videos from text scripts in minutes.", url: "https://heygen.com", featured: true },
    { name: "Synthesia", category: "Video", description: "Generate professional training and explainer videos with AI presenters.", url: "https://synthesia.io", featured: false },
    { name: "Sora", category: "Video", description: "OpenAI's text-to-video model capable of cinematic-quality generation.", url: "https://openai.com/sora", featured: false },
    { name: "Notion AI", category: "Productivity", description: "AI writing and summarization built directly into Notion workspaces.", url: "https://notion.so/product/ai", featured: false },
    { name: "Perplexity", category: "Productivity", description: "AI-powered search engine with cited, real-time answers — replaces Googling.", url: "https://perplexity.ai", featured: true },
    { name: "Otter.ai", category: "Productivity", description: "AI meeting transcription, summary, and action-item extraction in real time.", url: "https://otter.ai", featured: false },
    { name: "Make.com", category: "Productivity", description: "Visual no-code automation platform — connect AI tools to your workflows.", url: "https://make.com", featured: false },
    { name: "ElevenLabs", category: "Audio & Voice", description: "Hyper-realistic AI voice cloning, text-to-speech, and dubbing at scale.", url: "https://elevenlabs.io", featured: true },
    { name: "Adobe Podcast", category: "Audio & Voice", description: "AI-powered audio enhancement that makes any recording sound studio-quality.", url: "https://podcast.adobe.com", featured: false },
    { name: "Descript", category: "Audio & Voice", description: "Edit audio and video by editing text — includes AI voice and overdub.", url: "https://descript.com", featured: false },
    { name: "Julius AI", category: "Analytics & Data", description: "Upload data and get instant AI-generated charts, analysis, and insights.", url: "https://julius.ai", featured: false },
    { name: "Obviously AI", category: "Analytics & Data", description: "Build predictive models without writing a single line of data science code.", url: "https://obviously.ai", featured: false },
  ],

  playlists: [
    {
      id: "beginners",
      title: "AI for Beginners",
      icon: "🚀",
      description: "Start your AI journey with these foundational videos. No technical background required.",
      videos: [
        { ytId: "REPLACE_ME", title: "What is Artificial Intelligence? (Plain English)", duration: "12:34" },
        { ytId: "REPLACE_ME", title: "Understanding Large Language Models", duration: "18:45" },
        { ytId: "REPLACE_ME", title: "Your First AI Workflow: Step by Step", duration: "24:10" },
        { ytId: "REPLACE_ME", title: "AI Tools Overview — What's Worth Using in 2025", duration: "31:22" },
      ],
    },
    {
      id: "prompting",
      title: "Prompt Engineering",
      icon: "⚡",
      description: "Master the art of talking to AI. Better prompts = dramatically better results.",
      videos: [
        { ytId: "REPLACE_ME", title: "Prompt Engineering 101", duration: "15:20" },
        { ytId: "REPLACE_ME", title: "Advanced Prompting Techniques", duration: "22:15" },
        { ytId: "REPLACE_ME", title: "Chain-of-Thought Prompting Explained", duration: "17:50" },
        { ytId: "REPLACE_ME", title: "Prompting for Business Use Cases", duration: "26:40" },
      ],
    },
    {
      id: "business",
      title: "AI for Business",
      icon: "💼",
      description: "Practical AI applications for executives, managers, and growing teams.",
      videos: [
        { ytId: "REPLACE_ME", title: "AI Strategy for Business Leaders", duration: "28:00" },
        { ytId: "REPLACE_ME", title: "Automating Business Workflows with AI", duration: "20:30" },
        { ytId: "REPLACE_ME", title: "Calculating the ROI of AI Implementation", duration: "19:45" },
        { ytId: "REPLACE_ME", title: "Building an AI-Ready Culture", duration: "25:10" },
      ],
    },
    {
      id: "deepdives",
      title: "Tool Deep Dives",
      icon: "🔧",
      description: "In-depth tutorials and walkthroughs on the most powerful AI tools available today.",
      videos: [
        { ytId: "REPLACE_ME", title: "Mastering ChatGPT: Advanced Features", duration: "35:00" },
        { ytId: "REPLACE_ME", title: "Midjourney Masterclass for Non-Designers", duration: "42:15" },
        { ytId: "REPLACE_ME", title: "Automating With Make.com + AI", duration: "30:50" },
        { ytId: "REPLACE_ME", title: "HeyGen: Create AI Videos in Minutes", duration: "18:25" },
      ],
    },
  ],

  services: [
    {
      icon: "🧠",
      title: "AI Strategy Consulting",
      description: "Work 1-on-1 to build a tailored AI roadmap for your organization. Identify high-ROI opportunities and create a phased implementation plan your team will actually follow.",
      features: ["AI readiness audit", "Custom tool recommendations", "90-day action plan", "Priority use-case mapping"],
      cta: "Book a Strategy Call",
    },
    {
      icon: "🎓",
      title: "Team Workshops",
      description: "Half-day or full-day workshops that bring your entire team up to speed on practical AI tools and workflows. Hands-on, not theoretical — people leave with skills they use Monday morning.",
      features: ["Live tool demos", "Custom use-case exercises", "Recorded replay access", "Follow-up Q&A session"],
      cta: "Inquire About Workshops",
    },
    {
      icon: "🎤",
      title: "Speaking & Keynotes",
      description: "Engaging keynotes and panel appearances on the future of AI in business, leadership, and innovation. Todd tailors every talk to your audience and event theme.",
      features: ["Conference keynotes", "Executive roundtables", "Panel moderation", "Podcast appearances"],
      cta: "Request Speaking Info",
    },
    {
      icon: "📊",
      title: "AI Implementation",
      description: "Hands-on support for rolling out specific AI tools and workflows across your business — from proof-of-concept to full team adoption.",
      features: ["Tool setup & integration", "Custom workflow design", "Team onboarding", "Ongoing support retainer"],
      cta: "Start a Project",
    },
  ],

  // ─── Workshop page ────────────────────────────────────────────────────────────
  workshop: {
    navLabel: "AI Workshop",
    heading: "AI Workshop",
    subheading: "A hands-on, section-by-section guide to AI tools and strategies.",
    showInNav: true,
  },
  // Each section: { id, badge, title, description, ytId }
  // badge = optional eyebrow text (e.g. "Chapter 1"); ytId = YouTube video ID
  workshopSections: [],

  youtubeChannelUrl: "https://youtube.com/@tponsky",
  // Your channel ID (starts with UC...) — find it at youtube.com → your channel → About → Share → Copy channel ID
  youtubeChannelId: "UC5_X-VV0ow3VvDT7SOcjzaw",
  contactEmail: "todd@toddponsky.com",
  adminPassword: "SashaWade2026!",   // ← change this before deploying!

  // Controls which built-in sections appear and in what order in the nav/page
  sectionOrder: ["about", "tools", "learn", "shorts", "services", "contact"],
  sectionVisibility: {
    about: true,
    tools: true,
    learn: true,
    shorts: true,
    services: true,
    contact: true,
  },

  // Custom standalone pages — each appears as a nav link and full-page view
  // id: unique slug used in URL hash (e.g. "resources" → site.com/#page-resources)
  customPages: [
    // Example — delete or keep:
    {
      id: "resources",
      navLabel: "Resources",
      heading: "Free Resources",
      subheading: "Guides, templates, and tools to help you get started with AI.",
      body: "Add your content here. You can write multiple paragraphs, list links, embed anything — this is a free-form text area.\n\nExample: Download our AI Starter Checklist, browse our recommended reading list, or grab a prompt template library.",
    },
  ],
};

export const TOOL_CATEGORIES = [
  "Writing & Content",
  "Image Generation",
  "Video",
  "Productivity",
  "Audio & Voice",
  "Analytics & Data",
  "Education",
];
