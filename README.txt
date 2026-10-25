# VoxShield Web Prototype (V2 Enhanced Dashboard)
Cyber Scam Safety, Digital-Arrest Prevention & Pressure Tactic Detection Prototype

## Exact Steps to Run on Windows
1. Double-click `index.html` to open it directly in Google Chrome or Microsoft Edge.
   - Alternatively, right-click `index.html` -> Open with -> Google Chrome (or Microsoft Edge).
   - Or run a lightweight local server if preferred:
     In PowerShell: `python -m http.server 8000` or `npx serve`
     Then open http://localhost:8000 in your browser.
2. No build tools, external databases, or paid API keys are required.

## Key Modules & Completed Features

### 1. Main Dashboard & Senior-Friendly UI
- Clear high-contrast cybersecurity typography (Space Grotesk + DM Sans) accessible for senior citizens and non-technical users.
- Distinct color-coded status badges: High Risk (Red), Caution (Amber), Lower Risk (Cyan), Waiting (Neutral).
- Fully responsive layout for desktop, tablets, and mobile devices.
- Subtle animations that never block user interaction.

### 2. Voice & Message Input (Microphone Speech-to-Text)
- Working Web Speech API speech-to-text with English (India: en-IN), English (US: en-US), and Hindi (hi-IN) language selection.
- All 7 discrete states visually represented: Ready, Requesting permission, Listening, Speech detected, Processing, Transcript received, and Error.
- Real-time live transcript that remains fully editable in the message area.
- Non-destructive text appending: voice transcripts safely append to user notes without silent overwriting.
- Manual typing and paste fallback available at all times.
- Explicit Voice-Clone status: "Not Connected (Demo Only)". The prototype analyzes text context and pressure cues; it does not claim to detect cloned voices acoustically without a specialized deepfake neural model.

### 3. Scam Risk Analysis Heuristic
- Detects key fraud patterns:
  1. Urgent demands for money or immediate transfers (UPI, NEFT, wire, crypto).
  2. Threats of arrest or digital arrest (CBI, ED, Cyber Crime, non-bailable warrants).
  3. Requests for OTPs, PINs, passwords, CVVs, or MPINs.
  4. Impersonation of police, customs, court judges, banks, or relatives.
  5. Secrecy and isolation demands ("do not tell anyone", "close your room door").
  6. Remote-access app coercion (AnyDesk, TeamViewer, QuickSupport, unknown APKs).
  7. Manufactured urgency and panic ("within 10 minutes", "final warning").
  8. Family emergency impersonation ("accident", "bail money", "kidnapped").
- Multi-signal protection rule: single isolated keywords alone are capped at <= 35 points (does not falsely declare high-risk scams on one cue).
- Explainable signals view shows exact matching phrases and point contributions.

### 4. User Safety Action Protocol
- Prominent action protocol detailing standardized fraud response:
  - 🛑 Pause before transferring funds.
  - 🔒 Never share OTPs, PINs, or CVVs.
  - 📞 Hang up and call back using an independently verified number.
  - 👥 Consult trusted family members or friends.
  - 📱 Never install remote-access apps (AnyDesk/TeamViewer).
  - 📝 Preserve evidence and report to Cyber Crime Helpline (1930 / cybercrime.gov.in).

### 5. Payment Safety Cooldown (Simulated Circuit Breaker)
- 5-minute countdown timer (`05:00`).
- Controls: Start, Pause, Resume, and Reset.
- Safe lifecycle management: timers cleaned up on reset; never counts below 00:00.
- Explicit notice: Simulated reminder only. Does not lock UPI/banking apps or freeze accounts.

### 6. Trusted-Contact Alert Preview
- Customize contact name and optional phone number.
- Privacy-first phone masking: Phone numbers are masked in the UI (e.g. `+91 ••••• ••3210`) to prevent credential leakage.
- Generates safety message with risk category, short reason, and recommended actions.
- Copy button with visible "✓ Copied alert text!" feedback.
- Simulation only: no actual SMS or WhatsApp is dispatched without manual user authorization.

### 7. Session Activity History
- Records scans conducted during the current browsing session.
- Session-only memory storage: automatically cleared when the browser tab closes.
- Displays scan time, text preview snippet, risk score, and signal counts.
- Click-to-reload: clicking any past scan item reloads that scenario and its findings.
- "Clear session history" button to wipe session logs immediately.

## Prototype Scope & Limitations
- This is an educational front-end demonstration prototype for hackathons. It does not monitor live cellular phone calls.
- Voice-Clone AI forensics is labeled as "Demo only / Not connected" as it evaluates linguistic text patterns, not raw voice acoustics.
- The 5-minute countdown is a psychological circuit-breaker to stop panic payments; it does not lock banking or UPI applications.
- Alerts are simulated preview messages designed for manual sharing; no automated SMS or emergency dispatch is initiated.
