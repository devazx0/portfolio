import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  MessageCircle,
  Sun,
  Moon,
  Cpu,
  Command,
  Search,
  X,
  Terminal as TerminalIcon,
  Gamepad2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  ShieldCheck,
  ExternalLink,
  Code2,
  Server,
  Database,
  CreditCard,
  Zap,
  Sparkles
} from 'lucide-react';

// --- Configuration & Resume Data ---

const CONFIG = {
  name: "AZEEM SANUSI",
  role: "BACKEND & DISTRIBUTED SYSTEMS ENGINEER",
  subRole: "Node.js · TypeScript · NestJS · PostgreSQL",
  email: "bljazeem@gmail.com",
  phone: "+234 909 502 1208",
  location: "Nigeria · Remote · GMT+1",
  resumeUrl: "/Azeem_Sanusi_resume.pdf",
  avatarUrl: "/my-head.png",
  social: {
    github: "https://github.com/devazx0",
    linkedin: "https://linkedin.com/in/sanusi-azeem",
    whatsapp: "https://wa.me/2349095021208",
    email: "mailto:bljazeem@gmail.com"
  }
};

const METRIC_BADGES = [
  { label: "PRODUCTION_APIS", value: "9+", sub: "Shipped from scratch" },
  { label: "REMOTE_OVERLAP", value: "4–9h", sub: "US/EU · GMT+1" }
];

const SECTIONS = {
  about: "Lead Backend Engineer (NestJS, TypeScript, PostgreSQL) — shipped 9+ production APIs and 2,800+ REST endpoints across loyalty, marketplace, and fintech platforms. I own systems end-to-end: schema design to battle-tested production. Full details in my CV below.",
  skills: [
    {
      category: "Backend & Architecture",
      icon: Server,
      skills: ["NestJS", "Node.js", "Express", "REST API Design", "Swagger / OpenAPI", "Microservices", "System Architecture"]
    },
    {
      category: "Databases & ORM",
      icon: Database,
      skills: ["PostgreSQL (incl. PostGIS)", "TypeORM", "Prisma", "Redis (Caching / PubSub)", "SQL Indexing & Optimization"]
    },
    {
      category: "Payments & Fintech",
      icon: CreditCard,
      skills: ["Paystack (KYC & Payouts)", "Stripe (Webhooks/Subs)", "PayPal", "Idempotency & Concurrency Guards"]
    },
    {
      category: "Real-Time & Distributed",
      icon: Zap,
      skills: ["Socket.io", "BullMQ (Job Queues)", "Cron Schedulers", "Event-Driven Flows", "Concurrency Locks"]
    },
    {
      category: "Auth & Security",
      icon: ShieldCheck,
      skills: ["JWT & Refresh Tokens", "HMAC-SHA256 SSO", "RBAC / 2FA", "Google OAuth & Passport", "Rate Limiting"]
    },
    {
      category: "Full-Stack & Delivery",
      icon: Code2,
      skills: ["React / Next.js", "Tailwind CSS", "Docker", "Turborepo", "GitHub Actions", "Jest / Supertest"]
    }
  ]
};

const EXPERIENCES = [
  {
    role: "Lead Backend Developer",
    company: "Synergify",
    type: "Remote",
    period: "Sep 2024 – Present",
    summary: "Lead backend owner for the MCOM ecosystem — hub-and-spoke platform (NestJS, PostgreSQL, Redis) with MCOM Solutions Central as identity + billing hub for Mall, Rewards, Spin, VCard, Links and QR-Thrive.",
    highlights: [
      "Built Central auth: OAuth2 SSO + short-lived JWT handshake + HMAC-SHA256 data-sharing with JIT provisioning for one login across all platforms.",
      "Built Central payments: Stripe/PayPal + centralized wallet, memberships/packages, proxied in-app checkout, and HMAC-signed webhooks syncing entitlements.",
      "Shipped spoke services on shared contracts (plans CRUD, permissions gates), sustaining 50,000+ monthly requests at 99.9% uptime."
    ]
  },
  {
    role: "Software Engineer (Contract)",
    company: "Independent Client Engagements",
    type: "Remote",
    period: "2023 – 2024",
    summary: "Delivered scalable backend systems, ERP synchronization pipelines, and real-time messaging services.",
    highlights: [
      "WooManager: Custom WooCommerce ERP backend in NestJS synchronizing 10,000+ catalog inventory items, cutting stockout mismatches by 95%.",
      "AffiliateBase: Django REST Framework + Next.js ingestion pipelines processing 5,000+ records in <3s with SSG SEO optimization.",
      "Yurshorpe: Real-time buyer-seller messaging architecture with Firebase and WebSockets for 2,000+ active customer interactions."
    ]
  },
  {
    role: "B.Sc. in Statistics",
    company: "University of Ilorin",
    type: "Degree",
    summary: "Statistical inference, probability modeling, time series analysis, and machine learning applications.",
    highlights: [
      "Final-Year Project: Built a hybrid recommendation engine with TF-IDF and collaborative filtering, achieving 86% recommendation accuracy on test datasets."
    ]
  }
];

