export type UserRole = "admin" | "hr" | "engineering_manager" | "software_engineer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
  githubUsername?: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  founderName: string;
  founderEmail: string;
  githubRepo?: string;
}

export interface JobApplicant {
  id: string;
  name: string;
  email: string;
  roleApplied: string;
  status: "NEW" | "REVIEWING" | "SHORTLISTED" | "INTERVIEWED" | "OFFERED" | "REJECTED";
  resumeSummary: string;
  skills: string;
  experienceYears: number;
  score: number;
  matchReasons: string;
  createdAt: string;
}

export interface IssueComment {
  id: string;
  issueId: string;
  authorId?: string;
  authorName: string;
  commentBody: string;
  isSyncedToGithub: boolean;
  createdAt: string;
}

export interface GithubIssue {
  id: string;
  issueNumber: number;
  title: string;
  body: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string;
  assigneeName: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
  comments?: IssueComment[];
}

export interface DailySchedule {
  id: string;
  userId: string;
  title: string;
  timeSlot: string;
  isCompleted: boolean;
  date: string;
}

export interface CompanyDocument {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  toolName?: string;
  createdAt: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  isPrivate: boolean;
  openIssuesCount: number;
  language?: string;
  updatedAt?: string;
}

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";
