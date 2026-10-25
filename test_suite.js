// test_suite.js: Comprehensive automated test suite for VoxShield prototype
const fs = require('fs');
const path = require('path');

console.log("=== STARTING VOXSHIELD COMPREHENSIVE TEST SUITE ===");

// 1. Verify index.html contains all required elements
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const requiredIds = [
  'sampleBtn',
  'sampleBankBtn',
  'sampleRemoteBtn',
  'safeSampleBtn',
  'clearBtn',
  'message',
  'micLang',
  'micBtn',
  'stopMicBtn',
  'micStatusCard',
  'micBadge',
  'micLangTag',
  'micStatus',
  'analyzeBtn',
  'resultPanel',
  'statusPill',
  'scoreRing',
  'score',
  'riskTitle',
  'riskSummary',
  'meterFill',
  'signals',
  'disclaimer',
  'safetyProtocolPanel',
  'timer',
  'cooldownState',
  'cooldownText',
  'startCooldown',
  'resetCooldown',
  'contactName',
  'contactPhone',
  'contactMethod',
  'alertBtn',
  'alertPreview',
  'historyPanel',
  'historyList',
  'clearHistoryBtn'
];

let missingIds = [];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    missingIds.push(id);
  }
}

if (missingIds.length > 0) {
  console.error("FAIL: Missing required HTML IDs:", missingIds);
  process.exit(1);
} else {
  console.log(`PASS: All ${requiredIds.length} required HTML IDs exist in index.html.`);
}

// 2. Setup a lightweight mock DOM to run app.js in Node.js
class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.placeholder = '';
    this.className = '';
    this.style = {};
    this.disabled = false;
    this.title = '';
    this.attributes = {};
    this.classList = {
      _classes: new Set(),
      add: (cls) => this.classList._classes.add(cls),
      remove: (cls) => this.classList._classes.delete(cls),
      contains: (cls) => this.classList._classes.has(cls)
    };
    this.listeners = {};
  }

  setAttribute(name, val) { this.attributes[name] = val; }
  getAttribute(name) { return this.attributes[name] || null; }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  trigger(event, data = {}) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(data));
    }
  }

  focus() { this.focused = true; }

  querySelectorAll() { return []; }
}

const elements = {};
requiredIds.forEach(id => {
  let tag = 'div';
  if (id.includes('Btn')) tag = 'button';
  if (id === 'message') tag = 'textarea';
  if (id === 'micLang' || id === 'contactMethod') tag = 'select';
  if (id === 'contactName' || id === 'contactPhone') tag = 'input';
  elements[id] = new MockElement(id, tag);
});
elements['contactName'].value = 'Family Contact';
elements['contactPhone'].value = '+91 98765 43210';
elements['contactMethod'].value = 'WhatsApp (demo preview)';
elements['micLang'].value = 'en-IN';

// Mock SpeechRecognition with support for new instances per session
class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = 'en-IN';
    this.maxAlternatives = 1;
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    this.onspeechstart = null;
    this.onspeechend = null;
    this.onnomatch = null;
    MockSpeechRecognition.instance = this;
    MockSpeechRecognition.instances.push(this);
  }

  start() {
    MockSpeechRecognition.isStarted = true;
    if (this.onstart) this.onstart();
  }

  stop() {
    MockSpeechRecognition.isStarted = false;
    if (this.onend) this.onend();
  }

  abort() {
    MockSpeechRecognition.isStarted = false;
  }
}
MockSpeechRecognition.isStarted = false;
MockSpeechRecognition.instance = null;
MockSpeechRecognition.instances = [];

// Global sandbox setup
global.document = {
  getElementById: (id) => elements[id] || null,
  createElement: (tag) => new MockElement('mock-' + tag, tag),
  body: {
    appendChild: () => {},
    removeChild: () => {}
  },
  execCommand: () => true
};
global.window = {
  SpeechRecognition: MockSpeechRecognition,
  isSecureContext: true
};
global.navigator = {
  clipboard: {
    writeText: async (text) => {
      global.copiedClipboard = text;
      return true;
    }
  }
};

// 3. Load app.js code
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
eval(appCode);

console.log("PASS: app.js loaded and executed cleanly in mock DOM environment.");

// 4. Test Sample Scenario Loading
elements['sampleBtn'].trigger('click');
if (!elements['message'].value.includes("police department") || !elements['message'].value.includes("Aadhaar")) {
  console.error("FAIL: sampleBtn did not load expected digital arrest sample.");
  process.exit(1);
}
console.log("PASS: sampleBtn loads digital arrest scam sample.");

