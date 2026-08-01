import React from "react";
import { Sparkles, Code, FileText, Lightbulb, TrendingUp } from "lucide-react";

const suggestions = [
  {
    icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
    title: "Market Trends",
    prompt: "What are the key tech market trends in 2026?",
  },
  {
    icon: <Code className="w-4 h-4 text-teal-400" />,
    title: "Code Assistance",
    prompt: "Write a React custom hook for handling WebSocket connections.",
  },
  {
    icon: <FileText className="w-4 h-4 text-[#00AD9F]" />,
    title: "Summarize",
    prompt: "Explain the architecture of Perplexity AI in simple terms.",
  },
  {
    icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
    title: "Brainstorm",
    prompt: "Give me 5 unique project ideas combining AI and web development.",
  },
];

const NewThreadHero = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center py-12">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#00AD9F] text-xs font-semibold tracking-wide uppercase mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Perplexity Engine</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 font-serif">
        Where knowledge begins
      </h1>
      <p className="text-[#888A8E] text-base sm:text-lg max-w-xl mb-10">
        Ask anything or explore topics across real-time sources and deep AI search.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#202225] border border-[#2F3136] hover:bg-[#27292D] hover:border-[#00AD9F]/40 transition-all text-sm group"
          >
            <div className="p-2 rounded-lg bg-[#292B2E] group-hover:bg-[#303338] transition-colors shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="font-medium text-white group-hover:text-[#00AD9F] transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-[#808286] line-clamp-1 mt-0.5">
                {item.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewThreadHero;
