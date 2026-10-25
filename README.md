# VoxShield — Futuristic AI Security Command Center

> **"Your Voice. Your Safety. Our Shield."**  
> *Recognize suspicious communication, understand risk signals, and pause before taking potentially dangerous actions.*

**VoxShield** is a polished, beginner-friendly, privacy-focused cybersecurity hackathon prototype designed to protect users and senior citizens from digital-arrest pressure tactics, authority impersonation, and fraudulent payment demands before financial loss occurs.

---

## 1. Futuristic AI Shield Interface & Design

VoxShield features a **Sci-Fi AI Security Command Center** visual theme:
- **Atmospheric Palette**: Deep midnight navy and near-black backgrounds (`#030712`, `#060d1a`, `#0a1329`) with dynamic cyber ambient lighting.
- **Glowing Holographic Accents**: Electric violet (`#8b5cf6`), glowing neon cyan (`#00f0ff`), and cyber blue (`#38bdf8`).
- **Glassmorphic Command Panels**: Multi-layered panels with subtle transparency, backdrop blur (`backdrop-filter: blur(16px)`), fine glowing borders, and inner edge reflections.
- **Holographic Shield Centerpiece**: An interactive sci-fi holographic shield featuring dual rotating orbital telemetry rings, an animated SVG geometric aegis core, cyber coordinate nodes, and an active defense status badge (`SYS.DEFENSE // AI SHIELD ACTIVE`).
- **Active Audio Waveform Visualizer**: A 16-bar responsive equalizer that animates dynamically **only when the microphone is listening**, providing real-time visual feedback for voice capture.
- **Futuristic Circular Risk Meter**: A sleek conic-gradient dial with neon glow, digital telemetry score readout (`/ 100`), and real-time risk category classification (`Lower risk`, `Caution`, `High risk`).

---

## 2. Core Functional Features

- **Live Voice Speech-to-Text**: Built on the native Web Speech API, allowing users to speak suspicious call statements directly into the app with continuous streaming and support for English (`en-IN`, `en-US`) and Hindi (`hi-IN`).
- **Explainable Multi-Signal Risk Engine**: Transparently evaluates messages against 8 heuristic fraud categories (Digital arrest, Authority impersonation, Urgent demands, OTP/Credential theft, Secrecy demands, Remote access apps, Suspicious accounts, and Family emergencies). Flags exact matching cues and point contributions rather than producing an unexplainable black-box score.
- **Multi-Signal Protection Policy**: Avoids false positives on single isolated keywords (capped at $\le 35$ points) to prevent benign daily messages from being misclassified as fraud.
- **Judge & Evaluator Quick-Demo Bar**: 1-click test scenarios covering Digital Arrest, Bank OTP/PIN theft, AnyDesk remote-access coercion, and safe clinic appointment reminders.
- **Payment Circuit Breaker (Safety Cooldown)**: A working 5-minute countdown timer (`05:00`) that encourages users to pause, disconnect from caller panic, and verify claims independently.
- **Trusted-Contact Alert with Phone Masking**: Previews a concise verification message to send to a family member or trusted friend, automatically masking phone numbers (e.g. `+91 ••••• ••1234`) to safeguard privacy.
- **Session Activity History**: Tracks recent analyses in memory during the browsing session, allowing users to click and reload past scans or clear history instantly.
- **Standardized Safety Protocol**: Actionable cards outlining clear response rules (Pause, Never share OTPs, Hang up and verify, Consult family, Never install remote apps, Report to 1930 / cybercrime.gov.in).

---

## 3. Technologies Used

