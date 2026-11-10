"use client";

import { memorySeed } from "./memories";
import { useCallback, useMemo, useSyncExternalStore } from "react";

export const PREFIX = "evermind.demo.v1.";
const eventName = "evermind:change";
function subscribe(fn: () => void) {
  window.addEventListener(eventName, fn);
  window.addEventListener("storage", fn);
  return () => { window.removeEventListener(eventName, fn); window.removeEventListener("storage", fn); };
}
export function notify(message: string) { window.dispatchEvent(new CustomEvent("evermind:notice", { detail: message })); }
export function readDemo<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
export function writeDemo<T>(key: string, value: T) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); window.dispatchEvent(new Event(eventName)); return true; }
  catch { notify("Could not save. Browser storage may be full or unavailable. Export your data and try again."); return false; }
}
export function useDemo<T>(key: string, seed: T | (() => T)): [T, (value: T | ((old: T) => T)) => void] {
  const fallback = useMemo(() => typeof seed === "function" ? (seed as () => T)() : seed, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(PREFIX + key); } catch { return null; } }, () => null);
  const value = useMemo(() => { try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }, [raw, fallback]);
  const set = useCallback((next: T | ((old: T) => T)) => { const current = readDemo(key, fallback); writeDemo(key, typeof next === "function" ? (next as (old: T) => T)(current) : next); }, [key, fallback]);
  return [value, set];
}
export type AuditEvent = { id: string; title: string; time: string; kind: string };
export function audit(title: string, kind = "Account") {
  const events = readDemo<AuditEvent[]>("audit", []);
  writeDemo("audit", [{ id: crypto.randomUUID(), title, kind, time: new Date().toISOString() }, ...events].slice(0, 500));
}
export function download(name: string, data: unknown, plain = false) {
  const url = URL.createObjectURL(new Blob([plain ? String(data) : JSON.stringify(data, null, 2)], { type: plain ? "text/plain" : "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const profileSeed = { name: "Dr. Sabur Khan", title: "Chair, Board of Trustees", org: "Daffodil University Group", email: "s.khan@wollongong-group.edu", bio: "Founder-educator focused on access to education, entrepreneurship and international partnerships.", language: "English (UK)", timezone: "Asia/Dhaka", photo: "" };
export const preferenceSeed = { formality: 60, directness: 72, length: 25, approvals: true, stakeholders: true, knowledge: true, actions: false, advise: true, draft: true, act: false, retention: "12 months", plan: "Executive", paused: false, retired: false, twoFactor: true };
export type RecordItem = { id: string; title: string; body: string; status: string; category: string; date: string; source: string; owner?: string };
const record = (id: string, title: string, body: string, status: string, category: string, source = "Seeded demo record", date = "2026-11-10"): RecordItem => ({ id, title, body, status, category, date, source });
export const moduleSeeds: Record<string, RecordItem[]> = {
  knowledge: [record("k1", "Entrepreneurship book, 2025", "38 memories from the founder’s account of education and leadership. Students come first; partnerships begin with one programme.", "Ready", "Book", "Book, chapter 3"), record("k2", "DIU board minutes 2019–2025", "24 decisions including the Wollongong 2+2 pathway and the first-cohort review.", "Ready", "Minutes", "Board minutes"), record("k3", "AUAP keynote, Budapest", "17 memories about access to education and graduate employability.", "Ready", "Audio", "Keynote transcript"), record("k4", "Board pack Sept.pptx", "Password-protected document. Replace with an accessible document or add a text summary.", "Needs attention", "Presentation")],
  decisions: [record("d1", "Wollongong 2+2 pathway", "Start with one partner. Review faculty capacity before adding a second in Q3 2027.", "In review", "Partnerships", "Board minutes · book p. 42"), record("d2", "Defer Sylhet expansion to 2027", "Wait for a trusted operator and revised enrolment model. Review in March 2027.", "Deferred", "Expansion"), record("d3", "Incubator seed fund doubled", "Fund increased to ৳4 crore after the outcome review.", "Completed", "Investment")],
  tasks: [record("t1", "Review scholarship shortlist", "Review first cohort with Prof. Rahman. Return a recommendation to the board.", "Open", "High", "Board agenda"), record("t2", "Prepare partnership brief", "Summarise the Wollongong agreement and outstanding faculty questions.", "In progress", "Medium")],
  calendar: [record("c1", "DIU Board of Trustees · Q4", "10:00–11:00 · Zoom · Nine members. Review budget and partnership intake.", "Scheduled", "Board", "Demo calendar", "2026-11-12"), record("c2", "Founder office hours", "16:00–17:00 · Ashulia campus.", "Scheduled", "Mentoring", "Demo calendar", "2026-11-18"), record("c3", "Wollongong partnership call", "15:00–15:30 · Teams · Prof. Lee and the International Office.", "Scheduled", "Partnerships", "Demo calendar", "2026-11-14")],
  email: [record("e1", "Reply to University of Wollongong", "Dear Professor,\n\nLet us begin with one joint pathway in Computer Science, then review before adding more programmes.\n\nWarm regards,\nSabur Khan", "Draft", "Partnerships", "partnerships@uow.edu.au")],
  boardroom: [record("b1", "DIU Board of Trustees · Q4", "Agenda: 1. Graduate employability. 2. New campus budget. 3. Wollongong pathway.\nAll 9 participants have consented to the disclosed, non-voting AI observer.", "Ready", "9/9 consent", "Zoom · 10:00", "2026-11-12"), record("b2", "Incubator investment committee", "Review the new cohort. Two participant consents remain outstanding.", "Awaiting consent", "4/6 consent", "Teams · 15:00", "2026-11-18")],
  access: [record("s1", "Students · DIU", "Education topics only. Private legal, family, financial and health information is excluded.", "Active", "Advise only", "1,240 demo members"), record("s2", "Founders · Incubator", "ICT and entrepreneurship topics only.", "Active", "Advise only", "86 demo members"), record("s3", "Farhana Akter", "Requested access to decisions and calendar. No private memories.", "Pending", "Draft for approval", "farhana@example.com")],
  legacy: [record("l1", "Life story archive", "Stories and values from the biography. Business actions and private financial information are excluded.", "Complete", "Archive"), record("l2", "Ayesha Khan", "May access approved family stories and education values after a reviewed activation.", "Verified", "Beneficiary"), record("l3", "Zara Khan", "Identity verification is pending in this demo scenario.", "Pending", "Beneficiary"), record("l4", "Legacy instructions", "Share approved stories only. Never speak for my businesses, sign documents or make binding decisions.", "Draft", "Instructions")],
  rules: [record("r1", "Always ask before sending", "Emails, invitations and messages must be placed in Approvals before any simulated delivery.", "Active", "L2"), record("r2", "Protect legal and financial decisions", "The twin may provide context but cannot approve or execute binding actions.", "Locked", "L4")],
  support: [record("h1", "How do I correct a memory?", "Open Memories, choose a record, and use Correct. Changes are saved locally and recorded in the audit trail.", "Guide", "Help"), record("h2", "Where is my data stored?", "This demo stores edits in this browser only. Export from Settings → Your data. No external messages or payments are sent.", "Guide", "Help")],
};
export const moduleTitles: Record<string, [string, string, string]> = {
  knowledge: ["07 · Knowledge", "What your twin knows.", "Sources, principles and evidence, in one place."],
  decisions: ["06 · Decision Studio", "A record of your judgment.", "Compare options, record a decision and review the outcome."],
  tasks: ["09.02 · Tasks", "Move the important things forward.", "A clear owner and a next step for every task."],
  calendar: ["09.05 · Calendar", "Make room for what matters.", "Your upcoming commitments and meeting holds."],
  email: ["09.06 · Email assistance", "Your voice. Your approval.", "Review every draft before a simulated send."],
  boardroom: ["10 · Boardroom", "Your twin observes. You decide.", "A disclosed, non-voting AI observer. Demo meetings only."],
  access: ["11 · Access & governance", "Who can talk to your twin.", "Manage demo stakeholders, permissions and private topics."],
  legacy: ["12 · Digital Legacy", "What remains, on your terms.", "Stories and values shared only under the instructions you choose."],
  rules: ["09.04 · Delegation", "You set the boundaries.", "Explicit rules for every action your twin prepares."],
  support: ["13.06 · Help & support", "A little help, when you need it.", "Explore the guides or create a local support request."],
};
export function addRecord(module: string, item: RecordItem) { writeDemo(module, [item, ...readDemo(module, moduleSeeds[module] ?? [])]); audit(`Created ${item.title}`, module); }
export function answerDemo(question: string) {
  const words = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const records = [...readDemo("knowledge", moduleSeeds.knowledge), ...readDemo("decisions", moduleSeeds.decisions), ...readDemo("memories",memorySeed).map(m=>({title:m.t,body:m.d,source:m.src}))];
  const scored = records.map(r => ({ r, n: words.filter(w => (r.title + " " + r.body).toLowerCase().includes(w)).length })).sort((a, b) => b.n - a.n);
  if (!scored[0]?.n) return "I don’t have enough evidence in the demo sources to answer that. Add a source or teach a memory, then ask again. This is an unknown, not a verified claim.";
  return `Based on ${scored[0].r.title}: ${scored[0].r.body}\n\nSource: ${scored[0].r.source}. Seeded evidence; please review before acting.`;
}
