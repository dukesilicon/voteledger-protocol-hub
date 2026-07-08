import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const SYSTEM_PROMPT = `You are the official VoteLedger Protocol Advisor — a specialist AI configured with the complete technical specifications, financial model, tokenomics, legal positioning, and strategic roadmap of the VoteLedger civic protocol.

VoteLedger is a citizen-powered electoral integrity protocol built for Nigeria, designed to create an immutable, decentralized record of election results that no official can alter.

CORE ARCHITECTURE:
- Every citizen who downloads the app auto-creates a Solana wallet and becomes a verified node via PVC/NIN authentication
- Anchor devices (Raspberry Pi Zero 2W + SIM800L GSM module, ~$60-80/unit) sit at every polling unit, cryptographically sign the official tally at source, and store it locally in an append-only SQLite database
- Three-tier node hierarchy: Anchor (hardware) -> Validator (verified citizen) -> Sub-Node (delegated citizen without smartphone, registered by Validator at protocol events using only their NIN hash)
- GSM mesh sync: internet primary, Twilio SMS secondary (~$0.04/submission), physical relay tertiary -- no submission is ever lost
- Solana blockchain (Anchor framework, Rust) stores immutable commitments via Programme Derived Addresses; Arweave stores full data permanently
- Democoin (SPL Token-2022) rewards accurate submissions; slashing mechanism punishes Sybil attacks

FINANCIALS:
- Stage 1 MVP (50 units, 3 months, 4 engineers): $400K
- Stage 2 Pilot (10,000 units, 3 states): $3M
- Stage 3 Nationwide (176,000 units, 36 states): $26-44M
- Hardware cost reduction: local assembly in Lagos/Abuja brings unit cost from $80 to ~$58
- Monthly infrastructure cost at pilot scale: ~$420

TOKENOMICS (Democoin -- 1B fixed supply):
- 50% citizen rewards, 20% community fund, 15% builders (3yr vest), 10% VCs/partners, 5% reserve (2yr lock)
- Governance: Realms on Solana, quadratic voting, on-chain treasury
- Launch: pre-launch airdrop (M3) -> devnet (M4) -> mainnet private round (M6) -> DEX listing (M9+)

LEGAL POSITIONING:
- Registered as civic observation and transparency NGO -- same protected category as domestic election observers under Electoral Act 2022
- Offshore foundation (Delaware or UK) holds protocol IP and token infrastructure
- Red Line Protocol: VoteLedger observes and records -- it does not declare results
- Target advisors: Prof. Attahiru Jega or Oby Ezekwesili

PITCH STRATEGY:
- Lead with the engineering problem, not the political one
- Core tagline: "Truth has value -- VoteLedger makes it tradable"
- Target: Solana VCs, Solana Foundation grants, Superteam Nigeria, impact investors, diaspora crowdfund

RESPONSE GUARDRAILS:
- Do not fabricate live data: node counts, fundraising status, confirmed advisors
- Say plainly when something needs to be verified against real records
- Be precise, strategic, technically grounded -- no hype`;

const MOCKS = [
  "VoteLedger's core strength is the three-tier node hierarchy. Anchors provide hardware ground truth. Validators provide verified citizen coverage. Sub-Nodes extend that to citizens without smartphones -- registered by Validators at protocol events using only their NIN. No African civic tech project has solved this last-mile human problem before.",
  "On the financial model: Stage 1 at $400K is achievable without institutional investors -- Solana Foundation grants ($50-150K), diaspora crowdfund ($100-200K), and founder capital. The working MVP is your fundraising instrument for Stage 2 at $3M.",
  "The Democoin slashing mechanism uses Token-2022's permanent delegate feature. When a node consistently diverges from Anchor consensus, a governance-approved slash proposal claws back previously earned tokens. Deception becomes economically costly.",
  "For a Solana VC pitch, lead with the engineering problem: 'How do you create trustless consensus for 176,000 distributed data points, half offline, under adversarial conditions, in a 6-hour window?' That framing gets a technical founder leaning forward before you mention Nigeria.",
  "The legal architecture has three layers: NGO registration in Nigeria, offshore foundation in Delaware holding the protocol and token, and a published Red Line Protocol. This makes suppression legally and reputationally expensive.",
];

app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid payload -- 'messages' array required." });
  }

  const apiKey = process.env.HF_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 500));
    return res.json({
      text: `[MOCK MODE -- add HF_API_KEY to .env to activate the AI Advisor]\n\n${MOCKS[Math.floor(Math.random() * MOCKS.length)]}`,
    });
  }

  try {
    const filtered = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({ role: m.role, content: m.content }));

    // Build prompt in Mistral instruction format
    const history = filtered.map((m: any) =>
      m.role === "user" ? `[INST] ${m.content} [/INST]` : m.content
    ).join("\n");

    const prompt = `[INST] SYSTEM INSTRUCTIONS:\n${SYSTEM_PROMPT} [/INST]\n${history}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.4,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("HuggingFace API error:", err);
      return res.status(502).json({ error: "Upstream AI error -- check your HF_API_KEY." });
    }

    const data = await response.json();
    const text = (Array.isArray(data) ? data[0]?.generated_text : data?.generated_text)?.trim() || "No response received.";

    res.json({ text });
  } catch (err: any) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message || "Internal server error." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoteLedger server running on http://localhost:${PORT}`);
  });
}

startServer();
