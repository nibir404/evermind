"use client";
import { useDemo } from "@/lib/demo";

// 1:1 port of Paper "04.01 · Intelligence profile" (4M5-0)
import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Badge, Bar, Bell, C, Dot, Link2, Page, PageHead, PButton, PCard, Search, SrcTag, Sub, Txt, Eyebrow } from "@/components/paper";
import { Reveal } from "@/components/ui";

const traits: [string, string, string, string[], "mail"?][] = [
  ["Identity", "Dr. Sabur Khan — Chair, Daffodil Education Group. Founder-educator focused on access, industry links and international pathways.", "Verified", ["Annual report 2024", "LinkedIn bio"]],
  ["Professional identity", "Chairs DIU board; leads the Wollongong 2+2 partnership and the group incubator for student founders.", "Verified", ["DIU board minutes · 14"]],
  ["Expertise", "Higher-ed governance, transnational education, entrepreneurship programmes, ed-tech investment.", "Confirmed", ["38 speeches · 6 interviews"]],
  ["Leadership philosophy", "Students first; build institutions that outlast their founders; give young leaders real authority early.", "Confirmed", ["Convocation 2024", "Staff town halls"]],
  ["Communication", "Warm, direct, story-led. Short written replies; longer when mentoring.", "Inferred", ["1,940 sent emails"], "mail"],
  ["Strategy", "Partnerships over acquisitions; long horizons (10+ yrs); employability as the core metric.", "Confirmed", ["Strategy plan 2030"]],
  ["Risk profile", "Bold on education bets, conservative on debt and reputation.", "Inferred", ["11 investment decisions"]],
];
const rings: [string, number, string][] = [["Identity", 100, C.pine], ["Role", 92, C.pine], ["Expertise", 80, C.pine], ["Leadership", 85, C.pine], ["Comms", 40, C.amber], ["Strategy", 82, C.pine], ["Risk", 35, C.amber]];

