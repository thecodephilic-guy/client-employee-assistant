"use client";

import React, { useState } from "react";
import { UserRole, User } from "../types";
import { Sparkles, Building2, LogOut, Radio, Menu, X, Shield, Users, Briefcase, Code } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; shortLabel: string; icon: any; iconColor: string }[] = [
    { role: "admin", label: "Admin (Founder)", shortLabel: "Admin", icon: Shield, iconColor: "text-purple-400" },
    { role: "hr", label: "HR Manager", shortLabel: "HR", icon: Users, iconColor: "text-emerald-400" },
    { role: "engineering_manager", label: "Engineering Mgr", shortLabel: "EM", icon: Briefcase, iconColor: "text-amber-400" },
    { role: "software_engineer", label: "Software Engineer", shortLabel: "SWE", icon: Code, iconColor: "text-blue-400" },
  ];

  return (
    <header className="border-b border-white/10 bg-[#0c1222]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Hackathon Tag */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base truncate">
                One Corp AI
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono shrink-0">
                Agora 2026
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 hidden sm:block truncate">
              Voice-First Agentic Workplace Assistant
            </p>
          </div>
        </div>

        {/* Center: Desktop Quick 1-Click Role Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <Radio
              className={`w-3.5 h-3.5 ${
                sseConnected ? "text-emerald-400 animate-pulse" : "text-gray-500"
              }`}
            />
            <span className="text-[11px]">
              {sseConnected ? "Live Reactive SSE Stream" : "Connecting SSE..."}
            </span>
          </div>

          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {roles.map((r) => {
              const isActive = currentUser?.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => onSwitchRole(r.role)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Onboarding Button (Full on sm+, compact icon on mobile) */}
          <button
            onClick={onOpenOnboarding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 hover:border-purple-400 transition"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Onboarding</span>
          </button>
          <button
            onClick={onOpenOnboarding}
            className="sm:hidden p-2 rounded-xl text-xs font-semibold bg-purple-600/20 border border-purple-500/30 text-purple-200"
            title="Open Hybrid Voice Onboarding"
          >
            <Building2 className="w-4 h-4 text-purple-400" />
          </button>

          {currentUser && (
            <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 border-l border-white/10">
              <img
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 object-cover shrink-0"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-medium text-white truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {currentUser.role.replace("_", " ")}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Role Switcher Strip (Always accessible on screens < lg) */}
      <div className="lg:hidden border-t border-white/5 bg-black/40 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio
            className={`w-3 h-3 ${
              sseConnected ? "text-emerald-400 animate-pulse" : "text-gray-500"
            }`}
          />
          <span className="text-[10px] text-gray-400 font-mono">Role:</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
          {roles.map((r) => {
            const isActive = currentUser?.role === r.role;
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                onClick={() => onSwitchRole(r.role)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white/20 text-white border border-white/20 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 bg-white/[0.04] border border-white/[0.06]"
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? "text-white" : r.iconColor}`} />
                <span>{r.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
