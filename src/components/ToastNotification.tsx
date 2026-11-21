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
    email: <Mail className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />,
    issue: <GitPullRequest className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />,
    candidate: <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />,
    employee: <Users className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />,
    info: <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />,
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#18181b] p-3.5 sm:p-4 rounded-xl border border-zinc-700/80 shadow-2xl flex items-start gap-3 transform transition duration-200"
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white tracking-tight truncate">{toast.title}</h4>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-400 hover:text-white p-1 rounded-md transition shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
