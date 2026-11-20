# Live Reactive Dashboard & Server-Sent Events (SSE)

## Overview
Judges and employees can watch cards, task checklists, and issue boards react live as words are spoken, without needing manual page reloads.

## Event Subscription Lifecycle
1. When an employee logs in, the client initiates an HTTP `EventSource` connection to `/api/events?userId=${user.id}&companyId=${companyId}`.
2. The server keeps this connection open and pushes typed events.
3. Upon receiving an event, the dashboard immediately updates relevant sub-components and displays a rich glassmorphic notification toast.

## Handled Events
- `EMAIL_DISPATCHED`: Pops up a toast showing recipient, subject line, and email provider (Resend or Nodemailer).
- `ISSUE_CREATED`: Live prepends newly created GitHub tickets to the Engineering Manager and Software Engineer boards.
- `CANDIDATES_SHORTLISTED_LIVE`: Triggers celebratory confetti (`canvas-confetti`) and updates the HR candidate pipeline cards with "SHORTLISTED" badges.
- `EMPLOYEE_PROVISIONED`: Adds newly provisioned members to the Admin team list and logs an audit record.
- `SCHEDULE_UPDATED`: Toggles checkbox state in HR's daily action checklist.
- `FORM_FIELD_UPDATED`: Live populates inputs during the Hybrid Voice Company Onboarding interview.
- `DASHBOARD_REFRESH`: Triggers a background refetch of aggregated statistics.
