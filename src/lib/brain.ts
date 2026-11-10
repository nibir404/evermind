// Seed data for the Knowledge brain (List / Graph / 3D views).
import type { NeuronType } from "@/components/three/brain-graph";

export type BrainItem = {
  id: string;
  label: string;
  type: NeuronType;
  status: "Verified" | "Confirmed" | "Inferred" | "Unknown";
  summary: string;
  source: string;
  date: string;
  strength: number; // 0-100, how often it shapes answers
  links: string[];
};

export const brain: BrainItem[] = [
  // Principles
  { id: "students-first", label: "Students first", type: "principle", status: "Confirmed", summary: "\"When a choice is close, I pick the option that helps the student most, even if it costs us in the short term.\"", source: "Your book, 2025 · p. 42", date: "Mar 2025", strength: 96, links: ["scholarship-22", "fee-freeze", "book-2025", "wollongong", "convocation-24", "employability"] },
  { id: "employability", label: "Employability is the core metric", type: "principle", status: "Confirmed", summary: "Every programme is judged by graduate jobs within 12 months.", source: "Strategy plan 2030", date: "Nov 2026", strength: 91, links: ["strategy-2030", "incubator-fund", "students-first"] },
  { id: "keep-specific", label: "Keep the line specific", type: "principle", status: "Confirmed", summary: "Start with one partner, one programme, then expand.", source: "Interview · session 2", date: "Nov 2026", strength: 84, links: ["wollongong", "caucasus-2019", "interview-2"] },
  { id: "operator-first", label: "Operator first", type: "principle", status: "Inferred", summary: "Rather late with a trusted operator than early without one.", source: "Interview · session 4", date: "Nov 2026", strength: 72, links: ["sylhet-defer", "chattogram", "interview-4"] },
  { id: "careful-debt", label: "Careful about debt", type: "principle", status: "Verified", summary: "No expansion financed beyond 30% debt since 2008.", source: "Board minutes 2008–2024", date: "2008", strength: 88, links: ["expansion-2008", "fy27-budget", "board-minutes"] },
  { id: "quiet-voice", label: "Listen to the quietest voice", type: "principle", status: "Inferred", summary: "Tests the view of the person who spoke least before deciding.", source: "Staff town halls", date: "2024", strength: 61, links: ["town-halls", "rahman"] },
  { id: "never-on-day", label: "Never decide on the day", type: "principle", status: "Confirmed", summary: "Decisions come the next morning, written by hand.", source: "Interview · session 1", date: "Oct 2026", strength: 79, links: ["interview-1", "fy27-budget"] },

  // Decisions
  { id: "wollongong", label: "Wollongong 2+2", type: "decision", status: "Verified", summary: "Approved in principle. Start with one joint pathway in Computer Science.", source: "UOW registrar reply", date: "Oct 2026", strength: 82, links: ["students-first", "keep-specific", "uow-reply", "rahman"] },
  { id: "scholarship-22", label: "Scholarship line for 2+2 intake", type: "decision", status: "Verified", summary: "40 full scholarships reserved for first cohort.", source: "DIU board minutes · 14", date: "Sep 2026", strength: 70, links: ["students-first", "wollongong"] },
  { id: "incubator-fund", label: "Incubator seed fund ৳4 crore", type: "decision", status: "Verified", summary: "Doubled after outcome review. Met expectations.", source: "Board minutes · Oct 2026", date: "Oct 2026", strength: 77, links: ["employability", "board-minutes"] },
  { id: "sylhet-defer", label: "Defer Sylhet expansion to 2027", type: "decision", status: "Verified", summary: "Recorded. Outcome review due March 2027.", source: "Decision record", date: "Nov 2026", strength: 66, links: ["operator-first", "careful-debt"] },
  { id: "chattogram", label: "Chattogram campus with partner", type: "decision", status: "Inferred", summary: "Analysis saved: proceed with a partner, not alone.", source: "Decision Studio", date: "Nov 2026", strength: 58, links: ["operator-first", "keep-specific"] },
  { id: "fy27-budget", label: "FY27 budget deferred", type: "decision", status: "Verified", summary: "Pending a revised enrolment model.", source: "Boardroom summary", date: "Nov 2026", strength: 63, links: ["careful-debt", "never-on-day"] },

  // Memories
  { id: "fee-freeze", label: "Fee freeze during 2020 floods", type: "memory", status: "Verified", summary: "Froze fees for 11,000 students for two semesters.", source: "Board minutes 2020", date: "2020", strength: 74, links: ["students-first"] },
  { id: "expansion-2008", label: "The 2008 expansion", type: "memory", status: "Verified", summary: "An expansion he loved nearly sank the group. The lesson on debt.", source: "Your book, 2025 · ch. 2", date: "2008", strength: 85, links: ["careful-debt"] },
  { id: "convocation-24", label: "Convocation 2024", type: "memory", status: "Verified", summary: "\"I would rather lose a year than lose a student's trust.\"", source: "Convocation transcript", date: "2024", strength: 69, links: ["students-first"] },
  { id: "caucasus-2019", label: "Caucasus University 2019", type: "memory", status: "Verified", summary: "Accreditation delayed a year; three partners at once was too many.", source: "Caucasus 2019 notes", date: "2019", strength: 71, links: ["keep-specific"] },
  { id: "town-halls", label: "Staff town halls", type: "memory", status: "Confirmed", summary: "Monthly since 2016. Junior faculty speak first.", source: "Staff town halls", date: "2016–", strength: 52, links: ["quiet-voice"] },

  // People
  { id: "rahman", label: "Prof. Rahman", type: "person", status: "Verified", summary: "Pro-VC International. 14 shared decisions. Trusted on intake numbers.", source: "Email · 312 threads", date: "Since 2014", strength: 80, links: ["wollongong", "quiet-voice"] },
  { id: "rafiq", label: "Rafiq Hasan", type: "person", status: "Verified", summary: "Executive assistant. Handles calendar and follow-ups.", source: "Calendar · 6 months", date: "Since 2019", strength: 64, links: ["fy27-budget"] },
  { id: "farhana", label: "Farhana Akter", type: "person", status: "Confirmed", summary: "Requested access to decisions and calendar.", source: "Access request", date: "Nov 2026", strength: 31, links: ["rafiq"] },
  { id: "ahmed", label: "Prof. N. Ahmed", type: "person", status: "Verified", summary: "Trusted on academic quality. Chairs the curriculum board.", source: "Board minutes", date: "Since 2011", strength: 67, links: ["scholarship-22"] },

  // Sources
  { id: "book-2025", label: "Your book, 2025", type: "source", status: "Verified", summary: "38 memories extracted. Primary source for tone and principles.", source: "PDF · 284 pages", date: "2025", strength: 93, links: ["students-first", "expansion-2008"] },
  { id: "strategy-2030", label: "Strategy plan 2030", type: "source", status: "Verified", summary: "18 memories and 4 decisions extracted. Verified by you on 3 Nov.", source: "PDF · 64 pages", date: "Nov 2026", strength: 76, links: ["employability"] },
  { id: "board-minutes", label: "DIU board minutes 2019–2025", type: "source", status: "Verified", summary: "24 decisions and their outcomes.", source: "14 documents", date: "2019–2025", strength: 81, links: ["careful-debt", "incubator-fund"] },
  { id: "uow-reply", label: "UOW registrar reply", type: "source", status: "Verified", summary: "Confirms accreditation renewed to 2031.", source: "Email", date: "Nov 2026", strength: 44, links: ["wollongong"] },
  { id: "interview-1", label: "Interview · session 1", type: "source", status: "Confirmed", summary: "How you decide. 42 minutes.", source: "Audio", date: "Oct 2026", strength: 58, links: ["never-on-day"] },
  { id: "interview-2", label: "Interview · session 2", type: "source", status: "Confirmed", summary: "Partnerships. 38 minutes.", source: "Audio", date: "Nov 2026", strength: 55, links: ["keep-specific"] },
  { id: "interview-4", label: "Interview · session 4", type: "source", status: "Confirmed", summary: "People and operators. 31 minutes.", source: "Audio", date: "Nov 2026", strength: 49, links: ["operator-first"] },
];

