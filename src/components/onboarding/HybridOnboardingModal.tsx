"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Building2, Sparkles, X, Check, Key, ShieldCheck, ArrowRight, Play } from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../../lib/api";

interface HybridOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceCreated?: (company: any) => void;
}

export const HybridOnboardingModal: React.FC<HybridOnboardingModalProps> = ({
  isOpen,
  onClose,
  onWorkspaceCreated,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [adminPassword, setAdminPassword] = useState("Password123!");

  const [isListening, setIsListening] = useState(false);
  const [voicePromptText, setVoicePromptText] = useState("");
  const [agentSpokenGuide, setAgentSpokenGuide] = useState(
    "Hi Founder! I will set up your company workspace. Speak your Company Name, your Name, Email, and GitHub Repository."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlyUpdatedField, setRecentlyUpdatedField] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for Onboarding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setVoicePromptText(text);
        };
        recognition.onend = () => {
          setIsListening(false);
          if (voicePromptText.trim().length > 0) {
            handleVoiceOnboardingInput(voicePromptText);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [voicePromptText]);

  // Handle external SSE form update events if received
  useEffect(() => {
    const handleSseFormUpdate = (e: any) => {
      const { fields } = e.detail || {};
      if (fields) {
        if (fields.companyName) {
          setCompanyName(fields.companyName);
          highlightField("companyName");
        }
        if (fields.founderName) {
          setFounderName(fields.founderName);
          highlightField("founderName");
        }
        if (fields.founderEmail) {
          setFounderEmail(fields.founderEmail);
          highlightField("founderEmail");
        }
        if (fields.githubRepo) {
          setGithubRepo(fields.githubRepo);
          highlightField("githubRepo");
        }
      }
    };

    window.addEventListener("sse-form-field-updated", handleSseFormUpdate);
    return () => window.removeEventListener("sse-form-field-updated", handleSseFormUpdate);
  }, []);

  const highlightField = (fieldName: string) => {
    setRecentlyUpdatedField(fieldName);
    setTimeout(() => setRecentlyUpdatedField(null), 2500);
  };

  const toggleVoiceInterview = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setVoicePromptText("");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 200);
        }
      } else {
        // Fallback simulation
        simulateFounderVoiceInput();
      }
    }
  };

  const simulateFounderVoiceInput = () => {
    const sampleSpeech =
      "Our company is One Corp, founder is Sohail Ansari, email sohailansari483@gmail.com, and GitHub repo is thecodephilic-guy/doc-assistant.";
    setVoicePromptText(sampleSpeech);
    handleVoiceOnboardingInput(sampleSpeech);
  };

  const handleVoiceOnboardingInput = async (transcript: string) => {
    const lower = transcript.toLowerCase();

    // Check if finalizing verbally
    if (
      lower.includes("looks good") ||
      lower.includes("create the workspace") ||
      lower.includes("finalize")
    ) {
      handleFinalizeWorkspace();
      return;
    }

    try {
      const res = await api.voice.onboard({ transcript });
      if (res?.spokenText) setAgentSpokenGuide(res.spokenText);

      // Parse and live fill fields
      const compMatch = transcript.match(/(?:company|name)(?:\s+is)?\s+([A-Za-z0-9\s]+?)(?:,|\.|\sand\s|$)/i);
      const founderMatch = transcript.match(/(?:founder|founder name)(?:\s+is)?\s+([A-Za-z\s]+?)(?:,|\.|\sand\s|$)/i);
      const emailMatch = transcript.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      const repoMatch = transcript.match(/(?:repo|repository)(?:\s+is)?\s+([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)/i);

      if (compMatch) {
        setCompanyName(compMatch[1].trim());
        highlightField("companyName");
      }
      if (founderMatch) {
        setFounderName(founderMatch[1].trim());
        highlightField("founderName");
      }
      if (emailMatch) {
        setFounderEmail(emailMatch[1].trim());
        highlightField("founderEmail");
      }
      if (repoMatch) {
        setGithubRepo(repoMatch[1].trim());
        highlightField("githubRepo");
      }
    } catch (err: any) {
      console.warn("Voice onboard note:", err);
    }
  };

  const handleFinalizeWorkspace = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.dashboard.registerCompany({
        companyName: companyName || "One Corp",
        founderName: founderName || "Sohail Ansari",
        founderEmail: founderEmail || "sohailansari483@gmail.com",
        password: adminPassword,
        githubRepo: githubRepo || "thecodephilic-guy/doc-assistant",
        githubToken,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setAgentSpokenGuide(`Workspace '${companyName || "HyperScale AI"}' created successfully! Welcome aboard.`);
      if (onWorkspaceCreated) onWorkspaceCreated(res.company);

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      alert(`Error creating workspace: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="glass-panel rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-purple-500/30 shadow-2xl p-4 sm:p-8 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow ambient */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-purple-600" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Standout Demo Flow
              </span>
              <span className="text-xs text-gray-400">Murf Falcon Voice + Live Form</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" /> Hybrid Voice Company Onboarding
            </h2>
            <p className="text-xs text-gray-300 mt-1 max-w-lg leading-relaxed">
              Talk naturally with the onboarding assistant to fill workspace details on screen. Type or correct tricky strings at any time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Voice Guidance Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-purple-500/20 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-purple-200">Onboarding Agent:</div>
              <p className="text-xs text-gray-300 italic">{agentSpokenGuide}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleVoiceInterview}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isListening ? "Listening..." : "Speak to Agent"}</span>
            </button>

            <button
              onClick={simulateFounderVoiceInput}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1"
              title="Test with simulated founder speech"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Simulate Speech</span>
            </button>
          </div>
        </div>

        {voicePromptText && (
          <div className="mt-2 text-xs text-cyan-300 italic px-2 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>"{voicePromptText}"</span>
          </div>
        )}

        {/* Live Editable Form (Keyboard Fallback) */}
        <div className="mt-6 space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. HyperScale AI"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-white text-sm focus:outline-none transition-all ${
                  recentlyUpdatedField === "companyName"
                    ? "border-purple-400 ring-2 ring-purple-500/50"
                    : "border-white/10 focus:border-purple-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Founder Full Name</label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="e.g. Sohail Ansari"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-white text-sm focus:outline-none transition-all ${
                  recentlyUpdatedField === "founderName"
                    ? "border-purple-400 ring-2 ring-purple-500/50"
                    : "border-white/10 focus:border-purple-500"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Founder Email</label>
              <input
                type="email"
                value={founderEmail}
                onChange={(e) => setFounderEmail(e.target.value)}
                placeholder="e.g. sohailansari483@gmail.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-white text-sm focus:outline-none transition-all ${
                  recentlyUpdatedField === "founderEmail"
                    ? "border-purple-400 ring-2 ring-purple-500/50"
                    : "border-white/10 focus:border-purple-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                GitHub Repository (owner/repo)
              </label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="e.g. hyperscale-ai/core-services"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-white text-sm focus:outline-none transition-all ${
                  recentlyUpdatedField === "githubRepo"
                    ? "border-purple-400 ring-2 ring-purple-500/50"
                    : "border-white/10 focus:border-purple-500"
                }`}
              />
            </div>
          </div>

          {/* Keyboard-Only Tricky Strings */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Keyboard Fallback for Tricky Strings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Admin Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  GitHub Personal Access Token (Optional)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_••••••••••••••••"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <span className="text-xs text-gray-400">
            Say <em>"Looks good, create the workspace"</em> or click Finalize.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleFinalizeWorkspace}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:scale-105 text-white flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition"
            >
              {isSubmitting ? (
                <span>Creating Workspace...</span>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