export default function Intelligence() {
  const [state, setState] = useDemo("intelligence-status", traits.map((t) => t[2]));
  const [query,setQuery]=useState("");
  const toConfirm = state.filter((s) => s === "Inferred").length;
  const confirm = (label: string) => setState((st) => st.map((s, i) => (traits[i][0].startsWith(label) ? "Confirmed" : s)));
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="04.01 · My Intelligence" title="How your twin understands you" actions={<><Search placeholder="Search traits" value={query} onChange={setQuery}/><Bell /><PButton href="/knowledge">View sources</PButton><PButton variant="lime" onClick={() => setState((s) => s.map((x) => (x === "Inferred" ? "Confirmed" : x)))}>{toConfirm ? `Confirm ${toConfirm} traits` : "All confirmed"}</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ borderRadius: 4, padding: 20, display: "flex", alignItems: "center", gap: 40, background: "radial-gradient(ellipse 40% 120% at 0% 0%, rgba(214,232,250,.6), transparent 60%), radial-gradient(ellipse 40% 120% at 100% 100%, rgba(236,246,214,.7), transparent 60%), radial-gradient(rgba(14,90,67,.14) .9px, transparent 1.1px) 0 0/6px 6px, #fff", boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px" }}>
        <div style={{ width: 240 }}>
          <Eyebrow>Profile completeness</Eyebrow>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0" }}>
            <span style={{ fontSize: 40, fontWeight: 300 }}>{72 + (2 - toConfirm) * 6}<span style={{ fontSize: 13, color: C.slate }}>%</span></span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.pine, background: "#E8F6D0", borderRadius: 4, padding: "2px 6px", display: "flex", gap: 3, alignItems: "center" }}><ArrowUp size={10} /> +9% this month</span>
          </div>
          <Sub size={12}>5 of 7 areas have a verified or confirmed source.</Sub>
        </div>
        <div style={{ width: 300 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.body, marginBottom: 8 }}><span>Confirmed vs inferred traits</span><span>{7 - toConfirm} · {toConfirm}</span></div>
          <div style={{ display: "flex", gap: 3, height: 8 }}>
            <div style={{ flex: 7 - toConfirm, background: C.pine, borderRadius: 4, transition: "flex .5s" }} />
            <div style={{ flex: toConfirm || 0.001, background: C.amber, borderRadius: 4, transition: "flex .5s" }} />
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.body, marginTop: 8 }}>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Dot color={C.pine} size={6} /> Verified / confirmed 71%</span>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Dot color={C.amber} size={6} /> Inferred 29%</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 18 }}>
          {rings.map(([l, v, c], i) => {
            const conf = state[i] !== "Inferred";
            const col = conf ? C.pine : c;
            return (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <svg width="28" height="28"><circle cx="14" cy="14" r="11" fill="none" stroke="#E9E8E4" strokeWidth="2.5" /><circle cx="14" cy="14" r="11" fill="none" stroke={col} strokeWidth="2.5" strokeDasharray={`${((conf ? Math.max(v, 80) : v) / 100) * 69} 69`} transform="rotate(-90 14 14)" style={{ transition: "stroke-dasharray .6s" }} /></svg>
                <span style={{ fontSize: 11, color: C.body }}>{l}</span>
              </div>
            );
          })}
        </div>
      </Reveal>
      <Reveal delay={0.1} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard style={{ flex: 1, padding: "20px 20px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12 }}>
            <Txt size={17} weight={600}>Traits</Txt>
            <Sub size={12}>7 areas · sorted by confidence</Sub>
          </div>
          {traits.map(([k, v, , src, icon], i) => ( (k+v).toLowerCase().includes(query.toLowerCase())&&
            <div className="intelligence-trait-row" key={k} style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: `1px solid ${C.line}` }}>
              <span style={{ width: 150, flexShrink: 0, fontSize: 11, letterSpacing: "0.1em", color: C.slate, textTransform: "uppercase", lineHeight: "14px" }}>{k}</span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Txt>{v}</Txt>
                <div style={{ display: "flex", gap: 6 }}>{src.map((s) => <SrcTag key={s} icon={icon}>{s}</SrcTag>)}</div>
              </div>
              <Badge kind={state[i]} />
            </div>
          ))}
        </PCard>
        <PCard style={{ width: 380, flexShrink: 0, padding: 20, gap: 14 }}>
          <Txt size={17} weight={600}>To strengthen</Txt>
          <Sub size={12}>Two areas rest only on email inferences. Confirm them to raise accuracy.</Sub>
          {[
            ["Communication style", "Needs confirmation", C.warning, "Confirm", "Communication"],
            ["Risk profile", "Needs confirmation", C.warning, "Confirm", "Risk"],
            ["Languages", "No source yet", C.faint, "Add", ""],
          ].map(([t, s, c, a, key]) => {
            const done = key && state[traits.findIndex((x) => x[0].startsWith(key))] !== "Inferred";
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Dot color={done ? C.success : c} size={7} />
                <div style={{ flex: 1 }}>
                  <Txt>{t}</Txt>
                  <Sub color={done ? C.success : c === C.faint ? C.slate : C.warning}>{done ? "Confirmed by you" : s}</Sub>
                </div>
                {!done && <button onClick={() => key && confirm(key)}><Link2>{a}</Link2></button>}
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14 }}><Eyebrow>Source references · 2,007</Eyebrow></div>
          {[["Board minutes", 14, 6], ["Speeches & interviews", 44, 16], ["Emails (sampled)", 1940, 97, C.amber], ["Your direct edits", 9, 4]].map(([l, n, p, c]) => (
            <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
              <span style={{ flex: 1 }}>{l}</span>
              <Bar value={p as number} color={(c as string) ?? C.pine} />
              <span style={{ width: 44, textAlign: "right", fontSize: 13, color: C.body }}>{(n as number).toLocaleString()}</span>
            </div>
          ))}
        </PCard>
      </Reveal>
    </Page>
  );
}