export const byId = Object.fromEntries(brain.map((b) => [b.id, b]));
export const typeLabel: Record<NeuronType, string> = { principle: "Principle", decision: "Decision", memory: "Memory", person: "Person", source: "Source" };

/* ---------- Every dot in the 3D brain is a record ----------
   The 3D field has FIELD_SIZE neurons; field index i has type TYPES[i % 5].
   Hand-written items above fill the first matching slots (pinned ones keep
   their fixed slot), and the remaining slots get generated, plausible records
   so every dot can be hovered and opened. */
export const FIELD_SIZE = 140;
const TYPES: NeuronType[] = ["principle", "decision", "memory", "person", "source"];
export const pinned3d: Record<string, number> = { "students-first": 5, wollongong: 21, "strategy-2030": 24, "convocation-24": 12, rahman: 18, "careful-debt": 40, "book-2025": 54 };

const pools: Record<NeuronType, { label: string; summary: string; source: string; date: string }[]> = {
  principle: [
    ["Prove it small, then scale", "Pilot with one cohort before committing a whole faculty.", "Interview · session 3", "Nov 2026"],
    ["Reputation compounds", "Turns down fast money that could cost trust with parents.", "Your book, 2025 · ch. 5", "2025"],
    ["Hire for character", "Weighs integrity above CVs for leadership roles.", "Board minutes 2017", "2017"],
    ["Technology serves teaching", "New tools must show better learning, not just novelty.", "AUAP keynote", "Nov 2026"],
    ["Pay vendors on time", "Treats suppliers as partners; late payment is a breach of trust.", "Finance committee", "2019"],
    ["Write it down", "Every major decision gets a one-page written rationale.", "Interview · session 1", "Oct 2026"],
    ["Rural students matter", "Seeks scholarships for students outside Dhaka.", "Scholarship committee", "2023"],
    ["Measure outcomes yearly", "Reviews every major decision 12 months later.", "Board minutes 2021", "2021"],
    ["Patience with founders", "Gives incubator teams two pilots before judging.", "Incubator charter", "2022"],
    ["Say no kindly", "Declines quickly and personally rather than leaving people waiting.", "Email patterns", "2024"],
  ].map(([label, summary, source, date]) => ({ label, summary, source, date })),
  decision: [
    ["Free laptop programme", "Extended to 6,000 first-year students with a skills course.", "Board resolution", "Sep 2026"],
    ["Close evening MBA intake", "Low enrolment for three terms; faculty moved to executive MBA.", "Board minutes 2024", "2024"],
    ["Telemedicine pilot", "Two districts, only with a licensed medical partner.", "Decision Studio", "Nov 2026"],
    ["Solar roof on Smart City", "Approved after a 6-year payback case.", "Facilities committee", "2023"],
    ["Hostel fee cap", "Capped increases at 5% for three years.", "Board minutes 2022", "2022"],
    ["Join AUAP board", "Accepted a two-year term to raise DIU's profile.", "Email", "2025"],
    ["Pause new ICT venture", "Waited for a proven operator before launch.", "Investment committee", "2024"],
    ["Industry advisory panels", "Every department gets an employer panel.", "Academic council", "2021"],
  ].map(([label, summary, source, date]) => ({ label, summary, source, date })),
  memory: [
    ["First campus in Dhanmondi", "Started with rented floors and 600 students.", "Your book, 2025 · ch. 1", "2002"],
    ["Graduate who founded a startup", "A 2016 graduate now employs 300 people.", "Convocation transcript", "2023"],
    ["Visit to Wollongong", "Walked the campus with the registrar; agreed to start small.", "Travel notes", "Sep 2026"],
    ["COVID online switch", "Moved 20,000 students online in nine days.", "Board minutes 2020", "2020"],
    ["Letter from a parent", "Thanked him for keeping fees flat in the floods.", "Letters archive", "2020"],
    ["Budapest keynote", "Spoke on quality over speed in partnerships.", "AUAP keynote", "Nov 2026"],
    ["The failed franchise deal", "Walked away when the partner wanted to cut faculty pay.", "Interview · session 4", "2015"],
    ["Opening Smart City", "Ashulia campus opened with 12,000 students.", "Press archive", "2016"],
  ].map(([label, summary, source, date]) => ({ label, summary, source, date })),
  person: [
    ["Dr. M. Lutfar Rahman", "Vice-Chancellor. Trusted on academic policy.", "Board minutes", "Since 2012"],
    ["Ayesha Khan", "Family. Beneficiary in Digital Legacy.", "Legacy settings", "Since 2026"],
    ["Prof. Lee", "UOW International Office lead on the 2+2 pathway.", "Email · 18 threads", "Since 2026"],
    ["Tanvir Alam", "Incubator director. Runs demo days.", "Calendar", "Since 2020"],
    ["Nusrat Jahan", "Head of student affairs.", "Email · 96 threads", "Since 2018"],
    ["Kamal Uddin", "Finance director. Owns the FY27 model.", "Finance committee", "Since 2015"],
    ["Ms. Chowdhury", "Event organiser who requested sponsorship.", "Email", "Nov 2026"],
  ].map(([label, summary, source, date]) => ({ label, summary, source, date })),
  source: [
    ["Annual report 2025", "Group-wide numbers across 50+ concerns.", "PDF · 84 pages", "2025"],
    ["Employability survey 2025", "Placement by department; two below target.", "Survey export", "Nov 2026"],
    ["Interview · session 3", "Growth and pilots. 35 minutes.", "Audio", "Nov 2026"],
    ["AUAP keynote transcript", "17 memories on partnerships.", "Audio transcript", "Nov 2026"],
    ["Convocation speeches", "Five speeches, 2019–2024.", "Transcripts", "2019–2024"],
    ["Email archive · 2024", "Tone and stakeholder patterns.", "Mailbox export", "2024"],
    ["Press archive", "Interviews and coverage since 2002.", "Clippings", "2002–2026"],
  ].map(([label, summary, source, date]) => ({ label, summary, source, date })),
};

