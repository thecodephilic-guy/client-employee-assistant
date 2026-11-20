"use client";

import React from "react";
import { Mail, CheckCircle2, GitPullRequest, Users, X } from "lucide-react";

export interface ToastItem {
  id: string;
  type: "email" | "issue" | "candidate" | "employee" | "info";
  title: string;
  message: string;
  timestamp?: string;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const iconMap = {
    email: <Mail className="w-5 h-5 text-cyan-400 shrink-0" />,
    issue: <GitPullRequest className="w-5 h-5 text-purple-400 shrink-0" />,
    candidate: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    employee: <Users className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass-panel p-4 rounded-xl border border-white/15 shadow-2xl flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {iconMap[toast.type]}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-white tracking-wide">{toast.title}</h4>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
