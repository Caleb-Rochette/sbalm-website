"use client";

import { useState, useRef, useEffect } from "react";

type Role = "user" | "assistant";
interface Message { role: Role; content: string; }
type PanelState = "closed" | "open";

const GREETING: Message = {
  role: "assistant",
  content: "Hey! 👋 I'm the Sir Box a Lot assistant. Looking for help with a move? Ask me anything — pricing, availability, service area — or just tell me what you need and I'll get you sorted.",
};

export default function ChatWidget() {
  const [panel, setPanel] = useState<PanelState>("closed");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (panel === "open") {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [panel]);

  // Close on outside click
  useEffect(() => {
    if (panel === "closed") return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanel("closed");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panel]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages([...next, { role: "assistant", content: data.error ?? "Something went wrong. Please call 253-523-3755." }]);
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }]);
        if (data.leadCaptured) setLeadCaptured(true);
        if (panel === "closed") setUnread(true);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Connection error. Please call us at 253-523-3755." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {panel === "open" && (
        <div
          ref={panelRef}
          className="w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
          style={{ height: "480px", animation: "chatSlideUp 0.2s ease-out" }}
        >
          {/* Header */}
          <div className="bg-brand-navy px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Sir Box a Lot</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <p className="text-brand-mist text-xs">AI Assistant</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setPanel("closed")}
              className="text-brand-mist hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-brand-fog px-3 py-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-brand-orange text-white rounded-br-sm"
                      : "bg-white text-brand-dark shadow-sm rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-mist animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-mist animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-mist animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {leadCaptured && (
              <p className="text-center text-xs text-brand-stone py-1">
                ✓ Your info has been sent to Daryl
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-brand-stoneLight px-3 py-2.5 flex items-end gap-2 shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              rows={1}
              maxLength={2000}
              disabled={loading}
              className="flex-1 resize-none text-sm text-brand-dark placeholder:text-brand-stone focus:outline-none bg-transparent leading-relaxed max-h-24 overflow-y-auto disabled:opacity-50"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full bg-brand-orange hover:bg-brand-ember disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
              aria-label="Send"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setPanel(panel === "open" ? "closed" : "open")}
        aria-label={panel === "open" ? "Close chat" : "Chat with us"}
        className="w-14 h-14 rounded-full bg-brand-orange hover:bg-brand-ember shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative"
      >
        {panel === "open" ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
        {unread && panel === "closed" && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>

      <style jsx global>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
