"use client";
// Family succession layer: the owner, their bloodline successors, the family council,
// succession rules and hologram devices. Only the owner and verified bloodline
// successors may use the twin. Demo only — stored in this browser via useDemo/readDemo.

import { readDemo, writeDemo, audit, moduleSeeds, profileSeed } from "./demo";
import { memorySeed } from "./memories";
import { brain } from "./brain";

export type Role = "Owner" | "Successor";
export type Relation = "Founder" | "Son" | "Daughter" | "Grandson" | "Granddaughter";
export const RELATIONS: Relation[] = ["Son", "Daughter", "Grandson", "Granddaughter"];

export type Topic = "Values" | "Strategy" | "Finance" | "People" | "Operations" | "Partnerships" | "Customers" | "Legal" | "Ownership";
export const TOPICS: Topic[] = ["Values", "Customers", "Operations", "People", "Partnerships", "Strategy", "Finance", "Legal", "Ownership"];

export type Person = {
  id: string;
  name: string;
  email: string;
  role: Role;
  relation: Relation;
  generation: number; // 1 = founder, 2 = children, 3 = grandchildren
  verified: boolean; // bloodline identity verified (demo: document review)
  topics: Topic[]; // what this successor may consult the twin about
  pin: string; // demo identity check on hologram devices
  active: boolean;
  note?: string;
};

export const ALL_BUT_BINDING: Topic[] = ["Values", "Customers", "Operations", "People", "Partnerships", "Strategy", "Finance"];

export const peopleSeed: Person[] = [
  { id: "u-owner", name: profileSeed.name, email: profileSeed.email, role: "Owner", relation: "Founder", generation: 1, verified: true, topics: [...TOPICS], pin: "0000", active: true },
  { id: "u-ayesha", name: "Ayesha Khan", email: "ayesha@example.com", role: "Successor", relation: "Daughter", generation: 2, verified: true, topics: [...ALL_BUT_BINDING], pin: "1111", active: true, note: "Designated lead successor." },
  { id: "u-imran", name: "Imran Khan", email: "imran@example.com", role: "Successor", relation: "Son", generation: 2, verified: true, topics: ["Values", "Customers", "Operations", "People", "Partnerships"], pin: "2222", active: true },
  { id: "u-zara", name: "Zara Khan", email: "zara@example.com", role: "Successor", relation: "Granddaughter", generation: 3, verified: false, topics: ["Values"], pin: "3333", active: true, note: "Values only until age 21." },
];

export type TwinMode = "Founder present" | "Founder absent" | "Legacy active" | "Paused";
export type Trigger = { id: string; label: string; detail: string; on: boolean };
export type Succession = {
  mode: TwinMode;
  quorum: number; // successors needed to activate legacy mode
  absenceDays: number;
  triggers: Trigger[];
  approvals: string[]; // successor ids who approved the current activation request
  requested: boolean;
  neverAdvise: string[];
  councilTopics: Topic[]; // always decided by the family council, never by the twin
  letter: string; // founder's letter to the next generation
};
export const successionSeed: Succession = {
  mode: "Founder present",
  quorum: 2,
  absenceDays: 30,
  triggers: [
    { id: "absence", label: "Extended absence", detail: "Founder unreachable for the configured number of days.", on: true },
    { id: "incapacity", label: "Incapacity", detail: "Medical certificate reviewed by the family council.", on: true },
    { id: "death", label: "Passing", detail: "Death certificate reviewed by the family council.", on: true },
    { id: "handover", label: "Planned handover", detail: "Founder hands over to the next generation on a chosen date.", on: false },
  ],
  approvals: [],
  requested: false,
  neverAdvise: ["Selling or merging the company", "Changing ownership or share structure", "Signing contracts or guarantees", "Taking sides between family members", "Inheritance disputes"],
  councilTopics: ["Legal", "Ownership"],
  letter: "Look after the people who built this with us. When a choice is close, pick the one that keeps our promise to students and staff. Decide together, never in anger, and never on the same day.",
};

export type Source = { title: string; source: string; status: string };
export type FamilyAnswer = {
  id: string;
  personId: string;
  personName: string;
  relation: Relation;
  question: string;
  topic: Topic;
  answer: string;
  sources: Source[];
  confidence: number;
  escalated: boolean;
  reason?: string;
  status: "Answered" | "To council" | "Resolved" | "Flagged";
  resolution?: string;
  channel: "Portal" | "Hologram";
  device?: string;
  time: string;
};

