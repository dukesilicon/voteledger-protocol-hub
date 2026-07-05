import React, { useState } from "react";
import { 
  Cpu, Wallet, Database, Wifi, ShieldAlert, CheckCircle, 
  RefreshCw, SignalZero, Radio, AlertTriangle, Coins, Key, Landmark 
} from "lucide-react";
import { PollingUnit, SimulationState, CandidateVote } from "../types";

const MOCK_PU_DATABASE: PollingUnit[] = [
  { id: "pu1", code: "LA/IK/AL/001", name: "Alausa PU 001 - Secretariat Gate", ward: "Alausa", state: "Lagos", anchorsActive: true },
  { id: "pu2", code: "FC/AM/W2/004", name: "Wuse II PU 004 - City Center Plaza", ward: "Wuse II", state: "Abuja (FCT)", anchorsActive: true },
  { id: "pu3", code: "KN/SG/NW/012", name: "Sabon Gari PU 012 - Market Square", ward: "Sabon Gari", state: "Kano", anchorsActive: false },
  { id: "pu4", code: "RV/PH/OB/025", name: "Ogbunabali PU 025 - Civic Hall Gate", ward: "Ogbunabali", state: "Rivers", anchorsActive: true },
  { id: "pu5", code: "KD/CH/UN/009", name: "Chikun PU 009 - Primary School Comp", ward: "Chikun", state: "Kaduna", anchorsActive: false }
];

