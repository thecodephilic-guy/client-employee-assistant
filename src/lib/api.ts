const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4040";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("apex_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("apex_token", token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("apex_token");
    localStorage.removeItem("apex_user");
  }
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("apex_user");
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("apex_user", JSON.stringify(user));
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Login failed");
      }
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setStoredUser(data.user);
      }
      return data;
    },
    switchRole: async (role: string) => {
      const res = await fetch(`${API_BASE}/api/auth/switch-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Role switch failed");
      }
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setStoredUser(data.user);
      }
      return data;
    },
    getMe: () => fetchWithAuth("/api/auth/me"),
    getDemoUsers: () => fetch(`${API_BASE}/api/auth/demo-users`).then((r) => r.json()),
  },

  dashboard: {
    getSummary: () => fetchWithAuth("/api/dashboard/summary"),
    toggleChecklist: (taskId: string) =>
      fetchWithAuth("/api/dashboard/checklist/toggle", {
        method: "POST",
        body: JSON.stringify({ taskId }),
      }),
    registerCompany: (payload: any) =>
      fetch(`${API_BASE}/api/dashboard/onboard/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
  },

  voice: {
    interact: (data: { transcript?: string; confirmed?: boolean; pendingAction?: any }) =>
      fetchWithAuth("/api/voice/interact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onboard: (data: { transcript?: string; confirmed?: boolean; pendingAction?: any }) =>
      fetch(`${API_BASE}/api/voice/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },

  agora: {
    startSession: (channelName?: string) =>
      fetchWithAuth("/api/agora/session/start", {
        method: "POST",
        body: JSON.stringify({ channelName }),
      }),
    stopSession: (channelName: string) =>
      fetchWithAuth("/api/agora/session/stop", {
        method: "POST",
        body: JSON.stringify({ channelName }),
      }),
  },
};