elements['sampleBankBtn'].trigger('click');
if (!elements['message'].value.includes("fraud prevention") || !elements['message'].value.includes("OTP")) {
  console.error("FAIL: sampleBankBtn did not load bank OTP sample.");
  process.exit(1);
}
console.log("PASS: sampleBankBtn loads bank OTP scam sample.");

elements['sampleRemoteBtn'].trigger('click');
if (!elements['message'].value.includes("AnyDesk") || !elements['message'].value.includes("remote access")) {
  console.error("FAIL: sampleRemoteBtn did not load AnyDesk remote app sample.");
  process.exit(1);
}
console.log("PASS: sampleRemoteBtn loads remote app scam sample.");

elements['safeSampleBtn'].trigger('click');
if (!elements['message'].value.includes("City Health Clinic") || !elements['message'].value.includes("dental checkup")) {
  console.error("FAIL: safeSampleBtn did not load clinic safe sample.");
  process.exit(1);
}
console.log("PASS: safeSampleBtn loads safe clinic sample.");

// 5. Test Risk Analysis Engine
// Safe message test
performAnalysis(elements['message'].value.toLowerCase());
if (String(elements['score'].textContent) !== "8") {
  console.error("FAIL: Safe sample score should be 8, got:", elements['score'].textContent);
  process.exit(1);
}
if (!elements['statusPill'].textContent.includes("Lower risk")) {
  console.error("FAIL: Status pill should be 'Lower risk', got:", elements['statusPill'].textContent);
  process.exit(1);
}
console.log("PASS: Risk analysis for safe sample gives score 8 and 'Lower risk'.");

// Remote access app scam test
elements['sampleRemoteBtn'].trigger('click');
performAnalysis(elements['message'].value.toLowerCase());
const remoteScore = parseInt(elements['score'].textContent, 10);
if (remoteScore < 35 || !elements['signals'].innerHTML.includes("Remote-access")) {
  console.error("FAIL: Remote access scam should detect remote app signals, got score:", remoteScore);
  process.exit(1);
}
console.log(`PASS: Risk analysis for remote app scam detected signals (score: ${remoteScore}).`);

// Digital arrest scam test
elements['sampleBtn'].trigger('click');
performAnalysis(elements['message'].value.toLowerCase());
const scamScore = parseInt(elements['score'].textContent, 10);
if (scamScore < 65 || elements['statusPill'].textContent !== "High risk") {
  console.error("FAIL: Scam score should be >= 65 and 'High risk', got:", scamScore, elements['statusPill'].textContent);
  process.exit(1);
}
console.log(`PASS: Risk analysis for scam sample gives high risk score (${scamScore}) and 'High risk' status.`);

// Multi-signal rule test: Single isolated cue cap
const singleCueText = "Hello, can you give me some information about the police?".toLowerCase();
performAnalysis(singleCueText);
const singleScore = parseInt(elements['score'].textContent, 10);
if (singleScore > 35) {
  console.error("FAIL: Single keyword alone should not exceed score 35! Got:", singleScore);
  process.exit(1);
}
console.log("PASS: Single isolated keyword correctly capped at <= 35 (does not declare scam on one cue).");

// Empty message validation test
elements['clearBtn'].trigger('click');
elements['analyzeBtn'].trigger('click');
if (elements['riskTitle'].textContent !== "Input needed") {
  console.error("FAIL: Empty text did not trigger 'Input needed'.");
  process.exit(1);
}
console.log("PASS: Empty input validation handled safely.");

// 6. Test Trusted Contact Alert Preview with Phone Masking
elements['contactName'].value = "Dad";
elements['contactPhone'].value = "+91 98765 43210";
elements['contactMethod'].value = "SMS (demo preview)";

// A: Prior to analysis or after clear
elements['clearBtn'].trigger('click');
elements['alertBtn'].trigger('click');
if (!elements['alertPreview'].innerHTML.includes("UNASSESSED")) {
  console.error("FAIL: Alert message should indicate UNASSESSED when unassessed.");
  process.exit(1);
}
// Check phone masking
if (!elements['alertPreview'].innerHTML.includes("••••• ••3210")) {
  console.error("FAIL: Phone number was not masked properly in preview! HTML:", elements['alertPreview'].innerHTML);
  process.exit(1);
}
if (elements['alertPreview'].innerHTML.includes("98765")) {
  console.error("FAIL: Raw unmasked phone number leaked in preview!");
  process.exit(1);
}
console.log("PASS: Phone number masking verified: privacy preserved (+91 ••••• ••3210).");

