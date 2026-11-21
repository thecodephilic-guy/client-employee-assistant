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
      <div className="lg:col-span-5 bg-[#121216] rounded-2xl p-4 sm:p-5 border border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" /> Today's Action Checklist
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {completedCount}/{schedules.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {schedules.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleSchedule(item.id)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                  item.isCompleted
                    ? "bg-zinc-950/40 border-zinc-800/60 text-zinc-500"
                    : "bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-800/50 text-white"
                }`}
              >
                <div className="mt-0.5">
                  {item.isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-medium leading-snug ${
                      item.isCompleted ? "line-through text-zinc-500" : "text-zinc-200"
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                    {item.timeSlot}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 mt-4 italic">
          Voice: <em>"What is my schedule for today?"</em>
        </p>
      </div>

      {/* Right Col: Candidate Pool & Shortlisting (7 cols) */}
      <div className="lg:col-span-7 bg-[#121216] rounded-2xl p-4 sm:p-5 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400" /> Backend Engineer Candidates
            </h3>
            <p className="text-[11px] text-zinc-400">
              Voice: <em>"Find the top 3 candidates for the Backend Engineer role"</em>
            </p>
          </div>

          <button
            onClick={onShortlistVoiceAction}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs flex items-center justify-center gap-1.5 transition shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Shortlist Top 3</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {backendCandidates.slice(0, 3).map((cand) => {
            const isShortlisted = cand.status === "SHORTLISTED";
            return (
              <div
                key={cand.id}
                className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 ${
                  isShortlisted
                    ? "bg-zinc-900/80 border-zinc-700/80 shadow-sm"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/40"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-semibold text-white truncate">{cand.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-400 font-mono">
                      {cand.experienceYears}y exp
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {cand.skills}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-zinc-200">{cand.score}%</div>
                    <span className="text-[10px] text-zinc-500">Match</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      isShortlisted
                        ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800"
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