const PROJECTS = [
  {
    id: "vemtap",
    featured: true,
    title: "VEMTAP",
    category: "PRODUCTION_SAAS",
    tagline: "QR/NFC Customer Engagement Platform & Offline POS",
    metricBadges: [
      "813 REST Endpoints",
      "106 Controllers",
      "148 DB Entities",
      "148 Test Suites"
    ],
    description: "Architected and shipped an enterprise-grade QR/NFC customer engagement platform and offline POS system for physical business venues.",
    architectureSpecs: [
      "PostGIS Spatial Engine: Sub-10ms geospatial querying for nearby branch & store discovery.",
      "Offline-Capable POS: Conflict-free offline sync queue with transaction idempotency.",
      "Real-Time Messaging: Socket.io bidirectional channels for live order and interaction alerts.",
      "Rigorous Quality: 148 automated unit and E2E test suites ensuring zero regression."
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "PostGIS", "Redis", "Socket.io", "TypeORM", "NFC Tech"],
    demo: "https://vemtap.vercel.app/",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "mcom-mall",
    featured: true,
    title: "MCOM_MALL",
    category: "PRODUCTION_SAAS",
    tagline: "Multi-Vendor Marketplace & Seller Loyalty Engine",
    metricBadges: [
      "580 Endpoints",
      "Multi-Vendor APIs",
      "Gift Cards & Vouchers",
      "High Concurrency"
    ],
    description: "Designed a multi-vendor marketplace API enabling vendors to list products/services, establish seller partnerships, and run customer loyalty campaigns with custom digital vouchers and gift cards.",
    architectureSpecs: [
      "Atomic Balance Deductions: High-concurrency coupon, gift-card, and voucher redemption logic.",
      "Vendor Partitioning: Vendor-scoped catalogs, transaction routing, and settlement ledger.",
      "PostgreSQL Indexing: High-performance queries across dense product and order tables."
    ],
    stack: ["NestJS", "Next.js", "PostgreSQL", "Redis", "TypeScript", "Tailwind CSS"],
    demo: "https://mcom-mall.vercel.app/",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "mcom-reward",
    featured: true,
    title: "MCOM_REWARD",
    category: "LOYALTY_FINTECH",
    tagline: "Customer Loyalty, Points & Multi-Gateway Wallet Platform",
    metricBadges: [
      "334 Endpoints",
      "Stripe & PayPal",
      "Points & Stamps Engine",
      "Tiered Cashback"
    ],
    description: "Loyalty and rewards platform empowering businesses to run point-based, stamp-based, and tiered cashback campaigns with customer wallet funding via Stripe and PayPal.",
    architectureSpecs: [
      "Double-Spend Prevention: Distributed Redis locks + DB transaction isolation across redemption and top-up flows.",
      "Dynamic Campaign Engine: Multi-tier point multipliers, stamp threshold triggers, and expiry automation.",
      "Signature Verification: Webhook pipelines for asynchronous Stripe and PayPal payment confirmation."
    ],
    stack: ["NestJS", "Next.js", "PostgreSQL", "Redis", "Stripe", "PayPal", "TypeORM"],
    demo: "https://mcomloyalty.vercel.app/",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "mcom-vcard",
    title: "MCOM_VCARD",
    category: "PRODUCTION_SAAS",
    tagline: "Digital Business Cards & VCard Template Engine",
    metricBadges: [
      "332 REST Endpoints",
      "49 Controllers",
      "63 DB Entities",
      "MCOM SSO + Webhooks"
    ],
    description: "Shipped a digital business-card and VCard platform for businesses and members, with template-driven card creation, QR sharing, and rewards-backed engagement.",
    architectureSpecs: [
      "Sectioned Card Engine: Upsertable content blocks and centre controls (share/exchange/redeem toggles) per card.",
      "Template Lifecycle: Claim, apply, and duplicate flows that preserve saved content and re-map sections across designs.",
      "Public Tracking: Unauthenticated slug-based view/scan/share counters wired into analytics events.",
      "Central Billing Gate: MCOM OAuth SSO with HMAC-signed webhooks controlling can_access_vcard."
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "Redis", "React", "Vite", "Turborepo"],
    demo: "https://mcomvcard.centralhubsolution.com",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "mcom-links",
    title: "MCOM_LINKS",
    category: "PRODUCTION_SAAS",
    tagline: "QR/NFC Rotator Network & High-Street Offer Engine",
    metricBadges: [
      "98 REST Endpoints",
      "31 Controllers",
      "3-Layer Exposure",
      "Billing-Gated Rotation"
    ],
    description: "Built a centralized QR/NFC rotator that turns physical storefronts into dynamic digital billboards with sequential, never-blank offer delivery.",
    architectureSpecs: [
      "Atomic Rotator Pointer: Sequential next-offer memory with looping and branded fallback across concurrent scans.",
      "Weighted 3-Layer Routing: Hyper-local, nearby-expansion, and national layers with probability-based boosts.",
      "Monetization Guard: Suspended billing instantly drops offers from rotation; admin plan rulebook caps exposure.",
      "Multi-Portal Tenancy: Admin, agent, and business dashboards with scan/click/claim analytics."
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "React", "Vite", "Turborepo"],
    demo: "https://mcomlink.centralhubsolution.com",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "mcom-spin",
    title: "MCOM_SPIN",
    category: "LOYALTY_FINTECH",
    tagline: "Spin-to-Win Gamification & Mall Rewards Platform",
    metricBadges: [
      "352 REST Endpoints",
      "69 Controllers",
      "99 DB Models",
      "Leaderboards & Referrals"
    ],
    description: "Engineered a gamified loyalty and mall rewards platform where customers play campaigns, win prizes, and redeem rewards across local businesses.",
    architectureSpecs: [
      "Prize Campaign Engine: Reward inventory with QR/code redemption and expiry-aware customer wallets.",
      "Multi-Sided Portals: Business, customer, and mall-admin surfaces with RBAC and moderation flows.",
      "Engagement Loop: Leaderboards, referrals, promotions, events, and notification pipelines.",
      "Central Payments: MCOM SSO with platform-slug billing activation and webhook-driven access control."
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Next.js", "Tailwind CSS", "Turborepo"],
    demo: "https://mcomspin.centralhubsolution.com",
    github: null,
    liveStatus: "PRODUCTION"
  },
  {
    id: "affiliate-platform",
    featured: true,
    title: "AFFILIATE_BASE_PRO",
    category: "LOYALTY_FINTECH",
    tagline: "Multi-Level Affiliate Program & Automated Paystack Payouts",
    metricBadges: [
      "257 Endpoints",
      "Automated Payouts",
      "KYC Bank Verification",
      "BullMQ Queue"
    ],
    description: "Implemented multi-level affiliate program with commission and recruiter-override logic, automated Nigerian bank KYC verification (NUBAN), and scheduled Paystack batch transfers.",
    architectureSpecs: [
      "Hierarchical Overrides: Recursive calculation engine for parent and multi-tier recruiter commissions.",
      "Asynchronous Payout Pipeline: BullMQ jobs with exponential retry for scheduled Paystack transfer batches.",
      "Instant KYC Verification: Live NUBAN bank account resolution prior to transfer authorization."
    ],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Paystack API", "BullMQ", "Redis"],
    demo: null,
    github: null,
    liveStatus: "ENTERPRISE_API"
  },
  {
    id: "qr-thrive",
    title: "QR_THRIVE",
    category: "PRODUCTION_SAAS",
    tagline: "Dynamic QR Engine & Geo-Based Regional Pricing",
    metricBadges: [
      "95 Endpoints",
      "HMAC-SHA256 SSO",
      "Dynamic Routing",
      "Geo-Pricing Engine"
    ],
    description: "Engineered dynamic QR codes that update destinations and use-cases without reprinting physical tags, featuring lead-capture form builders and regional pricing tiers integrated with Vemtap.",
    architectureSpecs: [
      "Cross-Platform SSO: HMAC-SHA256 service-to-service auth for unified session sharing with Vemtap.",
      "Geo-IP Routing: Dynamic resolution of regional pricing and custom currency presentation.",
      "Edge-Cached Redirects: Microsecond redirect routing minimizing latency on physical QR scans."
    ],
    stack: ["NestJS", "PostgreSQL", "Redis", "SSO Architecture", "TypeScript"],
    demo: null,
    github: null,
    liveStatus: "ENTERPRISE_API"
  },
  {
    id: "logos-campus",
    featured: true,
    title: "LOGOS (CampusConnect)",
    category: "FULL_STACK_SAAS",
    tagline: "Social Learning Platform & TF-IDF Recommendation System",
    metricBadges: [
      "TF-IDF Recommendations",
      "Communities & Quizzes",
      "Offline PWA Mode",
      "Prisma + Redis"
    ],
    description: "Social learning platform built for academic institutions and student communities, featuring interactive quizzes, study communities, TF-IDF content recommendations, and PWA offline access.",
    architectureSpecs: [
      "Recommendation Algorithm: TF-IDF vector similarity matching students to tailored study materials.",
      "Sub-Millisecond Cache: Redis caching for real-time quiz leaderboards and community feeds.",
      "Open Source: Built with modern open standards and distributed under permissive licensing."
    ],
    stack: ["NestJS", "React", "Prisma", "PostgreSQL", "Redis", "PWA"],
    demo: "https://logos.devazeem.cv/feed",
    github: "https://github.com/devazx0",
    liveStatus: "OPEN_SOURCE"
  },
  {
    id: "woomanager",
    title: "WOOMANAGER",
    category: "CONTRACT_WORKS",
    tagline: "Custom WooCommerce ERP Backend & React Query Dashboard",
    metricBadges: [
      "WooCommerce REST API",
      "React Query Hooks",
      "NestJS Architecture",
      "Client Delivered"
    ],
    description: "Led backend architecture for a unified WooCommerce dashboard; integrated WooCommerce APIs and custom business logic via NestJS with React Query hooks for every endpoint.",
    architectureSpecs: [
      "API Normalization: Transformed WooCommerce REST responses into optimized, clean client payloads.",
      "Optimistic UI Updates: React Query mutation hooks with instant local state reflection."
    ],
    stack: ["NestJS", "React", "TanStack Query", "WooCommerce API", "TypeScript"],
    demo: null,
    github: null,
    liveStatus: "CLIENT_DELIVERED"
  },
  {
    id: "issueflow",
    featured: true,
    title: "ISSUEFLOW",
    category: "FULL_STACK_SAAS",
    tagline: "Multi-Tenant Issue Tracker & Agile Sprint Manager",
    metricBadges: [
      "Strict Multi-Tenancy",
      "Turborepo Monorepo",
      "Offline PWA + Cmd+K",
      "Built Solo in ~2 Weeks"
    ],
    description: "Jira-style full-stack issue tracker with dual-layer tenant isolation (DB schema + NestJS guards), per-project auto-numbering, interactive Kanban workflows, Web Push notifications, offline PWA support, and global Cmd+K palette.",
    architectureSpecs: [
      "Strict Tenant Isolation: Row-level tenant guards and database middleware preventing cross-tenant leakage.",
      "Monorepo Speed: Turborepo sharing types, DTOs, and validation schemas between client and API.",
      "Offline First: PWA caching and background sync for lightning-fast issue management."
    ],
    stack: ["NestJS", "React", "Vite", "Prisma", "PostgreSQL", "Turborepo", "Tailwind CSS", "PWA"],
    demo: "https://issuefloww.vercel.app/",
    github: "https://github.com/devazx0",
    liveStatus: "LIVE_APP"
  }
];

const SYSTEM_LOGS = [
  { id: 1, timestamp: "2026-08-30 12:00", level: "SUCCESS", message: "9+ production APIs shipped — loyalty, marketplace, gamification & payouts." },
  { id: 2, timestamp: "2024-11-20 14:10", level: "SUCCESS", message: "Vemtap flagship: QR/NFC engagement + offline POS in production." },
  { id: 3, timestamp: "2024-10-15 09:35", level: "INFO", message: "HMAC-SHA256 SSO + multi-tenant isolation adopted as core standard." },
  { id: 4, timestamp: "2024-09-28 18:22", level: "SUCCESS", message: "Zero payment double-spends via idempotency + Redis locks." },
  { id: 5, timestamp: "2024-08-10 11:05", level: "INFO", message: "IssueFlow: solo-built multi-tenant tracker — live with source code." }
];

const GEAR = {
  stack: ["NestJS", "TypeScript", "PostgreSQL (PostGIS)", "Prisma / TypeORM", "Redis", "Docker"],
  architecture: ["Multi-Tenant Isolation", "HMAC SSO", "BullMQ Queues", "Idempotent Payments", "REST & Swagger"]
};

// --- Utilities & Hooks ---

const useKonamiCode = (callback) => {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [, setInput] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newItem = e.key;
      setInput(prevInput => {
        const newInput = [...prevInput, newItem];
        if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
          return newItem === sequence[0] ? [newItem] : [];
        }
        if (newInput.length === sequence.length) {
          callback();
          return [];
        }
        return newInput;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
};

const callGemini = async (userQuery) => {
  const apiKey = "";

  const systemPrompt = `
    You are the AI interface for Azeem Sanusi's portfolio.
    Persona: Precise, highly technical, terminal/cyberpunk backend engineer assistant.
    Profile: Azeem Sanusi, Backend & Distributed Systems Engineer (NestJS, TypeScript, PostgreSQL, PostGIS, Redis). Shipped 9+ production APIs, 2800+ endpoints. Synergify Lead Backend Developer.
    Resume: Downloadable directly on page.
    Contact: ${CONFIG.email} | WhatsApp: ${CONFIG.phone}.
  `;

  const delays = [1000, 2000];

  for (let i = 0; i <= delays.length; i++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Response received.";
    } catch (error) {
      console.warn("AI Uplink fallback active:", error);
      if (i === delays.length) {
        const q = userQuery.toLowerCase();
        if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
          return `Azeem's resume is available for 1-click download via the DOWNLOAD_CV button on this portfolio, or at /Azeem_Sanusi_resume.pdf.`;
        }
        if (q.includes("vemtap") || q.includes("synergify") || q.includes("experience")) {
          return `At Synergify, Azeem lead-architected Vemtap (813 endpoints, 106 controllers, 148 entities), McomMall (580 endpoints), McomReward (334 endpoints), McomVcard (332 endpoints), McomLinks rotator (98 endpoints), and McomSpin gamification (352 endpoints) on NestJS + PostgreSQL + Redis.`;
        }
        if (q.includes("issueflow") || q.includes("project") || q.includes("logos")) {
          return `Azeem built IssueFlow (issuefloww.vercel.app - multi-tenant issue tracker) and Logos (logos.devazeem.cv/feed - open source social learning platform).`;
        }
        if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
          return `Reach Azeem directly at ${CONFIG.email} or WhatsApp at ${CONFIG.phone}. Open for backend and distributed systems roles.`;
        }
        return `SYSTEM_ONLINE: Azeem Sanusi is a Lead Backend Engineer (NestJS / TypeScript / PostgreSQL) with 9+ production APIs & 2,800+ endpoints shipped.`;
      }
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

// --- Mini Games (Mobile Optimized) ---

const DPadButton = ({ onClick, icon: Icon, className }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`p-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-xl active:scale-90 transition-transform touch-manipulation flex items-center justify-center shadow-sm ${className}`}
  >
    <Icon size={22} className="text-zinc-700 dark:text-zinc-300" />
  </button>
);

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gridSize = 16;

  const changeDir = useCallback((newDir) => {
    setDir(prevDir => {
      if (gameOver) return prevDir;
      if ((prevDir.x === 1 && newDir.x === -1) ||
        (prevDir.x === -1 && newDir.x === 1) ||
        (prevDir.y === 1 && newDir.y === -1) ||
        (prevDir.y === -1 && newDir.y === 1)) {
        return prevDir;
      }
      return newDir;
    });
  }, [gameOver]);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': changeDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': changeDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': changeDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': changeDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDir]);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize || prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 160);
    return () => clearInterval(move);
  }, [dir, food, gameOver]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-2 font-mono text-emerald-600 dark:text-emerald-500 font-bold text-xs sm:text-sm">SCORE: {score}</div>
      <div className="grid bg-zinc-900 border border-zinc-700 shadow-xl max-w-full" style={{ gridTemplateColumns: `repeat(${gridSize}, clamp(12px, 4vw, 16px))` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isSnake = snake.some(p => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return <div key={i} className={`aspect-square ${isSnake ? 'bg-emerald-500' : isFood ? 'bg-rose-500' : 'bg-transparent'}`} />;
        })}
      </div>
      {gameOver && <div className="mt-3 text-rose-500 font-bold text-xs">GAME OVER</div>}
      <button onClick={() => { setSnake([{ x: 8, y: 8 }]); setGameOver(false); setScore(0); setDir({ x: 0, y: -1 }); }} className="mt-3 px-4 py-2 bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700 rounded-lg font-mono flex items-center gap-2">
        <RotateCcw size={14} /> RESTART
      </button>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden w-44">
        <div />
        <DPadButton onClick={() => changeDir({ x: 0, y: -1 })} icon={ChevronUp} />
        <div />
        <DPadButton onClick={() => changeDir({ x: -1, y: 0 })} icon={ChevronLeft} />
        <DPadButton onClick={() => changeDir({ x: 0, y: 1 })} icon={ChevronDown} />
        <DPadButton onClick={() => changeDir({ x: 1, y: 0 })} icon={ChevronRight} />
      </div>
    </div>
  );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);

  function calculateWinner(squares) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  }

  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`mb-4 font-mono font-bold text-sm sm:text-base ${winner ? 'text-amber-500 animate-pulse' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {winner ? `WINNER: ${winner} ~` : (
          <span>NEXT: <span className={isX ? "text-emerald-500" : "text-rose-500"}>{isX ? 'X' : 'O'}</span></span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-zinc-200 dark:bg-zinc-800/50 p-2 sm:p-3 rounded-xl backdrop-blur-sm border border-zinc-300 dark:border-zinc-700 shadow-xl max-w-full">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 text-2xl sm:text-4xl font-black flex items-center justify-center transition-all duration-200 active:scale-95
              ${cell === 'X' ? 'text-emerald-500' : ''} 
              ${cell === 'O' ? 'text-rose-500' : ''} 
              ${!cell && !winner ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer' : 'cursor-default'} 
            `}
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={() => setBoard(Array(9).fill(null))}
        className="mt-6 px-5 py-2 bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700 rounded-full font-mono flex items-center gap-2 shadow-lg border border-zinc-700"
      >
        <RotateCcw size={14} /> RESET
      </button>
    </div>
  );
};