// B: After safe analysis
elements['safeSampleBtn'].trigger('click');
performAnalysis(elements['message'].value.toLowerCase());
elements['alertBtn'].trigger('click');
if (!elements['alertPreview'].innerHTML.includes("LOWER RISK")) {
  console.error("FAIL: Alert message should indicate LOWER RISK after safe analysis.");
  process.exit(1);
}
console.log("PASS: Alert preview correctly shows LOWER RISK.");

// C: After high-risk scam analysis
elements['sampleBtn'].trigger('click');
performAnalysis(elements['message'].value.toLowerCase());
elements['alertBtn'].trigger('click');
if (!elements['alertPreview'].innerHTML.includes("HIGH RISK")) {
  console.error("FAIL: Alert message should indicate HIGH RISK for scam.");
  process.exit(1);
}
console.log("PASS: Alert preview correctly shows HIGH RISK for scam.");

// 7. Test Cooldown Circuit Breaker (Start, Pause, Resume, Reset, No Underflow)
elements['resetCooldown'].trigger('click');
if (elements['timer'].textContent !== "05:00") {
  console.error("FAIL: Reset timer should display 05:00, got:", elements['timer'].textContent);
  process.exit(1);
}

// Start
elements['startCooldown'].trigger('click');
if (elements['startCooldown'].textContent !== "Pause cooldown") {
  console.error("FAIL: startCooldown button should change to 'Pause cooldown'");
  process.exit(1);
}
if (elements['cooldownState'].textContent !== "Cooldown in progress") {
  console.error("FAIL: cooldownState should be 'Cooldown in progress'");
  process.exit(1);
}
console.log("PASS: Cooldown starts and transitions button to 'Pause cooldown'.");

// Pause
elements['startCooldown'].trigger('click');
if (elements['startCooldown'].textContent !== "Resume cooldown") {
  console.error("FAIL: startCooldown button should change to 'Resume cooldown'");
  process.exit(1);
}
if (elements['cooldownState'].textContent !== "Cooldown paused") {
  console.error("FAIL: cooldownState should be 'Cooldown paused'");
  process.exit(1);
}
console.log("PASS: Cooldown pauses smoothly.");

// Resume
elements['startCooldown'].trigger('click');
if (elements['startCooldown'].textContent !== "Pause cooldown") {
  console.error("FAIL: startCooldown should resume to 'Pause cooldown'");
  process.exit(1);
}
console.log("PASS: Cooldown resumes smoothly.");

// Reset
elements['resetCooldown'].trigger('click');
if (elements['timer'].textContent !== "05:00" || elements['startCooldown'].textContent !== "Start 5-minute cooldown") {
  console.error("FAIL: Reset should restore timer to 05:00 and button to Start.");
  process.exit(1);
}
console.log("PASS: Cooldown reset works cleanly.");

// 8. Test Session Activity History (Feature 7)
if (!elements['historyList'].innerHTML.includes("history-item")) {
  console.error("FAIL: historyList should contain rendered items from previous analyses. HTML:", elements['historyList'].innerHTML);
  process.exit(1);
}
console.log("PASS: Session activity history recorded and rendered scans during session.");

elements['clearHistoryBtn'].trigger('click');
if (!elements['historyList'].innerHTML.includes("No messages analyzed yet")) {
  console.error("FAIL: Clear history should empty session scans and render empty state.");
  process.exit(1);
}
console.log("PASS: Clear history emptied session scans and restored empty placeholder.");

// 9. Test Speech Recognition & States (FEATURE 2)
console.log("--- Testing Speech-to-Text State Transitions ---");

// Initial state
if (elements['micBadge'].textContent !== "Ready") {
  console.error("FAIL: Initial mic state should be Ready, got:", elements['micBadge'].textContent);
  process.exit(1);
}
console.log("PASS: Initial mic state is 'Ready'.");

// Click Start Listening
elements['micBtn'].trigger('click');
const recInstance = MockSpeechRecognition.instance;
if (!recInstance) {
  console.error("FAIL: No MockSpeechRecognition instance created.");
  process.exit(1);
}

// State: Listening
if (elements['micBadge'].textContent !== "Listening") {
  console.error("FAIL: Mic state should be 'Listening', got:", elements['micBadge'].textContent);
  process.exit(1);
}
if (elements['micBtn'].textContent !== "⏹ Stop listening") {
  console.error("FAIL: Mic button should say '⏹ Stop listening'");
  process.exit(1);
}
console.log("PASS: State 'Listening' verified.");

// State: Speech detected (sound energy detected, NOT transcript received!)
recInstance.onspeechstart();
if (elements['micBadge'].textContent !== "Speech detected") {
  console.error("FAIL: Mic state should be 'Speech detected', got:", elements['micBadge'].textContent);
  process.exit(1);
}
if (elements['micStatus'].textContent.includes("Transcript received")) {
  console.error("FAIL: Sound detection was falsely treated as transcript received!");
  process.exit(1);
}
console.log("PASS: State 'Speech detected' verified without claiming transcript received.");

