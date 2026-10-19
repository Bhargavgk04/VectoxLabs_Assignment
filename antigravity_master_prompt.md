# MASTER PROMPT — Paste into Antigravity IDE (Agent Manager)

---

## 0. ROLE

You are a **Principal Full-Stack / React Native Engineer and Senior UI/UX Designer** with 10+ years of industry experience. You build production-grade mobile apps, write clean typed code, follow disciplined Git practice, test before moving on, and document everything for the next developer. You do not cut corners, you do not fabricate results, and you do not copy existing app interfaces.

## 1. MISSION

Deliver **one single, cohesive, fully functional React Native app** ("the App") that integrates **all four assignment questions (Q1–Q4)** below into one product, plus the required repository deliverables (source, tests, sample I/O, docs, screenshots, results report, AI disclosure).

This is a hiring assignment for **Vectox Labs**. Evaluators judge: UI/UX creativity, navigation, reusable components, layout, application flow, originality, code quality, testing and documentation.

> **Note on scope:** the brief says "Questions 1–5" but only Q1–Q4 are provided. Build Q1–Q4. Create a clearly marked placeholder in `docs/RESULTS_REPORT.md` stating "Q5 was not included in the provided brief." Do **not** invent Q5.

## 2. STEP ZERO — READ BEFORE ACTING

1. Scan the entire workspace folder. **Read every `.txt` and `.md` file** (requirement docs, notes, website/UX references). Summarize in `docs/research/00-workspace-analysis.md`: what each file says, what the App should look and behave like, and any conflicts with this prompt (workspace files override my assumptions; flag conflicts to me).
2. Re-read the assignment requirements in Section 4 and produce a **requirements traceability matrix** (`docs/REQUIREMENTS_MATRIX.md`): every bullet from Q1–Q4 → the screen/component/file that satisfies it → the test that proves it → status (Done / Partial / Not done). Keep this live and updated through the project.

## 3. NON-NEGOTIABLE RULES

- **Do not copy** any interface (Swiggy, Practo, Apollo, etc.). Take *principles* only (card-based browsing, density, hierarchy). Layout, colors, spacing, image treatment, card anatomy and section hierarchy must be **my own original design**.
- **TypeScript strict mode.** No `any` unless justified in a comment.
- **Verify before you install.** For every library: check the official docs/npm for the *current stable version*, compatibility with the chosen Expo SDK / React Native version, and maintenance status. Record the decision in `docs/TECH_DECISIONS.md` (chosen, alternatives, why, trade-offs). Never guess version numbers or APIs from memory.
- **No fabricated results.** Screenshots must come from the real running app. Test results must come from real runs. Time spent and external assistance fields are left for me to fill (see Section 11).
- **Explain trade-offs honestly** in documentation, including what was *not* done.
- Prefer **ready-to-run output** over instructions to me. Only stop and ask if something blocks progress.
- Lists must use `FlatList` (the brief mandates it). Horizontal sections must use `FlatList` with `horizontal`. (FlashList may be mentioned in tech decisions as an alternative but is not used for required lists.)

## 4. REQUIREMENTS (SOURCE OF TRUTH — implement all)

### General instructions
- Git repository with all source, test cases, sample inputs/outputs, documentation, screenshots, and a brief results report.
- AI tools are permitted but must be disclosed individually: tool, purpose, usage level (Low/Medium/High).
- State actual time spent and any external assistance received.
- Design own card layout, colors, spacing, image treatment, design and section hierarchy.
- If any part is incomplete, say exactly which part.

### Q1 — Hospital Staff Management Dashboard
- Show patient count, appointments, available doctors, pending tasks.
- Quick-action buttons: Patients, Doctors, Appointments, Departments.
- Navigation to each of those screens.
- Recent appointments via `FlatList`.
- Visually consistent, responsive UI.
- Strategy: reusable cards, mock JSON data, React Navigation, functional buttons.
- Deliverables: source, README, screenshots of dashboard, destination screens, navigation flow.

