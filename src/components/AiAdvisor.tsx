import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw, AlertCircle, ChevronRight, Cpu } from "lucide-react";
import { Message } from "../types";

const SUGGESTIONS = [
  "Draft a pitch for a Solana VC fund",
  "Explain the Sub-Node anti-fraud design",
  "How does Democoin slashing work?",
  "What is the Stage 1 funding strategy?",
  "Why is VoteLedger legally defensible?",
  "Walk through the partisanship game theory",
  "Who are the candidate advisors and why?",
  "Write an outreach DM to a civic advisor",
];

const INIT_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content:
    "Hello. I am the VoteLedger Protocol Advisor — configured with the complete technical specifications, financial model, tokenomics, legal positioning, risk matrix, six-month roadmap, and strategic history of the protocol.\n\nAsk me to draft a pitch, explain a technical decision, model a funding scenario, or prepare outreach copy. One honesty note: I don't have access to live data — actual node counts, real fundraising status, or confirmed advisors — so I'll tell you plainly when something needs to be verified against your real records instead of guessing. What do you need?",
  timestamp: new Date().toLocaleTimeString(),
};

export default function AiAdvisor() {
  const [messages, setMessages] = useState<Message[]>([INIT_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text || "No response received.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `⚠️ Could not reach the AI advisor.\n\nError: ${err.message}\n\nMake sure HF_API_KEY is set in your Vercel environment variables.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      ...INIT_MESSAGE,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai_advisor">

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-bg-darker border border-brand-gold-light/20 rounded-xl p-5 space-y-3">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-sand-muted flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-brand-green" />
            Protocol Advisor
          </h4>
          <p className="text-xs text-text-sand-dim leading-relaxed">
            Powered by Mistral 7B via Hugging Face (free tier) and pre-loaded with the full VoteLedger protocol spec — technical architecture, financial model, tokenomics, legal positioning, and pitch strategy. Ask it anything.
          </p>
        </div>

        <div className="bg-bg-darker border border-brand-gold-light/20 rounded-xl p-5 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-sand-muted font-bold">
            // Quick queries
          </span>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="w-full text-left p-3 bg-bg-dark/40 hover:bg-brand-green/5 border border-brand-gold-light/15 hover:border-brand-green/20 rounded-lg text-xs font-bold text-text-sand-dim hover:text-text-sand transition-all disabled:opacity-40 flex justify-between items-center group cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green"
              >
                <span className="truncate pr-2">{s}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-sand-muted group-hover:text-brand-green flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-4 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-text-sand-dim font-mono space-y-1">
            <p className="font-bold text-text-sand uppercase tracking-wider">// API key security</p>
            <p>Your HF_API_KEY is loaded server-side only. It is never compiled into the client bundle or exposed in the browser.</p>
          </div>
        </div>
      </div>

      {/* Chat console */}
      <div className="lg:col-span-8 flex flex-col h-[580px] bg-bg-darker border border-brand-gold-light/20 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="bg-bg-dark/50 border-b border-brand-gold-light/15 p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse-dot"></div>
            <div>
              <h3 className="text-sm font-bold text-text-sand uppercase tracking-wider">VoteLedger AI Advisor</h3>
              <p className="text-[10px] font-mono text-text-sand-muted uppercase tracking-widest">
                MODEL: mistral-7b-instruct · Hugging Face
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            disabled={loading}
            className="p-2 hover:bg-bg-dark text-text-sand-dim hover:text-text-sand rounded transition-all cursor-pointer border border-transparent hover:border-brand-gold-light/15 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-brand-green"
            title="Clear conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "ml-auto flex-row-reverse max-w-[85%]" : "mr-auto max-w-[85%]"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-[9px] font-mono font-bold flex-shrink-0 ${
                  isUser
                    ? "bg-brand-green/10 border-brand-green/40 text-brand-green"
                    : "bg-brand-gold-light/10 border-brand-gold-light/40 text-brand-gold"
                }`}>
                  {isUser ? "YOU" : "AI"}
                </div>
                <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                  isUser
                    ? "bg-brand-green/10 text-text-sand border border-brand-green/20 rounded-tr-none"
                    : "bg-bg-dark/40 text-text-sand-dim border border-brand-gold-light/15 rounded-tl-none"
                }`}>
                  <p className="leading-relaxed whitespace-pre-line font-sans text-text-sand">{msg.content}</p>
                  <span className="block text-[9px] text-text-sand-muted font-mono text-right pt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-brand-gold-light/10 border border-brand-gold-light/40 text-brand-gold flex items-center justify-center text-xs flex-shrink-0">
                <Cpu className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 bg-bg-dark/40 border border-brand-gold-light/15 rounded-xl rounded-tl-none text-xs flex items-center gap-2.5 font-mono text-text-sand-muted">
                <span>Consulting protocol specs</span>
                <span className="flex gap-1">
                  {[75, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 bg-text-sand-muted rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="bg-bg-dark/30 border-t border-brand-gold-light/15 p-3 flex-shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about the protocol, pitch strategy, financials, tech stack... ↵ to send"
              className="bg-bg-deep border border-brand-gold-light/15 text-text-sand rounded-lg px-4 py-2.5 text-xs flex-1 font-mono focus:outline-none focus:border-brand-green/50 disabled:opacity-50 placeholder-text-sand-muted transition-colors focus-visible:ring-2 focus-visible:ring-brand-green"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-brand-green hover:bg-brand-green/90 disabled:bg-bg-dark disabled:opacity-40 text-bg-deep font-semibold rounded-lg transition-all flex items-center justify-center flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-green"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
