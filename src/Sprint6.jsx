import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ── GROW BY XCADO — BRAND TOKENS ──────────────────────────────────────────────
const C = {
  grove:"#0F3D20", field:"#1E7A3E", shoot:"#5BB35E", lime:"#9DD96A",
  harvest:"#E8A020", earth:"#7A4E2D", chalk:"#F5F1E8", ink:"#0C1A0E",
  sky:"#0EA5E9", crimson:"#DC2626", violet:"#7C3AED", teal:"#0D9488",
  orange:"#EA580C", slate:"#64748B", mist:"#F7F4EF", border:"#E5DFD3", card:"#FFFFFF",
  // Aliases
  forest:"#0F3D20", forestMid:"#1E7A3E", forestLight:"#5BB35E",
  amber:"#E8A020", sand:"#F5F1E8",
};

// ── XCADO MARK ───────────────────────────────────────────────────────────────
// Square tile that wraps the official Xcado logo PNG. White background by
// default so the wide white-bg logo blends cleanly. `bg="none"` renders bare
// (e.g. on light surfaces), `bg="#0F3D20"` renders the legacy dark tile.
const XGrowMark = ({ size=36, bg="#FFFFFF", stroke="#E5DFD3", rx=10 }) => (
  <span style={{
    width:size, height:size, borderRadius:rx, flexShrink:0,
    background: bg === "none" ? "transparent" : bg,
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    border: bg === "none" ? "none" : `1px solid ${stroke}`,
    boxShadow: bg === "none" ? "none" : "0 1px 2px rgba(12,26,14,0.06)",
    overflow:"hidden",
  }}>
    <img
      src="/xcado-logo-mark.png"
      alt="Xcado"
      style={{ width: size * 0.86, height: size * 0.86, objectFit:"contain", display:"block" }}
    />
  </span>
);

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const Badge = ({ label, color, size="sm" }) => (
  <span className={`inline-flex items-center font-bold rounded-full whitespace-nowrap ${size==="sm"?"px-2.5 py-0.5 text-xs":"px-3 py-1 text-sm"}`}
    style={{ background:`${color}18`, color, border:`1px solid ${color}28` }}>{label}</span>
);
const Card = ({ children, className="", style={} }) => (
  <div className={`bg-white rounded-2xl border shadow-sm ${className}`} style={{ borderColor:C.border,...style }}>{children}</div>
);
const SectionTitle = ({ children, sub }) => (
  <div className="mb-6">
    <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28,
      letterSpacing:-0.5, color:C.ink, margin:"0 0 2px", lineHeight:1.15 }}>{children}</h2>
    {sub && <p className="text-sm mt-1" style={{ color:C.slate }}>{sub}</p>}
  </div>
);
const KpiCard = ({ icon, label, value, sub, color, trend }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color:C.slate }}>{label}</span>
      {trend && <span className="ml-auto text-xs font-bold" style={{ color:trend>0?C.shoot:C.crimson }}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}
    </div>
    <p className="text-2xl font-black" style={{ color }}>{value}</p>
    {sub && <p className="text-xs mt-0.5 truncate" style={{ color:C.slate }}>{sub}</p>}
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1 — PLATFORM DASHBOARD (UNIFIED HOME)
// ═══════════════════════════════════════════════════════════════════════════════
const DASH_REVENUE = [
  {m:"Oct",local:820,export:1240},{m:"Nov",local:940,export:1580},{m:"Dec",local:780,export:1920},
  {m:"Jan",local:1050,export:2100},{m:"Feb",local:1180,export:2450},{m:"Mar",local:1320,export:2890},
];
const DASH_FARMERS = [
  {m:"Oct",active:124},{m:"Nov",active:168},{m:"Dec",active:201},
  {m:"Jan",active:254},{m:"Feb",active:298},{m:"Mar",active:347},
];
const RECENT_ACTIVITY = [
  { id:1, type:"signup",     actor:"Grace Wanjiku",    detail:"Registered from Kiambu · 3.5 acres · Avocado + Tea",  time:"2 min ago",  icon:"👥", color:"#1E7A3E" },
  { id:2, type:"order",      actor:"FreshMarket Nairobi",detail:"Placed order — 1,500 kg Avocado · KES 112,500",      time:"14 min ago", icon:"🛒", color:"#E8A020" },
  { id:3, type:"shipment",   actor:"Coffee AA — Meru",  detail:"Departed Nairobi CDC → Mombasa Port · ETA 6hrs",      time:"1 hr ago",   icon:"🚚", color:"#0EA5E9" },
  { id:4, type:"cert",       actor:"Esther Njoroge",    detail:"ISO 22000 renewal alert · Macadamia · 30 days left",  time:"3 hrs ago",  icon:"⚠️", color:"#EA580C" },
  { id:5, type:"payment",    actor:"Peter Mutua",       detail:"M-Pesa received · KES 24,000 · Green Grams sale",    time:"5 hrs ago",  icon:"💳", color:"#7C3AED" },
  { id:6, type:"ai_alert",   actor:"AI Intelligence",   detail:"Fall Armyworm HIGH risk · Trans-Nzoia · Immediate action", time:"6 hrs ago", icon:"🤖", color:"#DC2626" },
];
const TOP_COUNTIES = [
  { name:"Kiambu",   farmers:89,  value:2840000, crops:["Tea","Coffee","Avocado"] },
  { name:"Meru",     farmers:62,  value:1980000, crops:["Miraa","Coffee","Tea"] },
  { name:"Nakuru",   farmers:48,  value:1420000, crops:["Wheat","Pyrethrum","Flowers"] },
  { name:"Makueni",  farmers:41,  value:980000,  crops:["Mangoes","Green Grams","Avocado"] },
  { name:"Kisumu",   farmers:38,  value:760000,  crops:["Sugarcane","Rice","Fishing"] },
];

