"use client";

import React from "react";
import { CheckSquare, Square, Users, Award, Calendar, Sparkles, Mail } from "lucide-react";
import { DailySchedule, JobApplicant } from "../../types";

interface HRDashboardProps {
  schedules: DailySchedule[];
  applicants: JobApplicant[];
  onToggleSchedule: (taskId: string) => void;
  onShortlistVoiceAction?: () => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  schedules,
  applicants,
  onToggleSchedule,
  onShortlistVoiceAction,
}) => {
  const completedCount = schedules.filter((s) => s.isCompleted).length;
  const backendCandidates = applicants
    .filter((a) => a.roleApplied.toLowerCase().includes("backend"))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Col: Daily Action Checklist (4 cols) */}
      <div className="lg:col-span-5 glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Today's Action Checklist
            </h3>
            <span className="text-[11px] text-emerald-300 font-mono">
              {completedCount}/{schedules.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {schedules.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleSchedule(item.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  item.isCompleted
                    ? "bg-emerald-950/15 border-emerald-500/20 text-gray-500"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] text-white"
                }`}
              >
                <div className="mt-0.5">
                  {item.isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-medium leading-snug ${
                      item.isCompleted ? "line-through text-gray-500" : "text-gray-200"
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[10px] text-emerald-400/70 mt-0.5 font-mono">
                    {item.timeSlot}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-4 italic">
          Voice: <em>"What is my schedule for today?"</em>
        </p>
      </div>

      {/* Right Col: Candidate Pool & Shortlisting (7 cols) */}
      <div className="lg:col-span-7 glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Backend Engineer Candidates
            </h3>
            <p className="text-[11px] text-gray-400">
              Voice: <em>"Find the top 3 candidates for the Backend Engineer role"</em>
            </p>
          </div>

          <button
            onClick={onShortlistVoiceAction}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shortlist Top 3</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {backendCandidates.slice(0, 3).map((cand, idx) => {
            const isShortlisted = cand.status === "SHORTLISTED";
            return (
              <div
                key={cand.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 ${
                  isShortlisted
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white truncate">{cand.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-gray-400 font-mono">
                      {cand.experienceYears}y exp
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {cand.skills}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-emerald-400">{cand.score}%</div>
                    <span className="text-[10px] text-gray-400">Match</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      isShortlisted
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }`}
                  >
                    {cand.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
