import { useState } from "react";
import { 
  DollarSign, Sliders, TrendingUp, Info, Landmark, CheckSquare, Settings 
} from "lucide-react";
import { BudgetItem } from "../types";

export default function FinancialModeler() {
  const [anchorQty, setAnchorQty] = useState<number>(10000);
  const [anchorUnitCost, setAnchorUnitCost] = useState<number>(75);
  const [softwareCost, setSoftwareCost] = useState<number>(4000000);
  const [telecomCost, setTelecomCost] = useState<number>(6000000);
  const [mobilizationCost, setMobilizationCost] = useState<number>(5000000);
  const [tokenCost, setTokenCost] = useState<number>(2000000);
  const [reserveCost, setReserveCost] = useState<number>(1000000);

  const applyPreset = (preset: "mvp" | "pilot" | "nationwide") => {
    if (preset === "mvp") {
      setAnchorQty(50); setAnchorUnitCost(75); setSoftwareCost(150000);
      setTelecomCost(50000); setMobilizationCost(100000); setTokenCost(0); setReserveCost(50000);
    } else if (preset === "pilot") {
      setAnchorQty(10000); setAnchorUnitCost(75); setSoftwareCost(480000);
      setTelecomCost(300000); setMobilizationCost(400000); setTokenCost(150000); setReserveCost(150000);
    } else {
      setAnchorQty(176000); setAnchorUnitCost(75); setSoftwareCost(4000000);
      setTelecomCost(6000000); setMobilizationCost(5000000); setTokenCost(2000000); setReserveCost(2000000);
    }
  };

  const hardwareCost = anchorQty * anchorUnitCost;
  const totalCost = hardwareCost + softwareCost + telecomCost + mobilizationCost + tokenCost + reserveCost;

  const getPercentage = (amount: number) =>
    totalCost === 0 ? 0 : (amount / totalCost) * 100;

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const fmtShort = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  const BUDGET_LINES: { label: string; value: number; color: string; bg: string }[] = [
    { label: "Anchor hardware", value: hardwareCost,      color: "bg-brand-green",  bg: "bg-brand-green/10" },
    { label: "Software & audits", value: softwareCost,    color: "bg-brand-gold",   bg: "bg-brand-gold/10" },
    { label: "Telecom mesh",      value: telecomCost,     color: "bg-blue-500",     bg: "bg-blue-500/10" },
    { label: "Mobilization",      value: mobilizationCost,color: "bg-amber-500",    bg: "bg-amber-500/10" },
    { label: "Token launch",      value: tokenCost,       color: "bg-purple-400",   bg: "bg-purple-400/10" },
    { label: "Reserve",           value: reserveCost,     color: "bg-text-sand-muted", bg: "bg-text-sand-muted/10" },
  ];

  return (
    <div className="space-y-6" id="financial_modeler">

      {/* ── DOMINANT COST DISPLAY — Bloomberg terminal style ── */}
      <div className="bg-bg-darker border border-brand-gold-light/25 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-[10px] font-mono text-brand-green uppercase tracking-widest font-bold mb-3">
          <Landmark className="w-4 h-4 animate-pulse" aria-hidden="true" />
          Estimated Protocol Cost
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-brand-gold-light/20 pb-6 mb-6">
          <div>
            <div className="text-5xl sm:text-7xl font-extrabold text-text-sand font-sans tracking-tight leading-none">
              {fmtShort(totalCost)}
            </div>
            <div className="text-sm text-text-sand-muted font-mono mt-2">
              {fmt(totalCost)} · {anchorQty.toLocaleString()} Anchor units
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["mvp","pilot","nationwide"] as const).map(p => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-brand-gold-light/25 hover:border-brand-green/40 hover:text-brand-green text-text-sand-muted rounded transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
              >
                {p === "mvp" ? "MVP — 50 units" : p === "pilot" ? "Pilot — 10K units" : "Nationwide — 176K"}
              </button>
            ))}
          </div>
        </div>

        {/* ── STACKED BAR — replaces pie chart ── */}
        <div className="mb-5">
          <div className="h-8 flex rounded-lg overflow-hidden gap-px bg-brand-gold-light/10">
            {BUDGET_LINES.filter(l => l.value > 0).map(l => (
              <div
                key={l.label}
                className={`${l.color} transition-all duration-500 first:rounded-l-lg last:rounded-r-lg`}
                style={{ width: `${getPercentage(l.value)}%` }}
                title={`${l.label}: ${fmt(l.value)} (${getPercentage(l.value).toFixed(1)}%)`}
              />
            ))}
          </div>
        </div>

        {/* ── LEGEND TABLE ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BUDGET_LINES.map(l => (
            <div key={l.label} className={`flex items-center justify-between p-2.5 rounded-lg ${l.bg} border border-brand-gold-light/10`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${l.color} flex-shrink-0`} aria-hidden="true" />
                <span className="text-[11px] font-mono text-text-sand-dim">{l.label}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-text-sand-muted">{getPercentage(l.value).toFixed(1)}%</span>
                <span className="text-text-sand font-bold">{fmtShort(l.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SLIDERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Anchor parameters */}
        <div className="bg-bg-darker border border-brand-gold-light/25 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-green uppercase tracking-widest font-bold border-b border-brand-gold-light/20 pb-3">
            <Settings className="w-4 h-4" aria-hidden="true" /> Anchor Parameters
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-2">
                <span className="text-text-sand-muted uppercase tracking-wider">Anchor units</span>
                <span className="text-text-sand font-bold">{anchorQty.toLocaleString()}</span>
              </div>
              <input
                type="range" min={50} max={176000} step={50}
                value={anchorQty}
                onChange={e => setAnchorQty(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
                aria-label="Anchor unit quantity"
              />
              <div className="flex justify-between text-[9px] font-mono text-text-sand-muted mt-1">
                <span>50 MVP</span><span>10K Pilot</span><span>176K National</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-2">
                <span className="text-text-sand-muted uppercase tracking-wider">Unit cost</span>
                <span className="text-text-sand font-bold">${anchorUnitCost}/unit</span>
              </div>
              <input
                type="range" min={55} max={150} step={5}
                value={anchorUnitCost}
                onChange={e => setAnchorUnitCost(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
                aria-label="Anchor unit cost"
              />
              <div className="flex justify-between text-[9px] font-mono text-text-sand-muted mt-1">
                <span>$55 Min spec</span><span>$75 Standard</span><span>$150 Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other cost parameters */}
        <div className="bg-bg-darker border border-brand-gold-light/25 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-green uppercase tracking-widest font-bold border-b border-brand-gold-light/20 pb-3">
            <Sliders className="w-4 h-4" aria-hidden="true" /> Cost Parameters
          </div>

          {[
            { label: "Software & audits", val: softwareCost, setter: setSoftwareCost, min: 150000, max: 8000000, step: 50000 },
            { label: "Telecom mesh",       val: telecomCost,  setter: setTelecomCost,  min: 50000,  max: 10000000, step: 100000 },
            { label: "Mobilization",       val: mobilizationCost, setter: setMobilizationCost, min: 100000, max: 8000000, step: 100000 },
            { label: "Token launch",       val: tokenCost,    setter: setTokenCost,    min: 0,      max: 4000000, step: 50000 },
          ].map(({ label, val, setter, min, max, step }) => (
            <div key={label}>
              <div className="flex justify-between text-[11px] font-mono mb-1.5">
                <span className="text-text-sand-muted uppercase tracking-wider">{label}</span>
                <span className="text-text-sand font-bold">{fmtShort(val)}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={val}
                onChange={e => setter(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── COMPARISON NOTE ── */}
      <div className="p-4 bg-brand-green/5 border border-brand-green/15 rounded-lg flex gap-3 items-start">
        <Info className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-text-sand-dim font-serif leading-relaxed">
          VoteLedger builds a permanent, reusable cryptographic election protocol for approximately{" "}
          <span className="text-text-sand font-semibold">{fmtShort(totalCost)}</span> —
          a fraction of Nigeria's $600M+ election administration costs, and permanently redeployable across future cycles and other African nations.
        </p>
      </div>
    </div>
  );
}
