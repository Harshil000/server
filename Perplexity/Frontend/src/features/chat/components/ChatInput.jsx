import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Globe, Paperclip, Sparkles, Loader2, X, FileText, Image as ImageIcon, FileCode } from "lucide-react";

const ChatInput = ({ onSend, loading, placeholder = "Ask anything..." }) => {
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...selectedFiles]);
    }
    // Reset file input value so same file can be re-added if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!prompt.trim() && attachedFiles.length === 0) || loading) return;
    
    onSend(prompt.trim(), attachedFiles);
    setPrompt("");
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mime, name) => {
    if (mime.startsWith("image/")) return <ImageIcon className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
    if (mime === "application/pdf" || name.toLowerCase().endsWith(".pdf")) return <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />;
    return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[#202225] border border-[#303236] rounded-2xl p-3 shadow-xl focus-within:border-[#00AD9F]/60 focus-within:ring-1 focus-within:ring-[#00AD9F]/40 transition-all"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,application/pdf,text/*,.json,.csv,.js,.jsx,.ts,.tsx,.py,.md"
        />

        {/* Attached Files Preview Chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-[#2A2C30]">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#282B2E] border border-[#383B40] text-xs text-[#E0E1E4] max-w-[220px]"
              >
                {getFileIcon(file.type, file.name)}
                <span className="truncate flex-1 font-medium">{file.name}</span>
                <span className="text-[10px] text-[#808286]">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="p-0.5 hover:bg-[#383B40] rounded-full text-[#909296] hover:text-white transition-colors"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachedFiles.length > 0 ? "Ask anything about attached files..." : placeholder}
          rows={1}
          className="w-full bg-transparent text-white placeholder-[#707276] resize-none focus:outline-none text-base pr-12 min-h-[44px] max-h-[200px]"
        />

        {/* Toolbar & Actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2A2C30]">
          <div className="flex items-center gap-2 relative">




            {/* Attach Icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-[#707276] hover:text-white hover:bg-[#282B2E] rounded-lg transition-colors relative"
              title="Attach files (Images, PDFs, Text, Code)"
            >
              <Paperclip className="w-4 h-4 text-[#00AD9F]" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!prompt.trim() && attachedFiles.length === 0) || loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              (prompt.trim() || attachedFiles.length > 0) && !loading
                ? "bg-[#00AD9F] text-black hover:bg-[#00c7b7] shadow-lg cursor-pointer"
                : "bg-[#2D3034] text-[#606266] cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ArrowUp className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