const RockPaperScissors = () => {
  const [result, setResult] = useState(null);
  const choices = ['ROCK', 'PAPER', 'SCISSORS'];

  const play = (choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    let res = '';
    if (choice === computer) res = 'DRAW';
    else if (
      (choice === 'ROCK' && computer === 'SCISSORS') ||
      (choice === 'PAPER' && computer === 'ROCK') ||
      (choice === 'SCISSORS' && computer === 'PAPER')
    ) res = 'WIN';
    else res = 'LOSE';
    setResult({ choice, computer, res });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {choices.map(c => (
          <button key={c} onClick={() => play(c)} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 active:scale-95 transition-all rounded-lg text-xs font-mono">
            {c}
          </button>
        ))}
      </div>
      {result && (
        <div className="text-center font-mono border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 w-full">
          <div className="text-[10px] text-zinc-400 mb-1">RESULT</div>
          <div className="flex justify-between mb-1 text-xs">
            <span>YOU: <span className="text-emerald-500 font-bold">{result.choice}</span></span>
            <span>CPU: <span className="text-rose-500 font-bold">{result.computer}</span></span>
          </div>
          <div className={`text-base font-bold ${result.res === 'WIN' ? 'text-emerald-500' : result.res === 'LOSE' ? 'text-rose-500' : 'text-amber-500'}`}>
            YOU {result.res}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Animations ---

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};

// --- UI Components ---

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout;
    if (displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 40 + Math.random() * 30);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="font-mono break-words">
      {displayedText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-emerald-600 dark:text-emerald-500`}>_</span>
    </span>
  );
};

const SectionHeader = ({ title, count }) => (
  <motion.h2 variants={fadeInUp} className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-6 sm:mb-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-2.5">
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-emerald-600 dark:text-emerald-500 font-mono">./</span>
      <span className="text-zinc-900 dark:text-zinc-100 tracking-wider font-mono truncate">{title}</span>
    </div>
    {count && (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 shrink-0 ml-2">
        [{count}]
      </span>
    )}
  </motion.h2>
);

const ThemeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-2.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-lg border border-zinc-200 dark:border-zinc-800"
    aria-label="Toggle Dark Mode"
  >
    {isDark ? <Sun size={17} /> : <Moon size={17} />}
  </button>
);

const DownloadCvButton = ({ variant = "default", className = "" }) => {
  if (variant === "compact") {
    return (
      <a
        href={CONFIG.resumeUrl}
        download="Azeem_Sanusi_resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-lg font-mono text-xs font-semibold transition-all active:scale-95 group ${className}`}
      >
        <FileText size={13} className="text-emerald-600 dark:text-emerald-400" />
        <span>DOWNLOAD_CV.PDF</span>
        <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
      </a>
    );
  }

  return (
    <a
      href={CONFIG.resumeUrl}
      download="Azeem_Sanusi_resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`relative inline-flex items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-zinc-950 font-mono text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] border border-zinc-800 dark:border-zinc-200 group ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <FileText size={15} />
        <span>DOWNLOAD_CV [PDF]</span>
      </div>
      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
        <span className="text-[10px] uppercase opacity-70 tracking-wider hidden xs:inline">RESUME</span>
        <Download size={13} className="group-hover:translate-y-0.5 transition-transform" />
      </div>
    </a>
  );
};

