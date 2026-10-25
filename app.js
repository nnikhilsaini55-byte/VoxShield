// VoxShield — Cyber Scam & Pressure Tactic Safety Layer
// Prototype Cybersecurity Dashboard for Hackathon Demonstration
// Client-side execution. Zero raw audio or sensitive data is uploaded or persisted.

const $ = id => document.getElementById(id);

// Safe and realistic test scenario samples
const sampleScenarios = {
  digitalArrest: "I am calling from the police department and cyber crime branch. Your Aadhaar card and bank account are linked to a criminal money laundering case. A non-bailable arrest warrant has been issued against you. Do not tell your family, stay on this call, and keep your door closed. To avoid immediate arrest, verify your OTP and transfer the money to our clearance account right now.",
  bankOtp: "Dear customer, this is an urgent notification from your bank's fraud prevention department. A suspicious transaction of Rs 48,500 was initiated from your credit card. To block this unauthorized payment, please share your OTP and 4-digit card PIN with our verification officer immediately.",
  remoteApp: "Hello, I am calling from technical support regarding your internet router and SIM card security. Your connection has been flagged for illegal activity. Please open your phone, download the AnyDesk application immediately, and read me the 9-digit remote access code so we can secure your device.",
  safeClinic: "Hi, this is a reminder from City Health Clinic about your dental checkup tomorrow at 4:00 PM. Please reply YES to confirm or call our clinic desk at 011-23456789 if you need to reschedule. Thank you and have a wonderful day!"
};

// Comprehensive scam pattern definitions (Supports English and common Indian cyber-scam/Hinglish terms)
const rules = [
  {
    name: "Authority impersonation",
    points: 22,
    words: [
      "police", "government officer", "department", "court", "customs",
      "bank officer", "bank manager", "bank", "cbi", "rbi", "cyber crime", "trai", "ed",
      "enforcement directorate", "thana", "police officer", "supreme court",
      "narcotics bureau", "courier service", "fedex", "dhl", "income tax", "cyber cell"
    ]
  },
  {
    name: "Threat or digital-arrest language",
    points: 24,
    words: [
      "arrest", "digital arrest", "under digital arrest", "criminal case", "warrant", "jail",
      "legal action", "crime case", "giraftar", "fir", "non-bailable",
      "custody", "police custody", "interrogation", "under arrest", "detained", "court order"
    ]
  },
  {
    name: "Urgent payment request",
    points: 24,
    words: [
      "transfer the money", "transfer money", "send money", "send the money", "pay immediately", "immediate payment",
      "pay now", "upi", "payment now", "deposit money", "paisa bhejo", "transfer karo",
      "penalty fee", "clear funds", "bank transfer", "wire money", "rtgs", "neft", "crypto", "pay money"
    ]
  },
  {
    name: "OTP / credential request",
    points: 25,
    words: [
      "otp", "pin", "password", "cvv", "verification code",
      "share your code", "share your otp", "share otp", "otp batao", "security code", "mpin", "card details", "banking password"
    ]
  },
  {
    name: "Secrecy & isolation pressure",
    points: 18,
    words: [
      "do not tell", "don't tell", "keep this secret", "do not inform",
      "stay on the call", "tell anyone", "kisi ko mat batana", "door close",
      "room band", "do not disconnect", "isolate yourself", "secret investigation"
    ]
  },
  {
    name: "Remote-access app coercion",
    points: 24,
    words: [
      "anydesk", "teamviewer", "quicksupport", "rustdesk", "screen share",
      "install this app", "install a remote access app", "install remote access", "download app", "apk", "remote access", "open link",
      "click on the link", "scan this qr", "qr code", "apk file", "install software"
    ]
  },
  {
    name: "Manufactured panic & urgency",
    points: 14,
    words: [
      "immediately", "urgent", "right now", "emergency", "final warning",
      "avoid arrest", "account blocked", "will be blocked", "blocked", "jaldi karo", "last warning", "within 10 minutes"
    ]
  },
  {
    name: "Family emergency impersonation",
    points: 18,
    words: [
      "accident", "your son", "your daughter", "family member",
      "hospital emergency", "kidnapped", "hospitalized", "bail money", "grandson"
    ]
  }
];

