import React, { useState, useEffect, useRef } from "react";
import {
  Vote, Coins, Sliders, Calendar, Sparkles, Map, Info,
  ChevronRight, ArrowRight, ShieldCheck, Heart, Cpu, CheckCircle,
  HelpCircle, Layers, Landmark, RefreshCw, Minus, Plus, ThumbsUp,
  AlertCircle, Smartphone, Award, Shield, Globe, ChevronUp,
  Menu, X, Twitter, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProtocolMap from "./components/ProtocolMap";
import FinancialModeler from "./components/FinancialModeler";
import TokenomicsPortal from "./components/TokenomicsPortal";
import RoadmapTimeline from "./components/RoadmapTimeline";
import AiAdvisor from "./components/AiAdvisor";

type TabType = "overview" | "simulator" | "financials" | "tokenomics" | "roadmap" | "advisor";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "";
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : "";

const TYPEWRITER_LINES = [
  "VoteLedger makes every citizen a guardian of democracy.",
  "Building a competing source of truth — bottom-up.",
  "No smartphone? No problem. Every Nigerian can be a node.",
];

const TABS: { id: TabType; label: string }[] = [
  { id: "overview",   label: "Protocol Overview" },
  { id: "simulator",  label: "Node Simulator" },
  { id: "financials", label: "Financial Modeler" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "advisor",    label: "Protocol Advisor" },
  { id: "roadmap",    label: "Roadmap" },
];

const TAB_META: Record<TabType, { eyebrow: string; title: string; desc: string }> = {
  overview:   { eyebrow: "// Protocol Overview", title: "Protocol Overview", desc: "" },
  simulator:  { eyebrow: "// Sandbox System", title: "Consensus & Telemetry Network Simulator", desc: "Simulate offline-fallback telemetry, consensus matching, and SMS cascade routing." },
  financials: { eyebrow: "// Budget Sandbox", title: "Capital Efficiency Modeler", desc: "Adjust parameters to model hardware, carrier, and mobilization costs across all three deployment stages." },
  tokenomics: { eyebrow: "// Governance Sandbox", title: "Democoin & Quadratic Voting Board", desc: "Explore Democoin distribution, governance proposals, and quadratic voting mechanics." },
  advisor:    { eyebrow: "// Protocol Intelligence", title: "Protocol Advisor", desc: "Ask the AI Advisor — pre-loaded with the full VoteLedger spec — to draft pitches, investor briefs, outreach copy, and strategic analysis." },
  roadmap:    { eyebrow: "// Rollout Roadmap", title: "Strategic 6-Month Roadmap", desc: "Detailed milestones across the six-month launch plan from foundation to Democoin launch." },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Typewriter ─────────────────────────────────────────────────────────
  const [lineIdx, setLineIdx]         = useState(0);
  const [charIdx, setCharIdx]         = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting]   = useState(false);

  useEffect(() => {
    const currentLine = TYPEWRITER_LINES[lineIdx];
    const speed = isDeleting ? 20 : 40;
    if (!isDeleting && charIdx === currentLine.length) {
      const t = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setLineIdx(prev => (prev + 1) % TYPEWRITER_LINES.length);
      return;
    }
    const t = setTimeout(() => {
      setDisplayText(isDeleting
        ? currentLine.substring(0, charIdx - 1)
        : currentLine.substring(0, charIdx + 1));
      setCharIdx(prev => isDeleting ? prev - 1 : prev + 1);
    }, speed);
    return () => clearTimeout(t);
  }, [charIdx, isDeleting, lineIdx]);

  // ── Node counter ───────────────────────────────────────────────────────
  const [nodeCount, setNodeCount] = useState(0);
  const nodeCountRef = useRef(0);

  useEffect(() => {
    const seed = 247;
    const duration = 2400;
    const start = performance.now();
    const raf = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * seed);
      nodeCountRef.current = val;
      setNodeCount(val);
      if (progress < 1) {
        requestAnimationFrame(raf);
      } else {
        nodeCountRef.current = seed;
        setNodeCount(seed);
        const tick = () => {
          if (Math.random() > 0.65) {
            nodeCountRef.current += 1;
            setNodeCount(nodeCountRef.current);
          }
          setTimeout(tick, Math.random() * 10000 + 6000);
        };
        setTimeout(tick, 5000);
      }
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  // ── Scroll to top ──────────────────────────────────────────────────────
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Navigation ─────────────────────────────────────────────────────────
  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== "overview") {
      setActiveTab("overview");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // FIX: scroll to very top on every tab switch — hero is hidden on non-overview tabs
  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Hero email signup ──────────────────────────────────────────────────
  const [heroEmail, setHeroEmail]       = useState("");
  const [heroSignedUp, setHeroSignedUp] = useState(false);
  const [heroLoading, setHeroLoading]   = useState(false);
  const [heroError, setHeroError]       = useState("");

  const handleHeroSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail || !heroEmail.includes("@")) {
      setHeroError("Please enter a valid email address.");
      return;
    }
    setHeroError("");
    setHeroLoading(true);
    try {
      if (!FORMSPREE_URL) throw new Error("Formspree not configured");
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: heroEmail, source: "hero", role: "early-supporter" }),
      });
      if (res.ok) {
        setHeroSignedUp(true);
        nodeCountRef.current += 1;
        setNodeCount(nodeCountRef.current);
      } else {
        setHeroError("Something went wrong. Please try again.");
      }
    } catch {
      setHeroSignedUp(true);
      nodeCountRef.current += 1;
      setNodeCount(nodeCountRef.current);
    } finally {
      setHeroLoading(false);
    }
  };

  // ── Full signup ────────────────────────────────────────────────────────
  const [fullName, setFullName]         = useState("");
  const [emailAddr, setEmailAddr]       = useState("");
  const [roleSelect, setRoleSelect]     = useState("");
  const [stateInput, setStateInput]     = useState("");
  const [formSignedUp, setFormSignedUp] = useState(false);
  const [formLoading, setFormLoading]   = useState(false);
  const [formError, setFormError]       = useState("");

  const handleFullSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddr || !emailAddr.includes("@") || !roleSelect || !stateInput) {
      setFormError("Please fill in all fields before submitting.");
      return;
    }
    setFormError("");
    setFormLoading(true);
    try {
      if (!FORMSPREE_URL) throw new Error("Formspree not configured");
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: fullName, email: emailAddr, role: roleSelect, state: stateInput, source: "full-signup" }),
      });
      if (res.ok) {
        setFormSignedUp(true);
        nodeCountRef.current += 1;
        setNodeCount(nodeCountRef.current);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormSignedUp(true);
      nodeCountRef.current += 1;
      setNodeCount(nodeCountRef.current);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Twitter share ──────────────────────────────────────────────────────
  const handleShare = () => {
    const text = encodeURIComponent('"Truth has value — VoteLedger makes it tradable."\n\nA citizen-powered civic protocol for electoral integrity in Nigeria. Every citizen a node. Every vote a truth.\n\n');
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-sand flex flex-col selection:bg-brand-gold/20 selection:text-text-sand relative overflow-x-hidden font-sans">

      {/* Ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(26,107,60,0.05)_0%,transparent_60%)] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute inset-0 grid-overlay pointer-events-none z-0 opacity-40" aria-hidden="true" />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-bg-deep/95 backdrop-blur-sm border-b border-brand-gold-light/25 relative" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => switchTab("overview")}
            className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none rounded cursor-pointer group"
            aria-label="VoteLedger home"
          >
            <div className="w-6 h-6 border border-brand-green/60 rounded-full flex items-center justify-center group-hover:border-brand-green transition-colors" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            </div>
            <span className="font-sans font-bold tracking-tight text-text-sand text-base">VoteLedger</span>
            <span className="hidden sm:inline-block text-[9px] bg-brand-gold/5 border border-brand-gold-light/25 px-2 py-0.5 rounded font-mono text-text-sand-dim uppercase tracking-wider">NIGERIA CORE</span>
          </button>

          {/* Desktop nav — with breadcrumb */}
          <div className="hidden lg:flex flex-col items-center gap-0.5">
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all border cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
                      isActive
                        ? "bg-brand-green/10 border-brand-green/30 text-brand-green font-bold"
                        : "border-transparent text-text-sand-dim hover:text-brand-green hover:bg-brand-green/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            {/* Breadcrumb — shows current section */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-sand-muted uppercase tracking-widest">
              <span className="text-brand-green/60">VoteLedger</span>
              <span>/</span>
              <span className="text-brand-green font-bold">{TABS.find(t => t.id === activeTab)?.label}</span>
              <span className="text-brand-gold-light/40">·</span>
              <span>{TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length}</span>
            </div>
          </div>

          {/* Header right */}
          <div className="hidden md:flex gap-5 font-mono text-[10px] text-text-sand-muted uppercase">
            <div className="flex flex-col items-end">
              <span className="text-brand-green font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot inline-block" aria-hidden="true" />
                ACTIVE PROTOCOL
              </span>
              <span className="text-[9px] text-text-sand-muted">Network Status</span>
            </div>
            <div className="h-6 w-px bg-brand-gold/10 self-center" aria-hidden="true" />
            <div className="flex flex-col items-end">
              <span className="text-brand-gold font-bold">1B FIXED</span>
              <span className="text-[9px] text-text-sand-dim">$DEMO Supply</span>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="flex lg:hidden p-2 rounded border border-brand-gold-light/20 text-text-sand-dim hover:text-text-sand hover:border-brand-gold-light/40 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-bg-deeper border-b border-brand-gold-light/20"
            >
              <nav className="flex flex-col py-2 px-4" aria-label="Mobile navigation">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className={`text-left py-3 px-3 font-mono text-[11px] uppercase tracking-widest rounded transition-all cursor-pointer border-b border-brand-gold-light/10 last:border-0 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
                      activeTab === tab.id
                        ? "text-brand-green font-bold"
                        : "text-text-sand-dim hover:text-text-sand"
                    }`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO — only shown on overview tab ───────────────────────────── */}
      {activeTab === "overview" && (
        <section className="relative py-12 sm:py-28 text-center px-4 overflow-hidden border-b border-brand-gold-light/30 bg-bg-darker" aria-labelledby="hero-heading">
          {/* Radio wave rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-15 hidden md:block" aria-hidden="true">
            <div className="relative w-[800px] h-[800px]">
              {[150, 300, 450, 600].map((size, i) => (
                <div key={size} className={`absolute top-1/2 left-1/2 rounded-full border border-brand-green animate-wave-${i}`} style={{ width: size, height: size }} />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/5 border border-brand-green/20 text-brand-green rounded font-mono text-[10px] uppercase tracking-widest mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Civic Protocol &nbsp;·&nbsp; Nigeria
            </div>

            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-7xl text-text-sand tracking-tight leading-[1.05] sm:leading-[0.98] max-w-3xl mx-auto" id="hero-heading">
              For too long,<br />
              our votes have been<br />
              <span className="font-serif italic font-light text-brand-green">stolen in silence.</span>
            </h1>

            <div className="font-mono text-xs sm:text-sm text-text-sand-dim flex items-center justify-center gap-1.5 h-6 max-w-lg mx-auto" role="status" aria-live="polite" aria-label={`Rotating message: ${displayText}`}>
              <span className="text-brand-green font-bold select-none" aria-hidden="true">&gt;_</span>
              <span aria-hidden="true">{displayText}</span>
              <span className="inline-block w-1.5 h-4 bg-brand-green animate-blink select-none" aria-hidden="true" />
            </div>

            {/* Hero CTA */}
            <div className="max-w-xl mx-auto">
              {!heroSignedUp ? (
                <form onSubmit={handleHeroSignup} noValidate>
                  <div className="flex border border-brand-gold-light/25 hover:border-brand-green/30 focus-within:border-brand-green rounded overflow-hidden bg-bg-darker transition-all max-w-md mx-auto">
                    <label htmlFor="hero-email" className="sr-only">Email address</label>
                    <input
                      id="hero-email"
                      type="email"
                      required
                      value={heroEmail}
                      onChange={e => { setHeroEmail(e.target.value); setHeroError(""); }}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 bg-transparent text-sm text-text-sand focus:outline-none placeholder-text-sand-muted font-sans"
                      disabled={heroLoading}
                    />
                    <button
                      type="submit"
                      disabled={heroLoading}
                      className="bg-brand-green hover:bg-brand-green/90 disabled:opacity-60 text-bg-deep font-sans font-bold text-xs px-6 py-3 transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-green focus-visible:outline-none"
                    >
                      {heroLoading ? "Joining..." : "Join the protocol"}
                    </button>
                  </div>
                  {heroError && <p className="text-xs text-red-700 font-mono mt-2 border-l-2 border-red-700 pl-2">{heroError}</p>}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-brand-green/10 border border-brand-green/20 rounded-lg max-w-md mx-auto text-xs text-brand-green font-sans tracking-wide"
                  role="status"
                >
                  ✓ &nbsp;You are registered. Welcome to the protocol.
                </motion.div>
              )}
              <p className="text-[11px] text-text-sand-muted mt-3 font-mono tracking-wider">
                Be among the first 1,000 founding citizen nodes.
              </p>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-gold/10 border border-brand-gold-light/25 rounded overflow-hidden max-w-3xl mx-auto pt-px" role="list">
              {[
                { val: "176K",   sub: "Polling units",    onClick: () => navigateToSection("how") },
                { val: "93M",    sub: "Registered voters", onClick: null },
                { val: "3-Tier", sub: "Node hierarchy",   onClick: () => navigateToSection("nodes") },
                { val: "1B",     sub: "Fixed cap supply",  onClick: () => switchTab("tokenomics") },
              ].map(({ val, sub, onClick }) => (
                <div
                  key={sub}
                  role="listitem"
                  onClick={onClick ?? undefined}
                  className={`bg-bg-dark p-5 text-center transition-all ${onClick ? "hover:bg-bg-darker cursor-pointer group" : ""}`}
                >
                  <div className={`text-xl sm:text-3xl font-bold text-text-sand tracking-tight ${onClick ? "group-hover:text-brand-green transition-colors" : ""}`}>
                    {val.replace(/[KMB-].*/, "")}<span className="text-brand-green">{val.match(/[KMB]|-Tier/)?.[0] ?? ""}</span>
                  </div>
                  <div className="text-[9px] font-mono text-text-sand-muted uppercase mt-1 tracking-widest">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TAB INDICATOR BAR ───────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-bg-deep/98 backdrop-blur-sm border-b border-brand-gold-light/20 shadow-sm" role="navigation" aria-label="Section navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <span className="text-[9px] font-mono text-text-sand-muted uppercase tracking-widest mr-2 shrink-0">Section:</span>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
                  activeTab === tab.id
                    ? "bg-brand-green text-bg-deep border-brand-green font-bold"
                    : "border-brand-gold-light/20 text-text-sand-muted hover:border-brand-green/40 hover:text-brand-green"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Mobile indicator */}
          <div className="flex sm:hidden items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" aria-hidden="true" />
              <span className="text-[11px] font-mono font-bold text-brand-green uppercase tracking-wider">
                {TABS.find(t => t.id === activeTab)?.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const idx = TABS.findIndex(t => t.id === activeTab); if (idx > 0) switchTab(TABS[idx - 1].id); }}
                disabled={TABS.findIndex(t => t.id === activeTab) === 0}
                className="p-1.5 rounded border border-brand-gold-light/20 text-text-sand-muted disabled:opacity-30 hover:border-brand-green/40 hover:text-brand-green transition-all cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                aria-label="Previous section"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-[9px] font-mono text-text-sand-muted px-1">
                {TABS.findIndex(t => t.id === activeTab) + 1}/{TABS.length}
              </span>
              <button
                onClick={() => { const idx = TABS.findIndex(t => t.id === activeTab); if (idx < TABS.length - 1) switchTab(TABS[idx + 1].id); }}
                disabled={TABS.findIndex(t => t.id === activeTab) === TABS.length - 1}
                className="p-1.5 rounded border border-brand-gold-light/20 text-text-sand-muted disabled:opacity-30 hover:border-brand-green/40 hover:text-brand-green transition-all cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                aria-label="Next section"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main id="content-top" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 w-full relative z-10">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >

            {/* ── OVERVIEW TAB ──────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-16">

                {/* NODE HIERARCHY — moved above "How it works" (most important concept first) */}
                <section id="nodes" aria-labelledby="nodes-heading" className="py-8">
                  <div className="space-y-4 mb-10">
                    <div className="eyebrow" aria-hidden="true">Node hierarchy</div>
                    <h2 className="text-3xl sm:text-5xl font-light text-text-sand tracking-tight leading-tight" id="nodes-heading">
                      Built for every Nigerian,<br />
                      <span className="font-serif italic font-light text-brand-green">not just the connected ones.</span>
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { tier: "01", name: "Hardware Anchor", badge: "Hardware Node", badgeClass: "bg-bg-dark border-brand-gold-light/30 text-text-sand-dim", body: "Hardware device at every polling unit. Signs official tallies at the source. Sealed and tamper-evident — any attempt to destroy it registers as physical forensic evidence, not silent erasure." },
                      { tier: "02", name: "Verified Validator", badge: "Citizen Node", badgeClass: "bg-brand-green/10 border-brand-green/20 text-brand-green", body: "A verified citizen with the app, NIN linkage, and minimum trust score. Records independently, hosts protocol events, onboards Sub-Nodes, and earns Democoin yield on their network." },
                      { tier: "03", name: "Delegated Sub-Node", badge: "Delegated Node", badgeClass: "bg-bg-dark border-brand-gold-light/30 text-text-sand-dim", body: "No smartphone required. Registered by a Validator using only their NIN. On election day, their Validator submits on their behalf — cryptographically signed, permanently accountable." },
                    ].map(({ tier, name, badge, badgeClass, body }) => (
                      <div key={tier} className="bg-bg-darker border border-brand-gold-light/25 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center hover:border-brand-green/20 transition-all">
                        <div>
                          <span className="font-mono text-[10px] text-brand-green uppercase tracking-widest font-bold">// TIER {tier}</span>
                          <h3 className="text-lg font-bold text-text-sand mt-1">{name}</h3>
                        </div>
                        <p className="md:col-span-2 font-serif text-sm text-text-sand-dim leading-relaxed">{body}</p>
                        <div className="flex justify-start md:justify-end">
                          <span className={`px-3 py-1 border text-[10px] font-mono uppercase tracking-widest rounded ${badgeClass}`}>{badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-6 border-l-2 border-brand-green bg-bg-darker/35 rounded-r-lg">
                    <p className="font-serif text-sm text-text-sand-dim leading-relaxed">
                      The Sub-Node architecture solves what no African civic tech project has cracked — the last-mile human problem. Nigeria's most excluded voters don't need a smartphone. They need proximity to a Validator they trust.{" "}
                      <span className="text-brand-green font-semibold">VoteLedger formalises this human network into a cryptographic protocol.</span>
                    </p>
                  </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how" aria-labelledby="how-heading" className="py-8 border-t border-brand-gold-light/25">
                  <div className="space-y-4 mb-10">
                    <div className="eyebrow" aria-hidden="true">How the protocol works</div>
                    <h2 className="text-3xl sm:text-5xl font-light text-text-sand tracking-tight leading-tight" id="how-heading">
                      Truth recorded at the<br />
                      <span className="font-serif italic font-light text-brand-green">source, before it can change.</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-gold/10 border border-brand-gold-light/25 rounded-lg overflow-hidden">
                    {[
                      { n: "01", title: "You download. You become a node.", body: "Every citizen who downloads VoteLedger auto-creates a cryptographic wallet. Verify your PVC or NIN and you become a verified node — one identity, one wallet, one vote in the protocol.", tags: ["React Native", "Solana wallet", "NIN Auth"] },
                      { n: "02", title: "An Anchor sits at every polling unit.", body: "A small hardware device — sealed, tamper-evident — records the official tally the moment results are announced. It signs the data cryptographically and stores it locally. Even if the internet is down.", tags: ["Raspberry Pi", "GSM Module", "Offline cache"] },
                      { n: "03", title: "Citizens and Anchors agree.", body: "When citizen nodes and the Anchor reach consensus, the result is written to the Solana blockchain — permanently, publicly, immutably. No minister, no returning officer can reach it.", tags: ["Solana", "Multi-Sig", "Arweave"] },
                      { n: "04", title: "GSM mesh means nobody is left out.", body: "In areas with internet, sync is instant. In areas with only GSM signal, submissions travel by SMS. Disrupted areas sync late, not never.", tags: ["SMS Fallback", "Delayed Sync", "Twilio"] },
                      { n: "05", title: "Discrepancies become public instantly.", body: "When VoteLedger's ledger diverges from official announcements, an automated Discrepancy Card fires — a clean, shareable summary journalists receive via API the moment it generates.", tags: ["Discrepancy Engine", "Media API", "Auto-alert"] },
                      { n: "06", title: "Accuracy earns Democoin.", body: "Citizens whose submissions match verified consensus earn Democoin — a tradable, on-chain record of civic participation. Your balance is your civic resume. Truth becomes a financial asset.", tags: ["Democoin", "Token-2022", "Quadratic Gov"] },
                    ].map(({ n, title, body, tags }) => (
                      <div key={n} className="bg-bg-darker p-8 flex flex-col justify-between hover:bg-bg-dark/60 transition-colors group">
                        <div>
                          <div className="text-[10px] font-mono text-brand-green font-bold tracking-widest uppercase mb-4">STEP {n}</div>
                          <h3 className="text-lg font-bold text-text-sand mb-2 tracking-wide group-hover:text-brand-green transition-colors">{title}</h3>
                          <p className="font-serif text-text-sand-dim text-sm leading-relaxed">{body}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-6">
                          {tags.map(t => <span key={t} className="chip">{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-6 bg-brand-green/5 border border-brand-green/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 bg-brand-green/10 text-brand-green rounded-lg" aria-hidden="true"><Cpu className="w-5 h-5" /></span>
                      <div>
                        <h4 className="text-sm font-bold text-text-sand uppercase tracking-wider">Interactive Node Simulator</h4>
                        <p className="text-xs text-text-sand-dim">Simulate offline-mesh fallback telemetry routing and local ward sync in real time.</p>
                      </div>
                    </div>
                    <button onClick={() => switchTab("simulator")} className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-light text-bg-deep font-bold font-sans text-xs uppercase tracking-wider py-2.5 px-5 rounded cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:outline-none">
                      Launch Simulator
                    </button>
                  </div>
                </section>

                {/* WHY IT MATTERS */}
                <section id="why" aria-labelledby="why-heading" className="py-8 border-t border-brand-gold-light/25">
                  <div className="space-y-4 mb-10">
                    <div className="eyebrow" aria-hidden="true">Why it matters</div>
                    <h2 className="text-3xl sm:text-5xl font-light text-text-sand tracking-tight leading-tight" id="why-heading">
                      Evidence without infrastructure<br />
                      <span className="font-serif italic font-light text-brand-green">is noise. We build the infrastructure.</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-gold/10 border border-brand-gold-light/25 rounded-lg overflow-hidden">
                    {[
                      { icon: "◎", title: "A competing source of truth", body: "Nigeria's elections don't fail because citizens don't care. They fail because the infrastructure of truth is controlled by the people who benefit from manipulating it. VoteLedger creates an independent record — bottom-up, before anyone can reach it." },
                      { icon: "◈", title: "Structurally non-partisan", body: "The protocol is neutral by design. The data is the data — whoever submits it, whatever party they support. Blocking VoteLedger means publicly opposing transparency. That's a political cost no Nigerian administration wants to pay openly." },
                      { icon: "◇", title: "Built for the adversarial real world", body: "Destroyed devices, cell-tower jamming, violent disruptions — VoteLedger handles it all. Data leaves the device before violence arrives. Disrupted wards sync late, not never." },
                      { icon: "◉", title: "Nigeria is Chapter 1", body: "Prove it here first. Deploy in Ghana, Kenya, Senegal, Zimbabwe. The protocol is redeployable at a fraction of the original cost. VoteLedger is not an election app. It is civic infrastructure for a continent." },
                    ].map(({ icon, title, body }) => (
                      <div key={title} className="bg-bg-darker p-8 border border-brand-gold-light/30 hover:border-brand-green/20 transition-all">
                        <span className="p-2 bg-brand-green/10 text-brand-green rounded inline-block text-sm font-mono mb-4" aria-hidden="true">{icon}</span>
                        <h3 className="text-lg font-bold text-text-sand mb-2 tracking-wide">{title}</h3>
                        <p className="font-serif text-sm text-text-sand-dim leading-relaxed">{body}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* PULL QUOTE + SHARE */}
                <section className="py-12 px-6 bg-brand-green/5 border border-brand-green/10 rounded-xl text-center" aria-label="Core philosophy">
                  <blockquote className="font-serif italic text-2xl sm:text-3xl text-brand-gold max-w-2xl mx-auto leading-relaxed">
                    "Truth has value. VoteLedger makes it tradable."
                  </blockquote>
                  <cite className="block font-mono text-[10px] text-brand-green uppercase tracking-widest mt-4 not-italic">
                    VoteLedger — Civic Protocol · Nigeria · 2025
                  </cite>
                  <button
                    onClick={handleShare}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-bg-darker border border-brand-gold-light/25 hover:border-brand-green/30 text-text-sand-dim hover:text-text-sand font-mono text-[11px] uppercase tracking-wider rounded transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                    aria-label="Share on Twitter/X"
                  >
                    <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
                    Share this
                  </button>
                </section>

                {/* ROADMAP PREVIEW */}
                <section className="py-8 border-t border-brand-gold-light/25">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <div className="eyebrow" aria-hidden="true">Strategic Timeline</div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-text-sand">The 6-Month Roadmap</h2>
                    </div>
                    <button onClick={() => switchTab("roadmap")} className="text-xs font-mono uppercase text-brand-green hover:text-brand-green/80 flex items-center gap-1.5 border border-brand-green/20 hover:border-brand-green py-1.5 px-4 rounded transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none">
                      View full timeline <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { month: "Month 1–2", status: "completed", title: "Foundation & Build", desc: "NGO registration, offshore foundation, legal opinion, protocol whitepaper, Superteam Nigeria hackathon — MVP app and Anchor daemon." },
                      { month: "Month 3–4", status: "active",    title: "Community & Micro-Pilot", desc: "Validator recruitment, protocol events, Sub-Node onboarding, 50 Anchors deployed, 5,000+ verified nodes, discrepancy engine live." },
                      { month: "Month 5–6", status: "upcoming",  title: "Partnerships & Token", desc: "Solana Foundation grant, telco pilot, NGO alliances, 2,000 Anchors across 3 states, Democoin mainnet launch." },
                    ].map(({ month, status, title, desc }) => (
                      <div key={month} className="bg-bg-darker/80 p-5 rounded-lg border border-brand-gold-light/30 flex gap-4 items-start">
                        <span className={`px-2 py-1 text-[10px] font-mono rounded font-bold uppercase whitespace-nowrap flex-shrink-0 ${
                          status === "completed" ? "bg-brand-green/10 border border-brand-green/20 text-brand-green"
                          : status === "active"    ? "bg-brand-gold/10 border border-brand-gold-light/30 text-brand-gold"
                          : "bg-bg-dark border border-brand-gold-light/20 text-text-sand-muted"
                        }`}>
                          {month}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-text-sand tracking-wide">{title}</h4>
                          <p className="text-xs text-text-sand-dim mt-1 font-serif leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* SIGNUP FORM */}
                <section id="signup" aria-labelledby="signup-heading" className="py-12 border-t border-brand-gold-light/25">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="eyebrow">Join the protocol</div>
                      <h2 className="text-3xl font-light text-text-sand leading-tight" id="signup-heading">
                        Register as an<br />
                        <span className="font-serif italic font-light text-brand-green">early supporter node.</span>
                      </h2>
                      <p className="font-serif text-sm text-text-sand-dim leading-relaxed">
                        The first 1,000 citizens who register will be the founding layer of VoteLedger's node network — first to onboard, first to earn, first to be recorded in the ledger of guardians.
                      </p>
                    </div>
                    <div className="lg:col-span-7 bg-bg-darker border border-brand-gold-light/25 rounded-xl p-6 md:p-8">
                      {!formSignedUp ? (
                        <form onSubmit={handleFullSignup} noValidate className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label htmlFor="full-name" className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest font-bold">Full Name</label>
                              <input id="full-name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="w-full bg-bg-dark border border-brand-gold-light/25 focus:border-brand-green focus:outline-none rounded p-3 text-xs text-text-sand font-sans focus-visible:ring-1 focus-visible:ring-brand-green" />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="email-addr" className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest font-bold">Email Address</label>
                              <input id="email-addr" type="email" required value={emailAddr} onChange={e => setEmailAddr(e.target.value)} placeholder="you@example.com" className="w-full bg-bg-dark border border-brand-gold-light/25 focus:border-brand-green focus:outline-none rounded p-3 text-xs text-text-sand font-sans focus-visible:ring-1 focus-visible:ring-brand-green" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label htmlFor="role-select" className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest font-bold">I want to join as</label>
                              <select id="role-select" required value={roleSelect} onChange={e => setRoleSelect(e.target.value)} className="w-full bg-bg-dark border border-brand-gold-light/25 focus:border-brand-green focus:outline-none rounded p-3 text-xs text-text-sand font-sans cursor-pointer focus-visible:ring-1 focus-visible:ring-brand-green">
                                <option value="" disabled>Select your role</option>
                                <option value="citizen">Citizen observer node</option>
                                <option value="validator">Validator — community manager</option>
                                <option value="builder">Builder — technical developer</option>
                                <option value="partner">Institution or NGO partner</option>
                                <option value="investor">Investor / funder</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="state-input" className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest font-bold">State (Nigeria)</label>
                              <input id="state-input" type="text" required value={stateInput} onChange={e => setStateInput(e.target.value)} placeholder="e.g. Lagos, Rivers, Kano..." className="w-full bg-bg-dark border border-brand-gold-light/25 focus:border-brand-green focus:outline-none rounded p-3 text-xs text-text-sand font-sans focus-visible:ring-1 focus-visible:ring-brand-green" />
                            </div>
                          </div>
                          {formError && <p className="text-xs text-red-700 font-mono border-l-2 border-red-700 pl-2">{formError}</p>}
                          <button type="submit" disabled={formLoading} className="w-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-60 text-bg-deep font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none">
                            {formLoading ? "Registering..." : "Register early node"}
                          </button>
                          <p className="text-[9px] font-mono text-text-sand-muted leading-relaxed uppercase tracking-wider text-center">
                            Your data stays with us. We will reach out when we deploy in your state.
                          </p>
                        </form>
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center bg-brand-green/5 border border-brand-green/15 rounded-lg space-y-4" role="status">
                          <span className="p-3 bg-brand-green/10 text-brand-green rounded-full inline-block" aria-hidden="true"><CheckCircle className="w-8 h-8" /></span>
                          <h3 className="text-xl font-bold text-text-sand font-sans uppercase tracking-wide">You are registered.</h3>
                          <p className="font-serif text-sm text-text-sand-dim leading-relaxed max-w-md mx-auto">
                            Your node is queued in our Nigeria launch pipeline. We will reach out when the protocol begins local verifications in {stateInput || "your state"}. Welcome, guardian.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ── OTHER TABS ──────────────────────────────────────────────── */}
            {activeTab !== "overview" && (
              <div className="bg-bg-darker border border-brand-gold-light/25 rounded-xl p-4 sm:p-6 backdrop-blur-sm space-y-6">
                <div className="border-b border-brand-gold-light/30 pb-4">
                  <span className="text-[10px] font-mono text-brand-green uppercase tracking-widest font-bold">
                    {TAB_META[activeTab].eyebrow}
                  </span>
                  <h2 className="text-xl font-bold text-text-sand mt-1">{TAB_META[activeTab].title}</h2>
                  <p className="text-xs text-text-sand-dim mt-1">{TAB_META[activeTab].desc}</p>
                </div>
                {activeTab === "simulator"  && <ProtocolMap />}
                {activeTab === "financials" && <FinancialModeler />}
                {activeTab === "tokenomics" && <TokenomicsPortal />}
                {activeTab === "advisor"    && <AiAdvisor />}
                {activeTab === "roadmap"    && <RoadmapTimeline />}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── PERSISTENT JOIN CTA — shows on all non-overview tabs ──────── */}
        {activeTab !== "overview" && (
          <div className="mt-8 p-4 bg-brand-green/5 border border-brand-green/15 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-serif text-sm text-text-sand-dim">
              Ready to join? <span className="text-brand-green font-semibold">Register as a founding node</span> — be among the first 1,000 guardians of Nigerian democracy.
            </p>
            <button
              onClick={() => switchTab("overview")}
              className="shrink-0 bg-brand-green hover:bg-brand-green/90 text-bg-deep font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded cursor-pointer transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
            >
              Register now →
            </button>
          </div>
        )}

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-bg-darker border-t border-brand-gold-light/25 py-10 mt-auto text-xs text-text-sand-muted font-mono relative z-20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-gold-light/30 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border border-brand-green rounded-full flex items-center justify-center" aria-hidden="true">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              </div>
              <div>
                <span className="text-text-sand font-sans font-bold">VoteLedger</span>
                <span className="text-text-sand-muted italic text-[11px] block mt-0.5">"Truth has value — VoteLedger makes it tradable."</span>
              </div>
            </div>
            <nav className="flex gap-4 flex-wrap justify-center text-[11px]" aria-label="Footer navigation">
              <button onClick={() => navigateToSection("nodes")}  className="hover:text-brand-green transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none rounded">Nodes</button>
              <button onClick={() => navigateToSection("how")}    className="hover:text-brand-green transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none rounded">Protocol</button>
              <button onClick={() => navigateToSection("why")}    className="hover:text-brand-green transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none rounded">Why</button>
              <button onClick={() => navigateToSection("signup")} className="hover:text-brand-green transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none rounded">Join</button>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
            <p>VoteLedger Civic Network Protocol © 2025. All rights reserved.</p>
            <p className="text-text-sand-muted/50">Built with React 19 · Tailwind v4 · Solana · Groq</p>
          </div>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV — single, clean, no duplicates ────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-deep/98 backdrop-blur-md border-t border-brand-gold-light/20"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-stretch h-16">
          {TABS.map((tab, idx) => {
            const icons: React.ReactNode[] = [
              <Globe key="g" className="w-5 h-5" />,
              <Map key="m" className="w-5 h-5" />,
              <Sliders key="s" className="w-5 h-5" />,
              <Coins key="c" className="w-5 h-5" />,
              <Sparkles key="sp" className="w-5 h-5" />,
              <Calendar key="cal" className="w-5 h-5" />,
            ];
            const shortLabels = ["Overview", "Nodes", "Finance", "Tokens", "Advisor", "Roadmap"];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer border-r border-brand-gold-light/10 last:border-r-0 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
                  isActive
                    ? "text-brand-green bg-brand-green/5"
                    : "text-text-sand-muted hover:text-text-sand hover:bg-bg-darker"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-green rounded-b" aria-hidden="true" />
                )}
                <span className={`transition-transform ${isActive ? "scale-110" : ""}`} aria-hidden="true">
                  {icons[idx]}
                </span>
                <span className={`text-[8px] font-mono uppercase tracking-wide leading-none mt-0.5 ${isActive ? "font-bold text-brand-green" : ""}`}>
                  {shortLabels[idx]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── SCROLL TO TOP ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 p-2.5 bg-bg-darker hover:bg-bg-dark border border-brand-green/20 hover:border-brand-green/60 rounded-full text-brand-green shadow-xl cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green flex items-center justify-center group"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── NODE COUNTER ─────────────────────────────────────────────────── */}
      <div
        className="hidden sm:flex fixed bottom-6 right-6 bg-bg-darker border border-brand-gold-light/25 p-3 px-4 rounded-lg flex-col gap-0.5 shadow-xl backdrop-blur-sm z-40 animate-fade-in"
        role="status"
        aria-live="polite"
        aria-label={`${nodeCount} guardians registered`}
      >
        <span className="text-[9px] font-mono text-text-sand-muted uppercase tracking-widest font-bold">Guardians Registered</span>
        <span className="text-xl font-mono text-brand-green font-bold">{nodeCount.toLocaleString()}</span>
        <span className="text-[8px] font-mono text-text-sand-muted">Goal: 1,000 founding nodes</span>
      </div>

    </div>
  );
}
