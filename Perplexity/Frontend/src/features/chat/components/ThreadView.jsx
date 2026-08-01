import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, User, Copy, Check, Globe, MessageSquare } from "lucide-react";

const ThreadView = ({ title, messages = [], loading }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
      {/* Title Header */}
      <div className="border-b border-[#262729] pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[#00AD9F] shrink-0" />
          <span>{title || "Untitled Thread"}</span>
        </h1>
      </div>

      {/* Messages List */}
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        return (
          <div key={index} className="space-y-3">
            {/* Message Header / Badge */}
            <div className="flex items-center gap-2 text-sm text-[#9B9C9E]">
              {isUser ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white">You</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-teal-500/10 text-[#00AD9F] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#00AD9F]">Perplexity AI</span>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#202225] border border-[#2D2F33] text-[11px] text-[#A0A1A4] ml-2">
                    <Globe className="w-3 h-3 text-[#00AD9F]" />
                    <span>Answer</span>
                  </div>
                </>
              )}
            </div>

            {/* Message Body */}
            <div
              className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                isUser
                  ? "bg-[#222426] text-white font-medium border border-[#2C2E32]"
                  : "bg-[#1C1E20] text-[#E0E1E4] border border-[#27292C]"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="markdown-body space-y-2">
                  {msg.toolCall && (
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#181A1D] border border-[#00AD9F]/30 text-xs text-[#00AD9F] mb-3 w-fit">
                      <Globe className={`w-3.5 h-3.5 shrink-0 text-[#00AD9F] ${msg.toolCallActive ? "animate-spin" : ""}`} />
                      <span>
                        {msg.toolCallActive ? "Searching web for" : "Searched web for"}{" "}
                        <strong className="text-white font-medium">"{msg.toolCall.input?.query || msg.toolCall.name}"</strong>
                      </span>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                      strong: ({ children }) => (
                        <strong className="font-bold text-white">{children}</strong>
                      ),
                      em: ({ children }) => <em className="italic text-[#C8C9CE]">{children}</em>,
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white mt-4 mb-2 border-b border-[#2A2C30] pb-1">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-white mt-3 mb-1.5">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-[#00AD9F] mt-2 mb-1">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-2 pl-2 text-[#D5D6DA]">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-2 pl-2 text-[#D5D6DA]">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="leading-normal">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#00AD9F] pl-3 py-1 my-2 bg-[#17181A] rounded-r text-[#B5B6BB] italic">
                          {children}
                        </blockquote>
                      ),
                      code: ({ inline, className, children, ...props }) => {
                        return inline ? (
                          <code className="bg-[#26282C] text-[#00AD9F] font-mono text-xs px-1.5 py-0.5 rounded border border-[#323439]">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-[#141517] text-teal-300 font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-[#2B2D31] overflow-x-auto my-3">
                            <code>{children}</code>
                          </pre>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Action Toolbar for AI responses */}
              {!isUser && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#292B2E] text-xs text-[#808286]">
                  <button
                    onClick={() => handleCopy(msg.content, index)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-[#25282B]"
                    title="Copy response"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="flex items-center gap-2 text-sm text-[#00AD9F]">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="font-semibold">Thinking...</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1C1E20] border border-[#27292C] space-y-2">
            <div className="h-4 bg-[#2A2D31] rounded w-3/4"></div>
            <div className="h-4 bg-[#2A2D31] rounded w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadView;
