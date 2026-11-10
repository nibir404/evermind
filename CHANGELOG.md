# Changelog

All notable changes to EverMind are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org).

## [0.3.0] - 2026-11-10

### Added
- **Live twin states on Talk.** The 3D twin now reacts to the conversation: idle, listening, thinking, speaking and deciding. Each state has its own body motion, rim light, floor ring and, while thinking, orbiting thought points. See [docs/twin-states.md](docs/twin-states.md).
- A live status cue under the avatar ("Listening…", "Checking your book, minutes and interviews…", "Answering from 3 sources", "Decision saved to your record"), announced to screen readers.
- "Save as decision" plays a decision moment (a firm nod and a lime flash) before returning to idle.
- **Upcoming events panel** on Talk: the next 3 calendar events with a "See all" link to the calendar, replacing the sources panel.
- A third seeded calendar event (Wollongong partnership call).
- Project README, this changelog and release instructions.

### Changed
- The view controls (Front, rotate, zoom) are now a horizontal bar at the bottom right instead of a vertical bar beside the avatar.
- Answers now arrive after a short thinking phase, and speaking time scales with the length of the answer.

### Removed
- The large centred caption line and both Captions toggles on Talk; the transcript on the left already shows the conversation.

## [0.2.0] - 2026-11-10

### Added
- A 3D GLB model of the twin that keeps the person's likeness, with smooth orbit animation.
- Voice-only mode on Talk.

### Changed
- The sidebar no longer shows the workspace hub grid or the settings gear.

### Fixed
- Overlap between the bottom buttons on Talk.

## [0.1.0] - 2026-11-10

### Added
- First complete demo: landing page, sign-up and onboarding, home brief, Talk with 3D avatar, Ask, Decision Studio, knowledge brain, approvals, calendar, email, tasks, access, audit trail, security and settings.

[0.3.0]: https://github.com/nibir404/evermind/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nibir404/evermind/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nibir404/evermind/releases/tag/v0.1.0
