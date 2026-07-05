import { useState, useEffect } from "react";
import { 
  Coins, Layers, TrendingUp, Info, HelpCircle, Heart, CheckCircle, Plus, Minus, ThumbsUp, Wallet 
} from "lucide-react";
import { CivicProposal } from "../types";

export default function TokenomicsPortal() {
  const [walletBalance, setWalletBalance] = useState<number>(500);
  const [toastMsg, setToastMsg] = useState<string>(""); // Democoin balance
  const [proposals, setProposals] = useState<CivicProposal[]>([
    {
      id: "prop1",
      title: "Deploy 1,000 Anchors in Kano State Wards",
      description: "Accelerate deployment of offline hardware devices in remote Northern wards with weak cellular coverage.",
      category: "infrastructure",
      democoinContributed: 2420,
      votesRecord: {},
      quadraticScore: 12.5
    },
    {
      id: "prop2",
      title: "Optimize MTN & Airtel SMS Fallback API Pipelines",
      description: "Fund direct gateway agreements with local carriers to guarantee SMS delivery speeds during network throttling.",
      category: "software",
      democoinContributed: 1680,
      votesRecord: {},
      quadraticScore: 9.8
    },
    {
      id: "prop3",
      title: "Launch Grassroots Mobilization in Delta Wards",
      description: "Onboard and equip 200 local ward wardens to coordinate paper count verifications in difficult riverine polling units.",
      category: "education",
      democoinContributed: 840,
      votesRecord: {},
      quadraticScore: 5.2
    }
  ]);

  const [pendingVotes, setPendingVotes] = useState<{ [id: string]: number }>({
    prop1: 0,
    prop2: 0,
    prop3: 0
  });

  const handlePendingVoteChange = (propId: string, delta: number) => {
    const current = pendingVotes[propId] || 0;
    const nextValue = Math.max(0, current + delta);
    
    const currentCost = current * current;
    const nextCost = nextValue * nextValue;
    const marginalCost = nextCost - currentCost;

    if (marginalCost > walletBalance) {
      setToastMsg("Insufficient Democoin — reduce your vote weight or earn more coins.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    setPendingVotes(prev => ({ ...prev, [propId]: nextValue }));
  };

  const commitVotes = (propId: string) => {
    const votes = pendingVotes[propId] || 0;
    if (votes === 0) return;

    const costInCoins = votes * votes;
    if (costInCoins > walletBalance) {
      setToastMsg("Insufficient Democoin balance.");
    setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    setWalletBalance(prev => prev - costInCoins);
    setToastMsg(`✓ Committed ${votes} vote${votes > 1 ? "s" : ""} — ${costInCoins} DEMO spent.`);
    setTimeout(() => setToastMsg(""), 3000);
    setProposals(prevProposals => 
      prevProposals.map(prop => {
        if (prop.id === propId) {
          const currentVotes = prop.votesRecord["user"] || 0;
          const updatedVotes = currentVotes + votes;
          const updatedRecord = { ...prop.votesRecord, "user": updatedVotes };
          
          const nextScore = parseFloat((prop.quadraticScore + Math.sqrt(votes)).toFixed(2));
          const nextContributed = prop.democoinContributed + costInCoins;

          return {
            ...prop,
            democoinContributed: nextContributed,
            votesRecord: updatedRecord,
            quadraticScore: nextScore
          };
        }
        return prop;
      })
    );

    setPendingVotes(prev => ({ ...prev, [propId]: 0 }));

  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="token_metrics">
      
      {/* Distribution Metrics (Left 5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Token Distribution Metrics Card */}
        <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-5 space-y-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-gold-light/15 pb-3">
            <h3 className="text-base font-light text-text-sand flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-cyan" />
              Democoin <span className="font-extrabold text-brand-cyan">Tokenomics</span>
            </h3>
            <span className="text-[10px] bg-brand-cyan/10 text-brand-cyan font-mono font-bold py-1 px-2.5 rounded border border-brand-cyan/20 uppercase tracking-wider">1B FIXED CAP</span>
          </div>

          {/* ── UNIFIED STACKED BAR ── */}
          <div className="space-y-3 pb-4 border-b border-brand-gold-light/10">
            <div className="h-6 flex rounded-lg overflow-hidden gap-px bg-brand-gold-light/10">
              {[
                { pct: 50, color: "bg-brand-green",   label: "Citizens" },
                { pct: 20, color: "bg-brand-gold",    label: "Community" },
                { pct: 15, color: "bg-blue-400",      label: "Builders" },
                { pct: 10, color: "bg-amber-400",     label: "Partners" },
                { pct: 5,  color: "bg-pink-400",      label: "Reserve" },
              ].map(s => (
                <div
                  key={s.label}
                  className={`${s.color} transition-all first:rounded-l-lg last:rounded-r-lg`}
                  style={{ width: `${s.pct}%` }}
                  title={`${s.label}: ${s.pct}%`}
                  aria-label={`${s.label} ${s.pct}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { pct: "50%", label: "Citizens",  amount: "500M", color: "text-brand-green" },
                { pct: "20%", label: "Community", amount: "200M", color: "text-brand-gold" },
                { pct: "15%", label: "Builders",  amount: "150M", color: "text-blue-400" },
                { pct: "10%", label: "Partners",  amount: "100M", color: "text-amber-400" },
                { pct:  "5%", label: "Reserve",   amount:  "50M", color: "text-pink-400" },
              ].map(l => (
                <div key={l.label} className="space-y-0.5">
                  <div className={`text-[11px] font-mono font-bold ${l.color}`}>{l.pct}</div>
                  <div className="text-[9px] font-mono text-text-sand-muted uppercase tracking-wide leading-tight">{l.label}</div>
                  <div className="text-[9px] font-mono text-text-sand-muted">{l.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Metric 1 */}
            <div className="bg-bg-dark/40 p-4 rounded-lg border border-brand-gold-light/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-brand-cyan font-bold uppercase tracking-wider">50% Citizen Rewards</span>
                <span className="text-text-sand font-bold">500M DEMO</span>
              </div>
              <div className="w-full bg-bg-dark/70 h-1.5 rounded overflow-hidden">
                <div className="bg-brand-cyan h-full rounded shadow-none" style={{ width: "50%" }}></div>
              </div>
              <p className="text-[11px] text-text-sand-dim pt-0.5 leading-relaxed">Released over 10 years to compensate observers for verified polling units, redundancy matches, and local ward audits.</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-bg-dark/40 p-4 rounded-lg border border-brand-gold-light/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-brand-purple font-bold uppercase tracking-wider">20% Community Grant Fund</span>
                <span className="text-text-sand font-bold">200M DEMO</span>
              </div>
              <div className="w-full bg-bg-dark/70 h-1.5 rounded overflow-hidden">
                <div className="bg-brand-purple h-full rounded shadow-[0_0_8px_#8F00FF]" style={{ width: "20%" }}></div>
              </div>
              <p className="text-[11px] text-text-sand-dim pt-0.5 leading-relaxed">Dedicated to funding developer tools, localized carrier SMS integrations, and hardware subsidies.</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-bg-dark/40 p-4 rounded-lg border border-brand-gold-light/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-blue-400 font-bold uppercase tracking-wider">15% Core Protocol Builders</span>
                <span className="text-text-sand font-bold">150M DEMO</span>
              </div>
              <div className="w-full bg-bg-dark/70 h-1.5 rounded overflow-hidden">
                <div className="bg-blue-400 h-full rounded" style={{ width: "15%" }}></div>
              </div>
              <p className="text-[11px] text-text-sand-dim pt-0.5 leading-relaxed">Allocated to cryptographers, hardware engineers, and developers with a standard 4-year vesting schedule.</p>
            </div>

            {/* Metric 4 */}
            <div className="bg-bg-dark/40 p-4 rounded-lg border border-brand-gold-light/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider">10% Strategic Partners</span>
                <span className="text-text-sand font-bold">100M DEMO</span>
              </div>
              <div className="w-full bg-bg-dark/70 h-1.5 rounded overflow-hidden">
                <div className="bg-amber-400 h-full rounded" style={{ width: "10%" }}></div>
              </div>
              <p className="text-[11px] text-text-sand-dim pt-0.5 leading-relaxed">Distributed to partners who support hardware manufacturing capital requirements and telecom carrier nodes.</p>
            </div>

            {/* Metric 5 */}
            <div className="bg-bg-dark/40 p-4 rounded-lg border border-brand-gold-light/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-pink-400 font-bold uppercase tracking-wider">5% Emergency Vault Reserve</span>
                <span className="text-text-sand font-bold">50M DEMO</span>
              </div>
              <div className="w-full bg-bg-dark/70 h-1.5 rounded overflow-hidden">
                <div className="bg-pink-400 h-full rounded" style={{ width: "5%" }}></div>
              </div>
              <p className="text-[11px] text-text-sand-dim pt-0.5 leading-relaxed">Locked safety pool utilized solely to mitigate severe network disruptions or reward massive audit operations.</p>
            </div>

          </div>
        </div>

      </div>

      {/* Quadratic Voting Sandbox (Right 7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Quadratic Explanation Card */}
        <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl p-5 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-sand-dim flex items-center gap-2 font-bold">
              <HelpCircle className="w-4 h-4 text-brand-cyan" />
              What is Quadratic Voting?
            </h4>
            <span className="text-[10px] bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 font-mono py-0.5 px-2.5 rounded font-bold uppercase">
              Cost = Votes²
            </span>
          </div>
          <p className="text-xs text-text-sand-dim leading-relaxed font-sans">
            Quadratic voting limits the dominance of capital. 1 vote costs 1 coin, but 3 votes cost 9 coins, and 10 votes cost 100 coins! Small coordinated communities can easily outvote a singular wealthy "whale". Try voting on the proposals below to test the mechanics!
          </p>
        </div>

        {/* Proposals Board */}
        <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-6 space-y-4 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-brand-gold-light/15 pb-3">
            <h3 className="text-lg font-light text-text-sand flex items-center gap-2">
              <Heart className="text-brand-purple" />
              Proposal <span className="font-extrabold text-brand-purple">Governance</span>
            </h3>
            
            {/* Wallet sandbox status */}
            <div className="flex items-center gap-2 bg-bg-dark/40 border border-brand-gold-light/15 py-1.5 px-3 rounded text-xs font-mono">
              <Wallet className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="text-text-sand-muted">Balance:</span>
              <span className="text-brand-cyan font-bold">{walletBalance.toLocaleString()} DEMO</span>
            </div>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => {
              const pending = pendingVotes[prop.id] || 0;
              const pendingCost = pending * pending;
              
              return (
                <div key={prop.id} className="bg-bg-dark/70 border border-brand-gold-light/15 rounded-lg p-5 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20 inline-block mb-2">
                        {prop.category.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-text-sand leading-tight">{prop.title}</h4>
                      <p className="text-xs text-text-sand-dim mt-1 leading-normal">{prop.description}</p>
                    </div>
                  </div>

                  {/* Funding stats bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-text-sand-dim pt-3 border-t border-brand-gold-light/15 uppercase tracking-wider">
                    <div>
                      <span className="text-text-sand-muted">Contributed: </span>
                      <span className="text-text-sand font-bold">{prop.democoinContributed.toLocaleString()} DEMO</span>
                    </div>
                    <div>
                      <span className="text-text-sand-muted">Quadratic Weight: </span>
                      <span className="text-brand-cyan font-bold">{prop.quadraticScore.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Interaction controllers */}
                  <div className="flex items-center justify-between gap-4 bg-bg-dark/50 p-2.5 rounded-lg border border-brand-gold-light/15">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePendingVoteChange(prop.id, -1)}
                        disabled={pending === 0}
                        className="p-1.5 bg-bg-dark/70 hover:bg-white/5 rounded border border-brand-gold-light/20 text-text-sand-dim hover:text-text-sand disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono text-text-sand font-bold px-2">{pending} pending votes</span>
                      <button 
                        onClick={() => handlePendingVoteChange(prop.id, 1)}
                        className="p-1.5 bg-bg-dark/70 hover:bg-white/5 rounded border border-brand-gold-light/20 text-text-sand-dim hover:text-text-sand transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {pending > 0 && (
                        <span className="text-xs font-mono text-amber-500">
                          Cost: {pendingCost} DEMO
                        </span>
                      )}
                      <button 
                        onClick={() => commitVotes(prop.id)}
                        disabled={pending === 0}
                        className="bg-brand-cyan hover:bg-brand-cyan/90 text-black font-mono font-bold text-[10px] py-2 px-3.5 rounded transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Commit Vote
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    {/* ── TOAST NOTIFICATION ── */}
      {toastMsg && (
        <div
          className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg font-mono text-xs font-bold shadow-xl transition-all border ${
            toastMsg.startsWith("✓")
              ? "bg-brand-green/10 border-brand-green/30 text-brand-green"
              : "bg-red-900/20 border-red-700/30 text-red-400"
          }`}
          role="status"
          aria-live="polite"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}

