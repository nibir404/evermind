# EverMind — Persistent Codebase Memory

> **Last Updated**: 2026-11-10  
> **Status**: Active & Evergreen  

## 1. Project Identity & Philosophy
- **Identity**: EverMind is an executive AI digital twin platform designed for Dr. Sabur Khan (Chair, Board of Trustees at Daffodil University Group).
- **Core Principle**: *"An AI twin that thinks like you — and never acts without you."*
- **Autonomy Hierarchy**:
  - `L0`: Recall & Remember (always on).
  - `L1`: Advise (grounded in verified/confirmed sources).
  - `L2`: Draft for approval (emails, briefs, calendar holds).
  - `L3`: Simulated actions within boundaries (no external delivery).
  - `L4`: Legal, financial & binding decisions (strictly human-only; twin is locked).

## 2. Process Topology & Runtime Ports
| Service / Process | Port | Command | Notes |
| :--- | :--- | :--- | :--- |
| Next.js Dev Server | 3000 | `npm run dev` | Next.js 16.4 with Turbopack |
| Production Build | 3000 | `npm run build && npm start` | SSR / Static App Router |

## 3. Core Subsystems & Architecture
- **App Shell & Routing (`src/app/`)**:
  - `(auth)`: Passkey, Google/Microsoft, and 6-digit demo OTP authentication.
  - `(app)`: Protected application shell with persistent floating sidebar dock.
  - `onboarding`: 7-step progressive onboarding interview and boundaries configuration.
  - `first-day`: Post-onboarding initial calibration checklist.
- **Client Reactive State Engine (`src/lib/demo.ts`)**:
  - Standardized `useDemo` hook backed by `useSyncExternalStore` and `localStorage` (`evermind.demo.v1.*`).
  - Automated audit log (`audit()`), event notifications, and JSON data export.
- **Visual Design System (`src/components/paper.tsx`, `src/app/globals.css`)**:
  - Paper design language: `#F5F5F7` canvas, `#0E5A43` pine, `#D4F26A` lime accent, `#111113` ink.
  - Dither noise background gradients and soft elevation shadows.
- **Interactive 3D Visuals (`src/components/three/`, `src/components/twin-avatar.tsx`)**:
  - 3D stylized avatar bust with orbit controls and speaking animations.
  - 3D/2D/List Knowledge Brain with elliptical clustering across 5 neuron categories.

## 4. Key Workspaces & Modules
- `Home` (`/home`): Readiness score (72/100), quick query bar, attention items, weekly learning summary.
- `Ask` (`/ask`) & `Talk` (`/talk`): Conversational thinking interfaces with evidence attribution and 3D avatar voice interaction.
- `Decision Studio` (`/decisions`, `/decide`): Multi-option decision analysis, risk assessment, and timing windows.
- `Knowledge & Brain` (`/knowledge`, `/brain`, `/memories`, `/memory/*`): Provenance-verified memory graph and document repository.
- `Executive Actions & Approvals` (`/actions`, `/approvals`, `/tasks`, `/calendar`, `/email`, `/rules`): Sign-off workflows, tone matching analysis, and boundaries.
- `Boardroom` (`/boardroom`): Disclosed AI observer meeting simulation and summary extraction.
- `Legacy` (`/legacy`, `/legacy/activation`): Digital legacy preservation with multi-party safeguarded activation.

## 5. Verification Checklist
- [x] Linter clean (`npm run lint` passes).
- [x] TypeScript clean (`npx tsc --noEmit` passes).
- [x] All assets and pages in place.
