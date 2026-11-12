"use client";
import Link from "next/link";
import { useDemo, profileSeed, preferenceSeed, audit, notify, addRecord } from "@/lib/demo";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Mic, Pencil, Shield, Upload, FileText, Loader2 } from "lucide-react";
import { Button, ease } from "@/components/ui";
import { autonomyLevels } from "@/lib/seed";

const STEPS = ["Welcome", "About you", "Interview", "Knowledge", "Review", "Boundaries", "Ready"];
const PRIORITIES = ["Student employability", "Founder incubator", "Research", "Global partnerships", "Financial discipline", "Campus growth", "Faculty"];

export default function Onboarding() {
  const [step, setStep] = useDemo("onboarding-step",0);
  const [dir, setDir] = useState(1);
  const router = useRouter();
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const next = () => { audit(`Completed onboarding step ${STEPS[step]}`,"Onboarding"); if(step < STEPS.length-1) go(step+1); else router.push("/first-day"); };

  return (
    <div className="onboarding-screen relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(212,242,106,0.3),transparent_70%)]" />
      {/* Top bar */}
      <header className="onboarding-header relative z-10 flex h-20 items-center gap-6 px-8">
        <span className="grid size-8 place-items-center rounded-full bg-lime">
          <span className="size-3 rounded-full border-[2.5px] border-ink" />
        </span>
        {step > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => i < step && go(i)} aria-label={s} className="h-6 py-[11px]">
                <span className="block h-[3px] w-14 overflow-hidden rounded-full bg-[#DCDCE0]">
                  <motion.span
                    className={`block h-full ${i < step ? "bg-pine" : "bg-lime"}`}
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease }}
                  />
                </span>
              </button>
            ))}
            <span className="ml-3 text-[13px] text-mute">Step {step + 1} of 7 · {STEPS[step]}</span>
          </motion.div>
        )}
        <div className="flex-1" />
        <Link href="/home" className="text-[13px] text-slate">{step === 0 ? "Explore demo workspace →" : "Save & exit"}</Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-8 pb-16">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -40, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease }}
            className="w-full"
          >
            {step === 0 && <Welcome onNext={next} />}
            {step === 1 && <AboutYou onNext={next} />}
            {step === 2 && <Interview onNext={next} />}
            {step === 3 && <Knowledge onNext={next} />}
            {step === 4 && <Review onNext={next} />}
            {step === 5 && <Boundaries onNext={next} />}
            {step === 6 && <Ready onNext={next} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Center({ title, sub, children }: { title: React.ReactNode; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[880px] flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="display text-[56px] leading-[1.05]">{title}</h1>
        {sub && <p className="max-w-[560px] text-[19px] text-slate">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

const BigBtn = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <Button onClick={onClick} className="h-12 px-8 text-[16px]">{children}</Button>
);

function Welcome({ onNext }: { onNext: () => void }) {
 const [user]=useDemo("profile",profileSeed);
  return (
    <Center title={<>Hello, {user.name}.</>} sub="Let's build a twin that thinks the way you do. Just a conversation — no forms.">
      <div className="flex gap-10 text-[15px] text-slate">
        {[
          [Mic, "Talk"],
          [Check, "Confirm"],
          [Shield, "Set limits"],
        ].map(([I, l]) => {
          const Icon = I as typeof Mic;
          return (
            <span key={l as string} className="flex items-center gap-2">
              <Icon size={17} strokeWidth={1.7} className="text-pine" /> {l as string}
            </span>
          );
        })}
      </div>
      <BigBtn onClick={onNext}>Begin</BigBtn>
      <p className="text-[13px] text-mute">Nothing is kept until you approve it.</p>
    </Center>
  );
}

function AboutYou({ onNext }: { onNext: () => void }) {
 const [user,setUser]=useDemo("profile",profileSeed);
  const [picked, setPicked] = useDemo<string[]>("onboarding-priorities",PRIORITIES.slice(0, 2));
  const toggle = (p: string) =>
    setPicked((xs) => (xs.includes(p) ? xs.filter((x) => x !== p) : xs.length < 3 ? [...xs, p] : xs));
  return (
    <Center title="Tell us who you are." sub="Founder, chairman or managing director. Edit anything below.">
      <div className="surface w-[620px] text-left">
        <div className="flex items-center gap-4 p-6">
          <span className="size-14 shrink-0 rounded-full" style={{ backgroundColor: "#fff", backgroundImage: "url(/twin/portrait-white.png)", backgroundSize: "200%", backgroundPosition: "50% 10%" }} />
          <div className="flex-1">
            <input aria-label="Your full name" value={user.name} onChange={e=>setUser(u=>({...u,name:e.target.value}))} placeholder="Your full name" className="w-full bg-transparent text-[20px] font-semibold outline-none" />
            <div className="flex gap-2 text-[14px] text-slate">
              <input aria-label="Your title" value={user.title} onChange={e=>setUser(u=>({...u,title:e.target.value}))} placeholder="Title, e.g. Chairman" className="w-1/2 bg-transparent outline-none" />
              <input aria-label="Your company" value={user.org} onChange={e=>setUser(u=>({...u,org:e.target.value}))} placeholder="Company or group" className="w-1/2 bg-transparent outline-none" />
            </div>
          </div>
          <Pencil size={16} className="text-mute" aria-hidden />
        </div>
        <div className="border-t border-line px-6 py-4">
          <p className="mb-3 text-[13px] text-mute">What matters most right now? Pick up to three.</p>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const on = picked.includes(p);
              return (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggle(p)}
                  className={`flex h-9 items-center gap-1.5 rounded-[4px] px-3 text-[14px] transition-colors duration-200 ${on ? "bg-pine text-white" : "bg-canvas text-ink hover:bg-[#ECECEF]"}`}
                >
                  {on && <Check size={14} className="text-lime" />} {p}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      <BigBtn onClick={onNext}>Yes, that&apos;s me</BigBtn>
    </Center>
  );
}

function Interview({ onNext }: { onNext: () => void }) {
  const [listening, setListening] = useState(false);
  const [response,setResponse]=useDemo("interview-response","Almost always the people. I would rather be late with an operator I trust than early without one.");
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-12">
      <div className="flex flex-col gap-8">
        <p className="eyebrow text-pine">Question 5 of 10 · How you decide</p>
        <h1 className="display text-[52px] leading-[1.05]">The team isn&apos;t ready. What decides it for you?</h1>
        <div className="surface p-5">
          <textarea aria-label="Interview response" className="mb-4 w-full text-[17px] leading-relaxed" rows={4} value={response} onChange={e=>setResponse(e.target.value)}/><p className="demo-muted">Demo interview · type your response. Audio recording is not used.</p>
          <div className="flex items-center gap-3">
            <button aria-label="Toggle demo waveform" onClick={() => setListening((l) => !l)} className="relative grid size-11 place-items-center rounded-[4px] bg-lime text-pine-deep">
              <Mic size={18} />
              {listening && <motion.span className="absolute inset-0 rounded-[4px] bg-lime" animate={{ scale: [1, 1.35], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} />}
            </button>
            <div className="flex h-6 items-center gap-[3px]">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-pine"
                  animate={listening ? { height: [6, 8 + ((i * 7) % 16), 6] } : { height: 4 }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.05 }}
                />
              ))}
            </div>
            <span className="text-[13px] text-mute">{listening ? "Demo waveform…" : "Paused"}</span>
            <div className="flex-1" />
            <button onClick={onNext} className="text-[14px] text-mute">Skip</button>
            <Button onClick={onNext}>Next</Button>
          </div>
        </div>
      </div>
      <div className="relative h-[620px] overflow-hidden rounded-[4px] bg-pine-deep">
        <motion.div className="absolute inset-0" animate={{ scale: listening ? [1, 1.015, 1] : 1 }} transition={{ repeat: Infinity, duration: 3 }} style={{ backgroundImage: "url(/twin/dither-figure.png)", backgroundSize: "cover", backgroundPosition: "50% 30%" }} />
        <div className="absolute left-8 top-8 text-white">
          <div className="display text-[44px] text-lime">46%</div>
          <div className="text-[13px] text-white/70">twin built</div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.8, duration: 0.6, ease }} className="surface absolute left-8 top-1/2 p-4">
          <p className="eyebrow mb-1">New rule · check it</p>
          <p className="mb-3 text-[15px]">No operator, no entry</p>
          <div className="flex gap-2">
            <Button onClick={()=>{addRecord("knowledge",{id:crypto.randomUUID(),title:"Interview: operator first",body:response,status:"Confirmed",category:"Interview",date:"2026-11-10",source:"Your demo interview"});notify("Interview saved to knowledge");}} className="h-8 px-3 text-[12px]">Confirm</Button>
            <Button onClick={()=>document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Interview response"]')?.focus()} variant="secondary" className="h-8 px-3 text-[12px]">Edit</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Knowledge({ onNext }: { onNext: () => void }) {
  const files = [
    { name: "Entrepreneurship book, 2025.pdf", meta: "38 memories", done: true },
    { name: "DIU board minutes 2019–2025", meta: "24 decisions", done: true },
    { name: "AUAP keynote, Budapest.mp3", meta: "Reading · 62%", done: false },
  ];
  return (
    <Center title="Give it your record." sub="Books, board minutes, speeches. You choose what it reads.">
      <div className="flex w-[620px] flex-col gap-2 text-left">
        <Link href="/knowledge/add" className="grid h-36 place-items-center rounded-[4px] border border-dashed border-pine/30 bg-white/60 text-center">
          <div>
            <Upload className="mx-auto mb-2 text-pine" size={20} strokeWidth={1.6} />
            <p className="text-[15px] font-medium">Add source text or import a file</p>
            <p className="text-[12px] text-mute">Text / Markdown · seeded source library</p>
          </div>
        </Link>
        {files.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1, ease, duration: 0.5 }} className="surface flex items-center gap-3 px-4 py-3.5">
            {f.done ? <Check size={16} className="text-success" /> : <Loader2 size={16} className="animate-spin text-pine" />}
            <FileText size={15} className="text-mute" strokeWidth={1.6} />
            <span className="flex-1 text-[14px]">{f.name}</span>
            <span className="text-[13px] text-pine">{f.meta}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <BigBtn onClick={onNext}>Continue</BigBtn>
        <button onClick={onNext} className="text-[15px] text-pine">Skip for now</button>
      </div>
    </Center>
  );
}

