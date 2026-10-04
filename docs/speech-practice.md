# Ms. Jana guided practice prototype

Home links to `#/coach` and `#/review`. The guide uses browser text-to-speech, not a recording or clone of Ms. Jana. Student profiles have UUIDs; identical names are separate profiles. Adult-observed outcomes have no invented numeric score. Results and profiles are saved only in this browser's localStorage. There is no authentication, protected teacher portal, shared database, or cross-device homework tracking yet. This prototype should not be treated as a secure student records system.

## Assessment integration contract

Automatic scoring is disabled unless `VITE_SPEECH_ASSESSMENT_ENDPOINT` is configured at build time. This must point to a protected backend endpoint, ideally same-origin `/api/speech-assessment`. Never place provider secrets in Vite environment variables: these are public in the client bundle. The existing static deployment does not create this API.

The browser requests microphone permission only after the user presses My turn. It captures at most six seconds using MediaRecorder, stops microphone tracks, and posts multipart fields `audio`, `word`, and `sound`. It releases its audio chunks after creating the request; it does not save audio to localStorage, IndexedDB, or a recording library. Capture uses the browser's default supported format, which the backend must inspect and convert for its provider. HTTPS or localhost is needed for microphone access. Browser speech recognition is not used as a substitute for pronunciation assessment.

Successful JSON response:

```json
{"score": 82, "provider": "provider-and-model-version"}
```

Use `score: null` for uncertain or unusable attempts. Values must be finite numbers from 0 to 100 or null. The client saves only the normalized result, word metadata, student ID, timestamp, and source. It drops extra response properties. Numeric results are shown only as automated estimates in review; no mastery or diagnostic label is assigned.

The backend must authenticate and authorize requests, limit upload size and duration, rate-limit usage, set timeouts, keep credentials server-side, and avoid logging or storing audio. Verify provider retention terms and settings before enabling it: client-side release does not guarantee provider-side deletion. No child name or local profile ID is sent by this prototype. Validate assessment against Ms. Jana's judgments before using scores for instructional ratings. Add approved cue selection rather than unconstrained corrective advice.

## Next steps

Choose a pronunciation-assessment provider and verify its suitability for children's target sounds. Add secure teacher access and a database before shared student records or home use. Configure processing permission and retention requirements. Replace browser-local review with authorized server persistence. Add teacher-approved coaching and calibrated uncertainty handling. A genuine Ms. Jana avatar and voice can be added separately; current UI describes itself as a practice guide.

## Checks

`node scripts/practice.test.mjs` covers duplicate names, score validation, separation of teacher observation from automated estimates, and results-only local storage. Routing tests cover coach and review URLs. Microphone capture and provider integration still need real-device testing after an endpoint is available.

References: [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), [Pronunciation assessment](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-pronunciation-assessment?pivots=programming-language-python), [Assessment limitations](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/characteristics-and-limitations-pronunciation-assessment).

## Microphone testing without a provider

When no endpoint is configured, My turn works without a student profile. It uses an AudioContext analyser to show input level for up to six seconds. No MediaRecorder, audio upload, or score storage is used in this mode. Sound detection indicates microphone input, not correct pronunciation. Done, timeout, or navigation releases microphone tracks and the analyser. Test permission denial, silence, input, Done, and navigating away on real devices.

Voice settings offer English voices from the device and a preview. Playback defaults to normal speed and reads only the practice word. Voice-name preference is a heuristic, not a guarantee of natural or pedagogically suitable speech. A consistent teaching voice still requires approved assets or a dedicated provider.