const statuses: BrainItem["status"][] = ["Verified", "Confirmed", "Inferred", "Inferred", "Unknown"];
const generated: BrainItem[] = [];
const slots: (string | undefined)[] = Array(FIELD_SIZE).fill(undefined);
Object.entries(pinned3d).forEach(([id, at]) => { slots[at] = id; });
const queue: Record<NeuronType, string[]> = { principle: [], decision: [], memory: [], person: [], source: [] };
brain.filter((b) => !(b.id in pinned3d)).forEach((b) => queue[b.type].push(b.id));
const used: Record<NeuronType, number> = { principle: 0, decision: 0, memory: 0, person: 0, source: 0 };
for (let i = 0; i < FIELD_SIZE; i++) {
  if (slots[i]) continue;
  const t = TYPES[i % 5];
  const real = queue[t].shift();
  if (real) { slots[i] = real; continue; }
  const pool = pools[t];
  const n = used[t]++;
  const base = pool[n % pool.length];
  const round = Math.floor(n / pool.length);
  const anchor = brain.filter((b) => b.type === t);
  const id = `${t}-gen-${i}`;
  generated.push({
    id,
    label: round ? `${base.label} (${round + 1})` : base.label,
    type: t,
    status: statuses[(i * 7) % statuses.length],
    summary: base.summary,
    source: base.source,
    date: base.date,
    strength: 20 + ((i * 37) % 60),
    links: [anchor[i % anchor.length]?.id].filter(Boolean) as string[],
  });
  slots[i] = id;
}
export const allBrain: BrainItem[] = [...brain, ...generated];
/** Field index → record id, for the 3D view. */
export const fieldIds = slots as string[];
Object.assign(byId, Object.fromEntries(generated.map((g) => [g.id, g])));