function Review({ onNext }: { onNext: () => void }) {
  const learned = ["Operator first", "Never decide on the day", "Students before margin", "Careful about debt"];
  const [ok, setOk] = useDemo<string[]>("onboarding-reviewed",[]);
  return (
    <Center title="Here's what it learned." sub="Keep what's true. Change what isn't.">
      <div className="grid w-[680px] grid-cols-2 gap-3">
        {learned.map((l) => {
          const on = ok.includes(l);
          return (
            <motion.button
              key={l}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOk((xs) => (on ? xs.filter((x) => x !== l) : [...xs, l]))}
              className={`flex items-center justify-between rounded-[4px] p-5 text-left text-[16px] transition-all duration-300 ${on ? "bg-pine text-white" : "surface"}`}
            >
              {l}
              <span className={`grid size-6 place-items-center rounded-full ${on ? "bg-lime text-pine-deep" : "bg-canvas text-mute"}`}>
                <Check size={14} />
              </span>
            </motion.button>
          );
        })}
      </div>
      <BigBtn onClick={onNext}>{ok.length ? `Keep ${ok.length}` : "Keep all"}</BigBtn>
    </Center>
  );
}

function Boundaries({ onNext }: { onNext: () => void }) {
 const [prefs,setPrefs]=useDemo("preferences",preferenceSeed);
  return (
    <Center title="How far can it go?" sub="Start safe. You can raise this any time.">
      <div className="surface w-[620px] p-1 text-left">
        {autonomyLevels.map((l) => (
          <div key={l.level} className="flex items-center gap-4 border-t border-line px-5 py-4 first:border-t-0">
            <span className={`w-7 text-[13px] font-semibold ${l.danger ? "text-danger" : "text-pine"}`}>{l.level}</span>
            <div className="flex-1">
              <p className="text-[15px]">{l.name}</p>
              <p className="text-[12px] text-mute">{l.desc}</p>
            </div>
            {l.locked ? <Lock size={15} className={l.danger ? "text-danger" : "text-mute"} /> : (
              <button role="switch" aria-label={l.name} aria-checked={l.level==="L1"?prefs.advise:l.level==="L2"?prefs.draft:prefs.act} onClick={()=>setPrefs(p=>({...p,[l.level==="L1"?"advise":l.level==="L2"?"draft":"act"]:!(l.level==="L1"?p.advise:l.level==="L2"?p.draft:p.act)}))} className={`relative h-6 w-10 rounded-[4px] ${(l.level==="L1"?prefs.advise:l.level==="L2"?prefs.draft:prefs.act)?"bg-pine":"bg-[#E3E3E8]"}`}><span className={`absolute top-0.5 size-5 rounded-[4px] bg-white ${(l.level==="L1"?prefs.advise:l.level==="L2"?prefs.draft:prefs.act)?"right-0.5":"left-0.5"}`}/></button>
            )}
          </div>
        ))}
      </div>
      <BigBtn onClick={onNext}>Save boundaries</BigBtn>
    </Center>
  );
}

function Ready({ onNext }: { onNext: () => void }) {
  return (
    <div className="mx-auto flex max-w-[880px] flex-col items-center gap-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.9, ease }} className="relative h-[380px] w-[380px] overflow-hidden rounded-[4px]" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 40%, #1F5A47 0%, #0E2E25 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "url(/twin/greeting.png)", backgroundSize: "auto 135%", backgroundPosition: "50% 0%", backgroundRepeat: "no-repeat" }} />
      </motion.div>
      <h1 className="display text-[60px] leading-none">Your twin is ready.</h1>
      <p className="text-[19px] text-slate">It will ask before it acts. Always.</p>
      <BigBtn onClick={onNext}>Meet your twin</BigBtn>
    </div>
  );
}