export default function ProtocolMap() {
  const [state, setState] = useState<SimulationState>({
    stage: "wallet",
    walletCreated: false,
    walletAddress: null,
    pvcLinked: false,
    ninLinked: false,
    selectedPU: null,
    votes: [
      { candidate: "Democracy Party (DP)", count: 184 },
      { candidate: "National Reform Alliance (NRA)", count: 142 },
      { candidate: "Citizen Coalition (CC)", count: 59 }
    ],
    isOfflineMode: true,
    cachedOffline: false,
    anchorSigned: false,
    syncType: "delay",
    ledgerHash: null,
    rewardEarned: 0,
    logs: ["Node initialized. Awaiting voter credential binding."]
  });

  const [pvcInput, setPvcInput] = useState("");
  const [ninInput, setNinInput] = useState("");
  const [credError, setCredError] = useState("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setState(prev => ({
      ...prev,
      logs: [`[${timestamp}] ${message}`, ...prev.logs]
    }));
  };

  const handleCreateWallet = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const mockAddress = Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    
    setState(prev => ({
      ...prev,
      walletCreated: true,
      walletAddress: mockAddress,
      stage: "wallet"
    }));
    addLog(`Solana node wallet created successfully: ${mockAddress.substring(0, 8)}...${mockAddress.substring(mockAddress.length - 8)}`);
  };

  const handleLinkCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    if (!pvcInput || pvcInput.length < 8) {
      setCredError("Enter a valid PVC ID (9–10 digits) or NIN (11 digits).");
      return;
    }
    // Fix: NIN is 11 digits, PVC is 9-10 — logic was inverted
    const isNIN = pvcInput.replace(/\D/g, "").length === 11;
    const isPVC = !isNIN && pvcInput.replace(/\D/g, "").length >= 9;
    setState(prev => ({
      ...prev,
      pvcLinked: isPVC,
      ninLinked: isNIN,
    }));
    addLog(`Verified identity on-chain hash: HASH_${Math.random().toString(36).substring(3, 9).toUpperCase()}`);
    addLog(`Node identity trust weighted status upgraded.`);
  };

  const handleSelectPU = (pu: PollingUnit) => {
    setState(prev => ({
      ...prev,
      selectedPU: pu,
      isOfflineMode: !pu.anchorsActive
    }));
    addLog(`Selected Polling Unit: [${pu.code}] ${pu.name}. Anchor Hardware status: ${pu.anchorsActive ? 'ACTIVE (ONLINE)' : 'DISRUPTED (OFFLINE BUFFERING MODE)'}`);
  };

  const handleVoteChange = (index: number, value: number) => {
    const updatedVotes = [...state.votes];
    updatedVotes[index].count = Math.max(0, value);
    setState(prev => ({ ...prev, votes: updatedVotes }));
  };

  const handleRecordLocalCache = () => {
    if (!state.selectedPU) return;
    setState(prev => ({
      ...prev,
      cachedOffline: true,
      stage: "buffer"
    }));
    addLog(`Vote counts packaged. AES-256 encrypted local cache stored in citizen wallet.`);
    addLog(`Redundancy checkpoint active: multiple nodes prepared to cross-verify.`);
  };

  const handleAnchorSign = () => {
    setState(prev => ({
      ...prev,
      anchorSigned: true,
      stage: "sync"
    }));
    addLog(`Raspberry Pi Hardware Anchor triggered. Local serial signature appended.`);
    addLog(`Hardware status: Buffered offline safely in Anchor flash storage.`);
  };

  const handleSyncToLedger = (type: "sms" | "cellular" | "delay") => {
    addLog(`Initiating Ledger sync using method: ${type.toUpperCase()}`);
    
    const txHash = `sol_tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}_vledger`;
    
    setState(prev => ({
      ...prev,
      syncType: type,
      ledgerHash: txHash,
      rewardEarned: 25,
      stage: "complete"
    }));
    
    addLog(`Delayed sync validation completed successfully.`);
    addLog(`Solana immutable storage confirmed. Tx Signature: ${txHash}`);
    addLog(`MINTED: 25.0 Democoin rewards distributed to voter node ${state.walletAddress?.substring(0, 6)}...`);
  };

  const resetSimulation = () => {
    setState({
      stage: "wallet",
      walletCreated: false,
      walletAddress: null,
      pvcLinked: false,
      ninLinked: false,
      selectedPU: null,
      votes: [
        { candidate: "Democracy Party (DP)", count: 184 },
        { candidate: "National Reform Alliance (NRA)", count: 142 },
        { candidate: "Citizen Coalition (CC)", count: 59 }
      ],
      isOfflineMode: true,
      cachedOffline: false,
      anchorSigned: false,
      syncType: "delay",
      ledgerHash: null,
      rewardEarned: 0,
      logs: ["Simulation reset. Node initialized."]
    });
    setPvcInput("");
    setNinInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="protocol_simulator">
      {/* Simulation Controls (Left Col) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Step Header */}
        <div className="flex justify-between items-center bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-cyan/10 text-brand-cyan rounded-lg border border-brand-cyan/20">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-sand-muted">// Live Node Simulator</h3>
              <p className="text-xs text-brand-cyan font-mono font-bold uppercase">Current Phase: {state.stage.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={resetSimulation}
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 py-1.5 px-3 rounded transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Node
          </button>
        </div>

        {/* Dynamic Card Container depending on Phase */}
        <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
          
          {/* Phase 1: Wallet Onboarding */}
          {state.stage === "wallet" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block mb-2">// Onboarding_Stage_01</span>
                <h3 className="text-2xl font-light text-text-sand mb-3 flex items-center gap-2">
                  <Wallet className="text-brand-cyan" />
                  Onboard Citizen Node & <span className="font-extrabold text-brand-cyan">Wallet</span>
                </h3>
                <p className="text-sm text-text-sand-dim leading-relaxed">
                  Every citizen is a node. Downloading the app instantly creates a non-custodial cryptographic wallet. Linking credentials builds identity trust-weight without storing plain-text identities on-chain.
                </p>
              </div>

              {!state.walletCreated ? (
                <div className="bg-bg-dark/70 border border-dashed border-brand-gold-light/20 p-8 text-center rounded-lg">
                  <Wallet className="w-12 h-12 text-text-sand-muted mx-auto mb-4" />
                  <p className="text-sm text-text-sand-dim mb-4 font-mono">// Awaiting active local wallet instantiation</p>
                  <button 
                    onClick={handleCreateWallet}
                    className="bg-brand-cyan hover:bg-brand-cyan/90 text-black font-mono font-bold text-xs py-3 px-6 rounded transition-all uppercase tracking-wider "
                  >
                    Auto-Generate Solana Node Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Generated Wallet Detail */}
                  <div className="bg-bg-dark/70 border border-brand-cyan/20 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                    <div>
                      <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block mb-1">Active Solana Node Address</span>
                      <p className="text-xs font-mono text-text-sand break-all">{state.walletAddress}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                      <CheckCircle className="w-3.5 h-3.5" /> SECURED_LEDGER
                    </div>
                  </div>

                  {/* PVC / NIN form */}
                  <div className="bg-bg-dark/50 border border-brand-gold-light/15 p-5 rounded-lg space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-text-sand-dim flex items-center gap-2">
                      <Key className="w-4 h-4 text-brand-cyan" /> Verification Credential Hash (PVC / NIN)
                    </h4>
                    <form onSubmit={handleLinkCredentials} className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-text-sand-muted mb-1.5 font-mono uppercase tracking-wider">Nigerian Permanent Voter Card (PVC) ID or National Identification Number (NIN)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. 90F7B2A84 or 12345678901"
                            value={pvcInput}
                            onChange={(e) => setPvcInput(e.target.value)}
                            className="bg-bg-dark/70 border border-brand-gold-light/20 text-text-sand rounded px-3 py-2 text-sm flex-1 font-mono focus:outline-none focus:border-brand-cyan"
                          />
                          <button 
                            type="submit"
                            className="bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 font-mono text-xs py-2 px-4 rounded transition-all uppercase"
                          >
                            Hash & Link
                          </button>
                        </div>
                        {credError && (
                          <p className="text-xs text-red-600 font-mono mt-1">{credError}</p>
                        )}
                      </div>
                    </form>
                    
                    {/* Status badges */}
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                      <span className={`px-2.5 py-1 rounded font-mono border uppercase tracking-wider ${state.pvcLinked ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20' : 'bg-bg-dark/50 text-text-sand-muted border-brand-gold-light/15'}`}>
                        PVC Checked: {state.pvcLinked ? 'LINKED_TRUST_HIGH' : 'UNVERIFIED'}
                      </span>
                      <span className={`px-2.5 py-1 rounded font-mono border uppercase tracking-wider ${state.ninLinked ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20' : 'bg-bg-dark/50 text-text-sand-muted border-brand-gold-light/15'}`}>
                        NIN Checked: {state.ninLinked ? 'LINKED_TRUST_MAX' : 'UNVERIFIED'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => setState(prev => ({ ...prev, stage: "record" }))}
                      className="bg-white hover:bg-slate-200 text-black font-mono font-bold text-xs py-2.5 px-6 rounded transition-all flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      Continue to Vote Recording
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase 2: Vote Recording & Selected PU */}
          {state.stage === "record" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block mb-2">// Recording_Stage_02</span>
                <h3 className="text-2xl font-light text-text-sand mb-3 flex items-center gap-2">
                  <Database className="text-brand-cyan" />
                  Polling Unit & <span className="font-extrabold text-brand-cyan">Vote Entry</span>
                </h3>
                <p className="text-sm text-text-sand-dim leading-relaxed">
                  Select an active Polling Unit (PU) to simulate monitoring. Enter voter counts directly from the paper tally sheets posted at the station.
                </p>
              </div>

              {/* PU List Selector */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-sand-muted">Select Nigerian Polling Unit Ward</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MOCK_PU_DATABASE.map((pu) => {
                    const isSelected = state.selectedPU?.id === pu.id;
                    return (
                      <div 
                        key={pu.id}
                        onClick={() => handleSelectPU(pu)}
                        className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-brand-cyan/5 border-brand-cyan/40' 
                            : 'bg-bg-dark/40 border-brand-gold-light/15 hover:border-brand-cyan/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs font-mono text-brand-cyan font-bold">{pu.code}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 font-mono font-bold rounded uppercase ${pu.anchorsActive ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20' : 'bg-red-950/40 text-red-400 border border-red-900/30'}`}>
                            {pu.anchorsActive ? 'Anchor Online' : 'Disrupted / Offline Buffer'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-text-sand truncate">{pu.name}</h4>
                        <p className="text-xs text-text-sand-muted font-mono uppercase tracking-wider mt-0.5">{pu.ward} Ward • {pu.state} State</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vote input boxes */}
              {state.selectedPU && (
                <div className="bg-bg-dark/70 border border-brand-gold-light/20 p-5 rounded-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-gold-light/15 pb-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-text-sand-dim">Record Counts for PU: <span className="text-brand-cyan font-bold">{state.selectedPU.code}</span></h4>
                    <span className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest">Official station posted figures</span>
                  </div>

                  <div className="space-y-3">
                    {state.votes.map((item, index) => (
                      <div key={item.candidate} className="flex items-center justify-between gap-4 bg-bg-dark/50 p-3 rounded-lg border border-brand-gold-light/15">
                        <span className="text-sm font-medium text-text-sand">{item.candidate}</span>
                        <input 
                          type="number"
                          value={item.count}
                          onChange={(e) => handleVoteChange(index, parseInt(e.target.value) || 0)}
                          className="bg-bg-dark/80 border border-brand-gold-light/20 text-text-sand rounded px-3 py-1.5 w-28 text-center text-sm font-mono focus:outline-none focus:border-brand-cyan"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-3">
                    <div className="flex items-center gap-2 text-xs text-amber-500 font-mono">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
                      <span>// Multiple consensus observer uploads activate multiplier payouts</span>
                    </div>

                    <button 
                      onClick={handleRecordLocalCache}
                      className="w-full md:w-auto bg-brand-cyan hover:bg-brand-cyan/90 text-black font-mono font-bold text-xs py-2.5 px-6 rounded uppercase tracking-wider "
                    >
                      Encrypt & Save Local Cache
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase 3: Anchor Buffer Hardware */}
          {state.stage === "buffer" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block mb-2">// Verification_Stage_03</span>
                <h3 className="text-2xl font-light text-text-sand mb-3 flex items-center gap-2">
                  <Cpu className="text-brand-cyan" />
                  Hardware Anchor <span className="font-extrabold text-brand-cyan">Verification</span>
                </h3>
                <p className="text-sm text-text-sand-dim leading-relaxed">
                  VoteLedger deploys zero-maintenance hardware device Anchors at each station. Observers connect via offline local protocols (like Wi-Fi Direct or Bluetooth LE) to query and verify identical entries.
                </p>
              </div>

              {/* Status display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-dark/70 p-5 rounded-lg border border-brand-gold-light/15 space-y-3">
                  <span className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest block">Citizen Mobile Node Status</span>
                  <div className="flex items-center gap-2 text-brand-cyan">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-mono font-bold uppercase">Encrypted local packet sealed</span>
                  </div>
                  <div className="bg-bg-dark/40 p-3 rounded text-[10px] font-mono text-text-sand-dim space-y-1.5 border border-brand-gold-light/15">
                    <p>PU_CODE: <span className="text-text-sand font-bold">{state.selectedPU?.code}</span></p>
                    <p>HASH: <span className="text-text-sand font-bold">sha256_b4f09d8ae...</span></p>
                    <p>STATUS: <span className="text-text-sand uppercase">Awaiting hardware signature</span></p>
                  </div>
                </div>

                <div className="bg-bg-dark/70 p-5 rounded-lg border border-brand-gold-light/15 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest block">Unit Anchor Hardware Status</span>
                    <div className="flex items-center gap-2 mt-2 text-amber-500">
                      <SignalZero className="w-5 h-5 animate-pulse text-amber-400" />
                      <span className="text-xs font-mono font-bold uppercase">
                        {state.selectedPU?.anchorsActive ? "ANCHOR_ONLINE" : "BUFFERING_OFFLINE"}
                      </span>
                    </div>
                    <p className="text-xs text-text-sand-dim mt-2">
                      {state.selectedPU?.anchorsActive 
                        ? "Anchor is active and waiting to route buffered packets over secure GSM transceivers." 
                        : "No cellular coverage. Anchor buffering state triggered to prevent losses."}
                    </p>
                  </div>

                  <button 
                    onClick={handleAnchorSign}
                    className="mt-4 bg-brand-cyan hover:bg-brand-cyan/90 text-black font-mono font-bold text-[10px] py-2 px-4 rounded transition-all uppercase tracking-wider"
                  >
                    Authorize Anchor Signature Match
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  onClick={() => setState(prev => ({ ...prev, stage: "record" }))}
                  className="text-xs font-mono text-text-sand-dim hover:text-white uppercase tracking-wider"
                >
                  ← Modify Counts
                </button>
              </div>
            </div>
          )}

          {/* Phase 4: Sync Layer & Disruption tolerance */}
          {state.stage === "sync" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-brand-purple uppercase tracking-widest block mb-2">// Network_Sync_Stage_04</span>
                <h3 className="text-2xl font-light text-text-sand mb-3 flex items-center gap-2">
                  <Radio className="text-brand-purple" />
                  Resilience Mesh <span className="font-extrabold text-brand-purple">Ledger Sync</span>
                </h3>
                <p className="text-sm text-text-sand-dim leading-relaxed">
                  How should the logged voting data reach the Solana mainnet? In Nigeria, active shutdowns, power cuts, and remote valleys block immediate sync. VoteLedger uses multi-channel delayed sync.
                </p>
              </div>

              {/* Mesh Choices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Method 1: Twilio SMS */}
                <div className="bg-bg-dark/70 border border-brand-gold-light/15 hover:border-brand-cyan/20 p-4 rounded-lg flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="p-1.5 bg-brand-cyan/10 text-brand-cyan rounded border border-brand-cyan/20"><Radio className="w-4 h-4" /></span>
                      <span className="text-[9px] font-mono bg-brand-cyan/10 text-brand-cyan px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">GSM SMS</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Twilio SMS Pipeline</h4>
                    <p className="text-xs text-text-sand-dim leading-relaxed">Compressed 160-character cellular SMS payload containing encrypted hash, decoded on proxy server.</p>
                  </div>
                  <button 
                    onClick={() => handleSyncToLedger("sms")}
                    className="mt-4 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-black font-mono font-bold text-[10px] py-2 rounded transition-all border border-brand-cyan/20 uppercase tracking-wider"
                  >
                    Sync via SMS Gateway
                  </button>
                </div>

                {/* Method 2: High Trust Cellular */}
                <div className="bg-bg-dark/70 border border-brand-gold-light/15 hover:border-brand-cyan/20 p-4 rounded-lg flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="p-1.5 bg-brand-cyan/10 text-brand-cyan rounded border border-brand-cyan/20"><Wifi className="w-4 h-4" /></span>
                      <span className="text-[9px] font-mono bg-brand-cyan/10 text-brand-cyan px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">CELLULAR LTE</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Direct Solana Sync</h4>
                    <p className="text-xs text-text-sand-dim leading-relaxed">Direct connection to Solana RPC servers. Instant validation block broadcast (Only works in full coverage units).</p>
                  </div>
                  <button 
                    onClick={() => handleSyncToLedger("cellular")}
                    className="mt-4 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-black font-mono font-bold text-[10px] py-2 rounded transition-all border border-brand-cyan/20 uppercase tracking-wider"
                  >
                    Instant Cellular Broadcast
                  </button>
                </div>

                {/* Method 3: Delayed Sync Safeguard */}
                <div className="bg-bg-dark/70 border border-brand-gold-light/20 hover:border-brand-purple/20 p-4 rounded-lg flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="p-1.5 bg-brand-purple/10 text-brand-purple rounded border border-brand-purple/20"><AlertTriangle className="w-4 h-4" /></span>
                      <span className="text-[9px] font-mono bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">SAFE Sync</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Delayed Offline Sync</h4>
                    <p className="text-xs text-text-sand-dim leading-relaxed">Safe buffer mode. Queued offline until the voter moves to an area with signal or secure connection. Outruns signal jams.</p>
                  </div>
                  <button 
                    onClick={() => handleSyncToLedger("delay")}
                    className="mt-4 bg-brand-purple/15 hover:bg-brand-purple text-brand-purple hover:text-white font-mono font-bold text-[10px] py-2 rounded transition-all border border-brand-purple/20 uppercase tracking-wider"
                  >
                    Commit Delayed Safe Sync
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Phase 5: Ledger Sync Complete & Democoin minted */}
          {state.stage === "complete" && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 bg-brand-cyan/10 border border-brand-cyan text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce glow-cyan">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-bold font-sans text-white">Truth Committed Immutably</h3>
                <p className="text-sm text-text-sand-dim leading-relaxed">
                  The polling unit vote count has been successfully transmitted, cross-verified with Anchors, and signed into the Solana permanent ledger.
                </p>
              </div>

              {/* Solana Transaction Details Block */}
              <div className="bg-bg-dark/70 border border-brand-gold-light/15 p-4 rounded-lg max-w-xl mx-auto space-y-3 text-left">
                <div className="flex justify-between items-center border-b border-brand-gold-light/15 pb-2 text-[10px] font-mono text-text-sand-muted uppercase tracking-widest">
                  <span>Solana Transaction Signature</span>
                  <span className="text-brand-cyan font-bold">// VALIDATED_MAX_TRUST</span>
                </div>
                <div className="font-mono text-xs text-brand-cyan break-all bg-bg-dark/70 p-2.5 border border-brand-gold-light/15 rounded">
                  {state.ledgerHash}
                </div>
                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono uppercase tracking-widest pt-1 text-text-sand-dim">
                  <div>
                    <span className="text-text-sand-muted block">Unit Code:</span>
                    <span className="text-text-sand font-bold">{state.selectedPU?.code}</span>
                  </div>
                  <div>
                    <span className="text-text-sand-muted block">Sync Protocol:</span>
                    <span className="text-text-sand font-bold">{state.syncType} Network</span>
                  </div>
                </div>
              </div>

              {/* Democoin Minter Card */}
              <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-5 rounded-lg max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/2 rounded-full translate-x-6 -translate-y-6"></div>
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="p-1 bg-brand-cyan text-black rounded-full">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-widest">Democoin Reward Minted</h4>
                </div>
                <span className="text-3xl font-extrabold text-white font-sans font-bold tracking-tight">+25.0 DEMO</span>
                <p className="text-xs text-text-sand-dim mt-2">
                  Rewarded for accurate, double-hashed polling unit voter log submission. Credited to node: <span className="font-mono text-white text-[11px] block mt-1">{state.walletAddress?.substring(0, 16)}...</span>
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={resetSimulation}
                  className="bg-white hover:bg-slate-200 text-black font-mono font-bold text-xs py-2.5 px-6 rounded transition-all uppercase tracking-widest"
                >
                  Simulate Another Unit Node
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Protocol Log Stream (Right Col) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Wallet Balance widget */}
        <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-sand-muted">// Node wallet balance</span>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20 font-bold uppercase tracking-wider">
              <Coins className="w-3 h-3" /> Solana Devnet
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white font-sans tracking-tight">{state.rewardEarned.toFixed(1)}</span>
            <span className="text-xs font-mono text-brand-cyan font-bold uppercase">DEMO</span>
          </div>

          <div className="text-[10px] text-text-sand-dim font-mono space-y-1.5 pt-3 border-t border-brand-gold-light/15 uppercase tracking-wider">
            <div className="flex justify-between">
              <span className="text-text-sand-muted">Trust Multiplier:</span>
              <span className="text-text-sand font-bold">{(state.pvcLinked || state.ninLinked) ? "1.5x (Identity Verified)" : "1.0x (Basic Observers)"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-sand-muted">Verified Nodes Near:</span>
              <span className="text-text-sand font-bold">4 active observers</span>
            </div>
          </div>
        </div>

        {/* Real-time Event log */}
        <div className="bg-bg-dark/50 border border-brand-gold-light/15 rounded-xl p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-gold-light/15 pb-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-sand-dim flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse shadow-none"></span>
              Console Log Stream
            </h4>
            <span className="text-[9px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20 uppercase tracking-widest font-bold">NODE_ONLINE</span>
          </div>

          <div className="h-64 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1 select-none scrollbar-thin">
            {state.logs.map((log, index) => {
              // Colour-code by content — green=success, amber=warning/offline, red=disrupted
              const isSuccess = /confirmed|minted|success|upgraded|created|stored|completed|active/i.test(log);
              const isWarning = /offline|buffered|delay|disrupted|jamm|await|pending|fallback/i.test(log);
              const isError   = /error|fail|lost|severed|attack/i.test(log);
              const isNewest  = index === 0;
              const cls = isNewest
                ? isError   ? "bg-red-950/30 text-red-400 border-l-2 border-red-500"
                : isWarning ? "bg-amber-950/30 text-amber-400 border-l-2 border-amber-500"
                : "bg-brand-green/5 text-brand-green border-l-2 border-brand-green"
                : isError   ? "text-red-400/70"
                : isWarning ? "text-amber-400/70"
                : isSuccess ? "text-brand-green/70"
                : "text-text-sand-muted";
              return (
                <div key={index} className={`p-1.5 rounded leading-relaxed transition-all ${cls}`}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informational safeguards tip box */}
        <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-lg space-y-2">
          <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-purple font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-purple" /> // Resilience_Safeguards
          </h5>
          <p className="text-[11px] text-text-sand-dim leading-relaxed font-sans">
            If communication is jammed by local forces, VoteLedger caches the votes locally in the citizen's sandboxed wallet. A delayed sync updates the decentralized ledger later once the node reaches an open connection. Truth survives violence.
          </p>
        </div>

      </div>
    </div>
  );
}
