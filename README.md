# EverMind

**An executive digital twin that thinks like you, and never acts without you.**

EverMind is a demo web app of an AI twin for Dr. Md. Sabur Khan, Chair of the Board of Trustees at Daffodil University Group. The twin learns from his book, board minutes, speeches and a voice interview. It answers questions with sources, drafts replies for approval and records every action in an audit trail.

> This is a **seeded demo**. All data lives in the browser (`localStorage`). No messages are sent, no money moves and no real AI model is called.

Current version: **0.3.1**. See [CHANGELOG.md](CHANGELOG.md).

## Quick start

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with Turbopack on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Stack

- **Next.js 16** (App Router) and **React 19**. This Next.js version has breaking changes; read `node_modules/next/dist/docs/` before changing framework code (see [AGENTS.md](AGENTS.md)).
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for the 3D twin.
- **Framer Motion**, **GSAP** and **Lenis** for motion and smooth scrolling.
- **Tailwind CSS 4** and plain CSS in `src/app/globals.css`.
- **lucide-react** icons.

## Project structure

```
src/
  app/
    page.tsx              Landing page (marketing)
    signin, signup, …     Auth and verification pages
    onboarding/           Twin-building onboarding flow
    (app)/                Signed-in app (shared sidebar layout)
      home/               Daily brief
      talk/               Talk to your twin: 3D avatar, voice, live states
      ask/                Text Q&A with sources
      decide/, decisions/ Decision Studio and decision log
      approvals/          Drafts waiting for sign-off
      knowledge/, memory/, brain/   What the twin knows
      calendar/, email/, tasks/     Workspace modules
      access/, audit/, security/, settings/   Governance and data
  components/
    twin-avatar.tsx       3D twin with state-driven motion (see docs/twin-states.md)
    sidebar.tsx, ui.tsx, paper.tsx, …   Shared UI
  lib/
    demo.ts               localStorage store, seed data, demo answers
    brain.ts, memories.ts, seed.ts      Knowledge and memory seeds
public/twin/              3D model (avatar.glb) and portrait images
docs/
  MEMORY.md               Product principles and codebase notes
  twin-states.md          How the Talk avatar reacts to the conversation
```

## Key ideas

- **Autonomy levels.** L0 remember, L1 advise, L2 draft for approval, L3 simulated actions, and L4 (legal, financial, binding) always stays with the human.
- **Every answer has a source.** Answers point back to the book, minutes or interview they came from.
- **Approvals first.** The twin drafts; the person approves. Everything is logged in the audit trail.

## Versioning and releases

The project follows [Semantic Versioning](https://semver.org). The version lives in `package.json`, and each release gets an annotated git tag `vX.Y.Z` on `main` plus an entry in [CHANGELOG.md](CHANGELOG.md).

To cut a release:

```bash
npm version minor --no-git-tag-version   # or patch / major
# update CHANGELOG.md, then
git commit -am "chore(release): vX.Y.Z"
git tag -a vX.Y.Z -m "EverMind vX.Y.Z"
git push origin main --follow-tags
```

Commit messages use [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
