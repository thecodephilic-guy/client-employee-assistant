"use client";

import React, { useState } from "react";
import { Users, AlertCircle, ShieldCheck, UserPlus, X, Check } from "lucide-react";
import { User, GithubIssue, AuditLog } from "../../types";

interface AdminDashboardProps {
  team: User[];
  issues: GithubIssue[];
  auditLogs: AuditLog[];
  stats: any;
  onProvisionEmployee: (data: { name: string; email: string; role: string; title: string }) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  team,
  issues,
  auditLogs,
  stats,
  onProvisionEmployee,
}) => {
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("software_engineer");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onProvisionEmployee({ name, email, role, title });
    setName("");
    setEmail("");
    setTitle("");
    setShowProvisionModal(false);
  };

  const openIssuesCount = stats.openIssuesCount || issues.filter((i) => i.status !== "CLOSED").length;

  return (
    <div className="space-y-4">
      {/* Sleek Minimal Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-[#121216] px-4 py-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Team Size</span>
            <div className="text-xl font-bold text-white mt-0.5">{team.length} Members</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#121216] px-4 py-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Open Issues</span>
            <div className="text-xl font-bold text-white mt-0.5">{openIssuesCount} Tickets</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#121216] px-4 py-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">RBAC Security</span>
            <div className="text-xl font-bold text-zinc-200 mt-0.5">Isolated</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Clean Single Container: Team Workspace */}
      <div className="bg-[#121216] rounded-2xl p-4 sm:p-5 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Company Workspace Roster</h3>
            <p className="text-xs text-zinc-400">
              Voice command: <em>"Hire Priya as an HR Manager with email priya@..."</em>
            </p>
          </div>
          <button
            onClick={() => setShowProvisionModal(true)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center gap-1.5 transition shrink-0 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between gap-3 hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={member.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{member.name}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{member.email}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                {member.role.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Provision Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] rounded-2xl p-5 sm:p-6 max-w-sm w-full border border-zinc-700/80 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Add Team Member</h3>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Nair"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@onecorp.ai"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                >
                  <option value="hr">HR Manager</option>
                  <option value="engineering_manager">Engineering Manager</option>
                  <option value="software_engineer">Software Engineer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm"
                >
                  Provision & Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