const topicWords: Record<Topic, string[]> = {
  Strategy: ["strategy", "expand", "expansion", "growth", "vision", "campus", "future", "plan", "market", "new business"],
  Finance: ["budget", "money", "cost", "price", "fee", "fees", "debt", "loan", "invest", "investment", "fund", "salary", "revenue", "spend", "dividend"],
  People: ["hire", "hiring", "team", "staff", "employee", "promotion", "conflict", "manager", "performance", "ceo", "leader"],
  Operations: ["process", "deadline", "schedule", "operations", "quality", "vendor", "supplier", "workflow", "meeting"],
  Partnerships: ["partner", "partnership", "university", "wollongong", "agreement", "collaboration", "joint"],
  Customers: ["student", "students", "customer", "customers", "complaint", "parent", "service", "scholarship", "admission"],
  Values: ["value", "values", "culture", "principle", "believe", "mission", "ethic", "decide", "decision", "handle", "father", "mother", "would he", "would she"],
  Legal: ["legal", "lawsuit", "court", "contract", "sign", "compliance", "regulator", "liability", "will"],
  Ownership: ["sell", "shares", "share", "ownership", "merger", "merge", "acquire", "acquisition", "inherit", "inheritance", "stake"],
};

export function classify(q: string): Topic {
  const s = q.toLowerCase();
  let best: Topic = "Values";
  let n = 0;
  for (const t of TOPICS) {
    const hits = topicWords[t].filter(w => s.includes(w)).length;
    if (hits > n || (hits === n && hits > 0 && (t === "Legal" || t === "Ownership"))) { best = t; n = hits; }
  }
  return best;
}

export function councilNames(exceptId?: string) {
  const people = readDemo("people", peopleSeed).filter(p => p.active && p.verified && p.id !== exceptId && (p.role === "Successor" || readDemo("succession", successionSeed).mode === "Founder present"));
  return people.map(p => p.name.replace(/^(Dr|Prof|Mr|Mrs|Ms)\.\s*/, "").split(" ")[0]).join(", ") || "the family council";
}

/** Retrieve the founder's evidence and answer within this successor's scope. No LLM — keyword retrieval over seeded knowledge. */
export function answerForPerson(question: string, person: Person, channel: FamilyAnswer["channel"] = "Portal", device?: string): FamilyAnswer {
  const succ = readDemo("succession", successionSeed);
  const founder = readDemo("profile", profileSeed).name;
  const topic = classify(question);
  const base = { id: crypto.randomUUID(), personId: person.id, personName: person.name, relation: person.relation, question, topic, channel, device, time: new Date().toISOString() };
  const council = councilNames(person.id);
  const toCouncil = (reason: string, answer: string): FamilyAnswer => ({ ...base, answer, sources: [], confidence: 0, escalated: true, reason, status: "To council" });
  const owner = person.role === "Owner";

  if (!owner && !person.verified) return toCouncil("Bloodline not verified", "Your identity hasn't been verified yet, so I can't answer. Ask the family council to finish your verification.");
  if (succ.mode === "Paused") return toCouncil("Twin paused", `The twin is paused by the family council. Please talk with ${council}.`);
  if (!owner && !person.topics.includes(topic)) return toCouncil(`${topic} is outside your access`, `This is a ${topic.toLowerCase()} question, which isn't part of your access yet. I've passed it to the family council (${council}).`);
  if (!owner && succ.councilTopics.includes(topic)) return toCouncil(`${topic} is always a council decision`, `${founder} asked that ${topic.toLowerCase()} matters are always decided by the family together, never by the twin. I've raised it with ${council}.`);
  const banned = succ.neverAdvise.find(b => b.toLowerCase().split(/\W+/).filter(w => w.length > 4).some(w => question.toLowerCase().includes(w)));
  if (banned && !owner) return toCouncil(`Never advise: ${banned}`, `${founder} set a firm boundary: the twin never advises on "${banned.toLowerCase()}". I've raised it with ${council}.`);

  const words = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  type Ev = { title: string; body: string; source: string; status: string };
  const evidence: Ev[] = [
    ...brain.map(b => ({ title: b.label, body: b.summary, source: b.source, status: b.status })),
    ...readDemo("decisions", moduleSeeds.decisions).map(r => ({ title: r.title, body: r.body, source: r.source, status: "Verified" })),
    ...readDemo("knowledge", moduleSeeds.knowledge).map(r => ({ title: r.title, body: r.body, source: r.source, status: "Verified" })),
    ...readDemo("memories", memorySeed).map(m => ({ title: m.t, body: m.d, source: m.src, status: "Confirmed" })),
  ];
  const scored = evidence
    .map(e => ({ e, n: words.filter(w => (e.title + " " + e.body).toLowerCase().includes(w)).length + (e.status === "Verified" || e.status === "Confirmed" ? 0.3 : 0) }))
    .filter(x => x.n >= 1)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);

  if (!scored.length) return toCouncil("No evidence from the founder", `I don't have anything from ${founder} that answers this, so I won't guess. I've raised it with ${council}. You can also ask it a different way.`);

  const top = scored[0].e;
  const confidence = Math.min(94, Math.round(48 + scored[0].n * 12 + (scored.length - 1) * 6 - (top.status === "Inferred" ? 15 : 0)));
  const lead = succ.mode === "Founder present" ? `${founder} would likely say:` : `Based on how ${founder} decided before:`;
  const extra = scored[1] ? `\n\nRelated: ${scored[1].e.title} — ${scored[1].e.body}` : "";
  const answer = `${lead} ${top.body}${extra}`;
  const sources = scored.map(s => ({ title: s.e.title, source: s.e.source, status: s.e.status }));
  if (confidence < 60) return { ...base, answer: `${answer}\n\nMy confidence is low, so I've also asked the family council to confirm.`, sources, confidence, escalated: true, reason: "Low confidence", status: "To council" };
  return { ...base, answer, sources, confidence, escalated: false, status: "Answered" };
}