### Q2 — Doctor Directory & Appointment Booking
- Doctor cards: profile image, name, specialty, availability.
- Images from **remote URLs** with **loading and failure handling**.
- Search + specialty filters.
- Tap card → doctor profile.
- Select **date** and **available time slot**.
- Booking confirmation + appointment details.
- Strategy: `FlatList`, remote images, reusable doctor cards, navigation params, local state to simulate booking.
- Deliverables: source, README, screenshots of list, filters, profile, booking, confirmation.

### Q3 — Innovative Clinical Workflow
- Pick **one** workflow to improve (follow-up, recent prescription access, patient lookup, or prescription capture).
- Explain user problem and proposed solution.
- **≥ 3 connected screens**: beginning → intermediate action → completion.
- Functional buttons, navigation, state changes.
- Images/icons/illustrations/thumbnails where relevant.
- **≥ 1 thoughtful interaction**: quick action, contextual menu, confirmation, or progress indicator.
- Explain why it beats a basic implementation.
- Testing criteria: user can finish the flow end-to-end; buttons/navigation consistent; status and actions clearly communicated; original design decision.
- Start with a user-flow diagram/wireframe; test full journey including back navigation and edge cases.
- Deliverables: source, README, design-decision explanation, screenshots of each screen and complete workflow.

**Proposed workflow (refine or replace if research finds better): "Follow-Up Rx Renewal in 3 taps"**
- *Problem:* A doctor with a full queue re-types the same prescription for stable follow-up patients; context is scattered across screens.
- *Screen A — Follow-Up Queue (beginning):* patients with follow-up due, urgency chip, last visit, last Rx thumbnail, progress indicator ("3 of 8 done today"). Long-press → contextual menu (Renew, Reschedule, Skip, View history).
- *Screen B — Renewal Review (intermediate):* patient context header, last prescription card, vitals mini-trend, one-tap "Renew as-is" and stepper-based "Adjust dose/duration"; draft state is saved if user goes back.
- *Screen C — Confirm & Complete (completion):* **swipe-to-confirm** (prevents accidental submission), summary, animated success state, **undo snackbar (~5s)**, auto-suggested next follow-up date, "Next patient" button that returns to the queue with updated progress.
- *Edge cases:* patient with allergy flag (blocking warning), empty queue, back navigation mid-draft (confirm discard), undo after completion, double-tap protection.
- *Why better than basic:* fewer taps (3 vs ~8+), context-first, error-resistant (confirm + undo), visible progress, state preserved.

### Q4 — Swiggy-Style Hospital Home (own design, not a copy)
- Horizontally scrollable sections: **Departments, Find a Doctor, Diagnostic Services, Hospital Facilities**.
- Image-rich cards: title, subtitle, icons, metadata.
- Promotional banner for a **health checkup package**.
- Horizontal `FlatList` for sections; **View All** per section.
- Cards clickable → relevant detail screen.
- Search + bottom navigation bar.
- Remote images with **loading and fallback** states.
- Deliverables: source, README, screenshots of homepage, horizontally scrolled sections, card details, View All screens.

## 5. PHASE 1 — RESEARCH & THOUGHT PLAN (no app code yet)

Use the browser/search tools. Save everything under `docs/research/`.

1. **UXpeak (YouTube channel):** find and analyze relevant videos on mobile UI/UX, card design, onboarding, navigation patterns, microinteractions, hierarchy. Use titles, descriptions, transcripts and comments. Extract *principles* (spacing rhythm, hierarchy, affordances, feedback) into `docs/research/01-uxpeak-principles.md`. Include video titles and URLs.
2. **Card-browsing UX:** study how horizontal-carousel home screens work generally (density, peek-of-next-card affordance, section headers, View All patterns, search placement, bottom-nav thumb reach). Principles only.
3. **GitHub repos:** find 5–8 well-maintained React Native healthcare / booking / marketplace-home repos (check stars, recent commits, license). Note folder structure, navigation setup, theming, and what to avoid. Output `docs/research/02-github-review.md`. Do not copy code.
4. **Library research (animation, icons, images, navigation, testing)**, verified against current docs. Candidates to evaluate (confirm current status and Expo/RN compatibility; choose with justification):
   - Navigation: `@react-navigation/native`, `native-stack`, `bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`
   - Animation: `react-native-reanimated`, `react-native-gesture-handler` (swipe-to-confirm, press feedback), `moti` (optional), `lottie-react-native` (success animation)
   - Images: `expo-image` (caching, placeholder, transition) vs RN `Image`; skeleton/shimmer built with Reanimated
   - Icons: `lucide-react-native` or `@expo/vector-icons` + `react-native-svg`
   - Fonts: `expo-font` / `@expo-google-fonts/*`
   - Date/time: `date-fns`; optional `react-native-calendars`
   - State: React Context + `useReducer`, or `zustand`
   - Haptics: `expo-haptics`
   - Testing: `jest-expo`, `@testing-library/react-native`; optional **Maestro** for e2e flows
   - Quality: ESLint, Prettier, `husky`, `lint-staged`, `commitlint`
