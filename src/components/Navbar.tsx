"use client";

import React from "react";
import { UserRole, User } from "../types";
import { Sparkles, Building2, LogOut, Radio, Shield, Users, Briefcase, Code } from "lucide-react";

interface NavbarProps {
  currentUser: User | null;
  onSwitchRole: (role: UserRole) => void;
  onOpenOnboarding: () => void;
  onLogout: () => void;
  sseConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  onOpenOnboarding,
  onLogout,
  sseConnected,
}) => {
  const roles: { role: UserRole; label: string; shortLabel: string; icon: any }[] = [
    { role: "admin", label: "Admin (Founder)", shortLabel: "Admin", icon: Shield },
    { role: "hr", label: "HR Manager", shortLabel: "HR", icon: Users },
    { role: "engineering_manager", label: "Engineering Mgr", shortLabel: "EM", icon: Briefcase },
    { role: "software_engineer", label: "Software Engineer", shortLabel: "SWE", icon: Code },
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Tag */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 text-zinc-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-white tracking-tight text-sm sm:text-base truncate">
                One Corp AI
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-zinc-400 font-mono shrink-0">
                Agora 2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block truncate">
              Voice-First Agentic Workplace Assistant
            </p>
          </div>
        </div>

        {/* Center: Desktop Clean 1-Click Role Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <Radio
              className={`w-3.5 h-3.5 ${
                sseConnected ? "text-emerald-400 animate-pulse" : "text-zinc-600"
              }`}
            />
            <span className="text-[11px]">
              {sseConnected ? "SSE Active" : "Connecting..."}
            </span>
          </div>

          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            {roles.map((r) => {
              const isActive = currentUser?.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => onSwitchRole(r.role)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700/80 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                  title={`Switch to ${r.label}`}
                >
                  {r.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenOnboarding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-200 transition"
          >
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Onboarding</span>
          </button>
          <button
            onClick={onOpenOnboarding}
            className="sm:hidden p-2 rounded-lg text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200"
            title="Open Hybrid Voice Onboarding"
          >
            <Building2 className="w-4 h-4 text-zinc-400" />
          </button>

          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <img
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-700 object-cover shrink-0"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-medium text-zinc-200 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {currentUser.role.replace("_", " ")}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Role Switcher Strip */}
      <div className="lg:hidden border-t border-zinc-800/80 bg-[#0d0e12] px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio
            className={`w-3 h-3 ${
              sseConnected ? "text-emerald-400 animate-pulse" : "text-zinc-600"
            }`}
          />
          <span className="text-[10px] text-zinc-500 font-mono">Role:</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
          {roles.map((r) => {
            const isActive = currentUser?.role === r.role;
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                onClick={() => onSwitchRole(r.role)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/80"
                }`}
              >
                <Icon className="w-3 h-3 text-zinc-400" />
                <span>{r.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