// Assessment state
let latestRisk = 0;
let latestSignals = [];
let hasAnalyzed = false;
let sessionScans = [];

// Cooldown state
let countdown = null;
let remaining = 300;
let isTimerRunning = false;

// HTML escaping helper
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// Word-boundary matching for short acronyms/words to avoid substring false positives
// (e.g. prevents "confirm" matching "fir", "reschedule" matching "ed", "spinning" matching "pin")
function matchKeyword(text, keyword) {
  if (!keyword.includes(" ")) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("(?:^|[^a-zA-Z0-9])" + escaped + "(?:[^a-zA-Z0-9]|$)", "i");
    return regex.test(text);
  }
  return text.includes(keyword);
}

// Phone number privacy masking helper (e.g. +91 98765 43210 -> +91 ••••• ••3210)
function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return "";
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return "••••";
  const lastFour = cleaned.slice(-4);
  const prefix = cleaned.length > 7 ? cleaned.slice(0, 3) + " " : "";
  return `${prefix}••••• ••${lastFour}`;
}

// ----------------------------------------------------
// FEATURE 1 & 2: Sample Loading & Input Validation
// ----------------------------------------------------
if ($("sampleBtn")) {
  $("sampleBtn").addEventListener("click", () => {
    $("message").value = sampleScenarios.digitalArrest;
    $("message").focus();
    $("message").style.borderColor = "";
  });
}

if ($("sampleBankBtn")) {
  $("sampleBankBtn").addEventListener("click", () => {
    $("message").value = sampleScenarios.bankOtp;
    $("message").focus();
    $("message").style.borderColor = "";
  });
}

if ($("sampleRemoteBtn")) {
  $("sampleRemoteBtn").addEventListener("click", () => {
    $("message").value = sampleScenarios.remoteApp;
    $("message").focus();
    $("message").style.borderColor = "";
  });
}

if ($("safeSampleBtn")) {
  $("safeSampleBtn").addEventListener("click", () => {
    $("message").value = sampleScenarios.safeClinic;
    $("message").focus();
    $("message").style.borderColor = "";
  });
}

if ($("clearBtn")) {
  $("clearBtn").addEventListener("click", () => {
    $("message").value = "";
    $("message").placeholder = "Example: I am calling from the police department. Your Aadhaar is linked to a criminal case. Do not tell anyone. Transfer the money immediately...";
    $("message").style.borderColor = "";
    resetAnalysisResults();
  });
}

function resetAnalysisResults() {
  hasAnalyzed = false;
  latestRisk = 0;
  latestSignals = [];
  $("score").textContent = "—";
  $("scoreRing").style.background = "conic-gradient(var(--cyan) 0deg, #20364b 0deg)";
  $("meterFill").style.width = "0%";
  $("statusPill").textContent = "Waiting";
  $("statusPill").className = "pill neutral";
  $("statusPill").style.color = "";
  $("statusPill").style.borderColor = "";
  $("riskTitle").textContent = "Ready to check";
  $("riskSummary").textContent = "Analyze a message or speak into the microphone to see risk indicators found.";
  $("signals").innerHTML = '<div class="empty">No analysis performed yet. Click a sample or enter a transcript above.</div>';
  $("disclaimer").textContent = "Risk score is an educational prototype heuristic based on known pressure tactics. It is not a legally binding guarantee or forensic verdict.";
}

// ----------------------------------------------------
// FEATURE 3 & 4: Scam Risk Analysis & User Safety Actions
// ----------------------------------------------------
$("analyzeBtn").addEventListener("click", () => {
  const text = $("message").value.trim().toLowerCase();
  if (!text) {
    $("message").focus();
    $("message").style.borderColor = "var(--orange)";
    $("riskTitle").textContent = "Input needed";
    $("riskSummary").textContent = "Please type, paste, or speak a transcript before analyzing.";
    return;
  }
  $("message").style.borderColor = "";

  // Brief loading feedback for user responsiveness
  const originalBtnText = $("analyzeBtn").innerHTML;
  $("analyzeBtn").innerHTML = `<span>⏳ Analyzing pressure cues...</span>`;
  $("analyzeBtn").disabled = true;

  setTimeout(() => {
    performAnalysis(text);
    $("analyzeBtn").innerHTML = originalBtnText;
    $("analyzeBtn").disabled = false;
  }, 260);
});

