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
  const events = readDemo<AuditEvent[]>("audit", auditSeed);
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
  knowledge: [
    record("k1", "Entrepreneurship book, 2025", "38 memories from the founder’s account of education and leadership. Students come first; partnerships begin with one programme.", "Ready", "Book", "Book, chapter 3", "2026-11-02"),
    record("k2", "DIU board minutes 2019–2025", "24 decisions including the Wollongong 2+2 pathway and the first-cohort review.", "Ready", "Minutes", "Board minutes", "2026-11-02"),
    record("k3", "AUAP keynote, Budapest", "17 memories on global partnerships, quality assurance and why universities should start small and prove outcomes.", "Ready", "Speech", "Audio transcript", "2026-11-03"),
    record("k4", "Founder interview with the twin", "41 answers on how he decides: operator first, students first, one partner at a time.", "Reviewed", "Interview", "Voice interview", "2026-11-01"),
    record("k5", "Daffodil Family annual report 2025", "Group-wide numbers across 50+ concerns: education, ICT and health. Used for context only.", "Processing", "Report", "PDF · 84 pages", "2026-11-08"),
    record("k6", "Employability survey, class of 2025", "Graduate placement by department. Two departments below target; a follow-up is pending.", "Needs review", "Data", "Survey export", "2026-11-09"),
    record("k7", "Scanned letters archive", "Unsupported ZIP. Re-upload as PDF to include these letters.", "Failed", "Archive", "Upload", "2026-11-09"),
  ],
  decisions: [
    record("d1", "Wollongong 2+2 pathway", "Start with one partner. Review faculty capacity before adding a second in Q3 2027.", "In review", "Partnerships", "Board minutes · book p. 42", "2026-11-10"),
    record("d2", "Defer Sylhet expansion to 2027", "Wait for a trusted operator and revised enrolment model. Review in March 2027.", "Deferred", "Expansion", "Board minutes 2025", "2026-10-28"),
    record("d3", "Incubator seed fund doubled", "Raise the seed fund to BDT 4 crore. Founders must show a working pilot before the second tranche.", "Recorded", "Investment", "Investment committee", "2026-10-14"),
    record("d4", "Free laptop programme, phase 2", "Extend to 6,000 first-year students. Pair each laptop with a digital-skills course.", "Recorded", "Students", "Board resolution", "2026-09-30"),
    record("d5", "Health concern: telemedicine pilot", "Pilot in two districts with a medical partner. No launch without a licensed operator.", "Draft", "Health", "Interview · health", "2026-11-06"),
    record("d6", "Close the evening MBA intake", "Low enrolment for three terms. Redirect faculty to the executive programme.", "Outcome reviewed", "Programmes", "Board minutes 2024", "2026-06-12"),
  ],
  tasks: [
    record("t1", "Review scholarship shortlist", "Review first cohort with Prof. Rahman. Return a recommendation to the board.", "Open", "High", "Board agenda", "2026-11-11"),
    record("t2", "Prepare partnership brief", "Summarise the Wollongong agreement and outstanding faculty questions.", "In progress", "Medium", "Twin draft", "2026-11-12"),
    record("t3", "Sign off Q4 budget notes", "Read the finance committee notes before the board meeting on Thursday.", "Open", "High", "Finance committee", "2026-11-12"),
    record("t4", "Call the Sylhet operator candidate", "Introductory call. Ask about their last two campus launches.", "Open", "Medium", "Expansion", "2026-11-14"),
    record("t5", "Record a video for orientation", "Two minutes for first-year students on why there is nothing impossible.", "In progress", "Low", "Student affairs", "2026-11-18"),
    record("t6", "Approve incubator cohort list", "12 founders shortlisted. Twin flagged two with incomplete pilots.", "Completed", "High", "Incubator", "2026-11-05"),
    record("t7", "Thank-you note to AUAP organisers", "Short personal note after the Budapest keynote.", "Completed", "Low", "Email", "2026-11-04"),
  ],
  calendar: [
    record("c1", "DIU Board of Trustees · Q4", "10:00–11:00 · Zoom · Nine members. Review budget and partnership intake.", "Scheduled", "Board", "Demo calendar", "2026-11-12"),
    record("c2", "Founder office hours", "16:00–17:00 · Ashulia campus.", "Scheduled", "Mentoring", "Demo calendar", "2026-11-18"),
    record("c3", "Wollongong partnership call", "15:00–15:30 · Teams · Prof. Lee and the International Office.", "Scheduled", "Partnerships", "Demo calendar", "2026-11-14"),
    record("c4", "Incubator demo day", "14:00–17:00 · Daffodil Smart City auditorium. 12 founders pitch.", "Scheduled", "Incubator", "Demo calendar", "2026-11-21"),
    record("c5", "Hold: Sylhet site visit", "Full day · Proposed by the twin. Needs your approval before invites go out.", "Draft", "Expansion", "Twin proposal", "2026-11-26"),
    record("c6", "Convocation rehearsal", "09:00–10:30 · Main campus.", "Scheduled", "Students", "Demo calendar", "2026-12-02"),
  ],
  email: [
    record("e1", "Reply to University of Wollongong", "Dear Professor,\n\nLet us begin with one joint pathway in Computer Science, then review before adding more programmes.\n\nWarm regards,\nSabur Khan", "Draft", "Partnerships", "partnerships@uow.edu.au", "2026-11-10"),
    record("e2", "Thank you, AUAP organisers", "Dear colleagues,\n\nThank you for a generous welcome in Budapest. The conversations on quality will stay with our team.\n\nWith gratitude,\nSabur Khan", "Sent (demo)", "Relations", "secretariat@auap.org", "2026-11-04"),
    record("e3", "Scholarship committee: next steps", "Dear Prof. Rahman,\n\nPlease share the shortlist by Wednesday. I would like students from outside Dhaka represented.\n\nBest,\nSabur", "Awaiting approval", "Students", "rahman@diu.edu.bd", "2026-11-09"),
    record("e4", "Decline: sponsorship request", "Dear Ms. Chowdhury,\n\nThank you for thinking of us. This year our support is focused on student programmes, so we must decline.\n\nKind regards,\nSabur Khan", "Draft", "Requests", "events@example.com", "2026-11-08"),
    record("e5", "Welcome, new incubator founders", "Dear founders,\n\nWelcome. Build something real, show it working, and we will back you.\n\nSabur Khan", "Draft", "Incubator", "founders@diu-incubator.org", "2026-11-07"),
  ],
  boardroom: [
    record("b1", "DIU Board of Trustees · Q4", "Agenda: 1. Graduate employability. 2. New campus budget. 3. Wollongong pathway.\nAll 9 participants have consented to the disclosed, non-voting AI observer.", "Ready", "9/9 consent", "Zoom · 10:00", "2026-11-12"),
    record("b2", "Incubator investment committee", "Review the new cohort. Two participant consents remain outstanding.", "Awaiting consent", "4/6 consent", "Ashulia · 14:00", "2026-11-19"),
    record("b3", "Academic council · October", "Summary approved. Actions: revise the employability survey; report back in December.", "Summary approved", "11/11 consent", "Main campus", "2026-10-22"),
    record("b4", "Health concerns review", "Observer transcript captured. Summary waiting for your review.", "Summary pending", "7/7 consent", "Teams · 11:00", "2026-11-06"),
  ],
  access: [
    record("s1", "Students · DIU", "Education topics only. Private legal, family, financial and health information is excluded.", "Active", "Advise only", "1,240 demo members", "2026-10-01"),
    record("s2", "Founders · Incubator", "ICT and entrepreneurship topics only.", "Active", "Advise only", "86 demo members", "2026-10-01"),
    record("s3", "Farhana Akter", "Requested access to decisions and calendar. No private memories.", "Pending", "Draft for approval", "farhana@example.com", "2026-11-09"),
    record("s4", "Leadership team", "Drafts for approval across all business topics. Legal and financial stay locked.", "Active", "Draft for approval", "12 demo members", "2026-10-15"),
    record("s5", "Alumni network", "Stories only. Access paused after the pilot ended.", "Revoked", "Stories only", "3,400 demo members", "2026-08-30"),
  ],
  legacy: [
    record("l1", "Life story archive", "Stories and values from the biography. Business actions and private financial information are excluded.", "Complete", "Archive", "Biography", "2026-10-20"),
    record("l2", "Ayesha Khan", "May access approved family stories and education values after a reviewed activation.", "Verified", "Beneficiary", "Family", "2026-10-21"),
    record("l3", "Zara Khan", "Identity verification is pending in this demo scenario.", "Pending", "Beneficiary", "Family", "2026-10-21"),
    record("l4", "Letter to future students", "A recorded message to be shared at convocation each year.", "Complete", "Message", "Voice note", "2026-10-25"),
    record("l5", "Values statement", "Students first. Start with one. There is nothing impossible.", "Complete", "Values", "Book · interview", "2026-10-25"),
  ],
  rules: [
    record("r1", "Always ask before sending", "Emails, invitations and messages must be placed in Approvals before any simulated delivery.", "Active", "L2", "Your boundary", "2026-10-01"),
    record("r2", "Protect legal and financial decisions", "The twin may provide context but cannot approve or execute binding actions.", "Locked", "L4", "System", "2026-10-01"),
    record("r3", "Decline sponsorships politely", "Draft a polite decline for sponsorship requests outside student programmes.", "Active", "L2", "Your boundary", "2026-10-12"),
    record("r4", "Hold calendar slots for the board", "Propose holds for board prep two days before each meeting.", "Active", "L2", "Your boundary", "2026-10-12"),
    record("r5", "Answer students after hours", "Advise students on education topics outside office hours.", "Paused", "L1", "Your boundary", "2026-10-18"),
  ],
  support: [
    record("h1", "How do I correct a memory?", "Open Memories, choose a record, and use Correct. Changes are saved locally and recorded in the audit trail.", "Guide", "Help", "Help centre", "2026-10-01"),
    record("h2", "Where is my data stored?", "This demo stores edits in this browser only. Export from Settings → Your data. No external messages or payments are sent.", "Guide", "Help", "Help centre", "2026-10-01"),
    record("h3", "How do approvals work?", "The twin drafts. You approve, edit or decline in Approvals. Nothing leaves without your sign-off.", "Guide", "Help", "Help centre", "2026-10-01"),
    record("h4", "Restore the sample data", "Settings → Your data → Reset demo. Everything returns to the original sample workspace.", "Guide", "Help", "Help centre", "2026-10-01"),
    record("h5", "Voice input doesn’t start", "Allow microphone access in your browser. Without it, Talk uses a sample question.", "Open", "Request", "Your request", "2026-11-09"),
  ],
};
export const approvalQueueSeed: RecordItem[] = [
  { ...moduleSeeds.email[2], id: "q1", status: "Pending", category: "email", owner: "e3" },
  { ...moduleSeeds.calendar[4], id: "q2", status: "Pending", category: "calendar", owner: "c5" },
];
export const auditSeed: AuditEvent[] = [
  { id: "a1", title: "Approved reply to AUAP organisers (demo)", kind: "Approvals", time: "2026-11-04T09:42:00.000Z" },
  { id: "a2", title: "Created Approve incubator cohort list", kind: "tasks", time: "2026-11-05T04:10:00.000Z" },
  { id: "a3", title: "Verified Students first in every partnership", kind: "Memory", time: "2026-11-06T06:30:00.000Z" },
  { id: "a4", title: "Health concerns review: Summary pending", kind: "boardroom", time: "2026-11-06T07:15:00.000Z" },
  { id: "a5", title: "Farhana Akter requested access", kind: "Access", time: "2026-11-09T03:05:00.000Z" },
  { id: "a6", title: "Scanned letters archive failed to import", kind: "knowledge", time: "2026-11-09T05:20:00.000Z" },
];
export const moduleTitles: Record<string, [string, string, string]> = {
  knowledge: ["Knowledge", "What your twin knows.", "Sources, principles and evidence, in one place."],
  decisions: ["Decision Studio", "A record of your judgment.", "Compare options, record a decision and review the outcome."],
  tasks: ["Tasks", "Move the important things forward.", "A clear owner and a next step for every task."],
  calendar: ["Calendar", "Make room for what matters.", "Your upcoming commitments and meeting holds."],
  email: ["Email", "Your voice. Your approval.", "Review every draft before a simulated send."],
  boardroom: ["Boardroom", "Your twin observes. You decide.", "A disclosed, non-voting AI observer. Demo meetings only."],
  access: ["Access", "Who can talk to your twin.", "Manage demo stakeholders, permissions and private topics."],
  legacy: ["Digital Legacy", "What remains, on your terms.", "Stories and values shared only under the instructions you choose."],
  rules: ["Delegation", "You set the boundaries.", "Explicit rules for every action your twin prepares."],
  support: ["Help", "A little help, when you need it.", "Explore the guides or create a local support request."],
};
export function addRecord(module: string, item: RecordItem) { writeDemo(module, [item, ...readDemo(module, module === "approval-queue" ? approvalQueueSeed : moduleSeeds[module] ?? [])]); audit(`Created ${item.title}`, module); }
export function answerDemo(question: string) {
  const words = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const records = [...readDemo("knowledge", moduleSeeds.knowledge), ...readDemo("decisions", moduleSeeds.decisions), ...readDemo("memories",memorySeed).map(m=>({title:m.t,body:m.d,source:m.src}))];
  const scored = records.map(r => ({ r, n: words.filter(w => (r.title + " " + r.body).toLowerCase().includes(w)).length })).sort((a, b) => b.n - a.n);
  if (!scored[0]?.n) return "I don’t have enough evidence in the demo sources to answer that. Add a source or teach a memory, then ask again. This is an unknown, not a verified claim.";
  return `Based on ${scored[0].r.title}: ${scored[0].r.body}\n\nSource: ${scored[0].r.source}. Seeded evidence; please review before acting.`;
}
