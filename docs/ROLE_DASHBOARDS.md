# Role Dashboards & Perspectives

## 1. Admin (Founder) Dashboard
- **Component**: `AdminDashboard.tsx`
- **Key Features**:
  - Pulse metrics: Team headcount, open issues count, RBAC status, database synchronization.
  - Team roster with provisioned roles and titles.
  - Live security audit trail recording all tool calls and permission events.
  - "Add Employee" modal and voice provisioning.

## 2. HR Manager Dashboard
- **Component**: `HRDashboard.tsx`
- **Key Features**:
  - Daily Action Checklist: Time-slotted schedule items with interactive checkbox toggles and progress indicator.
  - Candidate Pipeline Suite: Top 3 candidate cards for Backend Engineer with match scores (96%, 93%, 89%), skill chips, resume summaries, and real interview invite dispatch.

## 3. Engineering Manager Dashboard
- **Component**: `EMDashboard.tsx`
- **Key Features**:
  - Cross-Role Hero Flow banner: Creates GitHub issue, assigns to Rohan, and dispatches an authentic email notification.
  - Repository issues board displaying issue numbers, titles, priorities, assignees, and comment counts.
  - Manual ticket creation fallback.

## 4. Software Engineer Dashboard
- **Component**: `SWEDashboard.tsx`
- **Key Features**:
  - My Assigned Work Briefing: Lists all tickets assigned to the logged-in engineer (including tickets newly created by the Engineering Manager 30 seconds earlier).
  - Discussion Comments Thread: Shows recent comments and conversation context.
  - Hands-Free Status Update: Posts comment to GitHub issue and emails standup summary to manager Marcus.

## 5. Judge 1-Click Role Switcher
Located in the navbar and on the login page (`/login`), judges can effortlessly switch between all 4 employee roles in one click to evaluate RBAC isolation and cross-role workflows in real-time.
