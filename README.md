# VoteLedger Protocol Hub

> "Truth has value — VoteLedger makes it tradable."

A citizen-powered civic protocol for electoral integrity in Nigeria. VoteLedger creates an immutable, decentralized record of election results — built bottom-up, before anyone can tamper with the official count.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| AI Advisor | Google Gemini (gemini-1.5-flash, free tier) |
| Serverless function | Vercel Node runtime (`/api/chat.ts`) |
| Icons | Lucide React |
| Animations | Motion |

---

## Local development

### Prerequisites
- Node.js 18+
- An Anthropic API key — [console.anthropic.com](https://console.anthropic.com/)

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/voteledger-protocol-hub.git
cd voteledger-protocol-hub
npm install
cp .env.example .env
# Add your GEMINI_API_KEY and VITE_FORMSPREE_ID to .env
```

### Setting up Formspree (signup forms)

The hero email capture and full node registration form both submit to [Formspree](https://formspree.io) — a free service that emails you every submission with zero backend code.

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Click **New Form** → name it `VoteLedger Signups`
3. Copy the form ID from the endpoint URL: `https://formspree.io/f/xrgkqwer` → ID is `xrgkqwer`
4. Add it to `.env` as `VITE_FORMSPREE_ID="xrgkqwer"`
5. In Vercel, add the same variable: **Settings → Environment Variables → `VITE_FORMSPREE_ID`**

Without this set, forms still work but submissions only log to the browser console — nothing is captured. Set it before sharing the site with anyone.

### Run locally (two options)

**Option A — Vercel CLI (mirrors production exactly)**
```bash
npm install -g vercel
vercel dev
# Opens on http://localhost:3000
# AI Advisor calls /api/chat — serverless function runs locally
```

**Option B — Express dev server**
```bash
npm run dev
# Opens on http://localhost:3000
# Uses server.ts Express proxy
```

---

## Deploy to Vercel (recommended — free)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "feat: VoteLedger Protocol Hub v1.0"
git branch -M main

# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/voteledger-protocol-hub.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import Git Repository** → select your GitHub repo
3. Vercel auto-detects Vite — settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy** — first deploy (no API key yet) takes ~60 seconds

### Step 3: Add your API key

1. In Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com/)
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

The AI Advisor is now live. Every other feature works without the key.

### How it works on Vercel

```
Browser → vercel.app/api/chat → /api/chat.ts (serverless) → Anthropic API
                                      ↑
                          ANTHROPIC_API_KEY lives here only
                          Never in the browser. Never in the bundle.
```

---

## Deploy to Railway (alternative — full Express server)

Use this if you want more control or higher AI request volume.

```bash
npm run build:server   # builds both Vite frontend and Express server
```

1. Push to GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variable: `GEMINI_API_KEY`
4. Railway auto-runs `npm start` → serves frontend + API from one process

---

## Does it need a backend?

| Feature | Needs backend? |
|---|---|
| Protocol simulator | No — pure React |
| Financial modeler | No — pure React |
| Tokenomics portal | No — pure React |
| Roadmap timeline | No — pure React |
| AI Protocol Advisor | Yes — to keep API key secret |

The AI Advisor works in **mock mode** without a key — it returns pre-written VoteLedger-specific responses. Set `ANTHROPIC_API_KEY` for live Claude responses.

---

## Project structure

```
voteledger-protocol-hub/
├── api/
│   └── chat.ts              # Vercel serverless function — Anthropic API proxy
├── src/
│   ├── components/
│   │   ├── AiAdvisor.tsx    # Claude-powered protocol advisor chat
│   │   ├── FinancialModeler.tsx
│   │   ├── ProtocolMap.tsx  # Node network simulator
│   │   ├── RoadmapTimeline.tsx
│   │   └── TokenomicsPortal.tsx
│   ├── App.tsx
│   ├── index.css            # Tailwind v4 + off-white theme tokens
│   ├── main.tsx
│   └── types.ts
├── server.ts                # Express server (local dev / Railway deploy)
├── vercel.json              # Vercel config — routes /api/* to serverless
├── index.html
├── vite.config.ts
├── package.json
├── .env.example
└── README.md
```

---

## Environment variables

| Variable | Required | Where |
|---|---|---|
| `GEMINI_API_KEY` | For AI Advisor | Vercel dashboard → Settings → Environment Variables |
| `VITE_FORMSPREE_ID` | For signup forms | Vercel dashboard → Settings → Environment Variables |

---

## License

MIT — build on this, fork it, deploy it for other countries.

*VoteLedger is a civic observation and transparency protocol. It does not conduct elections, declare results, or challenge official tallies in its own name.*
