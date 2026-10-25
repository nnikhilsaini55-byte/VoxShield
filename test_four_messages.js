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

function matchKeyword(text, keyword) {
  if (!keyword.includes(" ")) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("(?:^|[^a-zA-Z0-9])" + escaped + "(?:[^a-zA-Z0-9]|$)", "i");
    return regex.test(text);
  }
  return text.includes(keyword);
}

function testMsg(msg) {
  const text = msg.toLowerCase();
  const found = [];
  for (const r of rules) {
    const hits = r.words.filter(w => matchKeyword(text, w));
    if (hits.length) found.push({ name: r.name, points: r.points, hits });
  }
  let score = 0;
  if (found.length === 0) score = 8;
  else if (found.length === 1) score = Math.min(found[0].points, 35);
  else score = Math.min(98, found.reduce((sum, r) => sum + r.points, 0));
  
  const category = score >= 65 ? "High risk" : score >= 35 ? "Caution" : "Lower risk";
  return { msg, score, category, cues: found.map(f => `${f.name} (${f.hits.join(', ')})`) };
}

console.log("TEST CASE 1:", JSON.stringify(testMsg("Hello, are you available for dinner tomorrow?"), null, 2));
console.log("TEST CASE 2:", JSON.stringify(testMsg("Your bank account will be blocked. Share your OTP immediately."), null, 2));
console.log("TEST CASE 3:", JSON.stringify(testMsg("You are under digital arrest. Transfer money now and do not tell your family."), null, 2));
console.log("TEST CASE 4:", JSON.stringify(testMsg("Someone claiming to be my bank manager wants me to install a remote access app."), null, 2));