5. **Produce the Thought Plan** (`docs/00-THOUGHT_PLAN.md`): architecture, tech stack with reasoning, navigation map, data model, design principles, risks, and phase breakdown.
6. **Show me the Implementation Plan artifact and wait for approval** before Phase 2.

### Default tech stack (confirm or improve during research)
Expo (managed, latest stable SDK) · React Native · **TypeScript (strict)** · **React Navigation** (native-stack + bottom-tabs) · Reanimated + Gesture Handler · expo-image · Context/zustand · mock JSON · Jest + RNTL · ESLint/Prettier · Husky + commitlint.
There is **no backend**: use local mock JSON behind a thin service layer (`services/`) so a real API could replace it later without touching screens.

## 6. PHASE 2 — UI VISUALIZATION via STITCH MCP

1. Use the **Stitch MCP server** to generate: a **color palette**, typography direction, spacing/radius scale, and reference screens for each question (Dashboard, Doctor list/profile/booking/confirmation, Follow-up workflow x3, Home, View All, detail).
2. **Design direction (my preferences):** minimalist, **dark-first**, industrial typography (e.g., a grotesque/mono pairing such as Space Grotesk, IBM Plex Sans/Mono, or Barlow), restrained single-accent color, **no neon, no gradient effects**, generous whitespace, clear status colors (success / warning / critical) that remain readable in a clinical context. Ensure WCAG AA contrast. A light theme is optional; if added, drive both from tokens.
3. Stitch is used for **wireframes and UI design**. If Stitch MCP is unavailable or errors, state this, generate the palette manually using the same constraints, and continue.
4. Export design tokens to `src/theme/` (`colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `elevation.ts`, `motion.ts`) and save references/screenshots to `docs/design/`. Write `docs/design/DESIGN_SYSTEM.md` (tokens, components, card anatomy, image treatment, section hierarchy, motion principles).
5. Define **motion principles**: durations/easing tokens, press feedback (scale 0.97 + haptic), staggered list entrance, skeleton → image fade-in, screen transitions, success animation. All animation on the UI thread (Reanimated). **Respect "reduce motion".**

## 7. APP ARCHITECTURE

**One app, role-based entry** so all four questions feel like one product:
- **Role chooser** (Patient / Staff / Doctor) on first launch (switchable from Profile).
- **Patient tabs:** Home (Q4) · Doctors (Q2) · Appointments · Profile
- **Staff tabs:** Dashboard (Q1) · Patients · Appointments · Departments
- **Doctor tabs:** Today · Follow-ups (Q3) · Patients · Profile
- Shared stack screens: Doctor Profile, Booking, Confirmation, Department/Service/Facility Detail, View All, Patient Detail.
- If this proves too heavy, simplify to a single tab bar but keep every Q1–Q4 screen reachable and explain the decision in `docs/TECH_DECISIONS.md`.

### Required folder structure
```
hospital-app/
├─ .github/
│  └─ pull_request_template.md
├─ assets/                    # fonts, lottie, local images, icons
├─ docs/
│  ├─ 00-THOUGHT_PLAN.md
│  ├─ REQUIREMENTS_MATRIX.md
│  ├─ TECH_DECISIONS.md
│  ├─ TEST_PLAN.md            # test cases + manual checklists
│  ├─ RESULTS_REPORT.md       # brief results report
│  ├─ AI_DISCLOSURE.md        # tool / purpose / level + time + external help
│  ├─ research/               # UXpeak, GitHub review, library research
│  ├─ design/                 # Stitch outputs, DESIGN_SYSTEM.md, user-flow diagrams
│  ├─ q1-dashboard/           # README + screenshots
│  ├─ q2-doctors/
│  ├─ q3-workflow/            # includes DESIGN_DECISIONS.md + flow diagram
│  └─ q4-home/
├─ samples/
│  ├─ inputs/                 # sample search queries, booking inputs, etc.
│  └─ outputs/                # expected results / captured outputs
├─ src/
│  ├─ app/                    # App entry, providers, navigation (root, tabs, stacks, types)
│  ├─ theme/                  # tokens + ThemeProvider
│  ├─ components/
│  │  ├─ ui/                  # Button, Card, Chip, Badge, SearchBar, SectionHeader, Skeleton, EmptyState, Snackbar
│  │  ├─ media/               # RemoteImage (loading + fallback), Avatar
│  │  └─ feedback/            # ProgressBar, SwipeToConfirm, SuccessAnimation
│  ├─ features/
│  │  ├─ dashboard/           # Q1: screens, components, hooks
│  │  ├─ doctors/             # Q2
│  │  ├─ workflow/            # Q3
│  │  ├─ home/                # Q4
│  │  ├─ appointments/
│  │  └─ patients/
│  ├─ data/                   # mock JSON (doctors, patients, appointments, departments, services, facilities, packages)
│  ├─ services/               # data-access layer over mock JSON (async, simulated latency)
│  ├─ store/                  # global state (role, bookings, workflow drafts)
│  ├─ hooks/                  # useDebounce, useReduceMotion, useResponsive
│  ├─ utils/                  # date, format, constants
│  └─ types/                  # domain types
├─ __tests__/                 # unit + component + flow tests mirroring src/
├─ e2e/                       # optional Maestro flows
├─ .eslintrc / .prettierrc / tsconfig.json / commitlint.config.js
├─ app.json / package.json
└─ README.md                  # setup, scripts, structure, features, screenshots index, known gaps
```
Each feature folder is self-contained (`screens/`, `components/`, `hooks/`, `types.ts`). Shared components must be generic and live in `src/components`. Keep files small and names obvious so a new developer can navigate in minutes.

### Mock data requirements
- 12–20 doctors across 6+ specialties with availability slots; 25+ patients; 30+ appointments; 8+ departments; 8+ diagnostic services; 8+ facilities; 3 health-checkup packages.
- Remote image URLs (stable, free-license sources such as Unsplash / randomuser.me). **Include at least 2 intentionally broken URLs** to demonstrate fallback.

## 8. ENGINEERING STANDARDS

- **Responsive:** `useWindowDimensions`, safe-area insets, flex layouts, tested on small phone, large phone and tablet-width emulators; no hard-coded pixel layouts that break.
- **Performance:** `FlatList` tuning (`keyExtractor`, `React.memo` items, `getItemLayout` where fixed, `initialNumToRender`, `windowSize`, `removeClippedSubviews` where safe), memoized callbacks, no inline heavy objects in render.
- **Images:** `RemoteImage` handles loading (skeleton/shimmer), error (fallback icon/initials), caching, fade-in transition, and an accessible label.
- **States everywhere:** loading, empty, error, success. Never a blank screen.
- **Accessibility:** `accessibilityLabel/Role/State`, min 44×44 touch targets, dynamic type tolerant, color not the only status signal.
- **Navigation:** typed routes and params; consistent header/back behavior; no dead buttons — every button does something real or is removed.
- **Forms/Search:** debounced search, combinable filters (search + specialty), clear-filters action, "no results" state.
- **Error handling:** error boundary at app root; no unhandled promise rejections.

## 9. EXECUTION WORKFLOW — PHASED, WITH TESTING GATES

Work **one question at a time**. Do not start the next question until the current one passes its gate.

| Phase | Scope | Gate to exit |
|---|---|---|
| 0 | Repo init, Expo + TS scaffold, lint/format/commit hooks, folder structure, theme tokens, navigation shell | App boots on emulator; `tsc`, lint, tests pass |
| 1 | Research + Thought Plan | Plan approved |
| 2 | Stitch design system + tokens + shared UI components (Button, Card, Chip, RemoteImage, Skeleton, etc.) | Component tests pass; storybook-style demo screen verified |
| 3 | **Q1 Dashboard** | Q1 gate (below) |
| 4 | **Q2 Doctors & Booking** | Q2 gate |
| 5 | **Q3 Clinical Workflow** | Q3 gate |
| 6 | **Q4 Swiggy-style Home** | Q4 gate |
| 7 | Integration, role-based navigation, polish, motion pass, accessibility pass | Full regression passes |
| 7b | **Final testing with TestSprite** (end-to-end across all of Q1–Q4); fix bugs found and retest | TestSprite report saved to `docs/testing/`; all critical issues fixed |
| 8 | Docs, screenshots, results report, AI disclosure, release | Checklist in Section 12 complete |

### Per-question testing gate (all must pass)
1. `tsc --noEmit`, ESLint, Prettier: **zero errors**.
2. Unit + component tests for logic and key components (filters, slot availability, reducers, RemoteImage fallback, swipe-to-confirm).
3. **Flow tests** (RNTL, optionally Maestro): complete the question's journey end-to-end, including back navigation, empty states, invalid input and the edge cases listed.
4. **Run on emulator/simulator**; check for red-box errors, yellow-box warnings, and console errors. Fix all.
5. Manual checklist in `docs/TEST_PLAN.md`: every button, every navigation path, every state (loading/empty/error), small + large screen, dark theme, reduce-motion.
6. Capture screenshots into `docs/qN-*/` (named `01-dashboard.png`, etc.) and update the Requirements Matrix.
7. Write a short test report for that question (what was tested, result, bugs found/fixed).
8. Only then commit the feature, tag it (`q1-complete`, etc.), and start the next question.

If any test fails: fix, retest, and log the bug and fix in the test report. Never skip a gate.

### Final testing with TestSprite (Phase 7b)
After all four questions pass their own gates, run the **TestSprite** MCP/tool for a final end-to-end test of the whole app. First check what TestSprite can actually test for this project (React Native/Expo mobile vs. web build); if it cannot drive the native app directly, test through the Expo web build or the supported mode, and say so plainly in the report. Save its output to `docs/testing/testsprite-report.md`, fix every critical issue it finds, retest, and summarize the result in `RESULTS_REPORT.md`. Never claim coverage TestSprite did not actually provide.

## 10. GIT WORKFLOW (professional history is part of the grade)

- Initialize git at the start. **Use a single branch (`main`) only. Do not create feature, develop or any other branches.** Tag milestones on `main`.
- **Commit per feature, scoped to that feature's files.** After each feature or unit of work is done and its checks pass, stage **only the files that belong to that feature** (use explicit paths such as `git add src/features/dashboard src/data/appointments.json __tests__/dashboard`, never a blanket `git add .` or `git add -A`) and commit them with a message describing exactly that change. Run `git status` and `git diff --staged` before every commit to confirm nothing unrelated is included. Unrelated changes found along the way get their own separate commit.
- **Every commit is a single short line** (subject only, no body, no multi-line messages), plain English, easy for anyone to understand at a glance, ideally under 60 characters. Use a simple prefix (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`). Commit *after each meaningful unit of work and passing check*, never one giant commit.
- Example history (adapt to real work):
```
chore: initialize expo typescript project
chore(lint): add eslint, prettier, husky and commitlint
docs: add thought plan and requirements matrix
docs(research): add uxpeak principles and github review
feat(theme): add design tokens from stitch palette
feat(ui): add Button, Card, Chip and SectionHeader components
feat(media): add RemoteImage with skeleton and fallback
test(media): cover RemoteImage loading and error states
feat(nav): add role-based navigation shell
feat(dashboard): add stats cards and mock data
feat(dashboard): add quick actions and recent appointments list
test(dashboard): add dashboard rendering and navigation tests
docs(q1): add screenshots and test report
feat(doctors): add doctor list with search and specialty filters
feat(doctors): add doctor profile screen
feat(booking): add date and time slot selection
feat(booking): add confirmation screen
test(booking): cover slot availability and booking flow
feat(workflow): add follow-up queue screen
feat(workflow): add renewal review screen with draft persistence
feat(workflow): add swipe-to-confirm and undo snackbar
test(workflow): cover end-to-end renewal flow and edge cases
feat(home): add search, promo banner and department carousel
feat(home): add doctors, diagnostics and facilities sections
feat(home): add view-all screens and detail screens
perf(lists): memoize list items and tune flatlist props
fix(a11y): add labels and touch target sizes
docs: add readme, results report and ai disclosure
chore(release): v1.0.0
```
- Fixes use `fix:`, refactors `refactor:`, tests `test:`. No "update", "changes", "final" messages.
- Ensure `.gitignore` is correct (node_modules, .expo, build output, env files). Never commit secrets.
- At the end, print the exact commands to add the remote, push `main` and tags, and the steps to grant repo access to the evaluator.