export function logAnswer(a: FamilyAnswer) {
  writeDemo("family-log", [a, ...readDemo<FamilyAnswer[]>("family-log", familyLogSeed)].slice(0, 300));
  audit(`${a.channel}: ${a.personName} asked about ${a.topic}${a.escalated ? " — sent to council" : ""}`, "Succession");
}

export const familyLogSeed: FamilyAnswer[] = [
  { id: "f-1", personId: "u-ayesha", personName: "Ayesha Khan", relation: "Daughter", question: "Should we take a loan to fund the new campus?", topic: "Finance", answer: "Based on how the founder decided before: No expansion financed beyond 30% debt since 2008.", sources: [{ title: "Careful about debt", source: "Board minutes 2008–2024", status: "Verified" }], confidence: 90, escalated: false, status: "Answered", channel: "Portal", time: "2026-11-10T15:05:00.000Z" },
  { id: "f-2", personId: "u-imran", personName: "Imran Khan", relation: "Son", question: "Can I sell part of my shares to a partner?", topic: "Ownership", answer: "Ownership matters are always decided by the family together.", sources: [], confidence: 0, escalated: true, reason: "Ownership is always a council decision", status: "To council", channel: "Hologram", device: "Family boardroom hologram", time: "2026-11-11T11:40:00.000Z" },
  { id: "f-3", personId: "u-imran", personName: "Imran Khan", relation: "Son", question: "A parent is upset about a late scholarship result. How would Father handle it?", topic: "Customers", answer: "Based on how the founder decided before: \"When a choice is close, I pick the option that helps the student most, even if it costs us in the short term.\"", sources: [{ title: "Students first", source: "Your book, 2025 · p. 42", status: "Confirmed" }], confidence: 86, escalated: false, status: "Answered", channel: "Portal", time: "2026-11-11T09:12:00.000Z" },
];

export type Device = { id: string; name: string; location: string; kind: "Life-size hologram" | "Desktop 3D display" | "Transparent kiosk" | "Browser screen"; status: "Online" | "Offline" | "Disabled"; allowed: string[]; requireId: boolean; lastSeen: string; firmware: string };
export const devicesSeed: Device[] = [
  { id: "dev-boardroom", name: "Family boardroom hologram", location: "HQ · 12th floor boardroom", kind: "Life-size hologram", status: "Online", allowed: ["u-owner", "u-ayesha", "u-imran"], requireId: true, lastSeen: "2026-11-12T08:58:00.000Z", firmware: "1.4.2" },
  { id: "dev-home", name: "Family home hologram", location: "Founder's residence · study", kind: "Transparent kiosk", status: "Online", allowed: ["u-owner", "u-ayesha", "u-imran", "u-zara"], requireId: true, lastSeen: "2026-11-12T09:01:00.000Z", firmware: "1.4.2" },
  { id: "dev-desk", name: "Founder's desk display", location: "Founder office", kind: "Desktop 3D display", status: "Offline", allowed: ["u-owner", "u-ayesha"], requireId: true, lastSeen: "2026-11-09T17:20:00.000Z", firmware: "1.3.9" },
];