// State: Processing
recInstance.onspeechend();
if (elements['micBadge'].textContent !== "Processing") {
  console.error("FAIL: Mic state should be 'Processing', got:", elements['micBadge'].textContent);
  process.exit(1);
}
console.log("PASS: State 'Processing' verified.");

// Text preservation test: user has pre-existing text
elements['message'].value = "Case reference: #1234.";
// Stop and restart mic to test text appending
elements['micBtn'].trigger('click'); // stop
elements['micBtn'].trigger('click'); // start
const activeRec = MockSpeechRecognition.instance;

// Result event simulation: onresult with recognized transcript
activeRec.onresult({
  resultIndex: 0,
  results: [
    Object.assign([{ transcript: "This is the police department" }], { isFinal: true })
  ]
});

// State: Transcript received
if (elements['micBadge'].textContent !== "Transcript received") {
  console.error("FAIL: Mic state should be 'Transcript received', got:", elements['micBadge'].textContent);
  process.exit(1);
}
console.log("PASS: State 'Transcript received' verified when words arrive.");

// Verify text preservation (no silent overwrite!)
if (!elements['message'].value.startsWith("Case reference: #1234.") || !elements['message'].value.includes("This is the police department")) {
  console.error("FAIL: Speech recognition silently overwrote pre-existing text! Text:", elements['message'].value);
  process.exit(1);
}
console.log("PASS: Pre-existing text preserved! Resulting text:", JSON.stringify(elements['message'].value));

// Stop listening test: onend after transcript was received
elements['micBtn'].trigger('click');
if (elements['micBadge'].textContent !== "Transcript received") {
  console.error("FAIL: onend should NOT show 'Try Again' when speech transcription succeeded! Badge:", elements['micBadge'].textContent);
  process.exit(1);
}
if (elements['micStatus'].textContent.includes("Try again") || elements['micStatus'].textContent.includes("No speech was transcribed")) {
  console.error("FAIL: onend erroneously displayed 'Try again' even though words were transcribed!");
  process.exit(1);
}
console.log("PASS: onend preserves 'Transcript received' status and does NOT show 'Try Again'.");

// Error handling tests
// Permission denied
elements['clearBtn'].trigger('click');
elements['micBtn'].trigger('click');
const errRec = MockSpeechRecognition.instance;
errRec.onerror({ error: "not-allowed" });
if (elements['micBadge'].textContent !== "Error" || !elements['micStatus'].textContent.includes("denied")) {
  console.error("FAIL: Permission denied error not reported properly:", elements['micStatus'].textContent);
  process.exit(1);
}
console.log("PASS: 'not-allowed' permission denied state handled with clear instructions.");

// Network error
errRec.onerror({ error: "network" });
if (elements['micBadge'].textContent !== "Error" || !elements['micStatus'].textContent.includes("internet")) {
  console.error("FAIL: Network error should explain internet requirement:", elements['micStatus'].textContent);
  process.exit(1);
}
console.log("PASS: 'network' error explains internet connection requirement.");

// No speech test: ensure app does NOT pretend speech was transcribed when 0 words are returned
elements['clearBtn'].trigger('click');
elements['micBtn'].trigger('click'); // start
const noSpeechRec = MockSpeechRecognition.instance;
noSpeechRec.onend(); // end with no speech
if (elements['micStatus'].textContent.includes("Review text above") || elements['micBadge'].textContent === "Transcript received") {
  console.error("FAIL: App pretended speech was received when 0 words were transcribed!");
  process.exit(1);
}
if (!elements['micStatus'].textContent.includes("No speech was transcribed")) {
  console.error("FAIL: App should clearly explain that no speech was transcribed:", elements['micStatus'].textContent);
  process.exit(1);
}
console.log("PASS: Never pretends speech was transcribed when no speech was received.");

// Language change test (Hindi and English)
elements['micLang'].value = "hi-IN";
elements['micLang'].trigger('change');
elements['micBtn'].trigger('click');
const hiRec = MockSpeechRecognition.instance;
if (hiRec.lang !== "hi-IN" || elements['micLangTag'].textContent !== "Lang: hi-IN") {
  console.error("FAIL: Language change to hi-IN failed:", hiRec.lang, elements['micLangTag'].textContent);
  process.exit(1);
}
console.log("PASS: Language switching to Hindi (hi-IN) initializes recognition instance with hi-IN.");

console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
