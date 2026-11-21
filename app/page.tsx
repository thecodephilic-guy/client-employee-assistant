"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole, GithubIssue, JobApplicant, DailySchedule, CompanyDocument, AuditLog, GithubRepo } from "../src/types";
import { api, getToken, clearToken, getStoredUser, setStoredUser, setToken } from "../src/lib/api";
import { Navbar } from "../src/components/Navbar";
import { VoiceOrb } from "../src/components/VoiceOrb";
import { ToastNotification, ToastItem } from "../src/components/ToastNotification";
import { AdminDashboard } from "../src/components/dashboard/AdminDashboard";
import { HRDashboard } from "../src/components/dashboard/HRDashboard";
import { EMDashboard } from "../src/components/dashboard/EMDashboard";
import { SWEDashboard } from "../src/components/dashboard/SWEDashboard";
import { KnowledgeDrawer } from "../src/components/dashboard/KnowledgeDrawer";
import { HybridOnboardingModal } from "../src/components/onboarding/HybridOnboardingModal";
import { BookOpen, Sparkles, Radio } from "lucide-react";
import confetti from "canvas-confetti";

export default function WorkspacePage() {
  const router = useRouter();

  // Active User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard Data State
  const [team, setTeam] = useState<User[]>([]);
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<GithubIssue[]>([]);
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [stats, setStats] = useState<any>({});

  // UI Modals & Drawers
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<any | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sseConnected, setSseConnected] = useState(false);

  // 1. Initial Authentication Check & Load
  useEffect(() => {
    async function initSession() {
      const token = getToken();
      if (!token) {
        // Auto login as default Admin (Sohail Ansari) for seamless judging experience
        try {
          const res = await api.auth.switchRole("admin");
          setCurrentUser(res.user);
        } catch (e) {
          try {
            const res = await api.auth.login("sohailansari483@gmail.com", "Password123!");
            setCurrentUser(res.user);
          } catch (e2) {
            router.push("/login");
            return;
          }
        }
      } else {
        try {
          const meRes = await api.auth.getMe();
          setCurrentUser(meRes.user);
        } catch (e) {
          clearToken();
          router.push("/login");
          return;
        }
      }
      setIsLoading(false);
    }

    initSession();
  }, [router]);

  // 2. Load Dashboard Data when user changes
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      const summary = await api.dashboard.getSummary();
      setTeam(summary.team || []);
      setIssues(summary.issues || []);
      setAssignedIssues(summary.assignedIssues || []);
      setApplicants(summary.applicants || []);
      setSchedules(summary.schedules || []);
      setDocuments(summary.documents || []);
      setAuditLogs(summary.auditLogs || []);
      setRepos(summary.repos || []);
      setStats(summary.stats || {});
    } catch (err: any) {
      console.warn("Dashboard load warning:", err.message);
    }
  };

  // 3. Realtime Server-Sent Events (SSE) Listener
  useEffect(() => {
    if (!currentUser) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4040";
    const sseUrl = `${API_BASE}/api/events?userId=${currentUser.id}&companyId=${currentUser.companyId || "comp_onecorp_01"}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      setSseConnected(true);
    };

    eventSource.onerror = () => {
      setSseConnected(false);
    };

    // Generic Event Handlers
    eventSource.addEventListener("EMAIL_DISPATCHED", (e: any) => {
      const data = JSON.parse(e.data);
      addToast({
        id: `email_${Date.now()}`,
        type: "email",
        title: `Email Sent via ${data.provider}`,
        message: `To: ${data.to} • "${data.subject}"`,
      });
    });

    eventSource.addEventListener("ISSUE_CREATED", (e: any) => {
      const data = JSON.parse(e.data);
      addToast({
        id: `issue_${Date.now()}`,
        type: "issue",
        title: `GitHub Issue #${data.issue?.issueNumber} Created`,
        message: `Assigned to ${data.issue?.assigneeName}: "${data.issue?.title}"`,
      });
      loadDashboardData();
    });

    eventSource.addEventListener("CANDIDATES_SHORTLISTED_LIVE", (e: any) => {
      const data = JSON.parse(e.data);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      addToast({
        id: `cand_${Date.now()}`,
        type: "candidate",
        title: `Top ${data.count} Candidates Shortlisted!`,
        message: `Marked SHORTLISTED & interview invitations dispatched.`,
      });
      loadDashboardData();
    });

    eventSource.addEventListener("EMPLOYEE_PROVISIONED", (e: any) => {
      const data = JSON.parse(e.data);
      addToast({
        id: `emp_${Date.now()}`,
        type: "employee",
        title: `Employee Provisioned: ${data.user?.name}`,
        message: `Role: ${data.user?.title}. Onboarding credentials emailed.`,
      });
      loadDashboardData();
    });

    eventSource.addEventListener("SCHEDULE_UPDATED", (e: any) => {
      loadDashboardData();
    });

    eventSource.addEventListener("FORM_FIELD_UPDATED", (e: any) => {
      const data = JSON.parse(e.data);
      window.dispatchEvent(new CustomEvent("sse-form-field-updated", { detail: data }));
    });

    eventSource.addEventListener("DASHBOARD_REFRESH", () => {
      loadDashboardData();
    });

    return () => {
      eventSource.close();
      setSseConnected(false);
    };
  }, [currentUser]);

  const addToast = (toast: ToastItem) => {
    setToasts((prev) => [toast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch Role Handler (Judges 1-Click Evaluation)
  const handleSwitchRole = async (targetRole: UserRole) => {
    try {
      // First try dedicated switch-role endpoint (dynamic DB lookup)
      const res = await api.auth.switchRole(targetRole);
      setCurrentUser(res.user);
      setPendingConfirmation(null);
      addToast({
        id: `switch_${Date.now()}`,
        type: "info",
        title: `Switched Perspective to ${targetRole.replace("_", " ").toUpperCase()}`,
        message: `Now logged in as ${res.user.name} (${res.user.title}) with role-restricted voice tools.`,
      });
    } catch (err: any) {
      const roleEmailMap: Record<UserRole, string> = {
        admin: "sohailansari483@gmail.com",
        hr: "sarah@onecorp.ai",
        engineering_manager: "marcus@onecorp.ai",
        software_engineer: "rohan@onecorp.ai",
      };

      try {
        const res = await api.auth.login(roleEmailMap[targetRole], "Password123!");
        setCurrentUser(res.user);
        setPendingConfirmation(null);
        addToast({
          id: `switch_${Date.now()}`,
          type: "info",
          title: `Switched Perspective to ${targetRole.replace("_", " ").toUpperCase()}`,
          message: `Now logged in as ${res.user.name} (${res.user.title}) with role-restricted voice tools.`,
        });
      } catch (err2: any) {
        console.warn("Role switch failed:", err2);
      }
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  // Checklist toggle for HR
  const handleToggleSchedule = async (taskId: string) => {
    try {
      await api.dashboard.toggleChecklist(taskId);
      loadDashboardData();
    } catch (err) {
      console.warn("Toggle checklist note:", err);
    }
  };

  // Confirm verbal action
  const handleConfirmPending = async () => {
    if (!pendingConfirmation) return;
    try {
      const action = pendingConfirmation.pendingAction || pendingConfirmation;
      await api.voice.interact({
        confirmed: true,
        pendingAction: action,
      });
      setPendingConfirmation(null);
      loadDashboardData();
    } catch (err: any) {
      alert(`Error confirming action: ${err.message}`);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-mono">Initializing One Corp Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        sseConnected={sseConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Floating Voice Knowledge RAG Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">Workplace Voice Assistant</h1>
            <span className="text-xs text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400">
              Role: <span className="text-zinc-200 font-medium capitalize">{currentUser.role.replace("_", " ")}</span>
            </span>
          </div>

          <button
            onClick={() => setIsKnowledgeOpen(true)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-xs text-zinc-200 font-medium flex items-center gap-1.5 transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Company Knowledge</span>
          </button>
        </div>

        {/* The Voice Orb Interactive Center */}
        <VoiceOrb
          userRole={currentUser.role}
          userName={currentUser.name}
          onActionCompleted={loadDashboardData}
          onConfirmationRequested={(res) => setPendingConfirmation(res ? (res.pendingAction || res) : null)}
          pendingConfirmation={pendingConfirmation}
          onConfirmPending={handleConfirmPending}
          onUiAction={(action) => {
            if (action.type === "NAVIGATE_ROLE" && action.payload?.role) {
              handleSwitchRole(action.payload.role);
            } else if (action.type === "OPEN_KNOWLEDGE") {
              setIsKnowledgeOpen(true);
            } else if (action.type === "CLOSE_KNOWLEDGE") {
              setIsKnowledgeOpen(false);
            } else if (action.type === "OPEN_ONBOARDING") {
              setIsOnboardingOpen(true);
            } else if (action.type === "CLOSE_ONBOARDING") {
              setIsOnboardingOpen(false);
            }
          }}
        />

        {/* Live Reactive Role Dashboard */}
        {currentUser.role === "admin" && (
          <AdminDashboard
            team={team}
            issues={issues}
            auditLogs={auditLogs}
            stats={stats}
            onProvisionEmployee={async (data) => {
              try {
                await api.voice.interact({
                  transcript: `Hire ${data.name} as ${data.role} with email ${data.email}`,
                  confirmed: true,
                  pendingAction: {
                    toolName: "provision_employee",
                    args: { name: data.name, email: data.email, role: data.role, title: data.title },
                  },
                });
                loadDashboardData();
              } catch (e: any) {
                alert(e.message);
              }
            }}
          />
        )}

        {currentUser.role === "hr" && (
          <HRDashboard
            schedules={schedules}
            applicants={applicants}
            onToggleSchedule={handleToggleSchedule}
            onShortlistVoiceAction={() => {
              api.voice
                .interact({
                  transcript: "Find the top 3 candidates for the Backend Engineer role.",
                  confirmed: true,
                  pendingAction: {
                    toolName: "shortlist_candidates",
                    args: { role: "Backend Engineer", sendInvites: true },
                  },
                })
                .then(loadDashboardData);
            }}
          />
        )}

        {currentUser.role === "engineering_manager" && (
          <EMDashboard
            issues={issues}
            team={team}
            repos={repos}
            onTriggerHeroFlow={() => {
              api.voice
                .interact({
                  transcript:
                    "Create a GitHub issue titled 'Fix payment webhook timeout', assign it to Rohan, and email him.",
                  confirmed: true,
                  pendingAction: {
                    toolName: "assign_github_task",
                    args: {
                      title: "Fix payment webhook timeout in stripe integration",
                      assigneeName: "Rohan Verma",
                      assigneeEmail: "rohan@onecorp.ai",
                      priority: "HIGH",
                    },
                  },
                })
                .then(loadDashboardData);
            }}
            onCreateIssueManual={(data) => {
              api.voice
                .interact({
                  transcript: `Create issue ${data.title} and assign to ${data.assigneeName}`,
                  confirmed: true,
                  pendingAction: {
                    toolName: "assign_github_task",
                    args: data,
                  },
                })
                .then(loadDashboardData);
            }}
          />
        )}

        {currentUser.role === "software_engineer" && (
          <SWEDashboard
            assignedIssues={assignedIssues}
            onTriggerStatusAction={() => {
              api.voice
                .interact({
                  transcript:
                    "Comment on issue #1 that I found the root cause and PR is coming today, and email my manager a quick standup.",
                  confirmed: true,
                  pendingAction: {
                    toolName: "post_issue_update_and_standup",
                    args: {
                      issueNumber: 1,
                      comment:
                        "Found root cause in ingestion chunking timeout. PR submitted for review today.",
                      managerEmail: "marcus@onecorp.ai",
                    },
                  },
                })
                .then(loadDashboardData);
            }}
            onSubmitCommentManual={(issueNumber, comment) => {
              api.voice
                .interact({
                  transcript: `Comment on issue #${issueNumber}: ${comment}`,
                  confirmed: true,
                  pendingAction: {
                    toolName: "post_issue_update_and_standup",
                    args: { issueNumber, comment, managerEmail: "marcus@onecorp.ai" },
                  },
                })
                .then(loadDashboardData);
            }}
          />
        )}
      </main>

      {/* Standout Flow: Hybrid Voice Company Onboarding Modal */}
      <HybridOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onWorkspaceCreated={() => {
          loadDashboardData();
          addToast({
            id: `onboard_${Date.now()}`,
            type: "info",
            title: "Workspace Successfully Registered!",
            message: "Company initialized with repository and founder settings.",
          });
        }}
      />

      {/* Knowledge Base RAG Drawer */}
      <KnowledgeDrawer
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        documents={documents}
        onAskQuestion={(question) => {
          api.voice
            .interact({ transcript: question })
            .then((res) => {
              addToast({
                id: `rag_${Date.now()}`,
                type: "info",
                title: "RAG Policy Query Result",
                message: res.spokenText?.substring(0, 120) + "...",
              });
            });
        }}
      />

      {/* Live Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
