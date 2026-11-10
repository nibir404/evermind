# Twin states on Talk

The Talk screen (`src/app/(app)/talk/page.tsx`) drives the 3D twin (`src/components/twin-avatar.tsx`) through one `mode` prop of type `TwinMode`.

The avatar model (`public/twin/avatar.glb`) is a single static mesh with no skeleton, so states are shown with whole-body motion, light and particles rather than facial or arm animation.

| Mode | When | Body | Scene | Status cue |
| --- | --- | --- | --- | --- |
| `idle` | Waiting for you | Slow breathing, gentle turn | Soft green rim light, faint ring | "Tap the mic to ask" |
| `listening` | Mic is open | Leans in, slight head tilt | Lime light pulses, ring ripples outward | "Listening…" |
| `thinking` | Working out an answer (about 1.4 s) | Leans back, turns away, slow sway | Thought points orbit the head, ring spins | "Checking your book, minutes and interviews…" |
| `speaking` | Delivering the answer | Rhythmic bob and small emphatic turns | White light pulses with speech, ring ripples | "Answering from 3 sources" |
| `deciding` | After "Save as decision" (about 1.8 s) | A firm nod and stands tall | Bright lime flash and fast ripple | "Decision saved to your record" |

## Flow

1. Mic tap: `listening`. With browser speech recognition, this lasts while you speak; otherwise a sample question is used after about 1.1 s.
2. `respond(question)`: `thinking`, then the answer is added to the transcript and the twin switches to `speaking`.
3. Speaking lasts `max(2.6 s, words × 0.3 s)`, then returns to `idle`.
4. "Save as decision": `deciding`, then `idle`.

All timers go through a `later()` helper and are cleared on each new turn and on unmount, so turns never overlap.

## Adding a state

1. Add the name to `TwinMode` and to `MODE_COLOR` in `twin-avatar.tsx`.
2. Add a pose in `Model`'s `switch`, and values in `MoodLight` and `StateRing`.
3. Add a label to `STATE_LABEL` and a cue to `STATE_CUE` in `talk/page.tsx`.
