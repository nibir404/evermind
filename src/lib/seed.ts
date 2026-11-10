// Seed data — replace with real API later.

export const user = {
  name: "Dr. Sabur Khan",
  first: "Dr. Khan",
  initials: "SK",
  title: "Chair, Board of Trustees",
  org: "Daffodil University Group",
  city: "Dhaka · GMT+6",
  languages: ["English", "Bangla"],
};

export const twin = {
  formed: 82,
  autonomy: "L2",
  memories: 1284,
  principles: 12,
  decisions: 418,
  sources: 96,
};

export const brief = {
  greeting: "Good morning",
  summary: "Three things need you today. Everything else is handled.",
};

export type Priority = { id: string; title: string; meta: string; tag: "Decide" | "Approve" | "Read" };
export const priorities: Priority[] = [
  { id: "p1", title: "FY27 budget — revised enrolment model", meta: "Board · due Thu", tag: "Decide" },
  { id: "p2", title: "Reply to Wollongong on joint PhD", meta: "Drafted by twin · 3 sources", tag: "Approve" },
  { id: "p3", title: "Incubator demo day summary", meta: "2 min read", tag: "Read" },
];

export type Approval = {
  id: string;
  kind: "Email" | "Calendar" | "Task" | "Memory";
  to: string;
  subject: string;
  body: string;
  confidence: number;
  sources: string[];
};
export const approvals: Approval[] = [
  {
    id: "a1",
    kind: "Email",
    to: "Prof. Lin, Wollongong",
    subject: "Joint PhD — next step",
    body: "Dear Prof. Lin,\n\nThank you for the thoughtful proposal. We are keen to move forward with a joint PhD in applied entrepreneurship. I'd suggest our deans meet in January to agree supervision and funding.\n\nWarm regards,\nSabur Khan",
    confidence: 92,
    sources: ["Board minutes · 14 Mar 2024", "Email thread · Oct 2026"],
  },
  {
    id: "a2",
    kind: "Calendar",
    to: "Rafiq Hasan",
    subject: "Move Founder office hours to Wed 4pm",
    body: "Conflict with the trustee call on Tuesday. Wednesday 4–5pm is free and you usually keep that slot for students.",
    confidence: 88,
    sources: ["Calendar pattern · 6 months"],
  },
  {
    id: "a3",
    kind: "Memory",
    to: "Your twin",
    subject: "New principle: 'Operator first'",
    body: "You said three times this month you'd rather be late with an operator you trust than early without one.",
    confidence: 81,
    sources: ["Interview · 4 Nov", "Board meeting · 12 Nov"],
  },
];

export type Message = { role: "you" | "twin"; text: string; sources?: string[]; visual?: "options" };
export const conversation: Message[] = [
  { role: "you", text: "Should we expand the Ashulia campus this year?" },
  {
    role: "twin",
    text: "I'd wait two quarters. You've said growth without operators is the risk you fear most, and the enrolment model still assumes 18% — the board questioned that last week.",
    sources: ["Board minutes · 12 Nov", "Your 2025 book, ch. 4", "FY26 admissions report"],
    visual: "options",
  },
];

export const history = [
  "Ashulia expansion",
  "Wollongong partnership",
  "Scholarship shortlist",
  "Incubator fund split",
  "Faculty hiring plan",
];

export const options = [
  { name: "Expand now", score: 42, note: "Operator not hired" },
  { name: "Wait two quarters", score: 86, note: "Matches 'Operator first'" },
  { name: "Partner instead", score: 64, note: "Lower control" },
];

export const decisions = [
  { id: "d1", title: "Expand Ashulia campus", status: "Open", date: "Nov 2026", lens: ["Operator first", "Students before margin"] },
  { id: "d2", title: "Incubator fund Tk 4.2 cr", status: "Approved", date: "Nov 2026", lens: ["Bet on founders"] },
  { id: "d3", title: "FY27 budget", status: "Deferred", date: "Dec 2026", lens: ["Careful about debt"] },
  { id: "d4", title: "Wollongong joint PhD", status: "In review", date: "Oct 2026", lens: ["Global partnerships"] },
];

export const principles = [
  "Operator first",
  "Students before margin",
  "Bold about education, careful about debt",
  "Listen longest to the quietest voice",
  "Never decide on the day",
];

export type BrainNode = { id: string; label: string; group: "principle" | "person" | "decision" | "memory"; detail: string };
export const brainNodes: BrainNode[] = [
  { id: "n1", label: "Operator first", group: "principle", detail: "Stated 9 times since 2019. Weighs every expansion." },
  { id: "n2", label: "Students before margin", group: "principle", detail: "Core to 31 decisions." },
  { id: "n3", label: "Prof. N. Ahmed", group: "person", detail: "Trusted on academic quality. 14 shared decisions." },
  { id: "n4", label: "Rafiq Hasan", group: "person", detail: "Chief of staff. Handles calendar and follow-ups." },
  { id: "n5", label: "2008 expansion", group: "memory", detail: "The lesson on debt that shaped every budget since." },
  { id: "n6", label: "Incubator fund", group: "decision", detail: "Approved Tk 4.2 cr, Nov 2026." },
  { id: "n7", label: "Ashulia campus", group: "decision", detail: "Open. Twin suggests waiting two quarters." },
  { id: "n8", label: "Wollongong", group: "person", detail: "Partner since 2021. Joint PhD in review." },
];