// --- Mobile-Optimized Project Item ---

const ProjectItem = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/50 bg-zinc-100/40 dark:bg-zinc-900/30 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 rounded-xl p-4 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              ~ {project.liveStatus}
            </span>
          </div>
          <h3 className="text-zinc-900 dark:text-zinc-100 font-bold font-mono text-lg sm:text-2xl tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors break-words">
            {project.title}
          </h3>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
              title="View Source Code"
            >
              <Github size={15} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-zinc-950 text-xs font-mono font-bold hover:bg-emerald-700 dark:hover:bg-emerald-400 active:scale-95 transition-all shadow-sm"
            >
              <span>DEMO</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium mb-3">
        {project.tagline}
      </p>

      {/* Metrics — capped at 3 for glanceability, rest live in CV */}
      {project.metricBadges && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3.5">
          {project.metricBadges.slice(0, 3).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-semibold"
            >
              ~ {badge}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3.5 font-light">
        {project.description}
      </p>

      {/* System Specs Expandable */}
      {project.architectureSpecs && (
        <div className="mb-3.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1.5 px-2 -ml-2 rounded-lg hover:bg-emerald-500/5"
          >
            <span>{isExpanded ? "[-] HIDE_SYSTEM_SPECS" : "[+] EXPAND_SPECS & ARCHITECTURE"}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2"
              >
                <div className="p-3 sm:p-4 rounded-xl bg-zinc-200/50 dark:bg-zinc-950/60 border border-zinc-300/80 dark:border-zinc-800 space-y-2 font-mono text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span>BACKEND_SPECIFICATIONS:</span>
                  </div>
                  {project.architectureSpecs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold shrink-0">~</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800/60">
        {project.stack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono rounded bg-zinc-200/60 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-300/50 dark:border-zinc-800"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// --- Compact Archive Row (glanceable) ---

const ArchiveRow = ({ project }) => (
  <a
    href={project.demo || project.github || "#projects-section"}
    target={project.demo || project.github ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="group flex items-center justify-between gap-3 px-3.5 sm:px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/40 dark:bg-zinc-900/30 hover:border-emerald-500/50 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 transition-all"
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
          {project.title}
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 uppercase">
          {project.category}
        </span>
      </div>
      <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
        {project.tagline}
      </p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className="hidden sm:inline text-[10px] font-mono text-zinc-400">
        {project.metricBadges?.[0] || project.liveStatus}
      </span>
      <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
    </div>
  </a>
);

// --- Career Experience Timeline ---

const ExperienceSection = () => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-30px" }}
    variants={staggerContainer}
    className="mb-20 sm:mb-24"
  >
    <SectionHeader title="EXPERIENCE_&_ROLES" count="LEAD_ARCHITECT" />
    <div className="space-y-8 sm:space-y-10">
      {EXPERIENCES.map((exp, idx) => (
        <motion.div
          key={idx}
          variants={fadeInUp}
          className="relative pl-4 sm:pl-6 border-l-2 border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 transition-colors"
        >
          <div className="absolute -left-[7px] sm:-left-[9px] top-1.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-emerald-500" />

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 mb-1">
            <h3 className="text-sm sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 break-words">
              {exp.role} <span className="text-emerald-600 dark:text-emerald-400 font-medium">@ {exp.company}</span>
            </h3>
            <span className="text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
              {exp.period ? `${exp.period} · ` : ""}{exp.type}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light mb-2.5">
            {exp.summary}
          </p>

          {exp.highlights.length > 0 && (
            <ul className="space-y-1.5 text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300">
              {exp.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">~</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  </motion.section>
);

// --- Command Palette ---

const CommandPalette = ({ isOpen, onClose, isDark, toggleTheme, onOpenGame, onFilterProjects }) => {
  if (!isOpen) return null;

  const commands = [
    { id: 'cv', label: '> Download CV / Resume [PDF]', action: () => { window.open(CONFIG.resumeUrl); }, icon: Download },
    { id: 'projects', label: '> Filter: Production SaaS APIs', action: () => onFilterProjects('PRODUCTION_SAAS'), icon: Server },
    { id: 'fullstack', label: '> Filter: Full-Stack & Apps', action: () => onFilterProjects('FULL_STACK_SAAS'), icon: Code2 },
    { id: 'theme', label: '> Toggle Dark/Light Theme', action: toggleTheme, icon: isDark ? Sun : Moon },
    { id: 'email', label: '> Send Direct Email', action: () => window.open(`mailto:${CONFIG.email}`), icon: Mail },
    { id: 'github', label: '> Open GitHub Profile', action: () => window.open(CONFIG.social.github), icon: Github },
    { id: 'linkedin', label: '> Open LinkedIn Profile', action: () => window.open(CONFIG.social.linkedin), icon: Linkedin },
    { id: 'snake', label: '> Play Snake Terminal Game', action: () => onOpenGame('snake'), icon: Gamepad2 },
    { id: 'tictactoe', label: '> Play Tic-Tac-Toe', action: () => onOpenGame('tictactoe'), icon: Gamepad2 },
    { id: 'rps', label: '> Play Rock Paper Scissors', action: () => onOpenGame('rps'), icon: Gamepad2 }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search size={16} className="text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or filter..."
            className="flex-1 bg-transparent focus:outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs sm:text-sm"
          />
          <div className="text-[10px] text-zinc-400 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">ESC</div>
        </div>
        <div className="py-2 max-h-72 overflow-y-auto">
          <div className="px-3.5 py-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Available Commands</div>
          {commands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => { cmd.action(); onClose(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-700 dark:text-zinc-300 transition-colors text-left group"
            >
              <cmd.icon size={15} className="group-hover:stroke-emerald-600 dark:group-hover:stroke-emerald-400 shrink-0" />
              <span className="font-mono text-xs sm:text-sm truncate">{cmd.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Neural Uplink (AI Terminal) ---

const NeuralUplink = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { role: 'system', text: 'NEURAL_UPLINK ESTABLISHED. ASK ABOUT 2,800+ REST ENDPOINTS, SYNERGIFY ARCHITECTURE, OR CV DOWNLOAD.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await callGemini(userMsg);

    setHistory(prev => [...prev, { role: 'system', text: response }]);
    setIsLoading(false);
  };

  return (
    <motion.div variants={fadeInUp} className="border-t border-zinc-200 dark:border-zinc-800/80 py-8 mb-20 sm:mb-24">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-xs uppercase">
          <Cpu size={14} />
          <span>NEURAL_UPLINK [AI ASSISTANT]</span>
        </div>
        <span className="text-[9px] font-mono text-zinc-400">STATUS: ACTIVE</span>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-900/60 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs h-56 sm:h-64 flex flex-col shadow-inner">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5 mb-3 pr-1">
          {history.map((msg, idx) => (
            <div key={idx} className={`${msg.role === 'user' ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'} leading-relaxed`}>
              <span className="mr-1.5 opacity-50 font-bold">{msg.role === 'user' ? '>' : '#'}</span>
              <span>{msg.text}</span>
            </div>
          ))}
          {isLoading && (
            <div className="text-emerald-600 dark:text-emerald-500 animate-pulse">
              <span className="mr-1.5">#</span> PROCESSING_QUERY...
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center border-t border-zinc-200 dark:border-zinc-800 pt-2.5">
          <span className="text-emerald-600 dark:text-emerald-500 font-bold">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about endpoints, Vemtap, IssueFlow..."
            className="bg-transparent flex-1 focus:outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 text-xs font-mono min-w-0"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="text-xs font-mono font-bold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            <span>SEND</span>
            <Sparkles size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Game Modal Window ---

const GameWindow = ({ game, onClose }) => {
  if (!game) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 truncate">
            <TerminalIcon size={13} />
            <span>CONSOLE: {game.toUpperCase()}</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-rose-500 transition-colors p-1">
            <X size={17} />
          </button>
        </div>
        <div className="p-3 sm:p-6 flex justify-center items-center min-h-[260px]">
          {game === 'snake' && <SnakeGame />}
          {game === 'tictactoe' && <TicTacToe />}
          {game === 'rps' && <RockPaperScissors />}
        </div>
      </motion.div>
    </div>
  );
};

// --- System Logs ---

const SystemLogs = () => (
  <motion.div variants={fadeInUp} className="mb-20 sm:mb-24">
    <SectionHeader title="SYSTEM_PRODUCTION_LOGS" count="VERIFIED" />
    <div className="font-mono text-[11px] sm:text-xs space-y-2 text-zinc-500 bg-zinc-100 dark:bg-zinc-900/30 p-3 sm:p-4 rounded-xl border-l-2 border-emerald-500 overflow-x-auto">
      {SYSTEM_LOGS.map((log) => (
        <div key={log.id} className="flex flex-col sm:flex-row sm:gap-3 leading-relaxed">
          <span className="opacity-50 shrink-0">[{log.timestamp}]</span>
          <span className={`font-bold shrink-0 w-16 sm:w-20 ${log.level === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-500' :
            log.level === 'WARN' ? 'text-amber-600 dark:text-amber-500' : 'text-blue-600 dark:text-blue-500'
            }`}>
            {log.level}
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">{log.message}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- Main Application Component ---

const App = () => {
  const [isDark, setIsDark] = useState(true);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [projectCategory, setProjectCategory] = useState("ALL");
  const [showArchive, setShowArchive] = useState(false);

  useKonamiCode(() => {
    setMatrixMode(prev => !prev);
    if (!matrixMode) setIsDark(true);
  });

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdKOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
        setActiveGame(null);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const matrixStyles = matrixMode ? {
    filter: 'sepia(100%) hue-rotate(90deg) saturate(300%) contrast(110%)',
    fontFamily: '"Courier New", Courier, monospace',
    textShadow: '0 0 5px #0f0'
  } : {};

  const featuredVisible = PROJECTS.filter(p =>
    p.featured && (projectCategory === "ALL" || p.category === projectCategory)
  );

  const archiveVisible = PROJECTS.filter(p =>
    !p.featured && (projectCategory === "ALL" || p.category === projectCategory)
  );

  const archivedCount = PROJECTS.filter(p => !p.featured).length;

  const categories = [
    { id: "ALL", label: "ALL_PROJECTS" },
    { id: "PRODUCTION_SAAS", label: "PRODUCTION_SAAS" },
    { id: "LOYALTY_FINTECH", label: "LOYALTY_&_FINTECH" },
    { id: "FULL_STACK_SAAS", label: "FULL_STACK" },
    { id: "CONTRACT_WORKS", label: "CONTRACT_WORKS" }
  ];

  return (
    <div className={`${isDark ? "dark" : ""} ${matrixMode ? "matrix-active" : ""}`}>
      <div
        className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 font-mono relative overflow-x-hidden"
        style={matrixStyles}
      >
        <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

        <CommandPalette
          isOpen={isCmdKOpen}
          onClose={() => setIsCmdKOpen(false)}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          onOpenGame={setActiveGame}
          onFilterProjects={(cat) => setProjectCategory(cat)}
        />

        <GameWindow game={activeGame} onClose={() => setActiveGame(null)} />

        {/* Background Grid Pattern */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${isDark ? '#27272a' : '#e4e4e7'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#27272a' : '#e4e4e7'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Background Subtle Radial Glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(16,185,129,0.035) 0%, rgba(0,0,0,0) 60%)'
          }}
        />

        <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-24">

          {/* HERO SECTION */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-16 sm:mb-24"
          >
            <motion.div variants={fadeInUp} className="mb-3.5 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-[11px] sm:text-xs uppercase flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>OPEN_TO_ROLES // REMOTE_READY</span>
              </div>
              <div className="hidden sm:flex gap-1.5 text-[10px] text-zinc-400 items-center">
                <Command size={10} />
                <span>+ K for actions</span>
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-3 text-zinc-900 dark:text-zinc-100 break-words">
              <TypingEffect text={CONFIG.name} />
            </h1>

            <motion.p variants={fadeInUp} className="text-sm sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
              {CONFIG.role}
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-mono mb-5 leading-normal">
              {CONFIG.subRole} · {CONFIG.location}
            </motion.p>

            {/* Metrics Grid — 3 glanceable proofs */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-2 sm:gap-3 my-5">
              {METRIC_BADGES.map((b, i) => (
                <div key={i} className="p-2.5 sm:p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono truncate">
                    {b.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5 truncate">
                    {b.label}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                    {b.sub}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <DownloadCvButton className="flex-1" />
              <a
                href="#projects-section"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-800 transition-colors active:scale-[0.98]"
              >
                <span>EXPLORE_PROJECTS</span>
                <ChevronDown size={14} />
              </a>
            </motion.div>
          </motion.section>

          {/* ABOUT SECTION */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="mb-20 sm:mb-24"
          >
            <SectionHeader title="ABOUT_ME" count="SYNERGIFY_LEAD" />
            <motion.p variants={fadeInUp} className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs sm:text-base font-normal">
              {SECTIONS.about}
            </motion.p>
          </motion.section>

          {/* WORK EXPERIENCE */}
          <ExperienceSection />

          {/* PROJECTS SECTION */}
          <motion.section
            id="projects-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="mb-20 sm:mb-24"
          >
            <SectionHeader title={showArchive ? "ALL_SYSTEMS_&_ARCHIVE" : "FEATURED_SYSTEMS"} count={showArchive ? `${featuredVisible.length + archiveVisible.length}_LOADED` : "6_FEATURED"} />

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light mb-5 -mt-3">
              {showArchive
                ? "Full archive — featured systems up top, the rest as quick-scan rows below."
                : "Top 6 systems for a quick skim. Full detail lives in my CV — archive holds the rest."}
            </p>

            {/* Category Filter Pills (Scrollable on Mobile) — only in archive mode */}
            {showArchive && (
              <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProjectCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 active:scale-95 ${projectCategory === cat.id
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Featured Projects List */}
            <div className="space-y-4 sm:space-y-6">
              {featuredVisible.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
              {featuredVisible.length === 0 && (
                <p className="text-xs font-mono text-zinc-500 text-center py-4">
                  No featured projects in this category — try ALL_PROJECTS.
                </p>
              )}
            </div>

            {/* Archive Toggle */}
            <div className="mt-8 text-center">
              {!showArchive ? (
                <button
                  onClick={() => setShowArchive(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-800 transition-all active:scale-[0.98]"
                >
                  <span>VIEW_ARCHIVE [+{archivedCount} MORE_SYSTEMS]</span>
                  <ChevronDown size={14} />
                </button>
              ) : (
                <div className="space-y-5">
                  <div className="pt-2">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-3">
                      ── ARCHIVE · {archiveVisible.length} MORE ──
                    </div>
                    <div className="space-y-2 text-left">
                      {archiveVisible.map((project) => (
                        <ArchiveRow key={project.id} project={project} />
                      ))}
                      {archiveVisible.length === 0 && (
                        <p className="text-xs font-mono text-zinc-500 text-center py-4">
                          No archived projects in this category — try ALL_PROJECTS.
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowArchive(false); setProjectCategory("ALL"); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    <ChevronUp size={14} />
                    <span>SHOW_LESS</span>
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          {/* TECH STACK */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="mb-20 sm:mb-24"
          >
            <SectionHeader title="TECHNICAL_SKILLS_MATRIX" count="CORE_STACK" />
            <div className="grid gap-4 sm:gap-5">
              {SECTIONS.skills.map((group, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="p-3.5 sm:p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2.5">
                    <group.icon size={14} />
                    <span>{group.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-mono rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* SYSTEM LOGS */}
          <SystemLogs />

          {/* GEAR MANIFEST */}
          <motion.div variants={fadeInUp} className="mb-20 sm:mb-24">
            <SectionHeader title="SYSTEM_GEAR_MANIFEST" count="SPECS" />
            <div className="bg-zinc-900 text-zinc-300 p-3.5 sm:p-5 rounded-xl text-[11px] sm:text-sm font-mono overflow-x-auto border border-zinc-800 shadow-inner">
              <pre>{JSON.stringify(GEAR, null, 2)}</pre>
            </div>
          </motion.div>

          {/* AI NEURAL UPLINK */}
          <NeuralUplink />

          {/* CONTACT & CV DOWNLOAD */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="mb-20 sm:mb-24"
          >
            <SectionHeader title="INITIATE_CONTACT" count="OPEN_TO_ROLES" />

            <div className="mb-4 sm:mb-6">
              <DownloadCvButton />
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
              <a
                href={`mailto:${CONFIG.email}`}
                className="p-3.5 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono min-w-0">
                    <div className="text-zinc-400 text-[10px]">DIRECT_EMAIL</div>
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold truncate">{CONFIG.email}</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </a>

              <a
                href={CONFIG.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MessageCircle size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono min-w-0">
                    <div className="text-zinc-400 text-[10px]">WHATSAPP_CHAT</div>
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold truncate">+234 909 502 1208</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </a>

              <a
                href={CONFIG.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Github size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono min-w-0">
                    <div className="text-zinc-400 text-[10px]">GITHUB_SOURCE</div>
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold truncate">github.com/devazx0</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </a>

              <a
                href={CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Linkedin size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono min-w-0">
                    <div className="text-zinc-400 text-[10px]">LINKEDIN_CONNECT</div>
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold truncate">linkedin.com/in/sanusi-azeem</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </a>
            </div>
          </motion.section>

          {/* FOOTER */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-zinc-200 dark:border-zinc-900 pt-6 sm:pt-8 mt-10 sm:mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 dark:text-zinc-600 font-mono gap-3.5 text-center sm:text-left"
          >
            <div>
              © {new Date().getFullYear()} {CONFIG.name}. All backend systems operational.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <DownloadCvButton variant="compact" />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>available_for_hire = <span className="text-emerald-600 dark:text-emerald-400">true</span></span>
              </div>
            </div>
          </motion.footer>

        </main>
      </div>
    </div>
  );
};

export default App;
