import { useState } from "react";
import { Calendar, CheckCircle, Clock, ChevronRight, Bookmark } from "lucide-react";

interface Milestone {
  month: string;
  title: string;
  status: "completed" | "active" | "planned";
  summary: string;
  deliverables: string[];
  focus: string;
}

export default function RoadmapTimeline() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const milestones: Milestone[] = [
    {
      month: "Month 1 — 2",
      title: "Protocol Spec & Core Prototypes",
      status: "completed",
      summary: "Lay the cryptographic foundations, audit the decentralized Solana contracts, and draft the developer client API.",
      deliverables: [
        "Cryptographic specs for multi-voter redundancy logs completed",
        "Solana main program (smart contract) prototype compiled and loaded to devnet",
        "Android-first non-custodial wallet client v0.1 released for internal testing",
        "Anchor hardware prototype built using standard Raspberry Pi Zero and SIM800L boards"
      ],
      focus: "Security & Cryptography"
    },
    {
      month: "Month 3",
      title: "Community & Developer Mobilization",
      status: "active",
      summary: "Rally patriotic Nigerian developers, coordinate with local voter protection groups, and establish local ward operations.",
      deliverables: [
        "Launch VoteLedger open-source Github repository & developer bounties",
        "Recruit and register 1,500 local warden node controllers in 6 geopolitical zones",
        "Establish regional training camps for offline-first verification processes",
        "Translate tutorial materials into Hausa, Igbo, Yoruba, and Pidgin"
      ],
      focus: "Grassroots Onboarding"
    },
    {
      month: "Month 4",
      title: "Ward Micro-Pilot Launch",
      status: "planned",
      summary: "Deploy the first 100 physical hardware Anchors in selected vulnerable wards to test live offline resilience safeguards.",
      deliverables: [
        "Physical deployment of 100 Raspberry Pi hardware Anchors in test wards",
        "Execute signal-jamming simulation to verify delayed-sync safe state caching",
        "Twilio SMS gateway performance test with MTN/Airtel cellular connections",
        "Publish real-time devnet ledger dashboard of mock votes"
      ],
      focus: "Offline Network Auditing"
    },
    {
      month: "Month 5",
      title: "Telco & Global NGO Partnerships",
      status: "planned",
      summary: "Engage with global democratic advocacy funds and major telecommunication companies for direct network integration.",
      deliverables: [
        "Draft direct zero-rated SMS pipeline agreements with MTN, Airtel, and Globacom",
        "Secure co-funding grants from international transparency and democracy NGO networks",
        "Integrate verified biometric checking features (voluntary NIN hashing)",
        "Audit smart contracts with top-tier blockchain safety firms"
      ],
      focus: "Partnerships & Scale"
    },
    {
      month: "Month 6",
      title: "Expanded Pilot & Democoin Launch",
      status: "planned",
      summary: "Scale up deployment to 10,000 polling units and execute the Democoin Token Generation Event (TGE) on Solana.",
      deliverables: [
        "Initiate hardware manufacturing run of 10,000 rugged low-cost Anchors",
        "Democoin public launch pool seeded on Solana decentralized exchanges (DEXs)",
        "Distribute initial retroactive voter rewards to pilot node participants",
        "Final code audits published publicly for absolute developer verification"
      ],
      focus: "Nationwide Readiness"
    }
  ];

  return (
    <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-5 md:p-6 backdrop-blur-sm" id="roadmap_timeline">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-gold-light/15 pb-4 mb-6 gap-3">
        <div>
          <h3 className="text-lg font-light text-text-sand flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-cyan" />
            6-Month <span className="font-extrabold text-brand-cyan">Strategic Roadmap</span>
          </h3>
          <p className="text-xs text-text-sand-dim">Rollout roadmap from initial protocol specs to expanded live election audits</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded">
            <CheckCircle className="w-3.5 h-3.5" /> M1-M2 COMPLETE
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> M3 IN PROGRESS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Tabs (Left 4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          {milestones.map((ms, index) => {
            const isActive = activeTab === index;
            return (
              <div 
                key={ms.month}
                onClick={() => setActiveTab(index)}
                role="button"
                aria-pressed={isActive}
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setActiveTab(index)}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none ${
                  ms.status === "planned" ? "opacity-60 hover:opacity-80" : ""
                } ${
                  isActive 
                    ? "bg-brand-cyan/5 border-brand-cyan/30" 
                    : "bg-bg-dark/40 border-brand-gold-light/15 hover:border-brand-cyan/20"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Status icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {ms.status === "completed" ? (
                      <CheckCircle className="w-4 h-4 text-brand-green" aria-label="Completed" />
                    ) : ms.status === "active" ? (
                      <Clock className="w-4 h-4 text-brand-gold animate-pulse" aria-label="In progress" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-text-sand-muted/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-text-sand-muted/30" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${
                      ms.status === "completed" ? "text-brand-green"
                      : ms.status === "active"    ? "text-brand-gold"
                      : "text-text-sand-muted"
                    }`}>
                      {ms.month}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-sand leading-tight mt-0.5 truncate">{ms.title}</h4>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 text-text-sand-muted group-hover:text-text-sand transition-all ${
                  isActive ? "rotate-90 text-brand-cyan" : ""
                }`} />
              </div>
            );
          })}
        </div>

        {/* Deliverables details panel (Right 8 Cols) */}
        <div className="lg:col-span-8 bg-bg-dark/70 border border-brand-gold-light/15 rounded-lg p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-gold-light/15 pb-3.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold">{milestones[activeTab].month} Objective</span>
              <h4 className="text-base font-bold text-text-sand mt-1">{milestones[activeTab].title}</h4>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold bg-white/5 text-text-sand-dim py-1 px-3 rounded border border-brand-gold-light/20">
              Focus: {milestones[activeTab].focus}
            </span>
          </div>

          <p className="text-xs text-text-sand-dim leading-relaxed font-mono">
            {milestones[activeTab].summary}
          </p>

          <div className="space-y-3 pt-2">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-text-sand-dim flex items-center gap-1.5 font-bold">
              <Bookmark className="w-3.5 h-3.5 text-brand-purple" /> Key Milestone Targets & Deliverables
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestones[activeTab].deliverables.map((del, dIdx) => (
                <div key={dIdx} className="flex gap-2.5 items-start p-3 bg-bg-dark/50 rounded border border-brand-gold-light/15">
                  <div className="mt-0.5 flex-shrink-0">
                    {milestones[activeTab].status === "completed" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green" aria-label="Completed" />
                    ) : milestones[activeTab].status === "active" ? (
                      <Clock className="w-3.5 h-3.5 text-brand-gold animate-pulse" aria-label="In progress" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-text-sand-muted/40 flex items-center justify-center" aria-label="Planned">
                        <div className="w-1 h-1 rounded-full bg-text-sand-muted/30" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-text-sand-dim leading-normal">{del}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

