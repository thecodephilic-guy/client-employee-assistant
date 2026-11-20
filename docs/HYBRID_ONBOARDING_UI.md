# Hybrid Voice Company Onboarding Flow

## Purpose
The Standout Demo Flow demonstrates how voice-first AI and traditional web forms can work together in harmony.

## User Experience Flow
1. **Initiate Voice Interview**:
   - The founder clicks "Voice Onboarding" in the navigation bar.
   - The AI Assistant greets the founder verbally and explains:
     *"Hi Founder! I will set up your company workspace. Speak your Company Name, your Name, Email, and GitHub Repository."*

2. **Live Voice Form Filling**:
   - As the founder speaks:
     *"Our company is Apex Technologies, founder is Alex Rivera, email alex@apextech.ai, and GitHub repo is apex-technologies/core-platform."*
   - The voice agent extracts the entity fields and dispatches real-time `FORM_FIELD_UPDATED` SSE events.
   - The form inputs highlight and update live on screen as words are spoken.

3. **Keyboard Fallback for Sensitive Strings**:
   - For complex tokens or passwords that are difficult or unsafe to dictate aloud (such as GitHub Personal Access Tokens and admin passwords), the founder can type or edit directly into the form inputs at any time.

4. **Verbal Finalization**:
   - The founder can say:
     *"Looks good, create the workspace."*
   - The AI confirms, creates the company in the PostgreSQL database, registers the founder user, triggers celebratory confetti, and loads the active workspace dashboard.