function performAnalysis(text) {
  const found = [];
  for (const r of rules) {
    const hits = r.words.filter(w => matchKeyword(text, w));
    if (hits.length) {
      found.push({ ...r, hits });
    }
  }

  // Multi-signal heuristic scoring:
  // Do not rely on one isolated keyword to declare a scam
  let score = 0;
  if (found.length === 0) {
    score = 8;
  } else if (found.length === 1) {
    // Single isolated pattern is capped at 35 (Caution/Low)
    score = Math.min(found[0].points, 35);
  } else {
    // Multiple converging tactics indicate high probability of fraud
    score = Math.min(98, found.reduce((sum, r) => sum + r.points, 0));
  }

  latestRisk = score;
  latestSignals = found;
  hasAnalyzed = true;

  $("score").textContent = score;
  const color = score >= 65 ? "#ff6b7a" : score >= 35 ? "#ffbf69" : "#55e6d0";
  $("scoreRing").style.background = `conic-gradient(${color} ${score * 3.6}deg, #20364b 0deg)`;
  $("meterFill").style.width = score + "%";
  $("meterFill").style.background = color;

  const pillText = score >= 65 ? "High risk" : score >= 35 ? "Caution" : "Lower risk";
  $("statusPill").textContent = pillText;
  $("statusPill").className = "pill " + (score >= 65 ? "danger" : score >= 35 ? "warn" : "success");
  $("statusPill").style.color = color;
  $("statusPill").style.borderColor = color;

  if (score >= 65) {
    $("riskTitle").textContent = "High risk pressure tactics detected";
    $("riskSummary").textContent = "Immediate stop: Multiple converging coercion cues detected (e.g. impersonation + arrest threats + payment urgency). Do not send money or share codes.";
    $("cooldownState").textContent = "Recommended: Pause before payment";
    $("cooldownText").textContent = "High-risk request detected. Use the safety cooldown to break caller pressure.";
  } else if (score >= 35) {
    if (found.length === 1) {
      $("riskTitle").textContent = "Isolated suspicious cue found";
      $("riskSummary").textContent = `Only one pattern matched (${found[0].name}). Single keywords alone do not confirm a scam. Verify the caller independently before taking action.`;
    } else {
      $("riskTitle").textContent = "Suspicious signals detected";
      $("riskSummary").textContent = "Caution: Multiple suspicious indicators were flagged. Verify caller claims using independent official channels.";
    }
  } else {
    $("riskTitle").textContent = "Fewer scam signals found";
    $("riskSummary").textContent = "No standard pressure keywords matched. Note: This warning check is a heuristic heuristic, not a guarantee that the message is authentic.";
  }

  // Render explainable signals
  if (found.length) {
    $("signals").innerHTML = found.map(s => `
      <div class="signal">
        <span class="symbol">⚠</span>
        <div>
          <b>${escapeHtml(s.name)} (+${s.points})</b>
          <span>Matched cues: ${s.hits.map(escapeHtml).join(", ")}</span>
        </div>
      </div>
    `).join("");
  } else {
    $("signals").innerHTML = '<div class="empty">No known pressure phrases matched. Scammers continuously adapt, so always verify through a trusted contact.</div>';
  }

  $("disclaimer").textContent = "Educational prototype heuristic based on known pressure tactics. Not a validated forensic verdict or voice-clone test.";

  // Record this scan in the session history (Feature 7)
  addHistoryEntry($("message").value, score, pillText, color, found.length);
}

// ----------------------------------------------------
// FEATURE 5: Payment Safety Cooldown Timer
// ----------------------------------------------------
function renderTimer() {
  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  $("timer").textContent = `${m}:${s}`;
}

