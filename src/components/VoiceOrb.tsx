"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Loader2, Play, CheckCircle2 } from "lucide-react";
import { VoiceState, UserRole } from "../types";
import { api } from "../lib/api";
import { agoraClient } from "../lib/agoraClient";

interface VoiceOrbProps {
  userRole: UserRole;
  userName: string;
  onActionCompleted?: () => void;
  onConfirmationRequested?: (data: any) => void;
  pendingConfirmation?: any;
  onConfirmPending?: () => void;
  onUiAction?: (action: any) => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  userRole,
  userName,
  onActionCompleted,
  onConfirmationRequested,
  pendingConfirmation,
  onConfirmPending,
  onUiAction,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [spokenResponse, setSpokenResponse] = useState("");
  const [isAgoraConnected, setIsAgoraConnected] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef("");
  const isSubmittingRef = useRef(false);
  const pendingConfirmationRef = useRef(pendingConfirmation);

  useEffect(() => {
    pendingConfirmationRef.current = pendingConfirmation;
  }, [pendingConfirmation]);

  // Initialize Speech Recognition once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setVoiceState("listening");
        };

        recognition.onresult = (event: any) => {
          let text = "";
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          if (text) {
            setTranscript(text);
            transcriptRef.current = text;
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition notice:", event.error);
          setVoiceState("idle");
        };

        recognition.onend = () => {
          const finalPrompt = transcriptRef.current.trim();
          if (finalPrompt.length > 0 && !isSubmittingRef.current) {
            handleVoiceSubmit(finalPrompt);
          } else {
            setVoiceState("idle");
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      recognitionRef.current?.abort();
      agoraClient.leaveChannel();
    };
  }, []);

  // Handle toggling microphone / Agora Voice Session
  const toggleListening = async () => {
    if (voiceState === "listening") {
      recognitionRef.current?.stop();
      setVoiceState("idle");
      return;
    }

    transcriptRef.current = "";
    setTranscript("");
    setSpokenResponse("");

    // Start Agora RTC session once
    if (!isAgoraConnected) {
      try {
        const sessionRes = await api.agora.startSession();
        if (sessionRes?.session) {
          const { appId, channelName, userToken, userUid } = sessionRes.session;
          await agoraClient.joinChannel(appId, channelName, userToken, userUid);
          setIsAgoraConnected(true);
        }
      } catch (err) {
        console.warn("Agora cloud session note:", err);
      }
    }

    // Start browser Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setVoiceState("listening");
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      }
    } else {
      // Fallback prompt for browsers without Web Speech API
      const simulatedPrompt = getRoleHeroPrompt(userRole);
      setTranscript(simulatedPrompt);
      handleVoiceSubmit(simulatedPrompt);
    }
  };

  const handleVoiceSubmit = async (queryText: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setVoiceState("thinking");

    try {
      const rawPending = pendingConfirmationRef.current;
      const unwrapPending = rawPending?.pendingAction || (rawPending?.toolName ? rawPending : null);
      const res = await api.voice.interact({
        transcript: queryText,
        confirmed: false,
        pendingAction: unwrapPending,
      });

      transcriptRef.current = "";
      setSpokenResponse(res.spokenText);

      // Handle voice UI navigation actions (100% voice operated)
      if (res.uiAction && onUiAction) {
        onUiAction(res.uiAction);
      }

      // Play audio response using Murf Falcon TTS or Web Speech
      playTTSAudio(res.spokenText, res.audioUrl, res.audioBase64);

      if (res.needsConfirmation) {
        if (onConfirmationRequested) {
          onConfirmationRequested(res.pendingAction || res);
        }
      } else {
        if (onConfirmationRequested) {
          onConfirmationRequested(null);
        }
        if (onActionCompleted) onActionCompleted();
      }
    } catch (err: any) {
      setSpokenResponse(`Error: ${err.message}`);
      setVoiceState("idle");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const playTTSAudio = (text: string, audioUrl?: string, audioBase64?: string) => {
    setVoiceState("speaking");

    if (audioUrl || audioBase64) {
      const src = audioUrl || `data:audio/mp3;base64,${audioBase64}`;
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = src;
      audioRef.current.onended = () => {
        setVoiceState("idle");
        if (isHandsFree) {
          setTimeout(() => startListening(), 400);
        }
      };
      audioRef.current.play().catch(() => playBrowserSpeech(text));
    } else {
      playBrowserSpeech(text);
    }
  };

  const playBrowserSpeech = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setVoiceState("idle");
        if (isHandsFree) {
          setTimeout(() => startListening(), 400);
        }
      };
      utterance.onerror = () => {
        setVoiceState("idle");
        if (isHandsFree) {
          setTimeout(() => startListening(), 400);
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setVoiceState("idle");
        if (isHandsFree) {
          setTimeout(() => startListening(), 400);
        }
      }, 3000);
    }
  };

  const startListening = () => {
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setVoiceState("listening");
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            setVoiceState("listening");
          } catch (err) {}
        }, 200);
      }
    }
  };

  // Quick Voice Prompts for Hackathon Judges
  const quickPrompts: Record<UserRole, { label: string; text: string; hero?: boolean }[]> = {
    admin: [
      {
        label: "👤 Provision New Employee",
        text: "Hire Priya as an HR Manager with email priya@onecorp.ai",
        hero: true,
      },
      {
        label: "📈 Company Pulse",
        text: "Give me a summary of my team and open GitHub issues.",
      },
      {
        label: "📧 Universal Email",
        text: "Send an email to board@onecorp.ai about Q4 sprint progress.",
      },
    ],
    hr: [
      {
        label: "📋 Daily Schedule Checklist",
        text: "What is my schedule for today?",
      },
      {
        label: "⭐ Voice Candidate Shortlisting (Top 3)",
        text: "Find the top 3 candidates for the Backend Engineer role.",
        hero: true,
      },
      {
        label: "📖 Company Leave Policy RAG",
        text: "What is our company annual leave and wellness policy at One Corp?",
      },
    ],
    engineering_manager: [
      {
        label: "⚡ Cross-Role Task Assignment (Hero Flow)",
        text: "Create a GitHub issue titled 'Fix payment webhook timeout', assign it to Rohan, and email him.",
        hero: true,
      },
      {
        label: "🔍 Team & Repo Visibility",
        text: "What open issues do we have in thecodephilic-guy/doc-assistant?",
      },
      {
        label: "📜 Sprint & On-Call Guidelines RAG",
        text: "What are the PR review SLAs and on-call rotation rules?",
      },
    ],
    software_engineer: [
      {
        label: "📥 Assigned Work Briefing",
        text: "What's assigned to me and what are the recent comments?",
        hero: true,
      },
      {
        label: "💬 Comment on Issue & Standup Email",
        text: "Comment on issue #1 that I found the root cause and PR is coming today, and email my manager a quick standup.",
        hero: true,
      },
      {
        label: "💰 Expense Reimbursement Policy RAG",
        text: "How much is our daily meal and travel reimbursement limit?",
      },
    ],
  };

  function getRoleHeroPrompt(role: UserRole): string {
    return quickPrompts[role].find((p) => p.hero)?.text || quickPrompts[role][0].text;
  }

  const roleStyles: Record<UserRole, { badge: string; glow: string; text: string }> = {
    admin: {
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      glow: "from-purple-600 via-indigo-600 to-blue-600",
      text: "Founder & Admin Mode",
    },
    hr: {
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      glow: "from-emerald-500 via-teal-600 to-cyan-600",
      text: "HR Talent Suite",
    },
    engineering_manager: {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      glow: "from-amber-500 via-orange-600 to-red-600",
      text: "Engineering Manager Hub",
    },
    software_engineer: {
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      glow: "from-cyan-500 via-blue-600 to-indigo-600",
      text: "Software Engineer Copilot",
    },
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${roleStyles[userRole].glow}`}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
        {/* Left: The Visual Voice Orb */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
            {/* Ripple Wave when Listening */}
            {voiceState === "listening" && (
              <div
                className={`absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-blue-400/50 animate-ripple`}
              />
            )}
            {/* Thinking Aurora Spin */}
            {voiceState === "thinking" && (
              <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-t-purple-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin" />
            )}

            {/* Glowing Orb Button */}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl group focus:outline-none ${
                voiceState === "listening"
                  ? "scale-110 bg-gradient-to-tr from-rose-500 to-red-600 shadow-red-500/50 ring-4 ring-red-400/30"
                  : voiceState === "thinking"
                  ? "bg-gradient-to-tr from-purple-600 to-indigo-600 animate-pulse shadow-purple-500/50"
                  : voiceState === "speaking"
                  ? "scale-105 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/50 ring-4 ring-cyan-400/30"
                  : "bg-gradient-to-tr from-indigo-700 via-purple-700 to-blue-600 hover:scale-105 shadow-indigo-500/30"
              }`}
            >
              {voiceState === "listening" ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 mt-1 uppercase tracking-wider">
                    Listening
                  </span>
                </div>
              ) : voiceState === "thinking" ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-spin" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 mt-1 uppercase tracking-wider">
                    Thinking
                  </span>
                </div>
              ) : voiceState === "speaking" ? (
                <div className="flex flex-col items-center">
                  <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-bounce" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 mt-1 uppercase tracking-wider">
                    Murf Voice
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] sm:text-[10px] font-medium text-white/80 mt-1">Tap to Speak</span>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-medium border bg-white/5 border-white/10 text-gray-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAgoraConnected ? "bg-emerald-400 animate-ping" : "bg-gray-400"
                }`}
              />
              {isAgoraConnected ? "Agora RTC Active" : "Murf Falcon Audio Ready"}
            </span>
          </div>
        </div>

        {/* Center / Right: Live Transcript & Voice Dialogue */}
        <div className="flex-1 w-full min-w-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border ${roleStyles[userRole].badge}`}
              >
                {roleStyles[userRole].text}
              </span>
              <span className="text-xs text-gray-400 truncate max-w-[200px]">
                <strong className="text-white">{userName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsHandsFree(!isHandsFree)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition ${
                  isHandsFree
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
                title="Continuous Hands-Free Mode: automatically listens after speaking"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isHandsFree ? "bg-emerald-400 animate-ping" : "bg-gray-500"}`} />
                <span>Hands-Free</span>
              </button>

              <span className="text-[11px] text-cyan-300 font-mono flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Gemini
              </span>
            </div>
          </div>

          {/* Transcript / Spoken Result Box */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 sm:p-4 min-h-[80px] flex flex-col justify-center break-words overflow-hidden">
            {transcript && (
              <div className="text-xs sm:text-sm text-cyan-300 mb-1 flex items-start gap-2 break-words">
                <Mic className="w-4 h-4 mt-0.5 text-cyan-400 shrink-0" />
                <span className="italic">"{transcript}"</span>
              </div>
            )}
            {spokenResponse ? (
              <div className="text-xs sm:text-sm text-gray-200 leading-relaxed flex items-start gap-2 break-words">
                <Volume2 className="w-4 h-4 mt-0.5 text-purple-400 shrink-0" />
                <div className="break-words overflow-hidden">{spokenResponse}</div>
              </div>
            ) : !transcript ? (
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Tap the glowing orb or select a prompt below to interact through natural hands-free voice.
                </span>
              </div>
            ) : null}
          </div>

          {/* Verbal Confirmation Pill (if action needs confirmation) */}
          {pendingConfirmation && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-pulse">
              <div className="text-xs text-amber-200">
                ⚠️ <strong>Voice Confirmation Required:</strong> Say "Yes", "Proceed", or click to confirm.
              </div>
              <button
                onClick={onConfirmPending}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold flex items-center justify-center gap-1 transition shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Action
              </button>
            </div>
          )}

          {/* 1-Click Interactive Voice Test Prompts for Hackathon Judges */}
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
              <span>Judge Quick-Test Prompts</span>
              <span className="text-gray-500 font-normal hidden sm:inline">(Click to test hands-free voice command)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {quickPrompts[userRole].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(p.text);
                    handleVoiceSubmit(p.text);
                  }}
                  className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                    p.hero
                      ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/50 text-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <Play className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