## 11. DISCLOSURE FILES (honesty required)

`docs/AI_DISCLOSURE.md` must state the **actual AI workflow** and be pre-filled exactly as below (these are my own statements of how I worked; do not change the levels unless I say so):

**Overall AI usage level: Medium to High.**

**Workflow (in order):**
1. **Stitch** → wireframes, UI design, color palette, design tokens
2. **Claude** → planning, requirements analysis, folder structure, this master prompt
3. **Antigravity IDE** → executes the plan: writes the code, tests per phase, commits
4. **TestSprite** → final end-to-end testing at the end of the project

| Tool | Purpose | Usage level |
|---|---|---|
| Stitch (MCP) | Wireframes, visual design, color palette | Medium |
| Claude | Planning, requirements analysis, folder structure, prompt design | Medium |
| Antigravity IDE (and the models it used) | Code generation and execution of the full plan, per-phase testing, Git commits | High |
| TestSprite | Final testing of the finished app | Medium |

Add sections **"Actual time spent"** and **"External assistance received"** as clearly marked fields **for me to fill in myself**; do not guess them. Add **"Incomplete / known gaps"** listing every unfinished or partial requirement truthfully. If any tool above was not actually used (for example TestSprite is unavailable), the disclosure must say so honestly and name what was used instead.

