"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, Users, Briefcase, Code, Shield } from "lucide-react";
import { api } from "../../src/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sohailansari483@gmail.com");
  const [password, setPassword] = useState("Password123!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await api.auth.login(email, password);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "admin",
      label: "Founder & CEO",
      name: "Sohail Ansari",
      email: "sohailansari483@gmail.com",
      icon: <Shield className="w-4 h-4 text-zinc-300" />,
    },
    {
      role: "hr",
      label: "HR Manager",
      name: "Sarah Jenkins",
      email: "sarah@onecorp.ai",
      icon: <Users className="w-4 h-4 text-zinc-300" />,
    },
    {
      role: "engineering_manager",
      label: "Engineering Manager",
      name: "Marcus Vance",
      email: "marcus@onecorp.ai",
      icon: <Briefcase className="w-4 h-4 text-zinc-300" />,
    },
    {
      role: "software_engineer",
      label: "Software Engineer",
      name: "Rohan Verma",
      email: "rohan@onecorp.ai",
      icon: <Code className="w-4 h-4 text-zinc-300" />,
    },
  ];

  const selectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative">
      <div className="max-w-md w-full bg-[#121216] rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/80 text-zinc-100 shadow-sm">
            <Sparkles className="w-5 h-5 text-zinc-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">One Corp Workplace Voice AI</h1>
          <p className="text-xs text-zinc-400">
            Agora Conversational AI • Murf AI Falcon TTS • PostgreSQL Neon • RBAC Tools
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/50 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Company Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sohailansari483@gmail.com or name@onecorp.ai"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white active:scale-[0.99] text-zinc-950 font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition duration-150"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Role Fill for Hackathon Judges */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
            <span>Judge 1-Click Role Select</span>
            <span className="text-zinc-500 font-mono font-normal">Password123!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => selectDemoUser(account.email)}
                className="p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 text-left transition flex items-center gap-2.5"
              >
                <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
                  {account.icon}
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-zinc-200 truncate">{account.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{account.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