function Dashboard() {
  const totalRevenue = DASH_REVENUE.reduce((s,r)=>s+r.local+r.export,0);
  const combinedData = DASH_REVENUE.map(r=>({ ...r, total:r.local+r.export }));

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <XGrowMark size={36} rx={9}/>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:30,
              letterSpacing:-0.5, color:C.ink, lineHeight:1 }}>
              Good morning, <span style={{ color:C.field }}>XCADO Team</span>
            </h2>
          </div>
          <p className="text-sm" style={{ color:C.slate }}>
            Sunday, 29 March 2026 · 347 active farmers across 24 counties · platform is healthy
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ background:`${C.shoot}15`, color:C.shoot }}>
            🟢 All systems operational
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <KpiCard icon="👥" label="Active Farmers"   value="347"         sub="across 24 counties"         color={C.field}   trend={16} />
        <KpiCard icon="🌾" label="Listings"          value="10"          sub="KES 5.2M combined"           color={C.harvest} trend={8}  />
        <KpiCard icon="🚚" label="In Transit"        value="3"           sub="KES 608K value"              color={C.sky}     trend={0}  />
        <KpiCard icon="✅" label="Certifications"    value="8"           sub="2 renewals due"              color={C.violet}  trend={-5} />
        <KpiCard icon="💰" label="MRR"               value="KES 5.7K"    sub="3 active tenants"            color={C.field}   trend={22} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Revenue chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-black" style={{ color:C.ink }}>Revenue — Local vs Export</p>
              <p className="text-xs" style={{ color:C.slate }}>KES thousands · last 6 months</p>
            </div>
            <p className="text-xl font-black" style={{ color:C.field }}>KES {(totalRevenue/1000).toFixed(0)}K</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.field} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.field} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="locGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.harvest} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.harvest} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}K`}/>
              <Tooltip formatter={(v,n)=>[`KES ${v}K`, n]} contentStyle={{ borderRadius:10, border:"none" }}/>
              <Area type="monotone" dataKey="export" name="Export" stroke={C.field}   strokeWidth={2} fill="url(#expGrad)"/>
              <Area type="monotone" dataKey="local"  name="Local"  stroke={C.harvest} strokeWidth={2} fill="url(#locGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Farmer growth */}
        <Card className="p-5">
          <p className="text-sm font-black mb-1" style={{ color:C.ink }}>Farmer Growth</p>
          <p className="text-xs mb-3" style={{ color:C.slate }}>Active registrations · 6 months</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DASH_FARMERS}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius:10, border:"none" }}/>
              <Bar dataKey="active" name="Farmers" fill={C.lime} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Activity feed */}
        <Card className="col-span-2 overflow-hidden">
          <div className="p-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${C.border}` }}>
            <p className="text-sm font-black" style={{ color:C.ink }}>Live Activity Feed</p>
            <Badge label="Live" color={C.shoot}/>
          </div>
          <div className="divide-y" style={{ borderColor:C.border }}>
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ background:`${a.color}18` }}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color:C.ink }}>{a.actor}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{a.detail}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color:C.slate }}>{a.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top counties */}
        <Card className="p-5">
          <p className="text-sm font-black mb-4" style={{ color:C.ink }}>Top Counties</p>
          <div className="space-y-3">
            {TOP_COUNTIES.map((c,i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black w-4" style={{ color:C.slate }}>{i+1}</span>
                    <span className="text-xs font-bold" style={{ color:C.ink }}>{c.name}</span>
                    <span className="text-xs" style={{ color:C.slate }}>{c.farmers} farmers</span>
                  </div>
                  <span className="text-xs font-black" style={{ color:C.field }}>
                    KES {(c.value/1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:C.border }}>
                  <div className="h-full rounded-full" style={{
                    width:`${(c.value/TOP_COUNTIES[0].value)*100}%`,
                    background: i===0?C.lime:i===1?C.shoot:C.field }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 2 — TRAINING & KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════════════════
const COURSES = [
  { id:"K001", title:"Export Certification Masterclass",     category:"Export",     level:"Intermediate", duration:"2h 40m", lessons:8,  enrolled:124, completion:68, rating:4.8, instructor:"Dr. Susan Kariuki",    badge:"🌍", featured:true,
    modules:["Introduction to GlobalG.A.P.","Farm documentation requirements","Internal audit process","External auditor visit prep","Lab testing & residue limits","Corrective action plans","Certificate maintenance","Renewal & upgrade path"] },
  { id:"K002", title:"Avocado: From Seedling to Export",     category:"Crop Guide", level:"Beginner",      duration:"1h 20m", lessons:6,  enrolled:89,  completion:82, rating:4.9, instructor:"James Njoroge (Agronomist)",badge:"🥑", featured:true,
    modules:["Hass vs Fuerte variety selection","Soil & climate requirements","Planting density & irrigation","Pest & disease management","Harvest timing for export","Post-harvest handling & grading"] },
  { id:"K003", title:"M-Pesa & Digital Payments for Farmers",category:"Finance",    level:"Beginner",      duration:"45m",    lessons:4,  enrolled:312, completion:91, rating:4.7, instructor:"XCADO Finance Team",    badge:"💳", featured:false,
    modules:["Setting up your Grow wallet","Receiving buyer payments","Understanding your credit score","Applying for seasonal loans"] },
  { id:"K004", title:"Coffee: Wet Mill Processing",          category:"Crop Guide", level:"Advanced",      duration:"3h 10m", lessons:10, enrolled:47,  completion:44, rating:4.6, instructor:"Wanjiru Kamau (Master Cupper)", badge:"☕", featured:false,
    modules:["Cherry selection & sorting","Pulping & fermentation","Washing & grading","Drying methods","Hulling & polishing","Cupping fundamentals","Preparing for Nairobi Coffee Exchange","Direct trade negotiation","Specialty vs commodity","Building buyer relationships"] },
  { id:"K005", title:"Climate-Smart Farming in ASALs",       category:"AgriTech",   level:"Intermediate", duration:"2h",     lessons:7,  enrolled:68,  completion:55, rating:4.5, instructor:"Prof. Kiplangat Bett",  badge:"🌤️", featured:false,
    modules:["Understanding your agro-ecological zone","Drought-tolerant crop selection","Irrigation efficiency techniques","Soil moisture conservation","Cover cropping & mulching","Weather forecast interpretation","Seasonal planning calendar"] },
  { id:"K006", title:"Cooperative Management for SACCOs",    category:"Business",   level:"Intermediate", duration:"1h 50m", lessons:6,  enrolled:38,  completion:37, rating:4.4, instructor:"Equity Bank Agri Team", badge:"🏢", featured:false,
    modules:["SACCO governance & bylaws","Member registration & onboarding","Bulk input purchasing","Collective bargaining with buyers","Financial management basics","Reporting & compliance"] },
];

const GUIDES = [
  { title:"Kenya Export Requirements — 2025 Update",    type:"PDF",    downloads:412, updated:"Mar 2025", badge:"📄" },
  { title:"Pesticide Residue Limits — EU MRL Guide",    type:"PDF",    downloads:287, updated:"Feb 2025", badge:"📄" },
  { title:"Avocado Grading Standards (GlobalG.A.P.)",   type:"Guide",  downloads:198, updated:"Jan 2025", badge:"📋" },
  { title:"M-Pesa Daraja API Integration Guide",        type:"Tech",   downloads:94,  updated:"Mar 2025", badge:"⚙️" },
  { title:"Grow Farmer Registration SOP",              type:"SOP",    downloads:156, updated:"Mar 2025", badge:"📋" },
  { title:"Rainfall & Planting Calendar — All 47 Counties", type:"Map", downloads:523, updated:"Jan 2025", badge:"🗺️" },
];

const CATEGORY_COLORS = { "Export":C.sky, "Crop Guide":C.field, "Finance":C.harvest, "AgriTech":C.teal, "Business":C.violet };
const LEVEL_COLORS    = { "Beginner":C.shoot, "Intermediate":C.amber, "Advanced":C.crimson };

function TrainingHub() {
  const [view, setView]     = useState("courses");
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState("All");

  const cats = ["All", ...new Set(COURSES.map(c=>c.category))];
  const filtered = COURSES.filter(c => catFilter==="All" || c.category===catFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Crop guides · Certification masterclasses · Agronomy tips · Downloadable resources">
          📚 Training &amp; Knowledge Base
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["courses","🎓 Courses"],["guides","📄 Guides"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🎓" label="Total Courses"   value={COURSES.length}   sub="Grow curriculum"           color={C.field}   />
        <KpiCard icon="👥" label="Total Enrolled"  value={COURSES.reduce((s,c)=>s+c.enrolled,0)} sub="across all courses" color={C.sky}     />
        <KpiCard icon="⭐" label="Avg Rating"       value="4.65"             sub="farmer satisfaction"         color={C.harvest} />
        <KpiCard icon="📄" label="Resource Guides"  value={GUIDES.length}    sub="downloadable PDFs & SOPs"   color={C.violet}  />
      </div>

      {view==="courses" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              {cats.map(c => (
                <button key={c} onClick={()=>setCatFilter(c)}
                  className="text-xs px-3 py-1.5 rounded-xl font-bold border transition-all"
                  style={{ borderColor:catFilter===c?(CATEGORY_COLORS[c]||C.field):C.border,
                    background:catFilter===c?`${CATEGORY_COLORS[c]||C.field}12`:"#fff",
                    color:catFilter===c?(CATEGORY_COLORS[c]||C.field):C.slate }}>
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map(course => (
                <div key={course.id} onClick={()=>setSelected(selected?.id===course.id?null:course)}
                  className="rounded-xl border cursor-pointer transition-all hover:shadow-sm overflow-hidden"
                  style={{ background:selected?.id===course.id?`${C.field}06`:"#fff",
                    borderColor:selected?.id===course.id?C.field:C.border,
                    borderWidth:selected?.id===course.id?2:1 }}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background:`${CATEGORY_COLORS[course.category]||C.field}12` }}>
                      {course.badge}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-black" style={{ color:C.ink }}>{course.title}</span>
                        {course.featured && <Badge label="Featured" color={C.harvest}/>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge label={course.category} color={CATEGORY_COLORS[course.category]||C.field}/>
                        <Badge label={course.level}    color={LEVEL_COLORS[course.level]}/>
                        <span className="text-xs" style={{ color:C.slate }}>{course.duration} · {course.lessons} lessons</span>
                        <span className="text-xs" style={{ color:C.slate }}>⭐ {course.rating}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color:C.field }}>{course.enrolled} enrolled</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background:C.border }}>
                          <div className="h-full rounded-full" style={{ width:`${course.completion}%`, background:C.shoot }}/>
                        </div>
                        <span className="text-xs" style={{ color:C.slate }}>{course.completion}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructor strip */}
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black"
                      style={{ background:C.field }}>
                      {course.instructor[0]}
                    </div>
                    <span className="text-xs" style={{ color:C.slate }}>{course.instructor}</span>
                  </div>

                  {/* Expanded modules */}
                  {selected?.id===course.id && (
                    <div className="px-4 pb-4 pt-1" style={{ borderTop:`1px solid ${C.border}` }}>
                      <p className="text-xs font-black uppercase tracking-wider mb-2.5" style={{ color:C.slate }}>
                        Course Modules ({course.modules.length})
                      </p>
                      <div className="space-y-1.5">
                        {course.modules.map((m,i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                              style={{ background:i<3?`${C.field}18`:`${C.border}`, color:i<3?C.field:C.slate }}>
                              {i+1}
                            </div>
                            <span style={{ color:C.ink }}>{m}</span>
                            {i<3 && <span className="ml-auto text-xs" style={{ color:C.shoot }}>✓ Preview</span>}
                          </div>
                        ))}
                      </div>
                      <button className="mt-3 w-full py-2 rounded-xl text-xs font-black text-white"
                        style={{ background:C.field }}>
                        Enrol Farmers in This Course →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-4" style={{ background:C.grove, border:"none" }}>
              <XGrowMark size={32} rx={8} bg="rgba(255,255,255,0.1)" stroke="#F5F1E8" tip={C.lime}/>
              <p className="text-sm font-black text-white mt-3 mb-1">Grow Academy</p>
              <p className="text-xs mb-3" style={{ color:"rgba(245,241,232,0.5)" }}>
                Practical, field-tested knowledge built specifically for East African farming conditions.
                Available offline on the mobile app.
              </p>
              <div className="space-y-2">
                {[["🌐","Available in Kiswahili + English"],["📱","Offline mode on mobile app"],["📜","Completion certificates issued"],["🎯","Tied to credit score improvements"]].map(([icon,text])=>(
                  <div key={text} className="flex items-start gap-2 text-xs" style={{ color:"rgba(245,241,232,0.65)" }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Completion Rate by Category</p>
              {Object.entries(CATEGORY_COLORS).map(([cat,col])=>{
                const avg = Math.round(COURSES.filter(c=>c.category===cat).reduce((s,c)=>s+c.completion,0) / Math.max(1, COURSES.filter(c=>c.category===cat).length));
                return (
                  <div key={cat} className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs w-20 flex-shrink-0" style={{ color:C.ink }}>{cat}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:C.border }}>
                      <div className="h-full rounded-full" style={{ width:`${avg}%`, background:col }}/>
                    </div>
                    <span className="text-xs font-black w-8 text-right" style={{ color:col }}>{avg}%</span>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}

      {view==="guides" && (
        <div className="grid grid-cols-2 gap-4">
          {GUIDES.map(g => (
            <div key={g.title} className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-sm transition-all cursor-pointer"
              style={{ borderColor:C.border }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:`${C.field}10` }}>
                {g.badge}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate" style={{ color:C.ink }}>{g.title}</p>
                <p className="text-xs" style={{ color:C.slate }}>Updated {g.updated} · {g.downloads} downloads</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={g.type} color={C.sky}/>
                <button className="text-xs px-3 py-1.5 rounded-lg font-bold text-white" style={{ background:C.field }}>↓</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 3 — BLOCKCHAIN TRACEABILITY
// ═══════════════════════════════════════════════════════════════════════════════
const TRACE_RECORDS = [
  { id:"QR-2025-001", crop:"Coffee AA",     farmer:"James Mwangi",    county:"Meru",     buyer:"Hamburg Traders DE", exportDate:"2025-04-15",
    chain:[
      { stage:"Farm Gate",      date:"Apr 10",  loc:"Imenti North, Meru",    hash:"0xa3f4...9b12", actor:"James Mwangi",         icon:"🌱" },
      { stage:"Wet Mill",       date:"Apr 11",  loc:"Meru Farmers Wet Mill", hash:"0xb7c2...4e55", actor:"Meru Cooperative",      icon:"⚙️" },
      { stage:"Quality Check",  date:"Apr 11",  loc:"Nairobi CDC",           hash:"0xc9d1...7f33", actor:"KEPHIS Inspector",      icon:"🔬" },
      { stage:"Export Cert",    date:"Apr 12",  loc:"KEPHIS HQ Nairobi",     hash:"0xd2e8...1a90", actor:"KEPHIS Kenya",          icon:"📜" },
      { stage:"Port Loading",   date:"Apr 15",  loc:"Mombasa Port",          hash:"0xe5f6...8c44", actor:"CMA CGM Agent",         icon:"⚓" },
    ],
    certifications:["Fairtrade","UTZ Certified","KEPHIS Phytosanitary"], grade:"AA", weight:"798 kg",
    qrData:{ lat:-0.047, lng:37.649, altitude:1650, variety:"SL28/SL34", processingMethod:"Fully Washed" }
  },
  { id:"QR-2025-002", crop:"Avocado Hass",  farmer:"Grace Wanjiku",   county:"Kiambu",   buyer:"Dutch Flower Group NL", exportDate:"2025-04-14",
    chain:[
      { stage:"Harvest",        date:"Apr 11",  loc:"Tigoni, Kiambu",        hash:"0xf1a2...3b67", actor:"Grace Wanjiku",         icon:"🥑" },
      { stage:"Pack House",     date:"Apr 11",  loc:"Kiambu Pack House",     hash:"0xa4b5...6c78", actor:"Kiambu Packers Ltd",    icon:"📦" },
      { stage:"Cold Chain",     date:"Apr 12",  loc:"Nairobi Cold Store",    hash:"0xb8c9...9d01", actor:"Fridgehouse Kenya",     icon:"❄️" },
      { stage:"Air Cargo",      date:"Apr 14",  loc:"JKIA Cargo Terminal",   hash:"0xc3d4...2e34", actor:"Kenya Airways Cargo",   icon:"✈️" },
    ],
    certifications:["GlobalG.A.P.","KEPHIS Phytosanitary"], grade:"A", weight:"1,500 kg",
    qrData:{ lat:-1.032, lng:36.830, altitude:1820, variety:"Hass", processingMethod:"Fresh — Waxed & Graded" }
  },
  { id:"QR-2025-003", crop:"Green Grams",   farmer:"Peter Mutua",     county:"Makueni",  buyer:"Agri India Imports IN", exportDate:"2025-04-01",
    chain:[
      { stage:"Farm Harvest",   date:"Mar 28",  loc:"Kibwezi East, Makueni", hash:"0xd7e8...5f90", actor:"Peter Mutua",           icon:"🫘" },
      { stage:"Cleaning",       date:"Mar 28",  loc:"Kibwezi Depot",         hash:"0xe2f3...8a01", actor:"Camilco Exports",       icon:"🏭" },
      { stage:"Inspection",     date:"Mar 29",  loc:"Nairobi CDC",           hash:"0xf6a7...1b23", actor:"KEBS Inspector",        icon:"🔬" },
      { stage:"Container",      date:"Mar 30",  loc:"Mombasa Container Yard",hash:"0xa1b2...4c56", actor:"MSC Agent",             icon:"📦" },
      { stage:"Vessel Departed",date:"Apr 01",  loc:"Mombasa Port — Berth 4",hash:"0xb5c6...7d89", actor:"MV Safmarine",          icon:"🚢" },
    ],
    certifications:["KEPHIS","KEBS Quality Standard"], grade:"A", weight:"800 kg",
    qrData:{ lat:-2.255, lng:37.898, altitude:740, variety:"Nylon Green Gram", processingMethod:"Dry-cleaned & Sorted" }
  },
];

function Traceability() {
  const [selected, setSelected] = useState(TRACE_RECORDS[0]);
  const [scanMode, setScanMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1400);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Farm-to-table QR codes · Immutable audit trail · Buyer scan portal · Export traceability">
          🔗 Blockchain Traceability
        </SectionTitle>
        <div className="flex gap-2">
          <button onClick={()=>setScanMode(!scanMode)}
            className="text-xs px-4 py-2 rounded-xl font-bold transition-all"
            style={{ background:scanMode?C.sky:C.mist, color:scanMode?"#fff":C.slate, border:`1px solid ${scanMode?C.sky:C.border}` }}>
            {scanMode?"📷 Scan Mode ON":"📷 Simulate Scan"}
          </button>
          <button onClick={handleGenerate}
            className="text-xs px-4 py-2 rounded-xl font-bold text-white"
            style={{ background:C.field }}>
            {generating?"⟳ Generating…":generated?"✓ QR Ready":"+ Generate New QR"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🔗" label="Traced Shipments"  value={TRACE_RECORDS.length}  sub="on-chain records"        color={C.violet} />
        <KpiCard icon="📱" label="QR Scans (30d)"    value="1,284"                  sub="by buyers globally"      color={C.sky}    />
        <KpiCard icon="⛓️" label="Chain Events"      value={TRACE_RECORDS.reduce((s,r)=>s+r.chain.length,0)} sub="immutable records" color={C.field} />
        <KpiCard icon="🌍" label="Export Markets"    value="4"                      sub="NL · DE · IN · UK"       color={C.harvest} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Record selector */}
        <div>
          <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Trace Records</p>
          <div className="space-y-2.5">
            {TRACE_RECORDS.map(r => (
              <div key={r.id} onClick={()=>setSelected(r)}
                className="p-3.5 rounded-xl border cursor-pointer transition-all"
                style={{ borderColor:selected?.id===r.id?C.violet:C.border,
                  background:selected?.id===r.id?`${C.violet}06`:"#fff",
                  borderWidth:selected?.id===r.id?2:1 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold" style={{ color:C.violet }}>{r.id}</span>
                  <Badge label="On-Chain" color={C.violet}/>
                </div>
                <p className="text-sm font-black" style={{ color:C.ink }}>{r.crop}</p>
                <p className="text-xs" style={{ color:C.slate }}>{r.farmer} · {r.county}</p>
                <p className="text-xs mt-1" style={{ color:C.slate }}>→ {r.buyer}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {r.chain.map((_,i) => (
                    <div key={i} className="flex-1 h-1 rounded-full" style={{ background:C.violet }}/>
                  ))}
                  <span className="text-xs ml-1" style={{ color:C.slate }}>{r.chain.length} events</span>
                </div>
              </div>
            ))}

            {/* Generate new */}
            {generated && (
              <div className="p-3.5 rounded-xl border" style={{ background:`${C.field}08`, borderColor:`${C.field}40`, borderStyle:"dashed" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold" style={{ color:C.field }}>QR-2025-004</span>
                  <Badge label="New" color={C.lime}/>
                </div>
                <p className="text-sm font-black" style={{ color:C.ink }}>Macadamia</p>
                <p className="text-xs" style={{ color:C.slate }}>Esther Njoroge · Kiambu</p>
              </div>
            )}
          </div>
        </div>

        {/* Chain detail */}
        {selected && (
          <div className="col-span-2 space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-black" style={{ color:C.ink }}>{selected.crop}</p>
                  <p className="text-xs" style={{ color:C.slate }}>
                    {selected.farmer} · {selected.county} → {selected.buyer}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selected.certifications.map(c=><Badge key={c} label={c} color={C.sky}/>)}
                  </div>
                </div>
                <div className="text-right">
                  {/* QR code visual */}
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{ background:C.grove }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1.5, padding:6 }}>
                      {Array.from({length:49}).map((_,i)=>{
                        const pattern=[1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1];
                        const isOn = (pattern[i]||0)===1 || Math.random()>0.55;
                        return <div key={i} style={{ width:5,height:5, background:isOn?C.lime:"transparent" }}/>;
                      })}
                    </div>
                  </div>
                  <p className="text-xs mt-1 font-mono" style={{ color:C.slate }}>{selected.id}</p>
                </div>
              </div>

              {/* Farm data */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  ["Weight",selected.weight],
                  ["Grade",`Grade ${selected.grade}`],
                  ["Altitude",`${selected.qrData.altitude}m`],
                  ["Variety",selected.qrData.variety],
                  ["Process",selected.qrData.processingMethod],
                  ["Export Date",selected.exportDate],
                ].map(([k,v])=>(
                  <div key={k} className="p-2.5 rounded-xl" style={{ background:C.mist }}>
                    <p className="text-xs" style={{ color:C.slate }}>{k}</p>
                    <p className="text-xs font-bold" style={{ color:C.ink }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Chain timeline */}
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>
                Immutable Chain ({selected.chain.length} events)
              </p>
              <div className="space-y-3 relative">
                <div className="absolute left-4 top-4 bottom-4 w-px" style={{ background:`${C.violet}25` }}/>
                {selected.chain.map((event,i)=>(
                  <div key={i} className="flex gap-3 pl-10 relative">
                    <div className="absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      style={{ background:`${C.violet}15`, border:`1.5px solid ${i===selected.chain.length-1?C.violet:`${C.violet}40`}` }}>
                      {event.icon}
                    </div>
                    <div className="flex-1 p-3 rounded-xl" style={{ background:i===selected.chain.length-1?`${C.violet}08`:C.mist, border:`1px solid ${i===selected.chain.length-1?`${C.violet}20`:C.border}` }}>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-black" style={{ color:C.ink }}>{event.stage}</p>
                        <span className="text-xs" style={{ color:C.slate }}>{event.date}</span>
                      </div>
                      <p className="text-xs" style={{ color:C.slate }}>{event.loc} · {event.actor}</p>
                      <p className="text-xs font-mono mt-1" style={{ color:`${C.violet}80` }}>{event.hash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Buyer scan portal preview */}
            <Card className="p-4" style={{ background:`${C.grove}`, border:"none" }}>
              <div className="flex items-center gap-3 mb-3">
                <XGrowMark size={28} rx={7} bg="rgba(255,255,255,0.1)" stroke="#F5F1E8" tip={C.lime}/>
                <div>
                  <p className="text-sm font-black text-white" style={{ fontFamily:"'Barlow Condensed',sans-serif" }}>
                    <span style={{ color:C.lime }}>X</span>GROW Trace Portal
                  </p>
                  <p className="text-xs" style={{ color:"rgba(245,241,232,0.45)" }}>grow.xcado.africa/trace/{selected.id}</p>
                </div>
                <div className="ml-auto"><Badge label="Public URL" color={C.lime}/></div>
              </div>
              <p className="text-xs" style={{ color:"rgba(245,241,232,0.6)", lineHeight:1.6 }}>
                Buyers scan the QR code on the shipment label to access the full provenance record —
                farm GPS, certifications, chain of custody events, and farmer profile.
                All data is read-only and tamper-evident.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 4 — SETTINGS, PROFILE & PLATFORM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const INTEGRATIONS = [
  { name:"M-Pesa Daraja v2",        desc:"Payment collection & disbursement",  status:"Connected", icon:"💳", color:C.field },
  { name:"Equity Bank H2H",         desc:"Host-to-host bulk payments",          status:"Pending",   icon:"🏦", color:C.amber },
  { name:"KEPHIS API",              desc:"Phytosanitary certificate lookup",     status:"Connected", icon:"🇰🇪", color:C.field },
  { name:"OpenWeatherMap",          desc:"7-day field-level forecasts",          status:"Connected", icon:"🌤️", color:C.sky },
  { name:"Twilio (SMS/WhatsApp)",   desc:"Farmer bulk messaging",               status:"Connected", icon:"💬", color:C.teal },
  { name:"Google Maps Platform",    desc:"County & field GIS mapping",          status:"Pending",   icon:"🗺️", color:C.orange },
  { name:"Anthropic Claude API",    desc:"AI yield prediction engine",           status:"Connected", icon:"🤖", color:C.violet },
  { name:"Blockchain (Ethereum L2)","desc":"Traceability ledger",               status:"Beta",      icon:"⛓️", color:C.violet },
];

const ORG_PROFILE = {
  name:"XCADO Ltd", type:"Enterprise", plan:"Enterprise", domain:"grow.xcado.africa",
  adminName:"Admin User", adminEmail:"admin@xcado.co.ke", adminPhone:"+254 700 000 001",
  farmers:1240, counties:24, tenantSince:"2022-11", mrrKES:2400,
};

function Settings() {
  const [tab, setTab]         = useState("profile");
  const [saved, setSaved]     = useState(false);
  const [apiVisible, setApiVisible] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const TABS = [
    ["profile",  "🏢 Organisation"],
    ["integrations","⚙️ Integrations"],
    ["api",      "🔑 API & Webhooks"],
    ["notifications","🔔 Notifications"],
    ["sprints",  "🗺️ Platform Roadmap"],
  ];

  return (
    <div>
      <SectionTitle sub="Organisation profile · API keys · Integrations · Notifications · Full platform roadmap">
        ⚙️ Settings &amp; Platform Config
      </SectionTitle>

      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
        {TABS.map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background:tab===id?"#fff":"transparent", color:tab===id?C.ink:C.slate, boxShadow:tab===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
        ))}
      </div>

      {/* PROFILE */}
      {tab==="profile" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <Card className="p-5 mb-4">
              <p className="text-sm font-black mb-4" style={{ color:C.ink }}>Organisation Details</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Organisation Name","XCADO Ltd"],["Organisation Type","Corporate / Exporter"],
                  ["Admin Name","Admin User"],["Admin Email","admin@xcado.co.ke"],
                  ["Primary Phone","+254 700 000 001"],["Custom Domain","grow.xcado.africa"],
                ].map(([label,val])=>(
                  <div key={label}>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:C.slate }}>{label}</label>
                    <div className="border rounded-xl px-3.5 py-2.5 text-sm" style={{ borderColor:C.border, background:C.mist, color:C.ink }}>{val}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-4 px-5 py-2 rounded-xl text-sm font-black text-white transition-all"
                style={{ background:saved?C.shoot:C.field }}>
                {saved?"✓ Saved":"Save Changes"}
              </button>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-black mb-4" style={{ color:C.ink }}>Plan & Billing</p>
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background:`${C.harvest}10`, border:`1px solid ${C.harvest}30` }}>
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <p className="text-sm font-black" style={{ color:C.ink }}>Enterprise Plan</p>
                  <p className="text-xs" style={{ color:C.slate }}>Unlimited farmers · Multi-org · API access · Dedicated support</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black" style={{ color:C.harvest }}>KES 2,400</p>
                  <p className="text-xs" style={{ color:C.slate }}>per month</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[["Farmers",ORG_PROFILE.farmers.toLocaleString(),"registered"],["Counties",ORG_PROFILE.counties,"covered"],["Since",ORG_PROFILE.tenantSince,"joined"]].map(([k,v,s])=>(
                  <div key={k} className="p-3 rounded-xl text-center" style={{ background:C.mist }}>
                    <p className="text-xl font-black" style={{ color:C.field }}>{v}</p>
                    <p className="text-xs" style={{ color:C.slate }}>{k} {s}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Quick Stats</p>
              {[["Active Farmers","1,240"],["Active Counties","24"],["Open Listings","10"],["Orders This Month","4"],["Shipments Active","3"],["Certifications","8"]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs py-1.5" style={{ borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.slate }}>{k}</span><span className="font-black" style={{ color:C.ink }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* INTEGRATIONS */}
      {tab==="integrations" && (
        <div className="grid grid-cols-2 gap-4">
          {INTEGRATIONS.map(intg => (
            <div key={intg.name} className="flex items-center gap-4 p-4 rounded-xl border bg-white"
              style={{ borderColor:C.border }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:`${intg.color}12` }}>{intg.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black" style={{ color:C.ink }}>{intg.name}</p>
                <p className="text-xs" style={{ color:C.slate }}>{intg.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={intg.status}
                  color={intg.status==="Connected"?C.shoot:intg.status==="Beta"?C.violet:C.amber}/>
                <button className="text-xs px-2.5 py-1.5 rounded-lg font-bold"
                  style={{ background:C.mist, color:C.slate, border:`1px solid ${C.border}` }}>
                  {intg.status==="Connected"?"Configure":"Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API */}
      {tab==="api" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-black mb-4" style={{ color:C.ink }}>API Keys</p>
            <div className="space-y-3">
              {[
                { label:"Production API Key", key:"xg_live_•••••••••••••••••••••••••••", env:"Production", color:C.field },
                { label:"Sandbox API Key",    key:"xg_test_•••••••••••••••••••••••••••", env:"Sandbox",    color:C.amber },
              ].map(k=>(
                <div key={k.label} className="p-3.5 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold" style={{ color:C.ink }}>{k.label}</p>
                    <Badge label={k.env} color={k.color}/>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono p-2 rounded-lg" style={{ background:C.grove, color:C.lime }}>
                      {apiVisible ? "xg_live_a3f4b7c2d1e8f5a9b3c6d2e7f1a4b8c5" : k.key}
                    </code>
                    <button onClick={()=>setApiVisible(!apiVisible)} className="text-xs px-2.5 py-1.5 rounded-lg font-bold"
                      style={{ background:C.field, color:"#fff" }}>
                      {apiVisible?"Hide":"Reveal"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-black mb-3" style={{ color:C.ink }}>Webhook Endpoints</p>
            {[
              { event:"farmer.registered",  url:"https://api.xcado.co.ke/webhooks/farmer",   active:true },
              { event:"order.confirmed",    url:"https://api.xcado.co.ke/webhooks/order",    active:true },
              { event:"payment.received",   url:"https://api.xcado.co.ke/webhooks/payment",  active:true },
              { event:"shipment.delivered", url:"https://api.xcado.co.ke/webhooks/shipment", active:false },
            ].map(w=>(
              <div key={w.event} className="flex items-center gap-3 py-2.5" style={{ borderBottom:`1px solid ${C.border}` }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:w.active?C.shoot:C.border }}/>
                <code className="text-xs font-mono flex-shrink-0" style={{ color:C.violet }}>{w.event}</code>
                <span className="text-xs flex-1 truncate" style={{ color:C.slate }}>{w.url}</span>
                <Badge label={w.active?"Active":"Inactive"} color={w.active?C.shoot:C.slate}/>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* PLATFORM ROADMAP */}
      {tab==="sprints" && (
        <div className="space-y-4">
          {[
            { sprint:"Sprint 1–2", label:"Foundation", status:"complete", pct:100,
              modules:["React Admin Dashboard","Flutter Mobile App (iOS/Android)","Enterprise Multi-Org Dashboard","Farmer Registration & KYC","Crop Cycle Management","Payments & Wallet (M-Pesa/Equity)","Marketplace Listings","Loans & Insurance","Credit Scoring"] },
            { sprint:"Sprint 3", label:"Growth Platform", status:"complete", pct:100,
              modules:["Gap Analysis Engine","SaaS Subscription & Billing","Weather & Field Intelligence","Supplier Portal & RBAC"] },
            { sprint:"Sprint 4", label:"Farmer Intelligence", status:"complete", pct:100,
              modules:["47-County Database with cascade","4-Step Farmer Signup Wizard","Trade Assessment Engine (15 crops)","Local vs Export Price Comparison","90-Day Action Plans"] },
            { sprint:"Sprint 5", label:"Route to Market", status:"complete", pct:100,
              modules:["Marketplace & Trade Board (full)","Supply Chain & Logistics (full)","Compliance & Certification Tracker","AI Yield & Price Intelligence","Pest Alert System"] },
            { sprint:"Sprint 6", label:"Platform Complete", status:"current", pct:100,
              modules:["Unified Platform Dashboard","Training & Knowledge Base","Blockchain Traceability & QR","Settings, API & Integrations","XCADO Brand Identity Applied"] },
          ].map((s,i)=>(
            <div key={s.sprint} className="rounded-2xl border overflow-hidden"
              style={{ borderColor:s.status==="current"?C.lime:s.status==="complete"?C.field:C.border,
                borderWidth:s.status==="current"?2:1, background:s.status==="current"?`${C.lime}05`:"#fff" }}>
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background:s.status==="complete"?C.field:s.status==="current"?C.lime:C.border,
                    color:s.status==="roadmap"?C.slate:"#fff" }}>
                  {s.status==="complete"?"✓":s.status==="current"?"★":i+1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black" style={{ color:C.ink }}>{s.sprint} — {s.label}</p>
                    <Badge label={s.status==="complete"?"Complete":s.status==="current"?"Live Now":"Roadmap"}
                      color={s.status==="complete"?C.field:s.status==="current"?C.lime:C.slate}/>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.modules.map(m=>(
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background:`${s.status==="complete"?C.field:s.status==="current"?C.lime:C.slate}12`,
                          color:s.status==="complete"?C.field:s.status==="current"?C.earth:C.slate }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black" style={{ color:s.status==="complete"?C.field:s.status==="current"?C.lime:C.slate }}>
                    {s.pct}%
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Final celebration */}
          <div className="rounded-2xl p-6 text-center" style={{ background:C.grove }}>
            <XGrowMark size={48} rx={12} bg="rgba(255,255,255,0.1)" stroke="#F5F1E8" tip={C.lime}/>
            <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26,
              color:"#F5F1E8", letterSpacing:-0.5, margin:"12px 0 4px" }}>
              <span style={{ color:C.lime }}>X</span>GROW Platform — 100% Complete
            </h3>
            <p style={{ color:"rgba(245,241,232,0.55)", fontSize:13, marginBottom:16 }}>
              Grow. Further. · by XCADO Group · grow.xcado.africa
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["6 Sprints","4 Mobile Screens","16 Web Modules","47 Counties","15 Crop Intelligence Profiles","8 Certifications","Blockchain Traceability"].map(badge=>(
                <span key={badge} className="text-xs px-3 py-1.5 rounded-full font-bold"
                  style={{ background:`${C.lime}20`, color:C.lime, border:`1px solid ${C.lime}30` }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="notifications" && (
        <Card className="p-5">
          <p className="text-sm font-black mb-4" style={{ color:C.ink }}>Notification Preferences</p>
          <div className="space-y-3">
            {[
              ["New farmer registered","SMS + In-app", true],
              ["Order confirmed","Email + In-app", true],
              ["Shipment status change","In-app", true],
              ["Certification expiry (60 days)","Email + SMS", true],
              ["Pest alert in your county","SMS + In-app", true],
              ["Payment received","SMS + In-app + WhatsApp", true],
              ["AI yield alert","Email", false],
              ["Weekly platform summary","Email", true],
            ].map(([event,channels,active])=>(
              <div key={event} className="flex items-center justify-between py-2.5" style={{ borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p className="text-xs font-bold" style={{ color:C.ink }}>{event}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{channels}</p>
                </div>
                <div className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                  style={{ background:active?C.field:C.border }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left:active?"calc(100% - 18px)":"2px" }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",     icon:"🏠", label:"Dashboard",           tag:null },
  { id:"training",      icon:"📚", label:"Training & Knowledge", tag:"New" },
  { id:"traceability",  icon:"🔗", label:"Blockchain Trace",     tag:"New" },
  { id:"settings",      icon:"⚙️", label:"Settings & Config",    tag:"New" },
];

const PREV_BUILT = [
  ["🛒","Marketplace & Trade Board"],
  ["🚚","Supply Chain & Logistics"],
  ["✅","Compliance & Certifications"],
  ["🤖","AI Yield Intelligence"],
  ["👥","Farmer Registry + Signup"],
  ["📈","Trade Assessment"],
  ["💎","SaaS Subscriptions"],
  ["🌤️","Weather & Fields"],
  ["🏭","Supplier & RBAC"],
  ["📊","Analytics & SDG M&E"],
  ["📱","Flutter Mobile App"],
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Sprint6() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Outfit','Plus Jakarta Sans',sans-serif", background:C.chalk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#C0BAB0; border-radius:4px; }
        button { font-family:'Outfit',sans-serif; cursor:pointer; }
        select, input { font-family:'Outfit',sans-serif; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:252, flexShrink:0, display:"flex", flexDirection:"column",
        background:C.grove, borderRight:"1px solid rgba(255,255,255,0.06)" }}>

        {/* Brand lockup */}
        <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <XGrowMark size={40} rx={10}/>
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1, fontFamily:"'Barlow Condensed',sans-serif" }}>
              <span style={{ fontWeight:800, fontSize:21, letterSpacing:-0.5, color:"#F5F1E8" }}>Grow</span>
              <span style={{ fontWeight:700, fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:C.lime, marginTop:3 }}>by XCADO</span>
              <p style={{ fontSize:10, color:"rgba(245,241,232,0.38)", marginTop:5,
                letterSpacing:"0.05em", fontWeight:500, fontFamily:"'Outfit',sans-serif" }}>Grow. Further.</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding:"10px", flex:1, overflowY:"auto" }}>
          <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
            padding:"8px 10px 5px", color:"rgba(255,255,255,0.22)" }}>Sprint 6 · Final</p>
          {NAV.map(n => {
            const active = page===n.id;
            return (
              <button key={n.id} onClick={()=>setPage(n.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:10, marginBottom:2,
                background: active?"rgba(157,217,106,0.12)":"transparent",
                border: active?`1px solid rgba(157,217,106,0.22)`:"1px solid transparent",
                borderLeft: active?`3px solid ${C.lime}`:"3px solid transparent",
                color: active?"#F5F1E8":"rgba(245,241,232,0.42)",
                fontSize:13, fontWeight:active?600:500, textAlign:"left", transition:"all 0.14s",
              }}>
                <span style={{ fontSize:15 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                {n.tag && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:20, fontWeight:700,
                  background:`${C.lime}20`, color:C.lime }}>{n.tag}</span>}
              </button>
            );
          })}

          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
              padding:"0 10px 5px", color:"rgba(255,255,255,0.18)" }}>All Sprints Built</p>
            {PREV_BUILT.map(([icon,label]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:9,
                padding:"4px 10px", fontSize:11, color:"rgba(245,241,232,0.2)" }}>
                <span style={{ fontSize:11, opacity:0.4 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, color:"rgba(245,241,232,0.45)", fontWeight:600 }}>Platform completion</span>
              <XGrowMark size={18} bg="none" stroke={C.lime} tip={C.lime}/>
            </div>
            <div style={{ height:5, borderRadius:3, background:"rgba(255,255,255,0.1)", overflow:"hidden", marginBottom:6 }}>
              <div style={{ height:"100%", borderRadius:3, width:"100%",
                background:`linear-gradient(90deg,${C.lime},#C8F590)` }}/>
            </div>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:C.lime, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>
                100% · Sprint 6 Complete
              </span>
              <span style={{ fontSize:9, color:"rgba(245,241,232,0.25)" }}>by XCADO</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <header style={{ background:"#fff", padding:"0 24px", height:52,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <XGrowMark size={22} rx={6}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:-0.3, color:C.grove }}>
                Grow <span style={{ color:C.field, fontWeight:700, letterSpacing:"0.14em", fontSize:10 }}>BY XCADO</span>
              </span>
            </div>
            <span style={{ color:C.border, fontSize:16 }}>/</span>
            <span style={{ fontWeight:700, color:C.ink, fontSize:13 }}>{NAV.find(n=>n.id===page)?.label || "Dashboard"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px 4px 8px",
              borderRadius:20, background:C.grove, border:`1px solid ${C.field}` }}>
              <XGrowMark size={16} bg="none" stroke={C.lime} tip={C.lime}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12,
                color:C.lime, letterSpacing:0.4 }}>Grow. Further.</span>
            </div>
            <div style={{ fontSize:11, padding:"4px 10px", borderRadius:20,
              background:`${C.lime}18`, color:C.earth, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>
              Platform Complete · Sprint 6
            </div>
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.field,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:11, fontWeight:800, color:"#F5F1E8", fontFamily:"'Barlow Condensed',sans-serif" }}>GW</span>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            {page==="dashboard"    && <Dashboard />}
            {page==="training"     && <TrainingHub />}
            {page==="traceability" && <Traceability />}
            {page==="settings"     && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}