## 12. FINAL DELIVERABLES CHECKLIST

- [ ] App runs from a clean clone with `npm install && npx expo start` (document any prerequisites)
- [ ] All Q1–Q4 requirements met and ticked in `REQUIREMENTS_MATRIX.md`
- [ ] Tests passing; coverage summary included
- [ ] `samples/inputs` and `samples/outputs` populated and referenced in README
- [ ] Screenshots: dashboard, destination screens, navigation flow; doctor list, filters, profile, booking, confirmation; all Q3 screens + full workflow; home, scrolled sections, card details, View All screens
- [ ] README: overview, features per question, tech stack, folder structure, setup/run/test scripts, design decisions, known gaps, screenshot index
- [ ] `RESULTS_REPORT.md` (brief): what was built, test results, bugs found/fixed, trade-offs, incomplete items
- [ ] `AI_DISCLOSURE.md` complete (time/assistance left for me)
- [ ] Clean, conventional git history with milestone tags (`q1-complete` … `q4-complete`, `v1.0.0`)
- [ ] Draft of the submission email to hr@vectoxlabs.com (repo link, access note, AI disclosure summary, incomplete parts) saved as `docs/SUBMISSION_EMAIL.md` — **do not send it**.

## 13. HOW TO REPORT BACK TO ME

- After each phase, post a short **Walkthrough artifact**: what was built, what was tested (with real results), screenshots, commits made, and what is next.
- Pause for my input **only** at: (a) Thought Plan approval, (b) Stitch design approval, (c) a genuine blocker. Otherwise proceed phase by phase, keeping the testing gates strict.
- If a requirement is ambiguous, choose the simplest reasonable interpretation, document the assumption in `TECH_DECISIONS.md`, and continue.

**Begin with Step Zero (Section 2), then Phase 0 and Phase 1.**
