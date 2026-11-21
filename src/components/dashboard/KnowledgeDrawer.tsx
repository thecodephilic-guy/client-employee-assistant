"use client";

import React, { useState } from "react";
import { BookOpen, Search, X, Sparkles, ChevronRight, FileText } from "lucide-react";
import { CompanyDocument } from "../../types";

interface KnowledgeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: CompanyDocument[];
  onAskQuestion: (question: string) => void;
}

export const KnowledgeDrawer: React.FC<KnowledgeDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  onAskQuestion,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<CompanyDocument | null>(null);
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const quickQuestions = [
    "What is our annual leave and sick policy?",
    "What are the PR review SLAs and on-call rotation rules?",
    "How much can I expense for business travel meals?",
    "What are the GitHub branch naming standards?",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full sm:max-w-xl h-full bg-[#0e0f13] border-l border-zinc-800 p-4 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/80 text-zinc-300">
                <BookOpen className="w-5 h-5 text-zinc-300" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Company Knowledge RAG</h3>
                <p className="text-xs text-zinc-400">Policy & Guidelines Semantic Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick RAG Search Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-300">
              Ask any company policy or process question:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    onAskQuestion(query);
                    onClose();
                  }
                }}
                placeholder="e.g. What is the meal per diem during travel?"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
              />
              <button
                onClick={() => {
                  if (query.trim()) {
                    onAskQuestion(query);
                    onClose();
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <div className="space-y-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onAskQuestion(q);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between transition group"
                >
                  <span>{q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Pre-loaded Company Documents */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Pre-Loaded Policy Library ({documents.length})
            </span>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                  className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                      <h4 className="text-xs font-semibold text-white">{doc.title}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60 shrink-0">
                      {doc.category}
                    </span>
                  </div>

                  {selectedDoc?.id === doc.id && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-300 whitespace-pre-line font-sans leading-relaxed">
                      {doc.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            Powered by LangChain Semantic Retrieval over One Corp Enterprise Documents.
          </p>
        </div>
      </div>
    </div>
  );
};