- **User Interface**: Semantic HTML5, CSS3 (Futuristic sci-fi cybersecurity theme, glassmorphism, responsive CSS Grid, accessible contrast).
- **Client Logic**: Vanilla JavaScript (ES6+), zero external runtime dependencies, zero frameworks, zero paid APIs.
- **Speech Processing**: Native Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- **Privacy & Storage**: Client-side memory and `sessionStorage`. Zero raw audio recording or external telemetry.
- **Testing Engine**: Node.js test suites ([`thorough_verification_pass.js`](file:///c:/Users/DDell/Downloads/VoxShield_Web_Prototype_V2/thorough_verification_pass.js), [`test_suite.js`](file:///c:/Users/DDell/Downloads/VoxShield_Web_Prototype_V2/test_suite.js)) and Google Chrome Headless.

---

## 4. Windows Setup & Run Instructions

No build steps, node package installations, or environment variables are required.

### Quick Start (Double-Click)
1. In Windows File Explorer, navigate to:
   `c:\Users\DDell\Downloads\VoxShield_Web_Prototype_V2`
2. **Double-click `index.html`**.
   - It will open immediately in your default web browser (**Google Chrome** or **Microsoft Edge** recommended for Speech-to-Text).

### Alternative: Local HTTP Server (PowerShell / Command Prompt)
If you prefer testing through `localhost`:
```powershell
# Open PowerShell in the project directory:
cd "c:\Users\DDell\Downloads\VoxShield_Web_Prototype_V2"

# Start lightweight Python web server:
python -m http.server 8000

# Open in browser:
# Navigate to http://localhost:8000
```

### Running Automated Test Verification
To verify code syntax, DOM structure, and all 7 test suites:
```powershell
node thorough_verification_pass.js
```

---

## 5. How to Test the Application

### Testing the Microphone (Speech-to-Text)
1. Select your desired speech language in the dropdown (`English (India)`, `English (US)`, or `हिन्दी (Hindi)`).
2. Click **🎙 Start listening** and grant browser microphone permission if prompted.
3. Observe the real-time status card transition and the **audio waveform visualizer** activating:
   - `Ready` $\rightarrow$ `Requesting permission` $\rightarrow$ `Listening` (waveform active) $\rightarrow$ `Speech detected` $\rightarrow$ `Transcript received`.
4. Recognized words will stream into the live transcript text area.
5. Notes you have already typed will **not** be deleted; voice transcripts cleanly append to your existing text.
6. Click **⏹ Stop listening**, then click **Analyze risk →**.

### Testing Demo Mode (Without Microphone)
Judges and evaluators can test the complete workflow even in noisy rooms or environments without microphone access:
1. Under **01 / SCAM CHECK**, locate the **Demo Mode for Judges** buttons:
   - **Scam: Digital arrest (High)**: Loads a digital arrest threat (CBI, non-bailable warrant, immediate transfer, secrecy demand).
   - **Scam: Bank & OTP (Caution)**: Loads an urgent credit card block notice demanding an OTP and PIN.
   - **Scam: AnyDesk app (Caution)**: Loads a tech-support pretext coercing the user to install AnyDesk and share a 9-digit code.
   - **Safe: Clinic reminder (Low)**: Loads a routine doctor appointment confirmation.
2. Click **Analyze risk →** to view the score, risk pill, meter, explainable signals, and recommended safety actions.
3. Test the **Start 5-minute cooldown** button: click to Start, click to Pause, click to Resume, and click Reset.
4. Enter a contact name and phone number in **04 / TRUSTED CONTACT**, click **Preview trusted-contact alert**, verify the masked phone number, and click **Copy alert text**.
5. Scroll down to **05 / SESSION ACTIVITY HISTORY** to inspect your logged scans, or click **Clear session history** to reset.

---

## 6. Privacy Considerations

- **Zero Audio Storage**: VoxShield **never** records, saves to disk, or uploads raw microphone audio.
- **Client-Side Execution**: All risk rule matching and scoring algorithms execute strictly in browser memory.
- **Phone Number Privacy Masking**: Any phone number entered in the trusted contact preview is masked (e.g. `+91 ••••• ••1234`) to prevent credential leakage.
- **No Background Telemetry**: Zero analytics trackers, cookies, or third-party tracking scripts.
- **Web Speech Processing Notice**: In Chrome and Edge, the browser's built-in Web Speech API connects securely to Google/Microsoft speech servers for conversion. Manual typing is available as an offline fallback.

---

## 7. Actual Limitations & What Is Not Implemented

To ensure academic, technical, and regulatory integrity, the following boundaries are stated:
1. **Voice-Clone Deepfake Detection Is Demo Only**: This prototype evaluates conversational pressure tactics, urgency markers, and authority impersonation in text. It **does not** contain a raw acoustic audio-forensics deepfake model and cannot verify whether a voice is synthetic or cloned from audio frequencies alone.
2. **Payment Application Locking Is Simulated**: The 5-minute countdown is an educational psychological circuit-breaker. Modern web browser sandboxes cannot freeze bank accounts, halt ACH/NEFT/RTGS transfers, or lock native UPI apps (Google Pay, PhonePe, Paytm).
3. **No Automated Telecom Dispatch**: The trusted-contact alert is a client-side clipboard preview. No cellular SMS, WhatsApp packets, or emergency calls are dispatched over telecom networks without user manual action.
4. **No Live Cellular Call Interception**: Standard web browsers have no technical access to tap or monitor incoming cellular telephone calls.
5. **Heuristic Warning, Not Guaranteed Forensic Verdict**: The scoring heuristic evaluates common behavioral patterns. It is not a certified fraud-prevention engine or guarantee that an unflagged message is authentic.
