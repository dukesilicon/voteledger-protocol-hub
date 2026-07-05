export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PollingUnit {
  id: string;
  code: string;
  name: string;
  ward: string;
  state: string;
  anchorsActive: boolean;
}

export interface CandidateVote {
  candidate: string;
  count: number;
}

export interface SimulationState {
  stage: "wallet" | "record" | "buffer" | "sync" | "complete";
  walletCreated: boolean;
  walletAddress: string | null;
  pvcLinked: boolean;
  ninLinked: boolean;
  selectedPU: PollingUnit | null;
  votes: CandidateVote[];
  isOfflineMode: boolean;
  cachedOffline: boolean;
  anchorSigned: boolean;
  syncType: "sms" | "cellular" | "delay";
  ledgerHash: string | null;
  rewardEarned: number;
  logs: string[];
}

export interface BudgetItem {
  id: string;
  name: string;
  category: "hardware" | "software" | "telecom" | "mobilization" | "token" | "operations";
  baseCost: number;
  unit: string;
  quantity: number;
  description: string;
}

export interface CivicProposal {
  id: string;
  title: string;
  description: string;
  category: "infrastructure" | "software" | "incentives" | "education";
  democoinContributed: number;
  votesRecord: { [wallet: string]: number }; // wallet address -> coins spent
  quadraticScore: number;
}
