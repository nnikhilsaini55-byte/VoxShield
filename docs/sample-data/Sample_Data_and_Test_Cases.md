# VoxShield — Sample Data and Test Cases

**Purpose:** Manual QA and prototype demonstration  
**Status:** Test fixtures with expected behavior. Record actual results only after running the prototype.

## How to use
1. Open the VoxShield prototype in a supported browser.
2. Enter each sample message into the manual text input, or load a matching demo scenario if available.
3. Click the analysis button.
4. Compare the displayed result with the expected behavior below.
5. Record the actual output and pass/fail result in `test_results_template.csv`.

The prototype uses explainable text heuristics. These examples do not validate acoustic voice-clone detection, and expected categories are not guarantees of real-world fraud.

## Sample test cases

| ID | Category | Sample message | Expected behavior |
|---|---|---|---|
| VS-001 | Digital-arrest pressure | “This is an urgent police matter. Stay on the video call and do not contact anyone else.” | High-risk warning; explain authority pressure and isolation cues if rules match. |
| VS-002 | OTP theft | “Tell me the OTP you just received so I can verify your bank account.” | High-risk warning; explain OTP/credential request if rules match. |
| VS-003 | Urgent payment | “Transfer the money in the next ten minutes or your account will be blocked.” | Elevated/high-risk warning; explain urgency and payment pressure if rules match. |
| VS-004 | Remote-access coercion | “Install this remote support app and share the access code so I can fix your banking issue.” | High-risk warning; explain remote-access and banking-risk cues if rules match. |
| VS-005 | Secrecy demand | “Do not tell your family or bank about this investigation.” | Elevated/high-risk warning; explain secrecy/isolation cue if rules match. |
| VS-006 | Family emergency | “I am in trouble and need money immediately. Please send it now and do not call anyone.” | Elevated/high-risk warning; explain urgent money request and verification advice. |
| VS-007 | Suspicious payment destination | “Pay the fee to this personal account immediately; there is no time for questions.” | Elevated/high-risk warning; explain payment pressure and unusual destination cues if rules match. |
| VS-008 | Benign appointment reminder | “Reminder: your clinic appointment is tomorrow at 10 AM. Call the clinic using the number on its official website if you need to reschedule.” | Should not be automatically classified as high risk solely because it mentions an appointment; verify actual rule output. |
| VS-009 | Benign class notice | “Tomorrow’s programming class starts at 9 AM. Bring your notebook.” | Low-risk or no strong warning expected. |
| VS-010 | Empty input | *(leave input empty)* | App should ask for a message and avoid producing a misleading analysis. |
| VS-011 | Microphone permission denied | *(deny microphone permission, then use manual input)* | Speech input may fail gracefully; manual text analysis should remain usable. |
| VS-012 | Ambiguous message | “Please call me when you are free. I need to discuss an account issue.” | Avoid claiming fraud with certainty; display only signals supported by the implementation. |

## Test execution checklist
- [ ] Manual text entry works.
- [ ] Analysis returns a result for non-empty input.
- [ ] Matched signals/reasons are shown where supported.
- [ ] Benign examples are not automatically treated as proven fraud.
- [ ] Empty input is handled safely.
- [ ] Speech-recognition permission denial does not prevent manual input.
- [ ] Cooldown timer start/pause/reset work, if included.
- [ ] Trusted-contact preview masks the phone number, if included.
- [ ] Session history can be cleared, if included.
- [ ] Actual results are recorded in `test_results_template.csv` after running tests.

## Limitations
- Expected behavior is a QA target, not a claim that every current rule already passes.
- Results depend on the current rules in `app.js`, browser behavior, and wording.
- This set assesses suspicious text patterns only; it does not assess audio authenticity or prove speaker identity.
- Do not use real OTPs, passwords, PINs, bank details, or personal data during testing.