$("startCooldown").addEventListener("click", () => {
  if (isTimerRunning) {
    // Pause cooldown
    clearInterval(countdown);
    countdown = null;
    isTimerRunning = false;
    $("startCooldown").textContent = "Resume cooldown";
    $("cooldownState").textContent = "Cooldown paused";
    $("cooldownText").textContent = "Timer paused. Take time to breathe and verify caller claims.";
    return;
  }

  // If timer had finished (remaining <= 0), reset to 5 minutes before starting
  if (remaining <= 0) {
    remaining = 300;
  }

  // Clear any existing timer to prevent duplicate runaway intervals
  if (countdown) {
    clearInterval(countdown);
    countdown = null;
  }

  isTimerRunning = true;
  $("startCooldown").textContent = "Pause cooldown";
  $("cooldownState").textContent = "Cooldown in progress";
  $("cooldownText").textContent = "Take a 5-minute pause. Call back using a known number to verify.";

  countdown = setInterval(() => {
    remaining--;
    renderTimer();
    if (remaining <= 0) {
      clearInterval(countdown);
      countdown = null;
      isTimerRunning = false;
      remaining = 0;
      renderTimer();
      $("startCooldown").textContent = "Start 5-minute cooldown";
      $("cooldownState").textContent = "Cooldown complete";
      $("cooldownText").textContent = "Safety window complete. Did you independently verify with official authorities?";
    }
  }, 1000);
});

$("resetCooldown").addEventListener("click", () => {
  if (countdown) clearInterval(countdown);
  countdown = null;
  isTimerRunning = false;
  remaining = 300;
  renderTimer();
  $("startCooldown").textContent = "Start 5-minute cooldown";
  $("cooldownState").textContent = "Cooldown not started";
  $("cooldownText").textContent = "This simulated timer does not lock banking or UPI applications.";
});

renderTimer();

// ----------------------------------------------------
// FEATURE 6: Trusted Contact Alert (With Phone Masking)
// ----------------------------------------------------
async function copyToClipboard(text, btnElement) {
  let success = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (e) {
      success = false;
    }
  }

  if (!success) {
    // Fallback using textarea execCommand
    try {
      const tempArea = document.createElement("textarea");
      tempArea.value = text;
      tempArea.style.position = "fixed";
      tempArea.style.left = "-9999px";
      document.body.appendChild(tempArea);
      tempArea.focus();
      tempArea.select();
      success = document.execCommand("copy");
      document.body.removeChild(tempArea);
    } catch (err) {
      success = false;
    }
  }

  if (success && btnElement) {
    const originalText = btnElement.textContent;
    btnElement.textContent = "✓ Copied alert text!";
    setTimeout(() => { btnElement.textContent = originalText; }, 2400);
  } else if (btnElement) {
    btnElement.textContent = "Please select & copy above";
  }
}

