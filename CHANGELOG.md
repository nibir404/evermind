# Changelog

All notable changes to EverMind are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org).

## [0.5.0] - 2026-11-10

### Added
- **Book contents panel:** every chapter with reading time and approval status, visible while reading and editing.
- **Publish as PDF:** print-ready A4 layout with optional cover page and table of contents; all chapters or approved only.
- **Export** the biography as Word (.doc), Markdown, HTML or JSON.
- **Share:** choose who can read it (only you, family and beneficiaries, anyone with the link), copy the link, use the system share sheet or email.
- Sample text for chapters 1, 2, 4, 5 and 6.

### Fixed
- The chapter 3 pull quote and closing paragraph no longer appear on every chapter.

## [0.4.0] - 2026-11-10

### Added
- **Spotlight search** (⌘K, or the search button in the sidebar) reaches every screen and every record.
- **Sample data for every module**, plus a seeded approval queue and audit trail, so each flow can be tested end to end.
- **Knowledge brain:** all 140 dots carry a record and show a tooltip on hover; selecting one opens its details.
- **Book editor:** rich text that is saved (bold, italic, links), drag and Alt+arrow reordering, a block menu (heading, quote, memory note, move, duplicate, delete), inline comments, "Rewrite with twin" on the selected text, and a keyboard-driven / menu.
- Favicon (SVG), Apple touch icon, web manifest, Open Graph and Twitter images, full metadata and a title for each screen.

### Changed
- Home rebuilt around what matters today: the twin with live key numbers, group pulse, next approval, upcoming events, attention items, recent decisions and weekly trends.
- One consistent style for dropdowns, fields, search and buttons; segmented status filters; split-view module lists with keyboard navigation; frosted sheets and toasts; consistent page spacing.

### Fixed
- Brain labels no longer cause React unmount errors.

## [0.3.1] - 2026-11-10

### Changed
- The dot texture on Talk now reacts to the cursor: nearby dots grow, turn lime and push outward, then ease back. It stays static when reduced motion is on. Built as a reusable `DotField` component.

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

[0.5.0]: https://github.com/nibir404/evermind/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/nibir404/evermind/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/nibir404/evermind/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/nibir404/evermind/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nibir404/evermind/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nibir404/evermind/releases/tag/v0.1.0
