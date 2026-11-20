"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Users, Briefcase, Code, Shield } from "lucide-react";
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
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      color: "border-purple-500/40 hover:border-purple-400 bg-purple-950/20",
    },
    {
      role: "hr",
      label: "HR Manager",
      name: "Sarah Jenkins",
      email: "sarah@onecorp.ai",
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20",
    },
    {
      role: "engineering_manager",
      label: "Engineering Manager",
      name: "Marcus Vance",
      email: "marcus@onecorp.ai",
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      color: "border-amber-500/40 hover:border-amber-400 bg-amber-950/20",
    },
    {
      role: "software_engineer",
      label: "Software Engineer",
      name: "Rohan Verma",
      email: "rohan@onecorp.ai",
      icon: <Code className="w-4 h-4 text-blue-400" />,
      color: "border-blue-500/40 hover:border-blue-400 bg-blue-950/20",
    },
  ];

  const selectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-purple-600 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-600 pointer-events-none" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">One Corp Workplace Voice AI</h1>
          <p className="text-xs text-gray-400">
            Agora Conversational AI • Murf AI Falcon TTS • PostgreSQL Neon • RBAC Tools
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Company Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@onecorp.ai or sohail@sohail.world"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition duration-200"
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
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
            <span>Judge 1-Click Role Select</span>
            <span className="text-indigo-400 font-normal">Password123!</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => selectDemoUser(account.email)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${account.color}`}
              >
                {account.icon}
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{account.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{account.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
