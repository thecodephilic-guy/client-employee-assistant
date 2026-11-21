"use client";

import React, { useState } from "react";
import { GitPullRequest, User, Sparkles, ExternalLink, Plus, X, Code, CheckCircle2 } from "lucide-react";
import { GithubIssue, User as UserType, GithubRepo } from "../../types";

interface EMDashboardProps {
  issues: GithubIssue[];
  team: UserType[];
  repos?: GithubRepo[];
  onTriggerHeroFlow?: () => void;
  onCreateIssueManual?: (data: { title: string; assigneeName: string; body: string; priority: string }) => void;
}

export const EMDashboard: React.FC<EMDashboardProps> = ({
  issues,
  team,
  repos = [],
  onTriggerHeroFlow,
  onCreateIssueManual,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [assigneeName, setAssigneeName] = useState("Rohan Verma");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("HIGH");
  const [selectedRepo, setSelectedRepo] = useState("thecodephilic-guy/doc-assistant");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (onCreateIssueManual) {
      onCreateIssueManual({ title, assigneeName, body, priority });
    }
    setTitle("");
    setBody("");
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Authenticated User Profile Repositories Strip */}
      <div className="bg-[#121216] rounded-2xl p-4 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Code className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-semibold text-white">
              Authenticated GitHub Repositories (@thecodephilic-guy)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/80 font-mono">
              Live GitHub API Token
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {repos.length} repos available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {repos.map((repo) => {
            const isActive = repo.fullName === selectedRepo;
            return (
              <div
                key={repo.id}
                onClick={() => setSelectedRepo(repo.fullName)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-zinc-800/90 border-zinc-600 text-white shadow-sm"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-white truncate">{repo.name}</span>
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-200 shrink-0" />
                    ) : (
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-500 hover:text-white transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2">{repo.description}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/50 mt-2">
                  <span className="text-zinc-300 font-mono">{repo.language || "TypeScript"}</span>
                  <span className="text-zinc-500">{repo.openIssuesCount} issues</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Repository Issues Board */}
      <div className="bg-[#121216] rounded-2xl p-4 sm:p-5 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-zinc-400" /> Active Issues
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/80 font-mono">
                {selectedRepo}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hero Voice Flow: <em>"Create a GitHub issue titled 'Fix payment webhook timeout', assign it to Rohan, and email him."</em>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTriggerHeroFlow}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-zinc-200 text-zinc-950 flex items-center gap-1.5 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Voice Assign Issue</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition border border-zinc-700/80"
              title="Manual Ticket"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {issues.map((issue) => {
            const priorityBadge =
              issue.priority === "URGENT"
                ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                : issue.priority === "HIGH"
                ? "bg-zinc-800 text-zinc-300 border-zinc-700/80"
                : "bg-zinc-900 text-zinc-400 border-zinc-800";

            return (
              <div
                key={issue.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-900/40 px-2 rounded-xl transition"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-400 shrink-0">
                    #{issue.issueNumber}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{issue.title}</h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{issue.body}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${priorityBadge}`}>
                    {issue.priority}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate max-w-[100px]">{issue.assigneeName}</span>
                  </div>

                  {issue.githubUrl && (
                    <a
                      href={issue.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] rounded-2xl p-5 max-w-sm w-full border border-zinc-700/80 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Create Issue in {selectedRepo}</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fix payment webhook timeout"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Assignee</label>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option value="Rohan Verma">Rohan Verma (Senior Fullstack Engineer - @thecodephilic-guy)</option>
                  <option value="Marcus Vance">Marcus Vance (Engineering Manager)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm"
                >
                  Create & Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
