export default {
  meta: {
    title: "Nicolás Ramos · Odoo and AI for companies",
    description:
      "Local AI agents, Odoo and business automation. I build systems that run on your own server, with models I trained myself and no subscriptions.",
    locale: "en_US",
  },
  nav: {
    home: "Home",
    services: "Services",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    other: "Español",
  },
  skip: "Skip to content",
  hero: {
    eyebrow: "Odoo · Local AI · Automation",
    title: ["AI that works", "inside your company"],
    subtitle:
      "I build AI agents and Odoo systems that run on your own server. Your data stays home and you are not hostage to a subscription.",
    primary: "Book a diagnosis",
    secondary: "See projects",
    proof: "89 stars and 48 forks on GitHub. OdooClaw runs on Odoo 16, 17 and 18.",
  },
  proof: {
    items: [
      { value: "15 years", label: "working with Odoo" },
      { value: "89", label: "stars on GitHub" },
      { value: "100%", label: "local, no forced cloud" },
      { value: "3", label: "Odoo versions covered" },
    ],
  },
  tagline: {
    text: "Agents that work beside you, systems that maintain themselves and data that never leaves your server.",
  },
  services: {
    eyebrow: "What I do",
    title: "Four ways to work together",
    intro:
      "Everything I offer gives you the same thing: your software stops being a black box and starts working for you.",
    items: [
      {
        key: "ia",
        title: "AI agents over your own data",
        body:
          "I set up agents that read, write and execute inside your systems using OdooClaw, my MCP server with models I trained myself. Zero cloud dependency where that makes sense.",
        points: [
          "Your hardware, my trained models",
          "MCP server for any client",
          "Data sovereignty and predictable cost",
        ],
      },
      {
        key: "odoo",
        title: "Odoo without surprises",
        body:
          "Implementation, migrations and custom modules built around the way your company actually works. Your Odoo should feel tailor made, not like a generic install.",
        points: [
          "Migrations from 14, 16 and 17",
          "Custom modules you can maintain",
          "Deploy with Doodba and Coolify",
        ],
      },
      {
        key: "auto",
        title: "Process automation",
        body:
          "I connect what you already have: Odoo, email, warehouse, accounting and the odd tool nobody owns. The repetitive work disappears and your team keeps what matters.",
        points: [
          "Integrations and APIs",
          "Scheduled jobs and alerts",
          "A trace for every run",
        ],
      },
      {
        key: "eq",
        title: "Support, audit and training",
        body:
          "I review existing setups, leave the infrastructure documented and teach your team to run it, so nobody needs me forever.",
        points: [
          "Performance and security audit",
          "Real handover with documentation",
          "Ongoing maintenance",
        ],
      },
    ],
  },
  process: {
    eyebrow: "How it starts",
    title: "Three steps and we are moving",
    intro:
      "No forty page proposals. First we understand the problem, then we prove it, then we put it in production.",
    steps: [
      {
        n: "01",
        title: "Diagnosis",
        body:
          "One working session on your processes and your current setup. We come out with the concrete problem and what is actually worth automating.",
      },
      {
        n: "02",
        title: "Working prototype",
        body:
          "I build something that already runs on your real data. You see it, you touch it, and we decide with evidence instead of gut feeling.",
      },
      {
        n: "03",
        title: "Production and growth",
        body:
          "Deploy, monitor and document. Then evolutionary maintenance with your own team in the driving seat.",
      },
    ],
  },
  projectsSection: {
    eyebrow: "Public code",
    title: "What you can review before you write",
    intro:
      "I maintain real open source, with companies using it in production. These are the repositories that represent me best.",
    cta: "See all repositories",
    stars: "stars",
    forks: "forks",
    detail: "Read more",
    total: "89 stars across these six repositories",
  },
  faq: {
    eyebrow: "Common questions",
    title: "What people usually ask me",
    items: [
      {
        q: "What is an AI agent over my own data?",
        a: "A program that can read your records, understand what you ask in plain language and take real actions inside your systems. It is not a chatbot that returns text: it is another worker inside the software you already use.",
      },
      {
        q: "Do I have to stop using Odoo?",
        a: "No. Odoo is usually the backbone of the project. What I do is make Odoo work with you: agents that query, create and move records for you, plus automations that run on their own.",
      },
      {
        q: "Which Odoo versions do you work with?",
        a: "Odoo 16, 17 and 18 for new projects, and migrations from 14 and 16. I also keep older installs running while that still makes economic sense.",
      },
      {
        q: "Do the models have to live in the cloud?",
        a: "They do not have to. OdooClaw is built to run entirely on premise with my own models. When an external API genuinely beats a local model we integrate it, but you always know what leaves your server.",
      },
      {
        q: "How does a project start?",
        a: "With a diagnosis. You tell me what is holding you back, I look at what you already have, and you get a fixed scope with phases. There is no public price list because every company starts from a different place.",
      },
      {
        q: "Can I see your code before hiring you?",
        a: "Please do. All of my public work is on GitHub, with stars and forks you can check yourself. The biggest repository is OdooClaw.",
      },
      {
        q: "Which languages do you work in?",
        a: "Spanish and English, both for documentation and for meetings with your team.",
      },
    ],
  },
  finalCta: {
    title: "Tell me what is holding you back",
    body:
      "I answer within two working days. If I cannot help, I will say so and point you to someone who can.",
    primary: "Write to me",
    secondary: "See services",
  },
  about: {
    eyebrow: "About me",
    title: "Fifteen years making software work for the business",
    lead:
      "I started with Odoo when it was still called OpenERP and I am still here because it is the piece that puts a company in order. In recent years I also build the AI agents that make it run itself.",
    body: [
      "I work from Tenerife, Canary Islands, for companies in Spain and elsewhere in the European Union. I have been through critical implementations, migrations that could not fail, and factories where one minute of downtime has a price.",
      "My way of working is simple: understand the business first, then write code, then hand it over so your team can run it. I have no interest in a project only I can maintain.",
      "Everything I can publish, I publish. OdooClaw started with a client who refused to move data off premise and today it is the most starred repository on my profile.",
    ],
    factsTitle: "Quick facts",
    facts: [
      { label: "Based in", value: "Tenerife, Canary Islands" },
      { label: "Time zone", value: "CET, UTC+1" },
      { label: "Languages", value: "Spanish and English" },
      { label: "I publish at", value: "nramos.dev" },
    ],
    stackTitle: "Daily tools",
    stack: [
      "Odoo 14 to 19",
      "Python",
      "Go",
      "TypeScript",
      "Astro",
      "PostgreSQL",
      "Docker and Doodba",
      "Coolify",
      "MCP",
      "PyTorch",
    ],
  },
  servicesPage: {
    eyebrow: "Services",
    title: "From diagnosis to production",
    intro:
      "Four services you can hire on their own or as one path. They all end the same way: something working on your server and your team knowing how to use it.",
  },
  projectsPage: {
    eyebrow: "Projects",
    title: "Open source that runs in production",
    intro:
      "Six repositories of my own. Star and fork counts come from the GitHub API and refresh with every build.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let us talk about your project",
    intro:
      "Write to me about whatever is costing you money or time. Two sentences are enough for me to know whether I can help.",
    emailLabel: "Direct email",
    copyLabel: "Copy email",
    copiedLabel: "Copied",
    mailSubject: "Project enquiry",
    mailBody:
      "Hi Nicolás:\n\nI would like to talk about\n\n1.\n2.\n\nBest regards.",
    linksTitle: "Also here",
    formNote:
      "The form with direct submission is waiting on a service key. Until then, the button opens your mail client with subject and body already written.",
    availability: {
      title: "How we work",
      items: [
        "First 30 minute conversation, no charge.",
        "Fixed scope quote after the diagnosis.",
        "Contract in Spanish or English.",
      ],
    },
  },
  footer: {
    tagline: "Odoo, local AI and automation for companies that want to decide faster.",
    menu: "Navigation",
    more: "More places",
    blog: "Blog at nramos.dev",
    github: "GitHub",
    linkedin: "LinkedIn",
    legal: "Legal notice",
    privacy: "Privacy policy",
    cookies: "Cookie policy",
    rights: "All rights reserved.",
    built: "Built with Astro, no unnecessary JavaScript.",
  },
  notFound: {
    code: "404",
    title: "This page does not exist",
    body: "The link may be old or mistyped. From here you can get back home.",
    cta: "Back to the start",
  },
  project: {
    back: "Back to projects",
    overview: "What it is",
    highlights: "What it solves",
    stack: "Technology",
    stats: "Repository data",
    repo: "Repository",
    updated: "Last push",
    language: "Language",
    stars: "Stars",
    forks: "Forks",
    visit: "Open on GitHub",
    related: "Other projects",
  },
} as const;
