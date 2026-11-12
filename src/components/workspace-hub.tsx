"use client";
import Link from "next/link";
import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { Modal } from "./demo-ui";
import { useDemo, profileSeed } from "@/lib/demo";
const groups = [
  ["Overview", [["Home","/home"],["Activity","/activity"],["Notifications","/notifications"]]],
  ["My intelligence", [["Intelligence profile","/intelligence"],["Personality","/personality"],["Leadership","/leadership"],["Decision patterns","/patterns"],["Evolution","/evolution"],["Book","/book"]]],
  ["Knowledge & memory", [["Knowledge sources","/knowledge"],["Add knowledge","/knowledge/add"],["Memories","/memories"],["Memory graph","/memory/graph"],["Experience archive","/memory/experiences"],["Corrections","/memory/corrections"],["Knowledge brain","/brain"]]],
  ["Think & decide", [["Ask your twin","/ask"],["Talk to your twin","/talk"],["Decision Studio","/decisions"],["Decision analysis","/decide"]]],
  ["Executive actions", [["Actions overview","/actions"],["Approvals","/approvals"],["Tasks","/tasks"],["Calendar","/calendar"],["Email assistance","/email"],["Delegation rules","/rules"]]],
  ["Governance", [["Boardroom","/boardroom"],["Access & sharing","/access"],["Security","/security"],["Audit trail","/audit"],["Digital Legacy","/legacy"],["Legacy activation","/legacy/activation"]]],
  ["Family succession", [["Successors","/family"],["Family council","/council"],["Succession rules","/succession"],["Hologram devices","/devices"],["Successor portal","/heir"],["Hologram mode","/hologram"]]],
  ["Your account", [["Profile","/settings"],["Your data","/settings/data"],["Integrations","/settings/integrations"],["Billing","/settings/billing"],["Help","/support"]]],
] as const;
export function WorkspaceHub() {
 const [open,setOpen]=useState(false);const [q,setQ]=useState("");
 return <><button aria-label="All modules" title="All modules" onClick={()=>setOpen(true)} style={{display:"grid",placeItems:"center",width:40,height:40,color:"#0E5A43"}}><LayoutGrid size={18}/></button>{open&&<Modal title="Your workspace" onClose={()=>setOpen(false)}><input aria-label="Find a module" placeholder="Find a module…" value={q} onChange={e=>setQ(e.target.value)} style={{padding:12,border:"1px solid #E6E3DE",borderRadius:4,width:"100%",marginBottom:20}}/><div className="demo-two">{groups.map(([group,links])=><div key={group}><p className="demo-kicker">{group}</p>{links.filter(([label])=>label.toLowerCase().includes(q.toLowerCase())).map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:"block",padding:"8px 0",fontSize:14,color:"#0E5A43"}}>{label}</Link>)}</div>)}</div></Modal>}</>;
}
export function ProfileAvatar() {
 const [p]=useDemo("profile",profileSeed);const initials=p.name.replace(/^Dr\.\s*/,"").split(/\s+/).slice(0,2).map(s=>s[0]).join("");
 return <Link href="/settings" aria-label="Your profile" style={{width:36,height:36,display:"grid",placeItems:"center",background:p.photo?`url(${p.photo}) center/cover`:"#E2F0E8",borderRadius:4,color:"#0E5A43",fontSize:13,fontWeight:600}}>{!p.photo&&initials}</Link>;
}
