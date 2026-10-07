import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight } from 'lucide-react';

export default function AiChatFloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am SmartServe AI Copilot. Ask me anything about today\'s demand forecast, shortage risks, or waste reduction strategy.'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    "What should I prepare tomorrow?",
    "Which food is wasting the most?",
    "Why is today's demand higher?",
    "How much can I save this week?",
    "Which items have shortage risk?"
  ];

  const handleSend = (textToSend) => {
    const promptText = textToSend || query;
    if (!promptText.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: promptText }]);
    if (!textToSend) setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = "SmartServe AI Telemetry Analysis: ";
      const textLower = promptText.toLowerCase();

      if (textLower.includes('tomorrow') || textLower.includes('prepare tomorrow')) {
        reply += "Recommended preparation for tomorrow: Veg Biryani 90 portions (+12%), Paneer Curry 65 portions, Chicken Biryani 125 portions. Total projected orders: 1,135 portions.";
      } else if (textLower.includes('wasting') || textLower.includes('waste')) {
        reply += "Fresh Garden Salad & Paneer Curry account for 62% of weekly waste due to over-preparation. Shift to 2-stage 10-portion batching to save ₹1,420/week.";
      } else if (textLower.includes('higher') || textLower.includes('why')) {
        reply += "Today's demand is 18% higher due to Friday evening footfall surge, pleasant 28°C weather, and local corporate lunch bookings.";
      } else if (textLower.includes('save') || textLower.includes('cost')) {
        reply += "By maintaining a 6% safety margin buffer instead of 15% manual over-prep, you can save ₹18,400 this month in raw kitchen costs.";
      } else if (textLower.includes('shortage') || textLower.includes('stockout')) {
        reply += "Veg Biryani dinner batch has a Low-to-Medium shortage risk if footfall exceeds 1,200 customers after 8:00 PM.";
      } else {
        reply += "All AI ML forecasting pipelines are online with 94.2% precision. All kitchen stations operating within zero-waste thresholds.";
      }

      setChatLog(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsThinking(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-[#081c15] via-[#1b4332] to-[#2d6a4f] text-white shadow-2xl border-2 border-[#d4af37]/40 hover:scale-105 transition-all duration-300 flex items-center gap-3 group cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
        </div>
        <span className="hidden sm:inline text-xs font-bold font-heading text-amber-300 tracking-wide">
          Ask SmartServe AI
        </span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#081c15] to-[#1b4332] text-white p-4 flex items-center justify-between border-b border-[#2d6a4f]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2d6a4f]/30 border border-emerald-400/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white flex items-center gap-1.5">
                  Ask SmartServe AI <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                </h3>
                <span className="text-[10px] text-emerald-300 font-medium">Copilot • Natural Language Engine</span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-[#f4f6f0] border-b border-gray-200 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-xl bg-white border border-gray-200 text-[10px] font-semibold text-gray-700 hover:border-[#1b4332] hover:text-[#1b4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Conversation Body */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
            {chatLog.map((msg, index) => (
              <div 
                key={index}
                className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1b4332] text-white ml-auto rounded-br-xs shadow-xs'
                    : 'bg-[#f4f6f0] text-gray-800 rounded-bl-xs border border-gray-200 shadow-2xs font-medium'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isThinking && (
              <div className="p-3 rounded-2xl bg-gray-100 text-gray-500 text-xs italic animate-pulse flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" />
                <span>Analyzing restaurant telemetry & POS trends...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about kitchen operations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