$("alertBtn").addEventListener("click", () => {
  const name = $("contactName").value.trim() || "Family Contact";
  const rawPhone = $("contactPhone") ? $("contactPhone").value.trim() : "";
  const method = $("contactMethod").value;

  // Accurate risk assessment status display
  let riskAssessmentLabel = "UNASSESSED (no message analyzed yet)";
  let shortReason = "Verification needed before making any payment.";
  if (hasAnalyzed) {
    if (latestRisk >= 65) {
      riskAssessmentLabel = "HIGH RISK (Urgent pressure tactics detected)";
      shortReason = `The message contained ${latestSignals.length} high-pressure indicators (e.g. ${latestSignals.map(s => s.name).slice(0, 2).join(", ")}).`;
    } else if (latestRisk >= 35) {
      riskAssessmentLabel = "MEDIUM RISK / CAUTION (Suspicious cues detected)";
      shortReason = `The message contained suspicious indicators (${latestSignals.map(s => s.name).slice(0, 2).join(", ")}).`;
    } else {
      riskAssessmentLabel = "LOWER RISK (Fewer scam signals, verify anyway)";
      shortReason = "No common pressure keywords matched, but independent confirmation is still recommended.";
    }
  }

  const maskedPhone = rawPhone ? maskPhoneNumber(rawPhone) : "";
  const phoneBadge = maskedPhone ? `<span class="masked-phone-badge">Target: ${escapeHtml(maskedPhone)}</span>` : "";

  const alertMessage = `Hi ${name}, VoxShield safety alert: A suspicious call/message was checked on my device. Risk status: ${riskAssessmentLabel}. Reason: ${shortReason} Recommended action: Please call me directly on my known personal number to help verify before I transfer money or share codes. (Prototype safety preview, not an emergency dispatch).`;

  $("alertPreview").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <strong>${escapeHtml(method)} · Preview only</strong>
      ${phoneBadge}
    </div>
    <p style="margin-top:10px;font-size:13px;line-height:1.6">${escapeHtml(alertMessage)}</p>
    <button type="button" class="btn secondary btn-sm" id="copyAlert" style="margin-top:12px">📋 Copy alert text</button>
  `;

  const copyBtn = $("copyAlert");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyToClipboard(alertMessage, copyBtn);
    });
  }
});

// ----------------------------------------------------
// FEATURE 7: Session Activity History
// ----------------------------------------------------
function addHistoryEntry(fullText, score, category, color, signalCount) {
  const entry = {
    id: "scan_" + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    snippet: fullText.trim().slice(0, 70) + (fullText.trim().length > 70 ? "…" : ""),
    score: score,
    category: category,
    color: color,
    signalCount: signalCount,
    fullText: fullText
  };

  sessionScans.unshift(entry);
  if (sessionScans.length > 8) sessionScans.pop();

  renderHistory();
}

function renderHistory() {
  const container = $("historyList");
  if (!container) return;

  if (sessionScans.length === 0) {
    container.innerHTML = `
      <div class="history-empty" id="historyEmpty">
        <div class="icon">📋</div>
        No messages analyzed yet in this session. Analyze a message above to start tracking history.
      </div>
    `;
    return;
  }

  container.innerHTML = sessionScans.map(item => `
    <div class="history-item" data-id="${item.id}" title="Click to view or reload this scan">
      <div class="history-meta">
        <span class="history-time">${escapeHtml(item.time)}</span>
        <span class="history-score-pill" style="color:${item.color};border:1px solid ${item.color}55;background:${item.color}18">
          ${item.score}/100 · ${escapeHtml(item.category)}
        </span>
      </div>
      <div class="history-text">"${escapeHtml(item.snippet)}"</div>
      <span class="pill neutral" style="font-size:10px;padding:3px 7px">${item.signalCount} cue${item.signalCount === 1 ? "" : "s"}</span>
    </div>
  `).join("");

  // Attach click listeners to reload past scans
  container.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-id");
      const scan = sessionScans.find(s => s.id === id);
      if (scan) {
        $("message").value = scan.fullText;
        $("message").focus();
        performAnalysis(scan.fullText.toLowerCase());
      }
    });
  });
}

if ($("clearHistoryBtn")) {
  $("clearHistoryBtn").addEventListener("click", () => {
    sessionScans = [];
    renderHistory();
  });
}

// ----------------------------------------------------
// FEATURE 2: Robust Speech-to-Text Implementation
// ----------------------------------------------------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MIC_STATES = {
  READY: { text: "Ready", cls: "status-ready" },
  REQUESTING: { text: "Requesting permission", cls: "status-requesting" },
  LISTENING: { text: "Listening", cls: "status-listening" },
  SPEECH_DETECTED: { text: "Speech detected", cls: "status-speech-detected" },
  PROCESSING: { text: "Processing", cls: "status-processing" },
  TRANSCRIPT_RECEIVED: { text: "Transcript received", cls: "status-transcript-received" },
  ERROR: { text: "Error", cls: "status-error" }
};

const micBtn = $("micBtn");
const stopMicBtn = $("stopMicBtn");
const micStatus = $("micStatus");
const micBadge = $("micBadge");
const micLang = $("micLang");
const micLangTag = $("micLangTag");

let activeRecognition = null;
let isListening = false;
let isStarting = false;
let isStopping = false;

let sessionBaseText = "";
let sessionWordsTranscribed = false;
let sessionWordCount = 0;
let sessionHadError = false;

function setMicState(stateKey, description) {
  const state = MIC_STATES[stateKey] || MIC_STATES.READY;
  if (micBadge) {
    micBadge.textContent = state.text;
    micBadge.className = "mic-badge " + state.cls;
  }
  if (micStatus) {
    micStatus.textContent = description;
  }

  // Futuristic audio waveform visualizer (active only during live listening states)
  const waveform = $("audioWaveform");
  if (waveform) {
    if (stateKey === "LISTENING" || stateKey === "SPEECH_DETECTED" || stateKey === "PROCESSING") {
      waveform.classList.add("active");
    } else {
      waveform.classList.remove("active");
    }
  }

  // Synchronize button states
  if (stateKey === "LISTENING" || stateKey === "SPEECH_DETECTED" || stateKey === "PROCESSING") {
    if (micBtn) {
      micBtn.textContent = "⏹ Stop listening";
      micBtn.disabled = false;
      micBtn.classList.add("mic-listening-active");
    }
    if (stopMicBtn) stopMicBtn.disabled = false;
  } else if (stateKey === "REQUESTING") {
    if (micBtn) {
      micBtn.textContent = "⏳ Requesting...";
      micBtn.disabled = true;
      micBtn.classList.remove("mic-listening-active");
    }
    if (stopMicBtn) stopMicBtn.disabled = true;
  } else {
    // READY, TRANSCRIPT_RECEIVED, ERROR
    if (micBtn) {
      micBtn.textContent = !SpeechRecognition ? "🎙 Mic Unavailable" : "🎙 Start listening";
      micBtn.disabled = !SpeechRecognition;
      micBtn.classList.remove("mic-listening-active");
    }
    if (stopMicBtn) stopMicBtn.disabled = true;
  }
}

function updateLangDisplay() {
  if (!micLangTag || !micLang) return;
  const langVal = micLang.value;
  micLangTag.textContent = "Lang: " + langVal;
}

// Safe Start Listening: always creates a clean, fresh SpeechRecognition instance
function startListening() {
  if (!SpeechRecognition) {
    setMicState("ERROR", "Speech-to-text is not supported by your browser (Web Speech API missing). Desktop Google Chrome or Microsoft Edge is recommended. Manual text input is fully operational.");
    return;
  }

  // Prevent multiple simultaneous recognition sessions
  if (isListening || isStarting) {
    return;
  }

  // Clean up any previous session before creating a fresh instance
  if (activeRecognition) {
    try {
      activeRecognition.abort();
    } catch (e) {}
    activeRecognition = null;
  }

  isStarting = true;
  isStopping = false;
  sessionHadError = false;
  sessionWordsTranscribed = false;
  sessionWordCount = 0;

  // Capture existing text in the textarea so it is never overwritten
  sessionBaseText = $("message") ? $("message").value : "";

  setMicState("REQUESTING", "Requesting microphone permission from browser...");

  try {
    const rec = new SpeechRecognition();
    activeRecognition = rec;

    // Web Speech API configuration
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    if (micLang) {
      rec.lang = micLang.value || "en-IN";
    }

    rec.onstart = () => {
      isStarting = false;
      isListening = true;
      setMicState("LISTENING", "Microphone is live. Speak clearly into your mic. Click 'Stop listening' when finished.");
    };

    rec.onspeechstart = () => {
      // Audio energy detected — DO NOT treat as transcript received!
      setMicState("SPEECH_DETECTED", "Voice sound detected. Capturing speech audio...");
    };

    rec.onspeechend = () => {
      setMicState("PROCESSING", "Processing speech audio into text...");
    };

    rec.onresult = (event) => {
      if (!event || !event.results) return;

      let finalStr = "";
      let interimStr = "";

      // Iterate through all results to reconstruct the full transcript accurately
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res || !res[0]) continue;
        const piece = res[0].transcript || "";
        if (res.isFinal) {
          finalStr += piece + " ";
        } else {
          interimStr += piece;
        }
      }

      const fullTranscript = (finalStr + interimStr).trim();

      // Only show Transcript Received when actual recognized words are returned!
      if (fullTranscript.length > 0) {
        sessionWordsTranscribed = true;
        const words = fullTranscript.split(/\s+/).filter(Boolean);
        sessionWordCount = words.length;

        // Safely preserve pre-existing user typed text without silent overwrite
        const separator = sessionBaseText.length > 0
          ? (sessionBaseText.endsWith(" ") || sessionBaseText.endsWith("\n") ? "" : " ")
          : "";
        $("message").value = sessionBaseText + separator + fullTranscript;

        setMicState(
          "TRANSCRIPT_RECEIVED",
          `Recognized ${sessionWordCount} word${sessionWordCount === 1 ? "" : "s"} so far: "${fullTranscript.slice(-45)}"`
        );
      }
    };

    rec.onnomatch = () => {
      if (!sessionWordsTranscribed) {
        setMicState("READY", "No recognizable words matched. Try speaking closer to the microphone or switch between English/Hindi.");
      }
    };

    rec.onerror = (event) => {
      isStarting = false;
      isListening = false;
      sessionHadError = true;

      const errorType = (event && event.error) ? event.error : "unknown";
      let errorMsg = "Microphone error: " + errorType + ". You can enter text manually.";

      if (errorType === "not-allowed" || errorType === "permission-denied") {
        errorMsg = "Microphone access denied. Please click the lock/settings icon in your browser address bar to allow microphone access.";
      } else if (errorType === "network") {
        errorMsg = "Speech recognition network error: In Chrome/Edge, browser speech recognition requires active internet to connect to speech servers. Manual text input works completely offline.";
      } else if (errorType === "no-speech") {
        if (sessionWordsTranscribed) {
          // Speech words were already captured; do not show error on normal silence pause
          return;
        }
        errorMsg = "No speech was detected before timeout. Click 'Start listening' when ready to speak.";
      } else if (errorType === "audio-capture") {
        errorMsg = "No microphone hardware found or microphone is in use by another application.";
      } else if (errorType === "aborted") {
        // Stopped intentionally by user
        return;
      }

      setMicState("ERROR", errorMsg);
    };

    rec.onend = () => {
      isStarting = false;
      isListening = false;
      activeRecognition = null;

      // Handle onend correctly without prematurely resetting transcript or showing 'Try Again' when recognition has succeeded!
      if (sessionWordsTranscribed) {
        setMicState(
          "TRANSCRIPT_RECEIVED",
          `Finished transcribing ${sessionWordCount} word${sessionWordCount === 1 ? "" : "s"}. Review text above, then click "Analyze risk".`
        );
      } else if (!sessionHadError) {
        // No words transcribed and no specific error occurred
        setMicState(
          "READY",
          "Listening ended. No speech was transcribed. Click 'Start listening' to try again or type/paste text manually."
        );
      }
    };

    rec.start();
  } catch (err) {
    isStarting = false;
    isListening = false;
    activeRecognition = null;
    sessionHadError = true;
    setMicState("ERROR", "Could not start microphone: " + err.message + ". You can type text manually.");
  }
}

// Safe Stop Listening
function stopListening() {
  if (!isListening && !isStarting) return;
  isStopping = true;
  isStarting = false;
  if (activeRecognition) {
    try {
      // Calling stop() asks recognizer to finish transcribing recorded audio
      activeRecognition.stop();
    } catch (e) {
      try {
        activeRecognition.abort();
      } catch (err) {}
    }
  }
  isListening = false;
}

// Button event bindings
if (micBtn) {
  micBtn.addEventListener("click", () => {
    if (isListening || isStarting) {
      stopListening();
    } else {
      startListening();
    }
  });
}

if (stopMicBtn) {
  stopMicBtn.addEventListener("click", () => {
    stopListening();
  });
}

// Language selector change handling
if (micLang) {
  micLang.addEventListener("change", () => {
    updateLangDisplay();
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 350);
    }
  });
}

// Initial setup
updateLangDisplay();
if (!SpeechRecognition) {
  if (micBtn) {
    micBtn.disabled = true;
    micBtn.title = "Speech recognition is not supported in this browser.";
  }
  if (stopMicBtn) stopMicBtn.disabled = true;
  if (micLang) micLang.disabled = true;
  setMicState("ERROR", "Speech-to-text is not supported by your browser (Web Speech API missing). Desktop Google Chrome or Microsoft Edge is recommended. Manual text input is fully operational.");
} else {
  setMicState("READY", "Microphone is idle. Click \"Start listening\" or type your transcript manually.");
}