export const chapters = [
  { n: 1, title: "Where he began", status: "Approved" },
  { n: 2, title: "The 2008 lesson", status: "Approved" },
  { n: 3, title: "How he decides", status: "Draft" },
  { n: 4, title: "What he believes", status: "Draft" },
  { n: 5, title: "People he trusts", status: "Draft" },
  { n: 6, title: "What he hopes to leave", status: "Writing" },
];

export const chapterThree = {
  kicker: "Chapter Three",
  title: "How he decides",
  dek: "He listens longest to the person in the room with the least to gain, and he almost never answers on the day.",
  paragraphs: [
    "Sabur Khan rarely decides in the meeting itself. He hears every side, asks one more question than anyone expects, and then goes home. The answer usually comes the next morning, written by hand on the back of the agenda he carried all day.",
    "Colleagues have learned to read the pause. It is not doubt. It is the space he keeps for the person who spoke least, often a junior teacher or a student representative, whose view he will quietly test against his own overnight.",
    "When a choice is close, he leans toward whatever helps students most, even if it costs the institution in the short run. He is bold about education and careful about debt, a balance he learned the hard way in 2008, when an expansion he loved nearly sank the group.",
  ],
  quote: "I would rather lose a year than lose a student's trust. Years come back.",
  quoteSource: "From his convocation address, 2016 · Verified",
  closing:
    "People who work with him say he never makes them feel small for disagreeing. He does, however, remember who brought him the bad news early, and he tends to trust them with the next hard thing.",
};

export const activity = [
  { time: "09:42", text: "Drafted reply to Wollongong from 3 sources" },
  { time: "09:15", text: "Summarised trustee pre-read (14 pages)" },
  { time: "08:30", text: "Declined 2 meetings that conflict with your rules" },
  { time: "Yest.", text: "Learned 3 new memories — awaiting your review" },
];

export const autonomyLevels = [
  { level: "L0", name: "Remember & recall", desc: "Always on", locked: true, on: true },
  { level: "L1", name: "Advise", desc: "Answers with sources", on: true },
  { level: "L2", name: "Draft for my approval", desc: "Emails, replies, briefs", on: true },
  { level: "L3", name: "Act within limits", desc: "Only where you allow", on: false },
  { level: "L4", name: "Legal & financial", desc: "Always you. Never the twin.", locked: true, on: false, danger: true },
];

/** Sample text for the other chapters, so the whole book can be read, exported and shared. */
export const chapterSeeds: Record<number, { dek: string; paragraphs: string[] }> = {
  1: {
    dek: "A rented floor in Dhanmondi, six hundred students, and a promise that they would be employable.",
    paragraphs: [
      "He started with rented floors and borrowed furniture. The first intake was six hundred students, most of them the first in their families to attend university.",
      "From the start he measured one thing above the rest: whether graduates found work. Every course, every hire and every partnership was judged against it.",
      "Colleagues from those years remember long evenings and short meetings. He wanted decisions written down, owners named, and the next step agreed before anyone went home.",
    ],
  },
  2: {
    dek: "An expansion he loved nearly sank the group. The lesson on debt has shaped every decision since.",
    paragraphs: [
      "In 2008 he pushed for a fast expansion. The idea was right; the financing was not. When enrolment slowed, the debt did not.",
      "He spent the next two years paying it down, campus by campus. He has not financed an expansion beyond thirty percent debt since.",
      "He tells the story to young founders without softening it. Bold about education, careful about debt, he says, and never the other way round.",
    ],
  },
  4: {
    dek: "Students first, employability as the measure, and nothing impossible.",
    paragraphs: [
      "When a choice is close, he picks the option that helps students most, even when it costs the institution in the short run.",
      "He believes a university is judged by what its graduates do in their first year of work, not by its buildings.",
      "And he believes, stubbornly, that there is nothing impossible. He says it at every convocation, and he means it as an instruction.",
    ],
  },
  5: {
    dek: "He remembers who brought him the bad news early.",
    paragraphs: [
      "Prof. Rahman has been at his side on international partnerships for more than a decade. They disagree often and decide together.",
      "He trusts operators more than plans. A good plan with the wrong operator, he says, is a bad plan.",
      "He gives the quietest person in the room time to speak, and he remembers who was brave enough to bring him bad news early.",
    ],
  },
  6: {
    dek: "Institutions that outlast their founders.",
    paragraphs: [
      "He wants to build institutions that run well without him, with values written down and people trusted to apply them.",
      "This book, and the twin that learned from it, are part of that. Both are meant to carry his reasoning forward, never to replace the people who decide.",
    ],
  },
};
