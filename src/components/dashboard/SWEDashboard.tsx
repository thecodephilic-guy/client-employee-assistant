"use client";

import React from "react";
import { GitPullRequest, MessageSquare, Sparkles, ExternalLink } from "lucide-react";
import { GithubIssue } from "../../types";

interface SWEDashboardProps {
  assignedIssues: GithubIssue[];
  onTriggerStatusAction?: () => void;
  onSubmitCommentManual?: (issueNumber: number, comment: string) => void;
}

export const SWEDashboard: React.FC<SWEDashboardProps> = ({
  assignedIssues,
  onTriggerStatusAction,
}) => {
  return (
    <div className="space-y-4">
      {/* Clean Single Container: Assigned Issues */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-cyan-400" /> My Assigned Issues & Thread Briefings
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Voice: <em>"What's assigned to me?"</em> or <em>"Comment on issue #1 that I found root cause, and email standup to manager."</em>
            </p>
          </div>

          <button
            onClick={onTriggerStatusAction}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 transition shadow shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice Standup & Comment</span>
          </button>
        </div>

        <div className="space-y-3">
          {assignedIssues.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-6 text-center">
              No active issues assigned. Switch to Engineering Manager to assign a task!
            </p>
          ) : (
            assignedIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        #{issue.issueNumber}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{issue.title}</h4>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                          issue.priority === "URGENT"
                            ? "bg-red-500/15 text-red-300 border-red-500/30"
                            : issue.priority === "HIGH"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{issue.body}</p>
                  </div>

                  {issue.githubUrl && (
                    <a
                      href={issue.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-white transition shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Latest Discussion Comment */}
                {issue.comments && issue.comments.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.04] space-y-1.5">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      <span>Latest Update</span>
                    </div>
                    {issue.comments.slice(-1).map((c) => (
                      <div
                        key={c.id}
                        className="p-2 rounded-lg bg-black/40 text-xs text-gray-300 flex items-start justify-between gap-2"
                      >
                        <span className="font-semibold text-cyan-300 shrink-0">{c.authorName}:</span>
                        <span className="truncate flex-1">{c.commentBody}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
