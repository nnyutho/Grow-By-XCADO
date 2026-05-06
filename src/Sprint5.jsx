import { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell, PieChart, Pie
} from "recharts";
import { Dashboard, TrainingHub, Traceability, Settings } from "./Sprint6.jsx";

// ── GROW BY XCADO — BRAND TOKENS ──────────────────────────────────────────────
const C = {
  // XCADO / Grow palette
  grove:       "#0F3D20",   // darkest anchor — sidebar bg, deep text
  field:       "#1E7A3E",   // primary brand green — buttons, nav active
  shoot:       "#5BB35E",   // mid-bright — hover states, progress
  lime:        "#9DD96A",   // accent — X mark tip, data viz, tags
  harvest:     "#E8A020",   // amber-gold — CTAs, payments, premium
  earth:       "#7A4E2D",   // warm brown — maps, secondary accents
  chalk:       "#F5F1E8",   // warm off-white — page background
  ink:         "#0C1A0E",   // near-black with green undertone — body text
  // System colours
  sky:         "#0EA5E9",
  crimson:     "#DC2626",
  violet:      "#7C3AED",
  teal:        "#0D9488",
  orange:      "#EA580C",
  slate:       "#64748B",
  mist:        "#F7F4EF",
  border:      "#E5DFD3",
  card:        "#FFFFFF",
  // Backward-compat aliases — all module code uses these and cascades cleanly
  forest:      "#0F3D20",
  forestMid:   "#1E7A3E",
  forestLight: "#5BB35E",
  amber:       "#E8A020",
  amberLight:  "#FEF3C7",
  sand:        "#F5F1E8",
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

// ── WORDMARK ──────────────────────────────────────────────────────────────────
// "Grow" wordmark with a small "by XCADO" attribution.
const XGrowWordmark = ({ light=true, size=20 }) => (
  <span style={{ display:"inline-flex", flexDirection:"column", lineHeight:1, fontFamily:"'Barlow Condensed',sans-serif" }}>
    <span style={{ fontWeight:800, fontSize:size, letterSpacing:-0.5, color: light ? "#F5F1E8" : C.grove }}>
      Grow
    </span>
    <span style={{ fontWeight:700, fontSize:Math.max(8, size*0.42), letterSpacing:"0.18em",
      textTransform:"uppercase", color: light ? C.lime : C.field, marginTop:2 }}>
      by XCADO
    </span>
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
    <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, letterSpacing:-0.5, color:C.ink, margin:"0 0 2px", lineHeight:1.15 }}>{children}</h2>
    {sub && <p className="text-sm mt-1" style={{ color:C.slate }}>{sub}</p>}
  </div>
);
const KpiCard = ({ icon, label, value, sub, color }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color:C.slate }}>{label}</span>
    </div>
    <p className="text-2xl font-black" style={{ color }}>{value}</p>
    {sub && <p className="text-xs mt-0.5 truncate" style={{ color:C.slate }}>{sub}</p>}
  </Card>
);
const StatRow = ({ label, value, bar, color }) => (
  <div className="flex items-center gap-3 mb-2.5">
    <span className="text-xs w-32 flex-shrink-0" style={{ color:C.slate }}>{label}</span>
    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:C.border }}>
      <div className="h-full rounded-full" style={{ width:`${bar}%`, background:color }} />
    </div>
    <span className="text-xs font-black w-10 text-right" style={{ color }}>{value}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1 — MARKETPLACE & TRADE BOARD (FULL BUILD)
// ═══════════════════════════════════════════════════════════════════════════════
const LISTINGS = [
  { id:"L001", img:"☕", crop:"Coffee AA",    grade:"AA", intent:"export", status:"Active",  farmer:"James Mwangi",    county:"Meru",      org:"Meru Coffee Coop",        price:420, unit:"kg", qty:4800,  available:"Apr 20", certified:["GlobalG.A.P","Fairtrade"] },
  { id:"L002", img:"🥑", crop:"Avocado",      grade:"A",  intent:"export", status:"Active",  farmer:"Grace Wanjiku",   county:"Kiambu",    org:"Tigoni Growers Ltd",      price:75,  unit:"kg", qty:12000, available:"Apr 14", certified:["GlobalG.A.P","KEPHIS"] },
  { id:"L003", img:"🫘", crop:"Green Grams",  grade:"A",  intent:"local",  status:"Active",  farmer:"Peter Mutua",     county:"Makueni",   org:"Makueni Pulses Coop",     price:200, unit:"kg", qty:3200,  available:"Apr 18", certified:[] },
  { id:"L004", img:"🧅", crop:"Onions",       grade:"B",  intent:"local",  status:"Active",  farmer:"Samuel Ruto",     county:"Elgeyo",    org:"Rift Valley Agri",        price:55,  unit:"kg", qty:8000,  available:"Apr 22", certified:[] },
  { id:"L005", img:"🍅", crop:"Tomatoes",     grade:"A",  intent:"local",  status:"Pending", farmer:"Agnes Chepkoech", county:"Kirinyaga", org:"Mwea Tomato Growers",     price:80,  unit:"kg", qty:2500,  available:"Apr 25", certified:["KEPHIS"] },
  { id:"L006", img:"🌿", crop:"French Beans", grade:"AA", intent:"export", status:"Active",  farmer:"David Kariuki",   county:"Nyeri",     org:"Central Highlands Veg",   price:130, unit:"kg", qty:6500,  available:"Apr 16", certified:["GlobalG.A.P","Fairtrade","KEPHIS"] },
  { id:"L007", img:"🥬", crop:"Kale",         grade:"A",  intent:"local",  status:"Active",  farmer:"Mary Akinyi",     county:"Kisumu",    org:"Lakeview Farms",          price:40,  unit:"kg", qty:1800,  available:"Apr 19", certified:[] },
  { id:"L008", img:"🌽", crop:"Maize",        grade:"B",  intent:"local",  status:"Active",  farmer:"Joseph Kamau",    county:"Nakuru",    org:"Rift Valley Cereals",     price:45,  unit:"kg", qty:15000, available:"May 01", certified:[] },
];

const ORDERS = [
  { id:"ORD-001", listing:"L001", buyer:"Hamburg Traders GmbH",     qty:2400,  totalKES:1008000, delivery:"Mombasa Port",     payment:"60% advance · 40% on delivery", status:"Confirmed" },
  { id:"ORD-002", listing:"L002", buyer:"Dutch Flower Group",        qty:5000,  totalKES:375000,  delivery:"JKIA Air Cargo",   payment:"Letter of Credit",              status:"Processing" },
  { id:"ORD-003", listing:"L006", buyer:"Tesco Supermarkets UK",     qty:3000,  totalKES:390000,  delivery:"Mombasa Port",     payment:"30-day net",                    status:"Confirmed" },
  { id:"ORD-004", listing:"L003", buyer:"Nairobi Wholesale Market",  qty:1500,  totalKES:300000,  delivery:"Wakulima Market",  payment:"Cash on delivery",              status:"Processing" },
  { id:"ORD-005", listing:"L004", buyer:"Carrefour Kenya",           qty:2000,  totalKES:110000,  delivery:"Nairobi DC",       payment:"14-day net",                    status:"Pending" },
];

const PRICE_TRENDS = {
  "Coffee AA":   [380, 395, 400, 410, 405, 415, 420, 418, 425, 430, 420, 420],
  "Avocado":     [60,  65,  70,  72,  68,  75,  80,  78,  76,  80,  75,  75],
  "French Beans":[110, 115, 118, 125, 120, 128, 130, 132, 128, 130, 130, 130],
  "Tomatoes":    [70,  65,  75,  80,  78,  82,  80,  85,  78,  80,  80,  80],
  "Maize":       [38,  40,  42,  44,  43,  45,  46,  45,  44,  45,  45,  45],
  "Green Grams": [180, 185, 190, 195, 192, 198, 200, 202, 198, 200, 200, 200],
};

const MONTHS = ["May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];

function Marketplace() {
  const [view, setView]             = useState("listings");
  const [search, setSearch]         = useState("");
  const [intentF, setIntentF]       = useState("all");
  const [gradeF, setGradeF]         = useState("all");
  const [selectedL, setSelectedL]   = useState(null);
  const [trendCrop, setTrendCrop]   = useState(Object.keys(PRICE_TRENDS)[0]);

  const filtered = useMemo(() =>
    LISTINGS.filter(l => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.crop.toLowerCase().includes(q) || l.county.toLowerCase().includes(q) || l.farmer.toLowerCase().includes(q);
      const matchIntent = intentF === "all" || l.intent === intentF;
      const matchGrade  = gradeF  === "all" || l.grade  === gradeF;
      return matchSearch && matchIntent && matchGrade;
    }),
    [search, intentF, gradeF]
  );

  const exportCount    = LISTINGS.filter(l => l.intent === "export").length;
  const totalValue     = LISTINGS.reduce((s, l) => s + l.qty * l.price, 0);
  const certifiedCount = LISTINGS.filter(l => l.certified.length > 0).length;
  const trendData      = (PRICE_TRENDS[trendCrop] || []).map((price, i) => ({ m: MONTHS[i], price }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Live produce listings · Buyer orders · Price discovery · Trade matching">
          🛒 Marketplace &amp; Trade Board
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["listings","🌾 Listings"],["orders","📦 Orders"],["prices","📈 Prices"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🌾" label="Active Listings"  value={LISTINGS.filter(l=>l.status==="Active").length}   sub={`${LISTINGS.length} total`}     color={C.forestMid} />
        <KpiCard icon="✈️" label="Export Listings"  value={exportCount}  sub="Ready for international buyers"  color={C.sky} />
        <KpiCard icon="💰" label="Total Value"       value={`KES ${(totalValue/1e6).toFixed(1)}M`} sub="Combined listing value" color={C.amber} />
        <KpiCard icon="✅" label="Certified Produce" value={certifiedCount} sub="GlobalG.A.P / Fairtrade / KEPHIS" color={C.violet} />
      </div>

      {/* LISTINGS */}
      {view==="listings" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <div className="flex gap-3 mb-4 flex-wrap">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search crop, county, farmer…"
                className="flex-1 min-w-40 border rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                style={{ borderColor:C.border, background:C.mist }} />
              <select value={intentF} onChange={e=>setIntentF(e.target.value)}
                className="border rounded-xl px-3 py-2 text-sm cursor-pointer" style={{ borderColor:C.border, background:C.mist }}>
                <option value="all">All Trade Intent</option>
                <option value="export">Export Only</option>
                <option value="local">Local Only</option>
              </select>
              <select value={gradeF} onChange={e=>setGradeF(e.target.value)}
                className="border rounded-xl px-3 py-2 text-sm cursor-pointer" style={{ borderColor:C.border, background:C.mist }}>
                <option value="all">All Grades</option>
                <option value="A">Grade A</option>
                <option value="AA">Grade AA</option>
                <option value="B">Grade B</option>
              </select>
            </div>
            <div className="space-y-2.5">
              {filtered.map(l=>(
                <div key={l.id} onClick={()=>setSelectedL(selectedL?.id===l.id?null:l)}
                  className="rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-sm"
                  style={{ background:selectedL?.id===l.id?`${C.forestMid}08`:"#fff", borderColor:selectedL?.id===l.id?C.forestMid:C.border, borderWidth:selectedL?.id===l.id?2:1 }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{l.img}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black" style={{ color:C.ink }}>{l.crop}</span>
                        <Badge label={`Grade ${l.grade}`} color={l.grade==="AA"?C.violet:l.grade==="A"?C.forestLight:C.slate} />
                        <Badge label={l.intent==="export"?"✈️ Export":"🏪 Local"} color={l.intent==="export"?C.sky:C.teal} />
                        <Badge label={l.status} color={l.status==="Active"?C.forestLight:C.amber} />
                      </div>
                      <p className="text-xs mt-0.5" style={{ color:C.slate }}>{l.farmer} · {l.county} County · {l.org}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black" style={{ color:C.forestMid }}>KES {l.price.toLocaleString()}/{l.unit}</p>
                      <p className="text-xs" style={{ color:C.slate }}>{l.qty.toLocaleString()} {l.unit} available</p>
                    </div>
                  </div>
                  {selectedL?.id===l.id && (
                    <div className="mt-3 pt-3 grid grid-cols-3 gap-3" style={{ borderTop:`1px solid ${C.border}` }}>
                      <div><p className="text-xs text-stone-400">Available from</p><p className="text-xs font-bold">{l.available}</p></div>
                      <div><p className="text-xs text-stone-400">Total value</p><p className="text-xs font-bold">KES {(l.qty*l.price).toLocaleString()}</p></div>
                      <div><p className="text-xs text-stone-400">Certifications</p>
                        <p className="text-xs font-bold">{l.certified.length>0?l.certified.join(", "):"None yet"}</p>
                      </div>
                      <div className="col-span-3 flex gap-2 mt-1">
                        <button className="text-xs px-4 py-2 rounded-xl font-bold text-white flex-1" style={{ background:C.forestMid }}>Place Order</button>
                        <button className="text-xs px-4 py-2 rounded-xl font-bold flex-1" style={{ background:C.sky+"18", color:C.sky, border:`1px solid ${C.sky}30` }}>Request Sample</button>
                        <button className="text-xs px-4 py-2 rounded-xl font-bold flex-1" style={{ background:C.mist, color:C.slate, border:`1px solid ${C.border}` }}>Message Farmer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Top Crops by Volume</p>
              {Object.entries(LISTINGS.reduce((acc,l)=>{ acc[l.crop]=(acc[l.crop]||0)+l.qty; return acc; },{}))
                .sort((a,b)=>b[1]-a[1]).slice(0,6).map(([crop,vol])=>(
                <StatRow key={crop} label={crop} value={`${(vol/1000).toFixed(1)}T`}
                  bar={Math.round((vol/5000)*100)} color={C.forestLight} />
              ))}
            </Card>
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Recent Orders</p>
              {ORDERS.slice(0,3).map(o=>{
                const listing = LISTINGS.find(l=>l.id===o.listing);
                return (
                  <div key={o.id} className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl">{listing?.img}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color:C.ink }}>{o.buyer}</p>
                      <p className="text-xs truncate" style={{ color:C.slate }}>{listing?.crop} · {o.qty.toLocaleString()} kg</p>
                    </div>
                    <Badge label={o.status} color={o.status==="Confirmed"?C.forestLight:o.status==="Processing"?C.sky:C.amber} />
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {view==="orders" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background:C.mist }}>
                {["Order ID","Buyer","Produce","Qty","Total Value","Delivery Point","Payment","Status"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider whitespace-nowrap" style={{ color:C.slate }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{ORDERS.map((o,i)=>{
                const listing = LISTINGS.find(l=>l.id===o.listing);
                return (
                  <tr key={o.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color:C.slate }}>{o.id}</td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color:C.ink }}>{o.buyer}</td>
                    <td className="px-4 py-3"><span className="text-base mr-1">{listing?.img}</span><span className="text-xs">{listing?.crop}</span></td>
                    <td className="px-4 py-3 text-xs font-mono font-bold">{o.qty.toLocaleString()} kg</td>
                    <td className="px-4 py-3 text-xs font-black" style={{ color:C.forestMid }}>KES {o.totalKES.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{o.delivery}</td>
                    <td className="px-4 py-3 text-xs">{o.payment}</td>
                    <td className="px-4 py-3"><Badge label={o.status} color={o.status==="Confirmed"?C.forestLight:o.status==="Processing"?C.sky:C.amber} /></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PRICE TRENDS */}
      {view==="prices" && (
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <p className="text-sm font-black" style={{ color:C.ink }}>Price Trend — Last 12 Months (KES/kg)</p>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(PRICE_TRENDS).map(cr=>(
                  <button key={cr} onClick={()=>setTrendCrop(cr)}
                    className="text-xs px-3 py-1 rounded-xl font-bold transition-all border"
                    style={{ borderColor:trendCrop===cr?C.forestMid:C.border, background:trendCrop===cr?`${C.forestMid}10`:"#fff", color:trendCrop===cr?C.forestMid:C.slate }}>
                    {cr}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.forestLight} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={C.forestLight} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}`} />
                <Tooltip formatter={v=>[`KES ${v}/kg`,"Price"]} contentStyle={{ borderRadius:10, border:"none" }} />
                <Area type="monotone" dataKey="price" stroke={C.forestLight} strokeWidth={2.5} fill="url(#pGrad)" dot={{ fill:C.forestLight, r:3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PRICE_TRENDS).map(([crop, prices])=>{
              const cur = prices[prices.length-1];
              const prev = prices[prices.length-2];
              const chg = ((cur-prev)/prev*100).toFixed(1);
              return (
                <Card key={crop} className="p-4">
                  <p className="text-sm font-black" style={{ color:C.ink }}>{crop}</p>
                  <p className="text-2xl font-black mt-1" style={{ color:C.forestMid }}>KES {cur}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold" style={{ color:chg>=0?C.forestLight:C.crimson }}>{chg>=0?"↑":"↓"} {Math.abs(chg)}% vs last month</span>
                  </div>
                  <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background:C.border }}>
                    <div className="h-full rounded-full" style={{ width:`${Math.round((cur/Math.max(...prices))*100)}%`, background:C.forestLight }} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 2 — SUPPLY CHAIN & LOGISTICS (FULL BUILD)
// ═══════════════════════════════════════════════════════════════════════════════
const SHIPMENTS = [
  { id:"SH001", listing:"Coffee AA",   farmer:"James Mwangi",   origin:"Meru Town",    destination:"Mombasa Port", buyer:"Hamburg Traders", qty:"800 kg", driver:"Thomas Waweru", vehicle:"KCB 123X", status:"In Transit",  stage:3, coldChain:false, eta:"Apr 15", value:336000, updates:[
    { time:"Apr 10 08:00", loc:"Meru Farm Gate",    note:"Pickup complete — 800 kg loaded, Grade AA verified" },
    { time:"Apr 10 14:30", loc:"Embu Weighbridge",  note:"Weight confirmed at 798 kg — 2 kg moisture loss" },
    { time:"Apr 11 09:00", loc:"Nairobi CDC",        note:"Quality inspection passed · KEPHIS cert issued" },
    { time:"Apr 12 06:00", loc:"Mombasa Highway",    note:"En route Mombasa · ETA 6 hrs" },
  ]},
  { id:"SH002", listing:"Avocado",     farmer:"Grace Wanjiku",  origin:"Limuru",       destination:"JKIA Air Cargo", buyer:"Dutch Flower Group", qty:"1,500 kg", driver:"Patrick Otieno", vehicle:"KDG 456Y", status:"At Pack House", stage:2, coldChain:true, eta:"Apr 14", value:112500, updates:[
    { time:"Apr 11 07:00", loc:"Tigoni Farm",        note:"Harvest complete — 1,520 kg picked" },
    { time:"Apr 11 15:00", loc:"Kiambu Pack House",  note:"Grading in progress — 1,500 kg Grade A approved" },
  ]},
  { id:"SH003", listing:"Green Grams", farmer:"Peter Mutua",    origin:"Kibwezi East", destination:"Mombasa Port", buyer:"Agri India Imports", qty:"800 kg",  driver:"John Kamau",    vehicle:"KDH 789Z", status:"Delivered",    stage:5, coldChain:false, eta:"Delivered", value:160000, updates:[
    { time:"Mar 28 08:00", loc:"Makueni Farm Gate",   note:"Pickup — 810 kg dry weight confirmed" },
    { time:"Mar 28 20:00", loc:"Nairobi CDC",         note:"Sorted, bagged and labelled" },
    { time:"Mar 30 06:00", loc:"Mombasa Container Yard", note:"Stuffed in 20ft container MSCU1234567" },
    { time:"Apr 01 00:00", loc:"Mombasa Port",        note:"Vessel MV Safmarine loaded · Bill of Lading issued" },
  ]},
  { id:"SH004", listing:"Rice",        farmer:"Mary Akinyi",    origin:"Nyando",       destination:"Kisumu DC",    buyer:"Meru Millers Ltd",  qty:"2,000 kg", driver:"David Ochieng",  vehicle:"KDE 321W", status:"Scheduled",    stage:1, coldChain:false, eta:"Apr 18", value:180000, updates:[
    { time:"Apr 15 08:00", loc:"Pickup scheduled",    note:"Driver assigned · Contact farmer 24hrs before" },
  ]},
];

const SUPPLY_STAGES = [
  { n:1, label:"Scheduled",      icon:"📋", color:C.slate },
  { n:2, label:"At Pack House",  icon:"📦", color:C.amber },
  { n:3, label:"In Transit",     icon:"🚛", color:C.sky },
  { n:4, label:"At Port / Hub",  icon:"⚓", color:C.violet },
  { n:5, label:"Delivered",      icon:"✅", color:C.forestLight },
];

const VEHICLES = [
  { plate:"KCB 123X", driver:"Thomas Waweru", phone:"0722 111 222", type:"7-ton lorry",    status:"Active",    lastLoc:"Nairobi-Mombasa Hwy", temp:null },
  { plate:"KDG 456Y", driver:"Patrick Otieno", phone:"0733 222 333", type:"3-ton pickup",   status:"At base",   lastLoc:"Kiambu Pack House",   temp:"4°C" },
  { plate:"KDH 789Z", driver:"John Kamau",     phone:"0744 333 444", type:"7-ton lorry",    status:"Available", lastLoc:"Mombasa Port",        temp:null },
  { plate:"KDE 321W", driver:"David Ochieng",  phone:"0755 444 555", type:"5-ton lorry",    status:"Scheduled", lastLoc:"Kisumu Depot",        temp:null },
];

function SupplyChain() {
  const [view, setView]     = useState("pipeline");
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Farm-gate to buyer · Cold chain monitoring · Driver tracking · Port clearance">
          🚚 Supply Chain &amp; Logistics
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["pipeline","🗂 Pipeline"],["vehicles","🚛 Fleet"],["coldchain","❄️ Cold Chain"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="📦" label="Active Shipments"  value={SHIPMENTS.filter(s=>s.status!=="Delivered").length} sub="in pipeline" color={C.sky} />
        <KpiCard icon="✅" label="Delivered (30d)"   value={SHIPMENTS.filter(s=>s.status==="Delivered").length} sub="on time" color={C.forestLight} />
        <KpiCard icon="💰" label="Value in Transit"  value={`KES ${(SHIPMENTS.filter(s=>s.status!=="Delivered").reduce((a,s)=>a+s.value,0)/1000).toFixed(0)}K`} sub="gross value" color={C.amber} />
        <KpiCard icon="❄️" label="Cold Chain Active" value={SHIPMENTS.filter(s=>s.coldChain).length} sub="temperature-controlled loads" color={C.sky} />
      </div>

      {/* PIPELINE VIEW */}
      {view==="pipeline" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            {/* Stage pipeline header */}
            <Card className="p-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute inset-x-8 top-5 h-0.5" style={{ background:C.border, zIndex:0 }} />
                {SUPPLY_STAGES.map(s=>(
                  <div key={s.n} className="flex flex-col items-center z-10 relative" style={{ width:80 }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-1.5"
                      style={{ background:`${s.color}18`, border:`1.5px solid ${s.color}`, fontSize:18 }}>{s.icon}</div>
                    <span className="text-xs font-bold text-center leading-tight" style={{ color:s.color }}>{s.label}</span>
                    <span className="text-xs font-black mt-0.5" style={{ color:C.ink }}>
                      {SHIPMENTS.filter(sh=>sh.stage===s.n).length}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipment cards */}
            {SHIPMENTS.map(s=>{
              const stg = SUPPLY_STAGES.find(st=>st.n===s.stage);
              return (
                <div key={s.id} onClick={()=>setSelected(selected?.id===s.id?null:s)}
                  className="rounded-xl border cursor-pointer transition-all hover:shadow-sm overflow-hidden"
                  style={{ background:selected?.id===s.id?`${C.forestMid}05`:"#fff", borderColor:selected?.id===s.id?C.forestMid:C.border, borderWidth:selected?.id===s.id?2:1 }}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="text-center flex-shrink-0" style={{ width:40 }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base" style={{ background:`${stg.color}15` }}>{stg.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-black" style={{ color:C.ink }}>{s.listing}</span>
                        <Badge label={s.status} color={stg.color} />
                        {s.coldChain && <Badge label="❄️ Cold Chain" color={C.sky} />}
                      </div>
                      <p className="text-xs" style={{ color:C.slate }}>{s.farmer} · {s.origin} → {s.destination}</p>
                      <p className="text-xs mt-0.5" style={{ color:C.slate }}>Buyer: {s.buyer} · {s.qty} · ETA: {s.eta}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black" style={{ color:C.forestMid }}>KES {s.value.toLocaleString()}</p>
                      <p className="text-xs" style={{ color:C.slate }}>{s.driver}</p>
                      <p className="text-xs font-mono" style={{ color:C.slate }}>{s.vehicle}</p>
                    </div>
                  </div>

                  {/* Stage tracker */}
                  <div className="flex px-4 pb-3 gap-1">
                    {SUPPLY_STAGES.map(st=>(
                      <div key={st.n} className="flex-1 h-1.5 rounded-full" style={{ background:st.n<=s.stage?st.color:C.border }} />
                    ))}
                  </div>

                  {/* Expanded tracking */}
                  {selected?.id===s.id && (
                    <div className="px-4 pb-4 pt-1" style={{ borderTop:`1px solid ${C.border}` }}>
                      <p className="text-xs font-black uppercase tracking-wider mb-2.5" style={{ color:C.slate }}>Tracking History</p>
                      <div className="space-y-2.5 relative">
                        <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background:C.border }} />
                        {s.updates.map((u,i)=>(
                          <div key={i} className="flex gap-3 pl-6 relative">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              style={{ background:"#fff", borderColor:i===s.updates.length-1?C.forestLight:C.border }}>
                              {i===s.updates.length-1 && <div className="w-2 h-2 rounded-full" style={{ background:C.forestLight }} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold" style={{ color:C.ink }}>{u.loc}</p>
                              <p className="text-xs" style={{ color:C.slate }}>{u.note}</p>
                              <p className="text-xs font-mono mt-0.5" style={{ color:C.slate }}>{u.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Shipment Status</p>
              {SUPPLY_STAGES.map(s=>{
                const count = SHIPMENTS.filter(sh=>sh.stage===s.n).length;
                return (
                  <div key={s.n} className="flex items-center gap-2.5 mb-2.5">
                    <span>{s.icon}</span>
                    <span className="text-xs flex-1" style={{ color:C.ink }}>{s.label}</span>
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background:C.border }}>
                      <div className="h-full rounded-full" style={{ width:`${(count/SHIPMENTS.length)*100}%`, background:s.color }} />
                    </div>
                    <span className="text-xs font-black w-4" style={{ color:s.color }}>{count}</span>
                  </div>
                );
              })}
            </Card>
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Export Hubs</p>
              {[["Mombasa Port","Main sea freight corridor",C.sky],["JKIA Air Cargo","Perishables — flowers, avocado",C.violet],["Nairobi CDC","Quality inspection &amp; consolidation",C.forestLight],["Kisumu Depot","Western Kenya regional hub",C.amber]].map(([h,d,c])=>(
                <div key={h} className="mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:c }} />
                    <p className="text-xs font-bold" style={{ color:C.ink }}>{h}</p>
                  </div>
                  <p className="text-xs ml-4" style={{ color:C.slate }} dangerouslySetInnerHTML={{ __html:d }} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* FLEET VIEW */}
      {view==="vehicles" && (
        <div className="grid grid-cols-2 gap-4">
          {VEHICLES.map(v=>(
            <Card key={v.plate} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background:`${C.sky}15` }}>🚛</div>
                <div>
                  <p className="text-sm font-black" style={{ color:C.ink }}>{v.plate}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{v.type}</p>
                </div>
                <Badge label={v.status} color={v.status==="Active"?C.forestLight:v.status==="Scheduled"?C.amber:C.slate} />
              </div>
              <div className="space-y-1.5 text-xs">
                {[["Driver",v.driver],["Phone",v.phone],["Last location",v.lastLoc],["Cold chain temp",v.temp||"N/A"]].map(([k,val])=>(
                  <div key={k} className="flex justify-between">
                    <span style={{ color:C.slate }}>{k}</span>
                    <span className="font-bold" style={{ color:k==="Cold chain temp"&&v.temp?C.sky:C.ink }}>{val}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* COLD CHAIN */}
      {view==="coldchain" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-black mb-4" style={{ color:C.ink }}>❄️ Cold Chain Temperature Log — KDG 456Y (Avocado consignment)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={[2,3,4,4,3,5,4,3,4,4,3,2,3,4,4,3,4,5,4,3,3,4,4,3,4].map((t,i)=>({ h:`${i}h`,temp:t }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="h" tick={{ fontSize:9, fill:C.slate }} interval={3} />
                <YAxis domain={[0,8]} tick={{ fontSize:9, fill:C.slate }} tickFormatter={v=>`${v}°C`} axisLine={false} tickLine={false} />
                <Tooltip formatter={v=>[`${v}°C`,"Temperature"]} contentStyle={{ borderRadius:10, border:"none" }} />
                <Line type="monotone" dataKey="temp" stroke={C.sky} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-xs"><div className="w-3 h-px" style={{ background:C.sky }} /><span style={{ color:C.slate }}>Actual temp</span></div>
              <span className="text-xs font-bold" style={{ color:C.forestLight }}>✓ Within 2–6°C target range</span>
            </div>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {[
              { item:"Avocado (JKIA export)", vehicle:"KDG 456Y", target:"2–6°C", actual:"3.8°C", status:"OK", icon:"🥑" },
              { item:"Flowers (JKIA export)", vehicle:"KDG 456Y", target:"2–4°C", actual:"3.1°C", status:"OK", icon:"🌹" },
              { item:"Dairy (Local)",         vehicle:"Contracted", target:"4–8°C", actual:"N/A",  status:"Monitor", icon:"🥛" },
            ].map(c=>(
              <Card key={c.item} className="p-4">
                <span className="text-2xl block mb-2">{c.icon}</span>
                <p className="text-sm font-black" style={{ color:C.ink }}>{c.item}</p>
                <p className="text-xs mb-2" style={{ color:C.slate }}>{c.vehicle}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span style={{ color:C.slate }}>Target</span><span className="font-bold">{c.target}</span></div>
                  <div className="flex justify-between"><span style={{ color:C.slate }}>Actual</span><span className="font-bold" style={{ color:c.status==="OK"?C.forestLight:C.amber }}>{c.actual}</span></div>
                </div>
                <Badge label={c.status} color={c.status==="OK"?C.forestLight:C.amber} />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 3 — COMPLIANCE & CERTIFICATION TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
const CERTIFICATIONS = [
  { id:"C001", farmer:"Grace Wanjiku",  county:"Kiambu",  cert:"GlobalG.A.P.",      crop:"Avocado",     status:"Certified",   issued:"2024-09-01", expiry:"2025-08-31", body:"GLOBALG.A.P. c/o FoodPLUS", score:88, renewDays:153, icon:"🌍", category:"Export", exportMarkets:["EU","UK","Netherlands"] },
  { id:"C002", farmer:"James Mwangi",   county:"Meru",    cert:"Fairtrade",          crop:"Coffee",      status:"Certified",   issued:"2024-06-15", expiry:"2025-06-14", body:"Fairtrade Africa",           score:92, renewDays:75,  icon:"⚖️", category:"Premium", exportMarkets:["USA","Germany","UK"] },
  { id:"C003", farmer:"James Mwangi",   county:"Meru",    cert:"UTZ Certified",      crop:"Coffee",      status:"Certified",   issued:"2024-08-01", expiry:"2025-07-31", body:"Rainforest Alliance",        score:85, renewDays:121, icon:"🌿", category:"Sustainability", exportMarkets:["EU","Japan"] },
  { id:"C004", farmer:"Peter Mutua",    county:"Makueni", cert:"KEPHIS Export Cert", crop:"Green Grams", status:"Certified",   issued:"2025-01-10", expiry:"2025-07-09", body:"KEPHIS Kenya",               score:79, renewDays:99,  icon:"🇰🇪", category:"Phytosanitary", exportMarkets:["India","UAE"] },
  { id:"C005", farmer:"Fatuma Hassan",  county:"Kwale",   cert:"GlobalG.A.P.",       crop:"Cashew Nuts", status:"In Progress", issued:null,         expiry:null,          body:"GLOBALG.A.P.",               score:52, renewDays:null, icon:"🌍", category:"Export", exportMarkets:["India","Vietnam"] },
  { id:"C006", farmer:"Wanjiru Kamau",  county:"Nyeri",   cert:"Rainforest Alliance",crop:"Tea",         status:"Certified",   issued:"2024-11-01", expiry:"2025-10-31", body:"Rainforest Alliance",        score:90, renewDays:213, icon:"🌿", category:"Sustainability", exportMarkets:["UK","EU","USA"] },
  { id:"C007", farmer:"Esther Njoroge", county:"Kiambu",  cert:"ISO 22000",           crop:"Macadamia",  status:"Renewal Due", issued:"2023-12-01", expiry:"2025-04-30", body:"SGS Kenya",                  score:74, renewDays:30,  icon:"📋", category:"Food Safety", exportMarkets:["China","USA"] },
  { id:"C008", farmer:"Daniel Kipchoge",county:"Nakuru",  cert:"PBK Registration",   crop:"Pyrethrum",   status:"Certified",   issued:"2024-07-01", expiry:"2026-06-30", body:"Pyrethrum Board of Kenya",   score:96, renewDays:457, icon:"🌼", category:"Statutory", exportMarkets:["USA","EU","Japan"] },
  { id:"C009", farmer:"Grace Wanjiku",  county:"Kiambu",  cert:"Organic EU (NOP)",   crop:"Avocado",     status:"In Progress", issued:null,         expiry:null,          body:"BCS Öko-Garantie GmbH",      score:43, renewDays:null, icon:"🌱", category:"Organic", exportMarkets:["Germany","Netherlands"] },
  { id:"C010", farmer:"Mary Akinyi",    county:"Kisumu",  cert:"EAS Quality Std",    crop:"Rice",        status:"Not Started", issued:null,         expiry:null,          body:"KEBS Kenya",                 score:0,  renewDays:null, icon:"📋", category:"Quality", exportMarkets:["Uganda","Rwanda"] },
];

const CERT_REQUIREMENTS = [
  { name:"GlobalG.A.P.",       markets:"EU, UK, USA, Asia",    steps:["Farm registration","Internal audit","External audit","Lab testing","Certificate issued"], minScore:70, cost:"KES 45,000–90,000", timeline:"3–6 months" },
  { name:"Fairtrade",          markets:"Global premium buyers",steps:["Producer group setup","Social premium audit","Price compliance check","Annual review"],    minScore:75, cost:"KES 30,000–60,000", timeline:"4–8 months" },
  { name:"Rainforest Alliance",markets:"EU, USA, Japan",       steps:["Farm assessment","Training plan","Internal audit","Certification visit","Issue cert"],      minScore:65, cost:"KES 25,000–50,000", timeline:"3–5 months" },
  { name:"KEPHIS Export Cert", markets:"All export markets",   steps:["Farm inspection","Pest survey","Lab residue test","Certificate issuance","Port clearance"],  minScore:60, cost:"KES 8,000–15,000",  timeline:"2–4 weeks" },
  { name:"Organic (EU/USDA)",  markets:"EU, USA, Japan",       steps:["3-yr transition plan","Input records","Farm inspection","Lab testing","Annual renewal"],    minScore:80, cost:"KES 60,000–120,000", timeline:"3 years" },
];

function ComplianceCerts() {
  const [view, setView] = useState("tracker");
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = CERTIFICATIONS.filter(c => filterStatus==="all" || c.status.toLowerCase().replace(" ","-")===filterStatus);

  const certified = CERTIFICATIONS.filter(c=>c.status==="Certified").length;
  const inProgress = CERTIFICATIONS.filter(c=>c.status==="In Progress").length;
  const renewalDue = CERTIFICATIONS.filter(c=>c.status==="Renewal Due").length;
  const notStarted = CERTIFICATIONS.filter(c=>c.status==="Not Started").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Export certification management · Compliance scoring · Renewal alerts · Market access">
          ✅ Compliance &amp; Certification Tracker
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["tracker","📋 Tracker"],["requirements","📖 Requirements"],["matrix","🗺 Market Access"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="✅" label="Certified" value={certified} sub="Active certifications" color={C.forestLight} />
        <KpiCard icon="⏳" label="In Progress" value={inProgress} sub="Applications underway" color={C.sky} />
        <KpiCard icon="⚠️" label="Renewal Due" value={renewalDue} sub="Expiring within 60 days" color={C.orange} />
        <KpiCard icon="❌" label="Not Started" value={notStarted} sub="Export blocked" color={C.crimson} />
      </div>

      {/* TRACKER */}
      {view==="tracker" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <div className="flex gap-3 mb-4 flex-wrap">
              {[["all","All"],["certified","Certified"],["in-progress","In Progress"],["renewal-due","Renewal Due"],["not-started","Not Started"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterStatus(v)}
                  className="text-xs px-3 py-1.5 rounded-xl font-bold border transition-all"
                  style={{ borderColor:filterStatus===v?C.forestMid:C.border, background:filterStatus===v?`${C.forestMid}10`:"#fff", color:filterStatus===v?C.forestMid:C.slate }}>
                  {l}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {filtered.map(c=>{
                const statusColor = c.status==="Certified"?C.forestLight:c.status==="In Progress"?C.sky:c.status==="Renewal Due"?C.orange:C.crimson;
                return (
                  <div key={c.id} onClick={()=>setSelected(selected?.id===c.id?null:c)}
                    className="rounded-xl border cursor-pointer transition-all hover:shadow-sm overflow-hidden"
                    style={{ background:selected?.id===c.id?`${statusColor}05`:"#fff", borderColor:selected?.id===c.id?statusColor:C.border, borderWidth:selected?.id===c.id?2:1 }}>
                    <div className="flex items-center gap-3.5 p-3.5">
                      <span className="text-2xl flex-shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-black" style={{ color:C.ink }}>{c.cert}</span>
                          <Badge label={c.status} color={statusColor} />
                          <Badge label={c.category} color={C.violet} />
                        </div>
                        <p className="text-xs" style={{ color:C.slate }}>{c.farmer} · {c.crop} · {c.county}</p>
                        <p className="text-xs mt-0.5" style={{ color:C.slate }}>{c.body}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {c.status==="Certified" && <>
                          <p className="text-xs font-bold" style={{ color:C.forestLight }}>Score: {c.score}/100</p>
                          <p className="text-xs" style={{ color:C.slate }}>Expires {c.expiry}</p>
                          {c.renewDays<=60 && <p className="text-xs font-bold" style={{ color:C.orange }}>⚠️ {c.renewDays}d left</p>}
                        </>}
                        {c.status==="In Progress" && <p className="text-xs font-bold" style={{ color:C.sky }}>Progress: {c.score}%</p>}
                        {c.status==="Not Started" && <p className="text-xs" style={{ color:C.crimson }}>Not started</p>}
                      </div>
                    </div>
                    {/* Score bar */}
                    {c.score>0 && (
                      <div className="px-4 pb-3">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:C.border }}>
                          <div className="h-full rounded-full" style={{ width:`${c.score}%`, background:statusColor }} />
                        </div>
                      </div>
                    )}
                    {/* Expanded */}
                    {selected?.id===c.id && (
                      <div className="px-4 pb-4 pt-1" style={{ borderTop:`1px solid ${C.border}` }}>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div><p className="text-xs text-stone-400 mb-0.5">Target Markets</p>
                            <div className="flex flex-wrap gap-1">{c.exportMarkets.map(m=><Badge key={m} label={m} color={C.sky} />)}</div>
                          </div>
                          <div><p className="text-xs text-stone-400 mb-0.5">Certification Body</p>
                            <p className="text-xs font-bold" style={{ color:C.ink }}>{c.body}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs px-4 py-2 rounded-xl font-bold text-white flex-1" style={{ background:statusColor }}>
                            {c.status==="Certified"?"Download Certificate":c.status==="In Progress"?"Continue Application":"Start Application"}
                          </button>
                          <button className="text-xs px-4 py-2 rounded-xl font-bold" style={{ background:C.mist, color:C.slate, border:`1px solid ${C.border}` }}>
                            Contact Body
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Certification Mix</p>
              <PieChart width={160} height={140} style={{ margin:"0 auto", display:"block" }}>
                <Pie data={[{v:certified,c:C.forestLight},{v:inProgress,c:C.sky},{v:renewalDue,c:C.orange},{v:notStarted,c:C.crimson}]}
                  cx={75} cy={65} innerRadius={40} outerRadius={62} dataKey="v" paddingAngle={4}>
                  {[C.forestLight,C.sky,C.orange,C.crimson].map((col,i)=><Cell key={i} fill={col} />)}
                </Pie>
              </PieChart>
              <div className="space-y-1.5 mt-2">
                {[["Certified",certified,C.forestLight],["In Progress",inProgress,C.sky],["Renewal Due",renewalDue,C.orange],["Not Started",notStarted,C.crimson]].map(([l,v,c])=>(
                  <div key={l} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background:c }} />
                    <span style={{ color:C.ink }}>{l}</span>
                    <span className="ml-auto font-black" style={{ color:c }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>⚠️ Action Required</p>
              {CERTIFICATIONS.filter(c=>c.status==="Renewal Due"||c.status==="Not Started").map(c=>(
                <div key={c.id} className="p-2.5 rounded-lg mb-2" style={{ background:`${C.orange}10`, border:`1px solid ${C.orange}25` }}>
                  <p className="text-xs font-bold" style={{ color:C.orange }}>{c.cert}</p>
                  <p className="text-xs" style={{ color:C.ink }}>{c.farmer} · {c.crop}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{c.status==="Renewal Due"?`Expires ${c.expiry}`:"Not started"}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* REQUIREMENTS */}
      {view==="requirements" && (
        <div className="grid grid-cols-2 gap-5">
          {CERT_REQUIREMENTS.map(req=>(
            <Card key={req.name} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-base font-black" style={{ color:C.ink }}>{req.name}</p>
                  <p className="text-xs mt-0.5" style={{ color:C.slate }}>Markets: {req.markets}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color:C.amber }}>{req.cost}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{req.timeline}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>Application Steps</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {req.steps.map((s,i)=>(
                    <div key={i} className="flex items-center gap-1">
                      <div className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ background:`${C.forestMid}12`, color:C.forestMid }}>{i+1}. {s}</div>
                      {i<req.steps.length-1 && <span style={{ color:C.border }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:C.border }}>
                  <div className="h-full rounded-full" style={{ width:`${req.minScore}%`, background:C.forestLight }} />
                </div>
                <span className="text-xs font-bold" style={{ color:C.slate }}>Min score: {req.minScore}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MARKET ACCESS MATRIX */}
      {view==="matrix" && (
        <Card className="overflow-hidden">
          <div className="p-4" style={{ borderBottom:`1px solid ${C.border}` }}>
            <p className="text-sm font-black" style={{ color:C.ink }}>Export Market Access Matrix</p>
            <p className="text-xs" style={{ color:C.slate }}>Which certifications unlock which export markets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr style={{ background:C.mist }}>
                <th className="px-4 py-2.5 text-left text-xs font-black" style={{ color:C.slate }}>Market</th>
                {["GlobalG.A.P.","Fairtrade","Rainforest Alliance","KEPHIS","Organic (EU/USDA)"].map(h=>(
                  <th key={h} className="px-3 py-2.5 text-center text-xs font-black whitespace-nowrap" style={{ color:C.slate }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  { market:"🇳🇱 Netherlands", certs:[true,true,true,true,true] },
                  { market:"🇬🇧 United Kingdom",certs:[true,true,true,true,false] },
                  { market:"🇩🇪 Germany",      certs:[true,true,true,false,true] },
                  { market:"🇺🇸 USA",           certs:[true,true,false,false,true] },
                  { market:"🇮🇳 India",         certs:[false,false,false,true,false] },
                  { market:"🇯🇵 Japan",         certs:[true,false,true,false,true] },
                  { market:"🇦🇪 UAE",           certs:[false,false,false,true,false] },
                  { market:"🇨🇳 China",         certs:[true,false,false,true,false] },
                  { market:"🌍 EAC Region",     certs:[false,false,false,true,false] },
                ].map((r,i)=>(
                  <tr key={r.market} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                    <td className="px-4 py-2.5 font-bold" style={{ color:C.ink }}>{r.market}</td>
                    {r.certs.map((has,j)=>(
                      <td key={j} className="px-3 py-2.5 text-center">
                        {has
                          ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ background:C.forestLight }}>✓</span>
                          : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs" style={{ background:C.border, color:C.slate }}>–</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 4 — AI YIELD & PRICE INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════
const AI_FORECASTS = [
  { crop:"Coffee",      county:"Nyeri",    farmer:"Wanjiru Kamau",    acres:4.0, predictedYield:3200, lastYield:2950, confidence:88, priceForecast:[420,435,445,428,432,440,455,448,460,465,442,458], soilScore:82, weatherScore:76, inputs:"Adequate", alerts:[], bestHarvestWindow:"Oct 15–Nov 10", exportReadiness:94 },
  { crop:"Avocado",     county:"Kiambu",   farmer:"Grace Wanjiku",    acres:3.5, predictedYield:4200, lastYield:3800, confidence:82, priceForecast:[75,78,82,85,88,84,90,94,98,95,88,92], soilScore:74, weatherScore:88, inputs:"Low nitrogen", alerts:["Apply CAN fertilizer before April 15","Irrigate North Block — moisture below 60%"], bestHarvestWindow:"Mar 20–Apr 30", exportReadiness:78 },
  { crop:"Green Grams", county:"Makueni",  farmer:"Peter Mutua",      acres:6.0, predictedYield:4800, lastYield:4100, confidence:91, priceForecast:[200,195,205,210,208,215,218,212,220,225,218,222], soilScore:68, weatherScore:72, inputs:"Adequate", alerts:["Short rains forecast late — delay planting by 2 weeks"], bestHarvestWindow:"Apr 5–Apr 25", exportReadiness:88 },
  { crop:"Tea",         county:"Kericho",  farmer:"Daniel Kipchoge",  acres:5.0, predictedYield:12000, lastYield:11200, confidence:94, priceForecast:[24,25,26,25,26,27,28,27,28,29,27,28], soilScore:90, weatherScore:85, inputs:"Adequate", alerts:[], bestHarvestWindow:"Year-round (flush in Mar–May)", exportReadiness:90 },
  { crop:"Macadamia",   county:"Kiambu",   farmer:"Esther Njoroge",   acres:3.0, predictedYield:2100, lastYield:1980, confidence:79, priceForecast:[255,260,268,272,265,278,285,280,290,295,282,288], soilScore:78, weatherScore:70, inputs:"Moderate deficit", alerts:["Wind risk to open blooms — monitor April 10–20","Pruning overdue — 15% yield improvement possible"], bestHarvestWindow:"Feb–May", exportReadiness:82 },
];

const PEST_ALERTS = [
  { crop:"Coffee",   pest:"Coffee Berry Borer", risk:"Medium", counties:["Nyeri","Murang'a","Meru"], action:"Apply Beauveria bassiana biological control", window:"Next 14 days" },
  { crop:"Maize",    pest:"Fall Armyworm",       risk:"High",   counties:["Trans-Nzoia","Uasin Gishu","Nakuru"], action:"Scout fields — spray Emamectin benzoate if >2 larvae/plant", window:"Immediate" },
  { crop:"Avocado",  pest:"Avocado Lace Bug",    risk:"Low",    counties:["Kiambu","Murang'a","Meru"], action:"Monitor — light infestation only", window:"Monitor weekly" },
];

function AIIntelligence() {
  const [selected, setSelected] = useState(AI_FORECASTS[0]);
  const [view, setView] = useState("yield");
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  const priceData = selected.priceForecast.map((p,i)=>({ m:months[i], price:p, projected:i>=6 }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="ML-powered yield forecasting · Price prediction · Pest alerts · Harvest window optimisation">
          🤖 AI Yield &amp; Price Intelligence
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["yield","🌾 Yield"],["prices","💰 Prices"],["pests","🐛 Pest Alerts"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🌱" label="Crops Modelled"    value={AI_FORECASTS.length}  sub="active AI forecasts"   color={C.forestMid} />
        <KpiCard icon="📈" label="Avg Confidence"    value={`${Math.round(AI_FORECASTS.reduce((s,f)=>s+f.confidence,0)/AI_FORECASTS.length)}%`} sub="model accuracy" color={C.sky} />
        <KpiCard icon="⚠️" label="Active Alerts"     value={AI_FORECASTS.reduce((s,f)=>s+f.alerts.length,0)} sub="agronomy interventions" color={C.orange} />
        <KpiCard icon="⭐" label="Best Export Score"  value={`${Math.max(...AI_FORECASTS.map(f=>f.exportReadiness))}%`} sub="Coffee — Nyeri" color={C.amber} />
      </div>

      {view==="yield" && (
        <div className="grid grid-cols-4 gap-5">
          {/* Crop selector */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Select Crop / Farmer</p>
            <div className="space-y-2">
              {AI_FORECASTS.map(f=>(
                <button key={f.crop+f.farmer} onClick={()=>setSelected(f)}
                  className="w-full p-3 rounded-xl border-2 text-left transition-all"
                  style={{ borderColor:selected?.crop===f.crop&&selected?.farmer===f.farmer?C.forestMid:C.border, background:selected?.crop===f.crop&&selected?.farmer===f.farmer?`${C.forestMid}08`:"#fff" }}>
                  <p className="text-xs font-black" style={{ color:C.ink }}>{f.crop}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{f.county} · {f.acres}ac</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:C.border }}>
                      <div className="h-full rounded-full" style={{ width:`${f.confidence}%`, background:C.forestLight }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color:C.forestLight }}>{f.confidence}%</span>
                  </div>
                  {f.alerts.length>0 && (
                    <p className="text-xs mt-1.5 font-bold" style={{ color:C.orange }}>⚠️ {f.alerts.length} alert{f.alerts.length>1?"s":""}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-black" style={{ color:C.ink }}>{selected.crop} — {selected.county}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{selected.farmer} · {selected.acres} acres · AI confidence: {selected.confidence}%</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color:C.forestMid }}>{selected.predictedYield.toLocaleString()} kg</p>
                  <p className="text-xs" style={{ color:C.slate }}>Predicted yield · vs {selected.lastYield.toLocaleString()} kg last season</p>
                  <p className="text-xs font-bold mt-0.5" style={{ color:C.forestLight }}>
                    +{((selected.predictedYield-selected.lastYield)/selected.lastYield*100).toFixed(1)}% increase
                  </p>
                </div>
              </div>

              {/* Factor scores */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  ["🌡️","Weather Score",selected.weatherScore,C.sky],
                  ["🌱","Soil Health",selected.soilScore,C.forestLight],
                  ["💊","Input Status",selected.inputs==="Adequate"?85:selected.inputs==="Low nitrogen"?55:40,selected.inputs==="Adequate"?C.forestLight:C.amber],
                  ["📤","Export Readiness",selected.exportReadiness,C.violet],
                ].map(([icon,label,score,color])=>(
                  <div key={label} className="p-3 rounded-xl text-center" style={{ background:`${color}10`, border:`1px solid ${color}20` }}>
                    <span className="text-lg block mb-1">{icon}</span>
                    <p className="text-xs font-bold" style={{ color:C.slate }}>{label}</p>
                    <p className="text-xl font-black" style={{ color }}>{score}%</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>Best Harvest Window</p>
                  <div className="p-3 rounded-xl" style={{ background:`${C.forestLight}12`, border:`1px solid ${C.forestLight}25` }}>
                    <p className="text-sm font-black" style={{ color:C.forestMid }}>{selected.bestHarvestWindow}</p>
                    <p className="text-xs mt-0.5" style={{ color:C.slate }}>AI-optimised for peak price + quality</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>Agronomy Alerts</p>
                  {selected.alerts.length===0 ? (
                    <div className="p-3 rounded-xl" style={{ background:`${C.forestLight}12`, border:`1px solid ${C.forestLight}25` }}>
                      <p className="text-xs font-bold" style={{ color:C.forestLight }}>✅ No alerts — on track</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {selected.alerts.map((a,i)=>(
                        <div key={i} className="p-2.5 rounded-xl text-xs" style={{ background:`${C.orange}10`, border:`1px solid ${C.orange}25`, color:C.ink }}>
                          ⚠️ {a}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Yield comparison chart */}
            <Card className="p-5">
              <p className="text-sm font-black mb-1" style={{ color:C.ink }}>Yield Comparison — All Monitored Crops</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={AI_FORECASTS.map(f=>({ name:f.crop, predicted:f.predictedYield, actual:f.lastYield, color:C.forestLight }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:C.slate }} />
                  <YAxis tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}T`} />
                  <Tooltip formatter={v=>[`${v.toLocaleString()} kg`]} contentStyle={{ borderRadius:10, border:"none" }} />
                  <Bar dataKey="actual"    name="Last Season" fill={`${C.slate}50`}   radius={[4,4,0,0]} />
                  <Bar dataKey="predicted" name="AI Forecast"  fill={C.forestLight} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {view==="prices" && (
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-black" style={{ color:C.ink }}>12-Month Price Forecast — {selected.crop} (KES/kg)</p>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-6 h-0.5 rounded" style={{ background:`${C.slate}80` }} />
                <span className="text-xs" style={{ color:C.slate }}>Historical</span>
                <div className="w-6 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor:C.forestLight }} />
                <span className="text-xs" style={{ color:C.slate }}>Forecast</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} tickFormatter={v=>`KES${v}`} />
                <Tooltip formatter={v=>[`KES ${v}/kg`,"Price"]} contentStyle={{ borderRadius:10, border:"none" }} />
                <Line type="monotone" dataKey="price" stroke={C.forestLight} strokeWidth={2.5}
                  strokeDasharray={(d)=>d&&d.projected?"4 3":null}
                  dot={(props)=>{
                    if(!props.payload?.projected) return <circle key={props.key} cx={props.cx} cy={props.cy} r={3} fill={C.forestLight} />;
                    return <circle key={props.key} cx={props.cx} cy={props.cy} r={3} fill="none" stroke={C.forestLight} strokeWidth={1.5} strokeDasharray="2 2" />;
                  }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-xl" style={{ background:`${C.amber}12`, border:`1px solid ${C.amber}25` }}>
              <p className="text-xs font-black" style={{ color:C.amber }}>💡 AI Price Recommendation</p>
              <p className="text-xs mt-1" style={{ color:C.ink }}>
                Best export window for {selected.crop} is <strong>{selected.bestHarvestWindow}</strong> — forecast price peaks at KES {Math.max(...selected.priceForecast)}/kg.
                Consider forward contracts with buyers now to lock in above-average rates.
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            {AI_FORECASTS.map(f=>{
              const maxP = Math.max(...f.priceForecast);
              const minP = Math.min(...f.priceForecast);
              const curP = f.priceForecast[f.priceForecast.length-1];
              return (
                <Card key={f.crop} className="p-4" onClick={()=>setSelected(f)} style={{ cursor:"pointer", borderColor:selected.crop===f.crop?C.forestMid:C.border, borderWidth:selected.crop===f.crop?2:1 }}>
                  <p className="text-sm font-black" style={{ color:C.ink }}>{f.crop}</p>
                  <p className="text-xs mb-2" style={{ color:C.slate }}>{f.county}</p>
                  <p className="text-2xl font-black" style={{ color:C.forestMid }}>KES {curP}</p>
                  <div className="flex justify-between text-xs mt-1" style={{ color:C.slate }}>
                    <span>Low KES {minP}</span>
                    <span>Peak KES {maxP}</span>
                  </div>
                  <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background:C.border }}>
                    <div className="h-full rounded-full" style={{ width:`${Math.round((curP-minP)/(maxP-minP)*100)}%`, background:C.forestLight }} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {view==="pests" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {PEST_ALERTS.map(p=>(
              <Card key={p.pest} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🐛</span>
                  <div>
                    <p className="text-sm font-black" style={{ color:C.ink }}>{p.pest}</p>
                    <p className="text-xs" style={{ color:C.slate }}>{p.crop}</p>
                  </div>
                  <Badge label={`${p.risk} Risk`} color={p.risk==="High"?C.crimson:p.risk==="Medium"?C.orange:C.forestLight} />
                </div>
                <div className="mb-3">
                  <p className="text-xs font-black uppercase tracking-wider mb-1.5" style={{ color:C.slate }}>Affected Counties</p>
                  <div className="flex flex-wrap gap-1">
                    {p.counties.map(c=><Badge key={c} label={c} color={C.sky} />)}
                  </div>
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ background:`${C.orange}10`, border:`1px solid ${C.orange}25` }}>
                  <p className="text-xs font-bold mb-0.5" style={{ color:C.orange }}>⚡ Recommended Action</p>
                  <p className="text-xs" style={{ color:C.ink }}>{p.action}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color:C.slate }}>Treatment window:</span>
                  <span className="text-xs font-bold" style={{ color:p.risk==="High"?C.crimson:C.orange }}>{p.window}</span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <p className="text-sm font-black mb-4" style={{ color:C.ink }}>📡 County-Level Pest Risk Heat</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { county:"Nyeri",      risk:30, crops:["Coffee Berry Borer"] },
                { county:"Kiambu",     risk:25, crops:["Avocado Lace Bug"] },
                { county:"Trans-Nzoia",risk:85, crops:["Fall Armyworm"] },
                { county:"Uasin Gishu",risk:80, crops:["Fall Armyworm"] },
                { county:"Nakuru",     risk:72, crops:["Fall Armyworm"] },
                { county:"Meru",       risk:35, crops:["Coffee Berry Borer"] },
                { county:"Kisumu",     risk:15, crops:["None detected"] },
                { county:"Makueni",    risk:20, crops:["Aphids"] },
              ].map(c=>(
                <div key={c.county} className="p-3 rounded-xl" style={{ background:c.risk>=70?`${C.crimson}10`:c.risk>=40?`${C.orange}10`:`${C.forestLight}10`, border:`1px solid ${c.risk>=70?C.crimson:c.risk>=40?C.orange:C.forestLight}25` }}>
                  <p className="text-xs font-black" style={{ color:C.ink }}>{c.county}</p>
                  <p className="text-xl font-black" style={{ color:c.risk>=70?C.crimson:c.risk>=40?C.orange:C.forestLight }}>{c.risk}%</p>
                  <p className="text-xs" style={{ color:C.slate }}>{c.crops[0]}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 5 — FARMER REGISTRY + SIGNUP
// ═══════════════════════════════════════════════════════════════════════════════
const FARMERS_REG = [
  { id:"F001", name:"Grace Wanjiku",    phone:"+254 711 002 341", county:"Kiambu",     subCounty:"Limuru",    crops:"Avocado, Tea",        acres:3.5,  kyc:"Verified",  joined:"2024-11-12", credit:78, gender:"Female", coop:"Tigoni Growers Ltd" },
  { id:"F002", name:"James Mwangi",     phone:"+254 722 410 882", county:"Meru",       subCounty:"Imenti N.", crops:"Coffee AA",           acres:5.2,  kyc:"Verified",  joined:"2024-09-04", credit:82, gender:"Male",   coop:"Meru Coffee Coop" },
  { id:"F003", name:"Esther Njoroge",   phone:"+254 733 528 117", county:"Murang'a",   subCounty:"Kiharu",    crops:"Macadamia, Avocado",  acres:4.0,  kyc:"In Review", joined:"2025-01-22", credit:65, gender:"Female", coop:"Murang'a Pressers" },
  { id:"F004", name:"Peter Mutua",      phone:"+254 715 904 220", county:"Makueni",    subCounty:"Kibwezi W.",crops:"Green Grams, Mango",  acres:6.8,  kyc:"Verified",  joined:"2024-07-30", credit:71, gender:"Male",   coop:"Makueni Pulses Coop" },
  { id:"F005", name:"Mary Akinyi",      phone:"+254 720 118 553", county:"Kisumu",     subCounty:"Nyakach",   crops:"Kale, Sukuma",        acres:1.2,  kyc:"Pending",   joined:"2025-02-14", credit:48, gender:"Female", coop:"Lakeview Farms" },
  { id:"F006", name:"Samuel Ruto",      phone:"+254 729 003 411", county:"Elgeyo",     subCounty:"Keiyo S.",  crops:"Onions, Maize",       acres:8.0,  kyc:"Verified",  joined:"2024-05-19", credit:88, gender:"Male",   coop:"Rift Valley Agri" },
  { id:"F007", name:"Agnes Chepkoech",  phone:"+254 718 660 014", county:"Kirinyaga",  subCounty:"Mwea",      crops:"Tomatoes, Rice",      acres:2.5,  kyc:"Verified",  joined:"2024-12-08", credit:74, gender:"Female", coop:"Mwea Tomato Growers" },
  { id:"F008", name:"David Kariuki",    phone:"+254 740 822 905", county:"Nyeri",      subCounty:"Tetu",      crops:"French Beans, Coffee",acres:3.1,  kyc:"Verified",  joined:"2024-08-22", credit:80, gender:"Male",   coop:"Central Highlands Veg" },
  { id:"F009", name:"Joseph Kamau",     phone:"+254 712 446 738", county:"Nakuru",     subCounty:"Naivasha",  crops:"Maize, Wheat",        acres:12.0, kyc:"Pending",   joined:"2025-03-04", credit:55, gender:"Male",   coop:"Rift Valley Cereals" },
  { id:"F010", name:"Lucy Wairimu",     phone:"+254 798 110 552", county:"Kiambu",     subCounty:"Lari",      crops:"Tea, Avocado",        acres:2.8,  kyc:"Verified",  joined:"2025-01-10", credit:69, gender:"Female", coop:"Tigoni Growers Ltd" },
  { id:"F011", name:"Michael Otieno",   phone:"+254 724 003 891", county:"Homa Bay",   subCounty:"Mbita",     crops:"Fish, Sweet Potato",  acres:0.8,  kyc:"In Review", joined:"2025-02-28", credit:42, gender:"Male",   coop:"Lake Vic Fillets" },
  { id:"F012", name:"Faith Nyambura",   phone:"+254 710 778 124", county:"Nyandarua",  subCounty:"Ndaragwa",  crops:"Pyrethrum, Potato",   acres:4.4,  kyc:"Verified",  joined:"2024-10-17", credit:76, gender:"Female", coop:"Ndaragwa Coop" },
];
const KYC_COLOR = (s) => s==="Verified"?C.shoot:s==="In Review"?C.amber:s==="Pending"?C.slate:C.crimson;

// ── REAL CO-OP: KATHIANI HORTICULTURAL SHG (Machakos County) ─────────────────
// Sourced from physical registration documents — Cert #3897042, Reg# SD/SHG/2016/29/03/359
const KATHIANI_COOP = {
  name:"Kathiani Horticultural Self-Help Group",
  type:"Self-Help Group",
  certNo:"3897042",
  regNo:"SD/SHG/2016/29/03/359",
  county:"Machakos",
  subCounty:"Kathiani",
  constituency:"Kathiani",
  division:"Kathiani",
  location:"Iveti",
  ward:"Kaliluni",
  postalAddress:"312 Machakos",
  formed:"2015-05-07",
  registered:"2016-03-29",
  certIssued:"2020-11-26",
  meetingVenue:"Kaliluni",
  meetingDay:"Thursday",
  meetingTime:"10:00 AM",
  totalMembers:41,
  womenAtReg:7,
  menAtReg:18,
  registrar:"Sammy O. Ogama (Sub County Social Development Officer)",
  ministry:"Ministry of Labour and Social Protection · Dept of Social Development",
  objectives:[
    "Market accessibility for horticultural products",
    "Opening up infrastructure",
    "Equipping farmers with agricultural knowledge",
  ],
  currentActivities:["Farming","Zero grazing","Table banking"],
  futurePlans:[
    "Water tank construction",
    "Setting up a dairy processing plant",
    "Building a horticultural products marketing & distribution facility",
  ],
};

const KATHIANI_MEMBERS = [
  { no:1,  name:"Fredrick Wambua Ndana",  role:"Chairperson",      idNo:"13521680" },
  { no:2,  name:"Fredrick Mating'i Nzomo",role:"V/Chairperson",    idNo:"11269214" },
  { no:3,  name:"Musyoka Mukusyo",         role:"Secretary",        idNo:"20171359" },
  { no:4,  name:"Alfred Kimeu Mutual",     role:"V/Secretary",      idNo:"21460735" },
  { no:5,  name:"Bridgit Wanza Mbuvi",     role:"Treasurer",        idNo:"10979672" },
  { no:6,  name:"Richard Muinde Kimuyu",   role:"Member",           idNo:"13521707" },
  { no:7,  name:"Alex Kimuyu",             role:"Member",           idNo:"8966851"  },
  { no:8,  name:"Nduku Munyao",            role:"Member",           idNo:"—"        },
  { no:9,  name:"Nthenge Mutisya",         role:"Member",           idNo:"1693058"  },
  { no:10, name:"James M. Kwitha",         role:"Member",           idNo:"20168595" },
  { no:11, name:"Agnes M. Kilonzo",        role:"Member",           idNo:"1682581"  },
  { no:12, name:"Syombua Mutua",           role:"Member",           idNo:"—"        },
  { no:13, name:"Mutunga Munyao",          role:"Member",           idNo:"13830857" },
  { no:14, name:"Mesembi Ndolo",           role:"Member",           idNo:"24018306" },
  { no:15, name:"Mutinda Mumo",            role:"Member",           idNo:"31813779" },
  { no:16, name:"Mutunga Munyao",          role:"Member",           idNo:"13830857" },
  { no:17, name:"Jimmy Munguti",           role:"Member",           idNo:"7807808"  },
  { no:18, name:"Mumbua Nzomo",            role:"Member",           idNo:"3494178"  },
  { no:19, name:"Kiwai Mutuku",            role:"Member",           idNo:"9344083"  },
  { no:20, name:"Peter Mutuku",            role:"Member",           idNo:"—"        },
  { no:21, name:"Mavinda Makenzi",         role:"Member",           idNo:"29896040" },
  { no:22, name:"Noah M. Muli",            role:"Member",           idNo:"—"        },
  { no:23, name:"Benedict Masila",         role:"Member",           idNo:"1690612"  },
  { no:24, name:"Mutinda Mutisya",         role:"Member",           idNo:"—"        },
  { no:25, name:"Jacinta Charles",         role:"Member",           idNo:"24032102" },
  { no:26, name:"Titus W. Maiko",          role:"Member",           idNo:"7808330"  },
  { no:27, name:"Nzioka Mwenga",           role:"Member",           idNo:"1691820"  },
  { no:28, name:"Joseph M. Mutiso",        role:"Member",           idNo:"20171359" },
  { no:29, name:"Mutuku Kakungu",          role:"Member",           idNo:"—"        },
  { no:30, name:"Munyaka Mutiso",          role:"Member",           idNo:"12538092" },
  { no:31, name:"Munyao Tua",              role:"Member",           idNo:"—"        },
  { no:32, name:"Munini Mutua",            role:"Member",           idNo:"—"        },
  { no:33, name:"Damaris M. Mutual",       role:"Member",           idNo:"26816567" },
  { no:34, name:"Alex M. Wambua",          role:"Member",           idNo:"—"        },
  { no:35, name:"Timothy Ndege",           role:"Member",           idNo:"—"        },
  { no:36, name:"Esther M. Musyoki",       role:"Member",           idNo:"1372955"  },
  { no:37, name:"Charles Mulinge",         role:"Member",           idNo:"21264436" },
  { no:38, name:"Simon M. Mbithi",         role:"Member",           idNo:"22854183" },
  { no:39, name:"Amos Silas",              role:"Member",           idNo:"05344668" },
  { no:40, name:"Isaac Muindi",            role:"Member",           idNo:"3543424"  },
  { no:41, name:"Jones M. Ndonye",         role:"Member",           idNo:"—"        },
];

// QMS Form 59 — Energy Use Record from "Fred Farm" (Chairperson's farm)
const FRED_FARM_ENERGY = [
  { date:"2015-03-18", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:35, outL:32, balL:3,  issuedTo:"C"  },
  { date:"2015-06-25", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:15, outL:8,  balL:7,  issuedTo:"A1" },
  { date:"2015-01-06", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:12, outL:8,  balL:4,  issuedTo:"C"  },
  { date:"2015-03-11", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:12, outL:8,  balL:6,  issuedTo:"A1-A4" },
  { date:"2015-03-11", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:36, outL:22, balL:14, issuedTo:"A5-A7" },
  { date:"2015-01-12", source:"Diesel/Oil", supplier:"Oil Libya", location:"Machakos",  qtyL:60, outL:28, balL:32, issuedTo:"A1-A4" },
  { date:"2015-06-22", source:"Diesel/Oil", supplier:"Vivo",       location:"Machakos", qtyL:28, outL:18, balL:2,  issuedTo:"C"  },
  { date:"2015-04-30", source:"Diesel/Oil", supplier:"Vivo",       location:"Machakos", qtyL:24, outL:18, balL:6,  issuedTo:"B1" },
  { date:"2015-02-27", source:"Diesel/Oil", supplier:"Total",     location:"Lavington", qtyL:34, outL:27, balL:7,  issuedTo:"B1-B5" },
  { date:"2015-06-22", source:"Diesel/Oil", supplier:"Kenol",     location:"Machakos",  qtyL:42, outL:36, balL:6,  issuedTo:"A5-A7" },
];

function KathianiCoopView() {
  const [tab, setTab] = useState("profile");
  const totalLitres = FRED_FARM_ENERGY.reduce((s,e)=>s+e.qtyL,0);
  const totalUsed   = FRED_FARM_ENERGY.reduce((s,e)=>s+e.outL,0);
  const totalBal    = FRED_FARM_ENERGY.reduce((s,e)=>s+e.balL,0);
  const officials   = KATHIANI_MEMBERS.filter(m=>m.role!=="Member");

  return (
    <div>
      {/* Hero card */}
      <Card className="p-6 mb-5" style={{ background:`linear-gradient(135deg,${C.field}10,${C.lime}05)`, borderColor:C.field }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-80">
            <Badge label="Verified Co-operative · Cert #3897042" color={C.field} />
            <p className="text-2xl font-black mt-2" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:-0.4 }}>
              {KATHIANI_COOP.name}
            </p>
            <p className="text-sm mt-1" style={{ color:C.slate }}>
              📍 {KATHIANI_COOP.ward}, {KATHIANI_COOP.location}, {KATHIANI_COOP.subCounty} Sub-County · {KATHIANI_COOP.county} County
            </p>
            <p className="text-xs mt-2" style={{ color:C.slate }}>
              {KATHIANI_COOP.ministry}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color:C.slate }}>Registered</p>
            <p className="text-lg font-black" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif" }}>{KATHIANI_COOP.registered}</p>
            <p className="text-xs mt-2" style={{ color:C.slate }}>Cert issued</p>
            <p className="text-sm font-bold" style={{ color:C.field }}>{KATHIANI_COOP.certIssued}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="👥" label="Total Members"     value={KATHIANI_COOP.totalMembers}                   sub={`${KATHIANI_COOP.womenAtReg}W · ${KATHIANI_COOP.menAtReg}M at registration`} color={C.field} />
        <KpiCard icon="📅" label="Years Active"       value={2026 - new Date(KATHIANI_COOP.formed).getFullYear()} sub={`Formed ${KATHIANI_COOP.formed}`}              color={C.shoot} />
        <KpiCard icon="⛽" label="Energy Logged · L"  value={totalLitres}                                  sub={`${FRED_FARM_ENERGY.length} purchases tracked`} color={C.harvest} />
        <KpiCard icon="🤝" label="Meeting Cadence"    value={KATHIANI_COOP.meetingDay}                     sub={`${KATHIANI_COOP.meetingTime} · ${KATHIANI_COOP.meetingVenue}`} color={C.violet} />
      </div>

      <div className="flex gap-1 p-1 rounded-xl mb-5 inline-flex" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
        {[["profile","🏛️ Group Profile"],["roster",`📋 Roster · ${KATHIANI_MEMBERS.length}`],["energy","⛽ Energy Log · Fred Farm"],["plans","🎯 Plans & Activities"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background:tab===id?"#fff":"transparent", color:tab===id?C.ink:C.slate, boxShadow:tab===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
        ))}
      </div>

      {/* PROFILE */}
      {tab==="profile" && (
        <div className="grid grid-cols-3 gap-5">
          <Card className="col-span-2 p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-4" style={{ color:C.slate }}>Registration Details</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                ["Group Name",        KATHIANI_COOP.name],
                ["Type",              KATHIANI_COOP.type],
                ["Certificate No.",   KATHIANI_COOP.certNo],
                ["Registration No.",  KATHIANI_COOP.regNo],
                ["County",            KATHIANI_COOP.county],
                ["Sub-County",        KATHIANI_COOP.subCounty],
                ["Constituency",      KATHIANI_COOP.constituency],
                ["Division",          KATHIANI_COOP.division],
                ["Location",          KATHIANI_COOP.location],
                ["Ward",              KATHIANI_COOP.ward],
                ["Postal Address",    KATHIANI_COOP.postalAddress],
                ["Date Formed",       KATHIANI_COOP.formed],
                ["Date Registered",   KATHIANI_COOP.registered],
                ["Cert Issued",       KATHIANI_COOP.certIssued],
                ["Meeting Venue",     KATHIANI_COOP.meetingVenue],
                ["Meeting Schedule",  `${KATHIANI_COOP.meetingDay} · ${KATHIANI_COOP.meetingTime}`],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs py-1" style={{ borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.slate }}>{k}</span>
                  <span className="font-bold text-right" style={{ color:C.ink }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
              <p className="text-xs font-bold mb-1" style={{ color:C.slate }}>Registered by</p>
              <p className="text-sm font-bold" style={{ color:C.ink }}>{KATHIANI_COOP.registrar}</p>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Management Committee</p>
              {officials.map(o=>(
                <div key={o.no} className="flex items-center gap-2.5 py-2" style={{ borderBottom:`1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background:C.field }}>
                    {o.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color:C.ink }}>{o.name}</p>
                    <p className="text-xs" style={{ color:C.slate }}>{o.role} · ID {o.idNo}</p>
                  </div>
                </div>
              ))}
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>Group Objectives</p>
              <ul className="space-y-1.5">
                {KATHIANI_COOP.objectives.map(o=>(
                  <li key={o} className="text-xs flex items-start gap-2"><span style={{ color:C.field }}>✓</span><span style={{ color:C.ink }}>{o}</span></li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* ROSTER */}
      {tab==="roster" && (
        <Card className="overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom:`1px solid ${C.border}` }}>
            <p className="text-sm font-black" style={{ color:C.ink }}>Membership Roster · {KATHIANI_MEMBERS.length} members</p>
            <Badge label="Source: Group Register" color={C.slate} />
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background:C.mist }}>
              {["#","Name","Role","National ID"].map(h=>(
                <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{KATHIANI_MEMBERS.map((m,i)=>(
              <tr key={m.no+"-"+m.name} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                <td className="px-4 py-2 text-xs font-mono" style={{ color:C.slate }}>{m.no}</td>
                <td className="px-4 py-2 text-xs font-bold" style={{ color:C.ink }}>{m.name}</td>
                <td className="px-4 py-2"><Badge label={m.role} color={m.role==="Member"?C.slate:C.field} /></td>
                <td className="px-4 py-2 text-xs font-mono" style={{ color:m.idNo==="—"?C.crimson:C.ink }}>{m.idNo}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* ENERGY LOG */}
      {tab==="energy" && (
        <div>
          <Card className="p-4 mb-4" style={{ background:`${C.harvest}08`, borderColor:`${C.harvest}30` }}>
            <p className="text-xs" style={{ color:C.slate }}>
              <span className="font-bold" style={{ color:C.ink }}>QMS Form 59 · Energy Use Record</span> — sourced from Fred Farm (Chairperson) field-level paper records, 2015 calendar year. Issue No. 001 · Effective 01/08/2015 · Approved by Agronomist.
            </p>
          </Card>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <KpiCard icon="📥" label="Litres Purchased" value={totalLitres} sub="across 10 transactions" color={C.field} />
            <KpiCard icon="📤" label="Litres Used"      value={totalUsed}   sub={`${Math.round((totalUsed/totalLitres)*100)}% utilisation`} color={C.shoot} />
            <KpiCard icon="🛢️" label="Litres Balance"  value={totalBal}    sub="end-of-year stock"        color={C.harvest} />
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ background:C.mist }}>
                {["Date","Source","Supplier","Location","Qty (L)","Out (L)","Balance (L)","Issued To"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{FRED_FARM_ENERGY.map((e,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                  <td className="px-4 py-2 text-xs font-mono" style={{ color:C.slate }}>{e.date}</td>
                  <td className="px-4 py-2 text-xs font-bold" style={{ color:C.ink }}>{e.source}</td>
                  <td className="px-4 py-2"><Badge label={e.supplier} color={e.supplier==="Oil Libya"?C.crimson:e.supplier==="Vivo"?C.sky:e.supplier==="Total"?C.violet:C.harvest} /></td>
                  <td className="px-4 py-2 text-xs" style={{ color:C.slate }}>{e.location}</td>
                  <td className="px-4 py-2 text-xs font-mono font-bold">{e.qtyL}</td>
                  <td className="px-4 py-2 text-xs font-mono">{e.outL}</td>
                  <td className="px-4 py-2 text-xs font-mono font-bold" style={{ color:e.balL>5?C.shoot:C.amber }}>{e.balL}</td>
                  <td className="px-4 py-2 text-xs font-mono" style={{ color:C.slate }}>{e.issuedTo}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
          <Card className="p-4 mt-4">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Spend by Supplier</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={Object.entries(FRED_FARM_ENERGY.reduce((a,e)=>{ a[e.supplier]=(a[e.supplier]||0)+e.qtyL; return a; },{})).map(([supplier,litres])=>({ supplier, litres }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="supplier" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
                <Bar dataKey="litres" radius={[8,8,0,0]} fill={C.harvest} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* PLANS */}
      {tab==="plans" && (
        <div className="grid grid-cols-2 gap-5">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.field }}>Current Activities</p>
            {KATHIANI_COOP.currentActivities.map((a,i)=>(
              <div key={a} className="flex items-start gap-3 p-3 rounded-xl mb-2" style={{ background:`${C.shoot}08`, border:`1px solid ${C.shoot}25` }}>
                <span className="text-xl">{i===0?"🌾":i===1?"🐄":"💰"}</span>
                <div><p className="text-sm font-bold" style={{ color:C.ink }}>{a}</p><p className="text-xs mt-0.5" style={{ color:C.slate }}>Active since registration</p></div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.harvest }}>Future Plans</p>
            {KATHIANI_COOP.futurePlans.map((p,i)=>(
              <div key={p} className="flex items-start gap-3 p-3 rounded-xl mb-2" style={{ background:`${C.harvest}08`, border:`1px solid ${C.harvest}25` }}>
                <span className="text-xl">{i===0?"💧":i===1?"🥛":"🏪"}</span>
                <div><p className="text-sm font-bold" style={{ color:C.ink }}>{p}</p><p className="text-xs mt-0.5" style={{ color:C.slate }}>Planned · awaits funding/partnership</p></div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function FarmerRegistry() {
  const [view, setView] = useState("farmers");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [showSignup, setShowSignup] = useState(false);
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => FARMERS_REG.filter(f => {
    const matchQ = !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.county.toLowerCase().includes(q.toLowerCase()) || f.crops.toLowerCase().includes(q.toLowerCase());
    const matchF = filter==="all" || (filter==="verified" && f.kyc==="Verified") || (filter==="pending" && f.kyc!=="Verified") || (filter==="female" && f.gender==="Female") || (filter==="male" && f.gender==="Male");
    return matchQ && matchF;
  }), [q, filter]);

  const verified = FARMERS_REG.filter(f=>f.kyc==="Verified").length;
  const female   = FARMERS_REG.filter(f=>f.gender==="Female").length;
  const totalAcres = FARMERS_REG.reduce((s,f)=>s+f.acres,0);
  const avgCredit  = Math.round(FARMERS_REG.reduce((s,f)=>s+f.credit,0)/FARMERS_REG.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="KYC verification · Co-op enrolment · Credit scoring · Demographic insights">
          👥 Farmer Registry &amp; Signup
        </SectionTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
            {[["farmers","👤 Farmers"],["coops","🤝 Co-operatives"]].map(([id,l])=>(
              <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
            ))}
          </div>
          <button onClick={()=>setShowSignup(true)} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:C.field }}>
            + Onboard Farmer
          </button>
        </div>
      </div>

      {view==="farmers" && (<>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="👥" label="Registered Farmers"  value={FARMERS_REG.length}                 sub="across 24 counties"          color={C.field} />
        <KpiCard icon="✅" label="KYC Verified"        value={`${verified}/${FARMERS_REG.length}`} sub={`${Math.round(verified/FARMERS_REG.length*100)}% complete`} color={C.shoot} />
        <KpiCard icon="🌾" label="Total Acres"          value={totalAcres.toFixed(1)}              sub="under cultivation"           color={C.harvest} />
        <KpiCard icon="📊" label="Avg Credit Score"     value={avgCredit}                          sub={`${female} women farmers`}    color={C.violet} />
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, county, crop…"
          className="flex-1 min-w-40 border rounded-xl px-3.5 py-2 text-sm focus:outline-none"
          style={{ borderColor:C.border, background:C.mist }} />
        {[["all","All Farmers"],["verified","KYC Verified"],["pending","Pending KYC"],["female","Female"],["male","Male"]].map(([id,l])=>(
          <button key={id} onClick={()=>setFilter(id)} className="px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background:filter===id?C.field:C.mist, color:filter===id?"#fff":C.slate, border:`1px solid ${filter===id?C.field:C.border}` }}>{l}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ background:C.mist }}>
                {["Farmer","Location","Crops","Acres","KYC","Credit"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{visible.map((f,i)=>(
                <tr key={f.id} onClick={()=>setSelected(selected?.id===f.id?null:f)} className="cursor-pointer hover:bg-stone-50"
                  style={{ borderBottom:`1px solid ${C.border}`, background:selected?.id===f.id?`${C.field}08`:i%2===0?"#fff":"#FAFAF8" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background:f.gender==="Female"?C.violet:C.field }}>
                        {f.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div><p className="text-xs font-black" style={{ color:C.ink }}>{f.name}</p><p className="text-xs font-mono" style={{ color:C.slate }}>{f.id}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs"><p className="font-bold" style={{ color:C.ink }}>{f.county}</p><p style={{ color:C.slate }}>{f.subCounty}</p></td>
                  <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{f.crops}</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold">{f.acres}</td>
                  <td className="px-4 py-3"><Badge label={f.kyc} color={KYC_COLOR(f.kyc)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full" style={{ background:C.border }}>
                        <div className="h-full rounded-full" style={{ width:`${f.credit}%`, background:f.credit>=70?C.shoot:f.credit>=50?C.amber:C.crimson }} />
                      </div>
                      <span className="text-xs font-black" style={{ color:f.credit>=70?C.shoot:f.credit>=50?C.amber:C.crimson }}>{f.credit}</span>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          {selected ? (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background:selected.gender==="Female"?C.violet:C.field }}>
                  {selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <p className="text-base font-black" style={{ color:C.ink }}>{selected.name}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{selected.phone}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[["County",selected.county],["Sub-county",selected.subCounty],["Crops",selected.crops],["Acres",selected.acres],["Co-operative",selected.coop],["Joined",selected.joined],["Gender",selected.gender]].map(([k,v])=>(
                  <div key={k} className="flex justify-between text-xs"><span style={{ color:C.slate }}>{k}</span><span className="font-bold" style={{ color:C.ink }}>{v}</span></div>
                ))}
              </div>
              <button className="w-full px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background:C.field }}>View Full Profile</button>
            </Card>
          ) : (
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>KYC Pipeline</p>
              {[["Verified",verified,C.shoot],["In Review",FARMERS_REG.filter(f=>f.kyc==="In Review").length,C.amber],["Pending",FARMERS_REG.filter(f=>f.kyc==="Pending").length,C.slate]].map(([l,v,c])=>(
                <StatRow key={l} label={l} value={v} bar={Math.round((v/FARMERS_REG.length)*100)} color={c} />
              ))}
            </Card>
          )}
          <Card className="p-4">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Top Counties</p>
            {Object.entries(FARMERS_REG.reduce((a,f)=>{ a[f.county]=(a[f.county]||0)+1; return a; },{})).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,n])=>(
              <StatRow key={c} label={c} value={n} bar={Math.round((n/FARMERS_REG.length)*100*4)} color={C.field} />
            ))}
          </Card>
        </div>
      </div>
      </>)}

      {view==="coops" && <KathianiCoopView />}

      {showSignup && (
        <div onClick={()=>setShowSignup(false)} style={{ position:"fixed", inset:0, background:"rgba(12,26,14,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:20 }}>
          <Card onClick={e=>e.stopPropagation()} className="w-full max-w-lg p-6">
            <p className="text-xl font-black mb-1" style={{ fontFamily:"'Barlow Condensed',sans-serif", color:C.ink }}>Onboard New Farmer</p>
            <p className="text-xs mb-5" style={{ color:C.slate }}>SMS-friendly signup · USSD fallback supported · Auto-syncs to Co-op registry</p>
            <div className="grid grid-cols-2 gap-3">
              {[["First name","Grace"],["Last name","Wanjiku"],["Phone (M-Pesa)","+254 7xx xxx xxx"],["National ID","12345678"],["County","Kiambu"],["Sub-county","Limuru"],["Primary crop","Avocado"],["Acres","3.5"]].map(([l,p])=>(
                <div key={l}>
                  <label className="text-xs font-bold mb-1 block" style={{ color:C.slate }}>{l}</label>
                  <input placeholder={p} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor:C.border }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={()=>setShowSignup(false)} className="flex-1 px-3 py-2 rounded-xl text-sm font-bold" style={{ background:C.mist, color:C.slate, border:`1px solid ${C.border}` }}>Cancel</button>
              <button onClick={()=>setShowSignup(false)} className="flex-1 px-3 py-2 rounded-xl text-sm font-bold text-white" style={{ background:C.field }}>Send SMS Invite →</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 6 — TRADE ASSESSMENT (BUYER DUE DILIGENCE + DEAL HEALTH)
// ═══════════════════════════════════════════════════════════════════════════════
const BUYERS = [
  { id:"B001", name:"Hamburg Traders GmbH",      country:"Germany",     established:1998, paid:42, late:1,  defaults:0, rating:94, tier:"AAA", category:"Coffee · Tea", lastDeal:"Apr 24, 2026",  flag:"🇩🇪" },
  { id:"B002", name:"Tesco Supermarkets UK",      country:"UK",          established:1919, paid:31, late:2,  defaults:0, rating:91, tier:"AA",  category:"Fresh Veg · Fruit", lastDeal:"Apr 18, 2026", flag:"🇬🇧" },
  { id:"B003", name:"Specialty Roasters JP",      country:"Japan",       established:2008, paid:18, late:0,  defaults:0, rating:96, tier:"AAA", category:"Premium Coffee", lastDeal:"Apr 22, 2026", flag:"🇯🇵" },
  { id:"B004", name:"BioSource Netherlands",       country:"Netherlands", established:2014, paid:11, late:1,  defaults:0, rating:84, tier:"AA",  category:"Tea · Superfoods", lastDeal:"Apr 26, 2026", flag:"🇳🇱" },
  { id:"B005", name:"African Roots Canada",        country:"Canada",      established:2019, paid:8,  late:0,  defaults:0, rating:88, tier:"AA",  category:"Macadamia · Nuts", lastDeal:"Apr 18, 2026", flag:"🇨🇦" },
  { id:"B006", name:"Doha Fresh Trading LLC",     country:"Qatar",       established:2017, paid:14, late:3,  defaults:1, rating:62, tier:"BB",  category:"Avocado · Mango", lastDeal:"Mar 28, 2026", flag:"🇶🇦" },
  { id:"B007", name:"Istanbul Agri Imports",      country:"Turkey",      established:2012, paid:9,  late:2,  defaults:0, rating:71, tier:"A",   category:"Avocado", lastDeal:"Apr 04, 2026", flag:"🇹🇷" },
  { id:"B008", name:"Dubai Wholesale Markets",     country:"UAE",        established:2010, paid:22, late:1,  defaults:0, rating:86, tier:"AA",  category:"Mixed Produce", lastDeal:"Apr 15, 2026", flag:"🇦🇪" },
];
const TIER_COLOR = (t) => t==="AAA"?C.shoot:t==="AA"?C.field:t==="A"?C.sky:t==="BB"?C.amber:C.crimson;
const ASSESSMENT_TREND = [
  { m:"Oct", score:78 },{ m:"Nov", score:80 },{ m:"Dec", score:81 },
  { m:"Jan", score:83 },{ m:"Feb", score:84 },{ m:"Mar", score:86 },{ m:"Apr", score:87 },
];

function TradeAssessment() {
  const [selected, setSelected] = useState(BUYERS[0]);
  const portfolioAvg = Math.round(BUYERS.reduce((s,b)=>s+b.rating,0)/BUYERS.length);
  const aaa = BUYERS.filter(b=>b.tier==="AAA").length;
  const flagged = BUYERS.filter(b=>b.rating<70).length;

  return (
    <div>
      <SectionTitle sub="Counterparty risk scoring · Payment history · Trade health · KYB due diligence">
        📈 Trade Assessment
      </SectionTitle>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🤝" label="Active Buyers"      value={BUYERS.length}    sub="vetted counterparties"        color={C.field} />
        <KpiCard icon="⭐" label="AAA-Rated"          value={aaa}              sub="lowest-risk tier"             color={C.shoot} />
        <KpiCard icon="📊" label="Portfolio Avg"      value={portfolioAvg}     sub="weighted risk score"          color={C.sky} />
        <KpiCard icon="⚠️" label="Flagged"            value={flagged}          sub="require enhanced DD"          color={C.crimson} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-2.5">
          {BUYERS.map(b=>(
            <div key={b.id} onClick={()=>setSelected(b)} className="rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-sm"
              style={{ background:selected?.id===b.id?`${C.field}08`:"#fff", borderColor:selected?.id===b.id?C.field:C.border, borderWidth:selected?.id===b.id?2:1 }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{b.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black" style={{ color:C.ink }}>{b.name}</span>
                    <Badge label={`Tier ${b.tier}`} color={TIER_COLOR(b.tier)} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color:C.slate }}>{b.country} · est {b.established} · {b.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black" style={{ color:TIER_COLOR(b.tier), fontFamily:"'Barlow Condensed',sans-serif" }}>{b.rating}</p>
                  <p className="text-xs" style={{ color:C.slate }}>{b.paid} on time · {b.late} late</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color:C.slate }}>Detail · {selected.id}</p>
            <p className="text-base font-black mb-1" style={{ color:C.ink }}>{selected.flag} {selected.name}</p>
            <Badge label={`Tier ${selected.tier} · ${selected.rating}/100`} color={TIER_COLOR(selected.tier)} />
            <div className="mt-4 space-y-2">
              {[["Country",selected.country],["Established",selected.established],["Category",selected.category],["Last deal",selected.lastDeal],["Paid on time",selected.paid],["Late payments",selected.late],["Defaults",selected.defaults]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs"><span style={{ color:C.slate }}>{k}</span><span className="font-bold" style={{ color:C.ink }}>{v}</span></div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background:C.field }}>Run KYB</button>
              <button className="px-3 py-2 rounded-xl text-xs font-bold" style={{ background:C.sky+"15", color:C.sky, border:`1px solid ${C.sky}30` }}>View Trades</button>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Portfolio Score · 7-mo</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={ASSESSMENT_TREND}>
                <defs><linearGradient id="ascore" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.field} stopOpacity={0.4}/><stop offset="100%" stopColor={C.field} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="m" tick={{ fontSize:10, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[60,100]} />
                <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
                <Area type="monotone" dataKey="score" stroke={C.field} strokeWidth={2} fill="url(#ascore)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 7 — SAAS SUBSCRIPTIONS (BILLING + PLANS)
// ═══════════════════════════════════════════════════════════════════════════════
const PLANS = [
  { id:"starter",    name:"Starter",    priceKES:0,      farmers:50,   features:["Marketplace listings","SMS alerts","M-Pesa checkout","Basic analytics"], color:C.slate,   badge:"Free" },
  { id:"growth",     name:"Growth",     priceKES:9500,   farmers:500,  features:["Everything in Starter","Co-op management","Weather & yield AI","Compliance tracker","Priority support"], color:C.field,    badge:"Most Popular" },
  { id:"enterprise", name:"Enterprise", priceKES:38000,  farmers:5000, features:["Everything in Growth","Custom domain","API + Webhooks","Dedicated CSM","White-label mobile app","On-prem option"], color:C.harvest, badge:"Best Value" },
];
const SUBS_BY_PLAN = [
  { name:"Starter",    count:62, mrr:0 },
  { name:"Growth",     count:34, mrr:323000 },
  { name:"Enterprise", count:8,  mrr:304000 },
];
const MRR_TREND = [
  { m:"Oct", mrr:412 },{ m:"Nov", mrr:456 },{ m:"Dec", mrr:498 },
  { m:"Jan", mrr:548 },{ m:"Feb", mrr:589 },{ m:"Mar", mrr:614 },{ m:"Apr", mrr:627 },
];
const RECENT_INVOICES = [
  { id:"INV-2026-0241", org:"Tigoni Growers Ltd",   plan:"Growth",     amount:9500,   status:"Paid",    date:"Apr 28" },
  { id:"INV-2026-0240", org:"Meru Coffee Coop",      plan:"Growth",     amount:9500,   status:"Paid",    date:"Apr 27" },
  { id:"INV-2026-0239", org:"XCADO Group Limited",  plan:"Enterprise", amount:38000,  status:"Paid",    date:"Apr 25" },
  { id:"INV-2026-0238", org:"Mwea Tomato Growers",   plan:"Growth",     amount:9500,   status:"Pending", date:"Apr 24" },
  { id:"INV-2026-0237", org:"Lake Vic Fillets",      plan:"Starter",    amount:0,      status:"N/A",     date:"Apr 22" },
  { id:"INV-2026-0236", org:"Murang'a Pressers",     plan:"Enterprise", amount:38000,  status:"Failed",  date:"Apr 20" },
];

function SaaSSubscriptions() {
  const totalMRR = SUBS_BY_PLAN.reduce((s,p)=>s+p.mrr,0);
  const totalSubs = SUBS_BY_PLAN.reduce((s,p)=>s+p.count,0);
  const arr = totalMRR * 12;

  return (
    <div>
      <SectionTitle sub="Plan distribution · MRR & ARR · Recent invoices · Plan upgrades">
        💎 SaaS Subscriptions
      </SectionTitle>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="🏢" label="Active Subs"     value={totalSubs}                 sub="across 24 counties"          color={C.field} />
        <KpiCard icon="💰" label="MRR"             value={`KES ${(totalMRR/1000).toFixed(0)}K`} sub="recurring monthly"   color={C.shoot} />
        <KpiCard icon="📊" label="ARR"             value={`KES ${(arr/1e6).toFixed(2)}M`}      sub="annualised"          color={C.harvest} />
        <KpiCard icon="📈" label="Net New / mo"    value="+13"                       sub="last 30 days"                 color={C.sky} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {PLANS.map(p=>(
          <Card key={p.id} className="p-5" style={{ borderColor:p.color, borderWidth:p.id==="growth"?2:1 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-black" style={{ fontFamily:"'Barlow Condensed',sans-serif", color:p.color }}>{p.name}</p>
              <Badge label={p.badge} color={p.color} />
            </div>
            <p className="text-3xl font-black" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {p.priceKES===0 ? "Free" : `KES ${p.priceKES.toLocaleString()}`}
            </p>
            <p className="text-xs mb-4" style={{ color:C.slate }}>{p.priceKES===0?"Forever free":"per month · billed annually"}</p>
            <p className="text-xs font-bold mb-2" style={{ color:C.slate }}>Up to {p.farmers.toLocaleString()} farmers</p>
            <ul className="space-y-1.5 mb-4">
              {p.features.map(f=>(
                <li key={f} className="text-xs flex items-start gap-2"><span style={{ color:p.color }}>✓</span><span style={{ color:C.ink }}>{f}</span></li>
              ))}
            </ul>
            <button className="w-full px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background:p.color }}>
              {p.id==="starter"?"Start Free":p.id==="growth"?"Upgrade →":"Contact Sales"}
            </button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2 p-5">
          <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>MRR Growth · USD thousands</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MRR_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="m" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
              <Line type="monotone" dataKey="mrr" stroke={C.field} strokeWidth={3} dot={{ fill:C.field, r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Plan Mix</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SUBS_BY_PLAN} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label={(e)=>`${e.name} ${e.count}`}>
                {SUBS_BY_PLAN.map((p,i)=>(<Cell key={i} fill={i===0?C.slate:i===1?C.field:C.harvest} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom:`1px solid ${C.border}` }}>
          <p className="text-sm font-black" style={{ color:C.ink }}>Recent Invoices</p>
        </div>
        <table className="w-full text-sm">
          <thead><tr style={{ background:C.mist }}>
            {["Invoice","Organisation","Plan","Amount","Status","Date"].map(h=>(
              <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{RECENT_INVOICES.map((inv,i)=>(
            <tr key={inv.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
              <td className="px-4 py-3 font-mono text-xs" style={{ color:C.slate }}>{inv.id}</td>
              <td className="px-4 py-3 text-xs font-bold" style={{ color:C.ink }}>{inv.org}</td>
              <td className="px-4 py-3"><Badge label={inv.plan} color={inv.plan==="Enterprise"?C.harvest:inv.plan==="Growth"?C.field:C.slate} /></td>
              <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color:C.ink }}>{inv.amount===0?"—":`KES ${inv.amount.toLocaleString()}`}</td>
              <td className="px-4 py-3"><Badge label={inv.status} color={inv.status==="Paid"?C.shoot:inv.status==="Pending"?C.amber:inv.status==="Failed"?C.crimson:C.slate} /></td>
              <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{inv.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 8 — WEATHER & FIELDS
// ═══════════════════════════════════════════════════════════════════════════════
const WEATHER_COUNTIES = [
  { county:"Kiambu",      temp:22, condition:"Partly Cloudy", icon:"⛅", rain:35, humidity:68, wind:12, advisory:"Ideal for spraying" },
  { county:"Meru",        temp:20, condition:"Light Rain",    icon:"🌦️", rain:78, humidity:84, wind:8,  advisory:"Delay harvest 2 days" },
  { county:"Murang'a",    temp:21, condition:"Cloudy",        icon:"☁️", rain:55, humidity:75, wind:10, advisory:"Monitor leaf moisture" },
  { county:"Makueni",     temp:28, condition:"Sunny",         icon:"☀️", rain:8,  humidity:42, wind:14, advisory:"High evapotranspiration" },
  { county:"Nakuru",      temp:19, condition:"Overcast",      icon:"☁️", rain:42, humidity:71, wind:11, advisory:"Watch for armyworm" },
  { county:"Kisumu",      temp:26, condition:"Thunderstorm",  icon:"⛈️", rain:88, humidity:89, wind:18, advisory:"Postpone field activities" },
];
const FORECAST_7D = [
  { d:"Mon", high:23, low:14, rain:35 },{ d:"Tue", high:24, low:15, rain:20 },
  { d:"Wed", high:22, low:14, rain:60 },{ d:"Thu", high:21, low:13, rain:75 },
  { d:"Fri", high:23, low:14, rain:40 },{ d:"Sat", high:25, low:15, rain:15 },
  { d:"Sun", high:26, low:16, rain:10 },
];

function WeatherFields() {
  const [selected, setSelected] = useState(WEATHER_COUNTIES[0]);
  return (
    <div>
      <SectionTitle sub="7-day forecast · County advisories · Plot-level conditions · Spray windows">
        🌤️ Weather &amp; Fields
      </SectionTitle>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <Card className="col-span-2 p-5" style={{ background:`linear-gradient(135deg,${C.sky}10,${C.field}05)` }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color:C.slate }}>Now · {selected.county}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-5xl">{selected.icon}</span>
                <div>
                  <p className="text-4xl font-black" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif" }}>{selected.temp}°C</p>
                  <p className="text-sm font-bold" style={{ color:C.slate }}>{selected.condition}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge label={selected.advisory} color={C.field} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["💧 Rain prob",`${selected.rain}%`,C.sky],["💨 Humidity",`${selected.humidity}%`,C.field],["🌬️ Wind",`${selected.wind} km/h`,C.violet]].map(([l,v,c])=>(
              <div key={l} className="p-3 rounded-xl" style={{ background:"#fff", border:`1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color:C.slate }}>{l}</p>
                <p className="text-lg font-black" style={{ color:c, fontFamily:"'Barlow Condensed',sans-serif" }}>{v}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>County Advisories</p>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {WEATHER_COUNTIES.map(w=>(
              <button key={w.county} onClick={()=>setSelected(w)} className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left"
                style={{ background:selected.county===w.county?`${C.field}10`:"transparent", border:`1px solid ${selected.county===w.county?C.field:"transparent"}` }}>
                <span className="text-xl">{w.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color:C.ink }}>{w.county}</p>
                  <p className="text-xs truncate" style={{ color:C.slate }}>{w.condition}</p>
                </div>
                <span className="text-sm font-black" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif" }}>{w.temp}°</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-5">
        <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>7-Day Forecast · {selected.county}</p>
        <div className="grid grid-cols-7 gap-3">
          {FORECAST_7D.map(d=>(
            <div key={d.d} className="text-center p-3 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
              <p className="text-xs font-bold" style={{ color:C.slate }}>{d.d}</p>
              <p className="text-2xl my-1">{d.rain>60?"🌧️":d.rain>30?"⛅":"☀️"}</p>
              <p className="text-xs font-black" style={{ color:C.ink }}>{d.high}°</p>
              <p className="text-xs" style={{ color:C.slate }}>{d.low}°</p>
              <div className="mt-1.5 text-xs font-bold" style={{ color:d.rain>60?C.sky:d.rain>30?C.amber:C.shoot }}>{d.rain}%</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Rainfall Probability · 7-day</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={FORECAST_7D}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="d" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
            <Bar dataKey="rain" radius={[8,8,0,0]}>
              {FORECAST_7D.map((d,i)=>(<Cell key={i} fill={d.rain>60?C.sky:d.rain>30?C.amber:C.shoot} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 9 — SUPPLIER & RBAC
// ═══════════════════════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { id:"S001", name:"Kathiani Horticultural SHG", type:"Self-Help Group", county:"Machakos",  staff:41,  certs:1, status:"Active",  contact:"312 Machakos · Cert #3897042", featured:true },
  { id:"S002", name:"Murang'a Avocado Pressers",  type:"Processor",  county:"Murang'a",  staff:42,  certs:3, status:"Active",  contact:"j.kimani@muranga-press.co.ke" },
  { id:"S003", name:"Kilifi Coconut Processors",   type:"Processor",  county:"Kilifi",    staff:28,  certs:2, status:"Active",  contact:"ops@kilificoco.ke" },
  { id:"S004", name:"Nyeri Highlands Coffee",     type:"Mill",        county:"Nyeri",     staff:55,  certs:4, status:"Active",  contact:"mill@nyerihighlands.co.ke" },
  { id:"S005", name:"Lake Vic Fish Fillets",      type:"Cold Chain",  county:"Homa Bay",  staff:18,  certs:1, status:"Suspended", contact:"info@lakevicfish.ke" },
  { id:"S006", name:"Kericho Purple Tea",         type:"Factory",     county:"Kericho",   staff:120, certs:5, status:"Active",  contact:"factory@kerichoptea.ke" },
  { id:"S007", name:"Isiolo Moringa Co-op",       type:"Co-operative",county:"Isiolo",    staff:34,  certs:2, status:"Active",  contact:"isiolo.moringa@coop.ke" },
];
const ROLES = [
  { role:"Platform Admin",   users:3,  perms:["All modules","Billing","User mgmt","API keys","Settings"] },
  { role:"Org Manager",      users:18, perms:["All modules","User mgmt","Reports","Org settings"] },
  { role:"Agronomist",       users:42, perms:["Farmer registry","Weather & Fields","Compliance","Reports"] },
  { role:"Supplier",         users:64, perms:["Marketplace","Compliance","Trace records","Own profile"] },
  { role:"Farmer",           users:524,perms:["Own profile","Marketplace browse","Training","Weather"] },
];
const RBAC_MATRIX = [
  { module:"Marketplace",    admin:"✓", manager:"✓", agronomist:"View", supplier:"✓",   farmer:"View" },
  { module:"Farmer Registry",admin:"✓", manager:"✓", agronomist:"✓",     supplier:"—",  farmer:"Own" },
  { module:"Compliance",     admin:"✓", manager:"✓", agronomist:"View", supplier:"Own", farmer:"—" },
  { module:"Weather",        admin:"✓", manager:"✓", agronomist:"✓",     supplier:"View", farmer:"View" },
  { module:"Billing",        admin:"✓", manager:"View",agronomist:"—",   supplier:"—",  farmer:"—" },
  { module:"API Keys",       admin:"✓", manager:"—", agronomist:"—",     supplier:"—",  farmer:"—" },
];

function SupplierRBAC() {
  const [tab, setTab] = useState("suppliers");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Supplier directory · Onboarding pipeline · Role-based access matrix">
          🏭 Supplier &amp; RBAC
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["suppliers","🏭 Suppliers"],["roles","🔐 Roles"],["matrix","🧩 Permission Matrix"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background:tab===id?"#fff":"transparent", color:tab===id?C.ink:C.slate, boxShadow:tab===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      {tab==="suppliers" && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            <KpiCard icon="🏭" label="Suppliers" value={SUPPLIERS.length} sub="enrolled organisations" color={C.field} />
            <KpiCard icon="👷" label="Total Staff" value={SUPPLIERS.reduce((s,x)=>s+x.staff,0)} sub="across all suppliers" color={C.sky} />
            <KpiCard icon="📜" label="Avg Certs" value={(SUPPLIERS.reduce((s,x)=>s+x.certs,0)/SUPPLIERS.length).toFixed(1)} sub="per supplier" color={C.harvest} />
            <KpiCard icon="⚠️" label="Suspended" value={SUPPLIERS.filter(s=>s.status==="Suspended").length} sub="require review" color={C.crimson} />
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ background:C.mist }}>
                {["ID","Supplier","Type","County","Staff","Certs","Status","Contact"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{SUPPLIERS.map((s,i)=>(
                <tr key={s.id} style={{ borderBottom:`1px solid ${C.border}`, background:s.featured?`${C.field}08`:i%2===0?"#fff":"#FAFAF8" }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color:C.slate }}>{s.id}</td>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color:C.ink }}>
                    {s.featured && <span title="Real-world co-operative" style={{ marginRight:6 }}>⭐</span>}
                    {s.name}
                  </td>
                  <td className="px-4 py-3"><Badge label={s.type} color={s.type==="Self-Help Group"?C.field:C.violet} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{s.county}</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold">{s.staff}</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color:C.harvest }}>{s.certs}</td>
                  <td className="px-4 py-3"><Badge label={s.status} color={s.status==="Active"?C.shoot:C.crimson} /></td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:C.slate }}>{s.contact}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
        </>
      )}

      {tab==="roles" && (
        <div className="grid grid-cols-2 gap-4">
          {ROLES.map(r=>(
            <Card key={r.role} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-black" style={{ color:C.ink, fontFamily:"'Barlow Condensed',sans-serif" }}>{r.role}</p>
                <Badge label={`${r.users} users`} color={C.field} />
              </div>
              <p className="text-xs font-bold mb-2" style={{ color:C.slate }}>Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {r.perms.map(p=>(<Badge key={p} label={p} color={C.sky} />))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==="matrix" && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr style={{ background:C.grove }}>
              {["Module","Platform Admin","Org Manager","Agronomist","Supplier","Farmer"].map(h=>(
                <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.lime }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{RBAC_MATRIX.map((r,i)=>(
              <tr key={r.module} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                <td className="px-4 py-3 text-xs font-bold" style={{ color:C.ink }}>{r.module}</td>
                {["admin","manager","agronomist","supplier","farmer"].map(role=>(
                  <td key={role} className="px-4 py-3 text-xs font-mono font-bold" style={{ color:r[role]==="✓"?C.shoot:r[role]==="—"?C.crimson:C.slate }}>{r[role]}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 10 — ANALYTICS & SDG M&E
// ═══════════════════════════════════════════════════════════════════════════════
const SDG_GOALS = [
  { id:1,  code:"SDG 1",  title:"No Poverty",            icon:"💵", color:"#E5243B", metric:"Avg farmer income +",  value:"+34%", target:"+50%", progress:68 },
  { id:2,  code:"SDG 2",  title:"Zero Hunger",            icon:"🌾", color:"#DDA63A", metric:"Yield improvement",     value:"+22%", target:"+30%", progress:73 },
  { id:5,  code:"SDG 5",  title:"Gender Equality",        icon:"⚖️", color:"#FF3A21", metric:"Women farmers",          value:"42%",  target:"50%",  progress:84 },
  { id:8,  code:"SDG 8",  title:"Decent Work & Growth",   icon:"📈", color:"#A21942", metric:"Co-op jobs created",    value:"1,240",target:"2,000",progress:62 },
  { id:12, code:"SDG 12", title:"Responsible Consumption",icon:"♻️", color:"#BF8B2E", metric:"Certified produce",      value:"58%",  target:"75%",  progress:77 },
  { id:13, code:"SDG 13", title:"Climate Action",         icon:"🌍", color:"#3F7E44", metric:"CO₂ reduction",          value:"-18%", target:"-25%", progress:72 },
  { id:17, code:"SDG 17", title:"Partnerships",           icon:"🤝", color:"#19486A", metric:"Active partner orgs",   value:"104",  target:"150",  progress:69 },
];
const ANALYTICS_COUNTIES = [
  { name:"Kiambu",  farmers:89, gmv:2840 },{ name:"Meru",    farmers:62, gmv:1980 },
  { name:"Nakuru",  farmers:48, gmv:1420 },{ name:"Makueni", farmers:41, gmv:980  },
  { name:"Kisumu",  farmers:38, gmv:760  },{ name:"Murang'a",farmers:35, gmv:920  },
];

function AnalyticsSDG() {
  const [view, setView] = useState("sdg");
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="UN Sustainable Development Goals · Platform analytics · Impact metrics">
          📊 Analytics &amp; SDG M&amp;E
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["sdg","🌍 SDG Tracker"],["analytics","📊 Platform Analytics"]].map(([id,l])=>(
            <button key={id} onClick={()=>setView(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background:view===id?"#fff":"transparent", color:view===id?C.ink:C.slate, boxShadow:view===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      {view==="sdg" && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            <KpiCard icon="🌍" label="SDGs Tracked" value={SDG_GOALS.length} sub="of 17 UN goals" color={C.field} />
            <KpiCard icon="📊" label="Avg Progress" value={`${Math.round(SDG_GOALS.reduce((s,g)=>s+g.progress,0)/SDG_GOALS.length)}%`} sub="across all goals" color={C.shoot} />
            <KpiCard icon="✅" label="On-track" value={SDG_GOALS.filter(g=>g.progress>=70).length} sub="≥70% to target" color={C.harvest} />
            <KpiCard icon="📅" label="Reporting Period" value="Q1 2026" sub="Jan – Mar" color={C.violet} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {SDG_GOALS.map(g=>(
              <Card key={g.id} className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background:`${g.color}20`, color:g.color }}>{g.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color:g.color }}>{g.code}</p>
                    <p className="text-base font-black" style={{ color:C.ink }}>{g.title}</p>
                  </div>
                  <Badge label={g.progress>=70?"On-track":"Behind"} color={g.progress>=70?C.shoot:C.amber} />
                </div>
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs"><span style={{ color:C.slate }}>{g.metric}</span><span className="font-bold" style={{ color:C.ink }}>{g.value} / {g.target}</span></div>
                  <div className="h-2 rounded-full" style={{ background:C.border }}>
                    <div className="h-full rounded-full" style={{ width:`${g.progress}%`, background:g.color }} />
                  </div>
                  <p className="text-xs font-bold text-right" style={{ color:g.color }}>{g.progress}% to target</p>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {view==="analytics" && (
        <div className="grid grid-cols-2 gap-5">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Farmers by County</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ANALYTICS_COUNTIES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis type="number" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
                <Bar dataKey="farmers" fill={C.field} radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>GMV by County · KES K</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ANALYTICS_COUNTIES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis type="number" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:C.slate }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius:10, border:"none", fontSize:12 }} />
                <Bar dataKey="gmv" fill={C.harvest} radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 11 — COMMUNICATIONS HUB
// ═══════════════════════════════════════════════════════════════════════════════
const THREADS = [
  { id:"T001", from:"Grace Wanjiku",   role:"Farmer",  county:"Kiambu",   subject:"Avocado harvest ready — 1.2T",  preview:"Hi team, my avocado is ready for collection. Please send transport…", time:"12 min ago", unread:true,  channel:"SMS" },
  { id:"T002", from:"Hamburg Traders", role:"Buyer",   county:"Germany",  subject:"PO confirmation for Coffee AA",  preview:"Confirming purchase of 2,400kg at agreed FOB rate of USD 4.20/kg…",  time:"1 hr ago",   unread:true,  channel:"Email" },
  { id:"T003", from:"James Mwangi",     role:"Farmer",  county:"Meru",     subject:"Question about KEPHIS renewal",  preview:"Good morning. Could you advise on the documents needed for renewing…",time:"3 hrs ago",  unread:false, channel:"WhatsApp" },
  { id:"T004", from:"Esther Njoroge",   role:"Farmer",  county:"Murang'a", subject:"Macadamia certification cost",   preview:"Hello, I would like to understand the cost breakdown for Fairtrade…",  time:"6 hrs ago",  unread:false, channel:"SMS" },
  { id:"T005", from:"Tesco UK",         role:"Buyer",   county:"UK",       subject:"Spec sheet — French Beans AA",   preview:"Please share the latest spec sheet and any new certification updates…", time:"1 day ago",  unread:false, channel:"Email" },
];
const BROADCAST_HISTORY = [
  { id:"BC-041", date:"Apr 28", title:"Heavy rain advisory · 5 counties",    audience:"Farmers in Kisumu, Homa Bay, Migori, Siaya, Busia", reach:184, channel:"SMS" },
  { id:"BC-040", date:"Apr 25", title:"FOB price update · Coffee AA +2%",     audience:"All Coffee farmers + Co-op managers",                reach:96,  channel:"SMS" },
  { id:"BC-039", date:"Apr 22", title:"New ISO 22000 training module live",   audience:"All Enterprise plan organisations",                  reach:42,  channel:"Email" },
];

function CommunicationsHub() {
  const [tab, setTab] = useState("inbox");
  const [selected, setSelected] = useState(THREADS[0]);
  const [draft, setDraft] = useState("");
  const unread = THREADS.filter(t=>t.unread).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle sub="Two-way SMS · WhatsApp · Email · Broadcast tools · Notification log">
          💬 Communications Hub
        </SectionTitle>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:C.mist, border:`1px solid ${C.border}` }}>
          {[["inbox",`📥 Inbox · ${unread}`],["broadcast","📣 Broadcast"],["history","🗂️ History"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background:tab===id?"#fff":"transparent", color:tab===id?C.ink:C.slate, boxShadow:tab===id?"0 1px 3px rgba(0,0,0,.1)":"none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="📥" label="Unread"          value={unread}                   sub={`of ${THREADS.length} active threads`} color={C.crimson} />
        <KpiCard icon="📤" label="Sent · Today"    value="24"                       sub="across all channels"                    color={C.field} />
        <KpiCard icon="📡" label="SMS Credits"     value="1,840"                    sub="≈ 920 broadcasts left"                  color={C.sky} />
        <KpiCard icon="✅" label="Delivery Rate"    value="98.4%"                    sub="last 7 days"                            color={C.shoot} />
      </div>

      {tab==="inbox" && (
        <div className="grid grid-cols-3 gap-5">
          <Card className="overflow-hidden">
            {THREADS.map(t=>(
              <div key={t.id} onClick={()=>setSelected(t)} className="p-3.5 cursor-pointer"
                style={{ borderBottom:`1px solid ${C.border}`, background:selected?.id===t.id?`${C.field}10`:t.unread?C.mist:"#fff" }}>
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-black" style={{ color:C.ink }}>{t.from}</p>
                  <span className="text-xs" style={{ color:C.slate }}>{t.time}</span>
                </div>
                <p className="text-xs font-bold mb-1" style={{ color:C.ink }}>{t.subject}</p>
                <p className="text-xs truncate" style={{ color:C.slate }}>{t.preview}</p>
                <div className="flex gap-1.5 mt-2">
                  <Badge label={t.role} color={t.role==="Farmer"?C.field:C.sky} />
                  <Badge label={t.channel} color={t.channel==="SMS"?C.harvest:t.channel==="Email"?C.violet:C.shoot} />
                  {t.unread && <Badge label="New" color={C.crimson} />}
                </div>
              </div>
            ))}
          </Card>

          <Card className="col-span-2 p-5 flex flex-col" style={{ minHeight:480 }}>
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <p className="text-base font-black" style={{ color:C.ink }}>{selected.subject}</p>
                    <p className="text-xs" style={{ color:C.slate }}>From {selected.from} · {selected.county} · via {selected.channel}</p>
                  </div>
                  <Badge label={selected.channel} color={selected.channel==="SMS"?C.harvest:selected.channel==="Email"?C.violet:C.shoot} />
                </div>
                <div className="flex-1 mb-4">
                  <p className="text-sm" style={{ color:C.ink, lineHeight:1.6 }}>{selected.preview} ...</p>
                </div>
                <div>
                  <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Type your reply…" rows={3}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" style={{ borderColor:C.border, background:C.mist }} />
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background:C.field }}>Send via {selected.channel}</button>
                    <button onClick={()=>setDraft("")} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background:C.mist, color:C.slate, border:`1px solid ${C.border}` }}>Discard</button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm" style={{ color:C.slate }}>Select a thread</p>
            )}
          </Card>
        </div>
      )}

      {tab==="broadcast" && (
        <Card className="p-6 max-w-3xl">
          <p className="text-base font-black mb-1" style={{ color:C.ink }}>New Broadcast</p>
          <p className="text-xs mb-5" style={{ color:C.slate }}>Send to thousands of farmers in one tap · SMS credits deducted on send</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color:C.slate }}>Audience</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor:C.border }}>
                <option>All farmers (524)</option>
                <option>By county — Kiambu (89)</option>
                <option>By crop — Coffee farmers (98)</option>
                <option>By co-op — Tigoni Growers Ltd (24)</option>
                <option>Verified farmers only (412)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color:C.slate }}>Channel</label>
              <div className="flex gap-2">
                {["SMS","WhatsApp","Email"].map(c=>(
                  <label key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer" style={{ borderColor:C.border, background:C.mist }}>
                    <input type="checkbox" defaultChecked={c==="SMS"} /><span className="text-xs font-bold">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color:C.slate }}>Message · {160} chars max for SMS</label>
              <textarea rows={4} placeholder="Heavy rain advisory for Kisumu county. Postpone field activities until Tue. Reply HELP for guidance."
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" style={{ borderColor:C.border, background:C.mist }} />
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop:`1px solid ${C.border}` }}>
              <p className="text-xs" style={{ color:C.slate }}>Estimated cost: <span className="font-bold" style={{ color:C.ink }}>184 credits</span></p>
              <button className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background:C.field }}>Send Broadcast →</button>
            </div>
          </div>
        </Card>
      )}

      {tab==="history" && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr style={{ background:C.mist }}>
              {["ID","Date","Title","Audience","Reach","Channel"].map(h=>(
                <th key={h} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider" style={{ color:C.slate }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{BROADCAST_HISTORY.map((b,i)=>(
              <tr key={b.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#FAFAF8" }}>
                <td className="px-4 py-3 font-mono text-xs" style={{ color:C.slate }}>{b.id}</td>
                <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{b.date}</td>
                <td className="px-4 py-3 text-xs font-bold" style={{ color:C.ink }}>{b.title}</td>
                <td className="px-4 py-3 text-xs" style={{ color:C.slate }}>{b.audience}</td>
                <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color:C.field }}>{b.reach}</td>
                <td className="px-4 py-3"><Badge label={b.channel} color={b.channel==="SMS"?C.harvest:C.violet} /></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 12 — FLUTTER MOBILE APP
// ═══════════════════════════════════════════════════════════════════════════════
const APP_DEVICES = [
  { os:"Android", version:"v2.4.1", users:412, crash:0.2,  rating:4.6 },
  { os:"iOS",     version:"v2.4.1", users:42,  crash:0.1,  rating:4.8 },
  { os:"USSD",    version:"*483*1#",users:184, crash:0.0,  rating:4.4 },
];
const APP_FEATURES = [
  { icon:"📡", title:"Offline-first sync",         body:"Works in zero-bar areas · auto-syncs when reconnected" },
  { icon:"📞", title:"USSD fallback",                body:"Feature phones supported via *483*1# Safaricom shortcode" },
  { icon:"🌍", title:"Multilingual",                  body:"English · Swahili · Kalenjin · Luo · Kikuyu · Kamba" },
  { icon:"📷", title:"Camera-based plot capture",    body:"GPS + photo for plot verification & yield evidence" },
  { icon:"💳", title:"M-Pesa STK push",              body:"One-tap payment for inputs, training, certifications" },
  { icon:"🔔", title:"Smart notifications",          body:"Weather alerts · price moves · cert renewals" },
];

function FlutterMobileApp() {
  const totalUsers = APP_DEVICES.reduce((s,d)=>s+d.users,0);
  return (
    <div>
      <SectionTitle sub="Cross-platform farmer app · Android · iOS · USSD · Offline-first">
        📱 Flutter Mobile App
      </SectionTitle>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon="📲" label="Active Devices" value={totalUsers}    sub="across 3 platforms" color={C.field} />
        <KpiCard icon="⭐" label="Avg Rating"     value="4.6"           sub="last 30 days · 2,184 reviews" color={C.harvest} />
        <KpiCard icon="🛡️" label="Crash-free"     value="99.8%"         sub="Sentry monitoring"   color={C.shoot} />
        <KpiCard icon="🚀" label="Latest Build"   value="v2.4.1"        sub="released Apr 26, 2026" color={C.violet} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Phone preview */}
        <Card className="p-6 flex items-center justify-center" style={{ background:`linear-gradient(135deg,${C.grove},${C.field})` }}>
          <div style={{ width:220, height:440, borderRadius:32, background:"#fff", border:"8px solid #0C1A0E", padding:14, display:"flex", flexDirection:"column", boxShadow:"0 18px 40px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between" style={{ fontSize:9, color:C.slate, marginBottom:8 }}>
              <span>9:41</span><span>📶 5G · 🔋 84%</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <XGrowMark size={28} rx={7} />
              <div>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, color:C.grove }}>Grow</p>
                <p style={{ fontSize:7, fontWeight:700, letterSpacing:"0.14em", color:C.field }}>BY XCADO</p>
              </div>
            </div>
            <div style={{ background:`${C.field}10`, border:`1px solid ${C.field}30`, borderRadius:10, padding:10, marginBottom:8 }}>
              <p style={{ fontSize:10, fontWeight:800, color:C.grove }}>Hi Grace 👋</p>
              <p style={{ fontSize:8, color:C.slate }}>Avocado FOB +2% today</p>
            </div>
            <div style={{ background:C.mist, borderRadius:10, padding:10, marginBottom:8 }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.ink, marginBottom:4 }}>📦 Active Listings · 3</p>
              <p style={{ fontSize:8, color:C.slate }}>1.2T Avocado · 800kg Tea</p>
            </div>
            <div style={{ background:C.mist, borderRadius:10, padding:10, marginBottom:8 }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.ink, marginBottom:4 }}>🌤️ Kiambu · 22°C</p>
              <p style={{ fontSize:8, color:C.slate }}>Ideal for spraying today</p>
            </div>
            <div style={{ background:`${C.harvest}15`, border:`1px solid ${C.harvest}30`, borderRadius:10, padding:10, marginBottom:8 }}>
              <p style={{ fontSize:9, fontWeight:700, color:C.ink }}>💳 KES 24K paid</p>
              <p style={{ fontSize:8, color:C.slate }}>via M-Pesa · 5 hrs ago</p>
            </div>
            <div className="flex justify-around mt-auto pt-2" style={{ borderTop:`1px solid ${C.border}` }}>
              {["🏠","🛒","🌱","💬","⚙️"].map((i,k)=>(<span key={k} style={{ fontSize:14, opacity:k===0?1:0.5 }}>{i}</span>))}
            </div>
          </div>
        </Card>

        <div className="col-span-2 space-y-5">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Devices &amp; Versions</p>
            <table className="w-full text-sm">
              <thead><tr>{["Platform","Version","Users","Crash %","Rating"].map(h=>(
                <th key={h} className="text-left text-xs font-bold uppercase tracking-wider py-2" style={{ color:C.slate }}>{h}</th>
              ))}</tr></thead>
              <tbody>{APP_DEVICES.map((d,i)=>(
                <tr key={d.os} style={{ borderTop:`1px solid ${C.border}` }}>
                  <td className="py-2 text-sm font-black" style={{ color:C.ink }}>{d.os==="Android"?"🤖":d.os==="iOS"?"🍎":"📞"} {d.os}</td>
                  <td className="py-2 text-xs font-mono" style={{ color:C.slate }}>{d.version}</td>
                  <td className="py-2 text-xs font-mono font-bold" style={{ color:C.field }}>{d.users}</td>
                  <td className="py-2 text-xs font-mono" style={{ color:d.crash<0.5?C.shoot:C.crimson }}>{d.crash}%</td>
                  <td className="py-2 text-xs font-bold" style={{ color:C.harvest }}>⭐ {d.rating}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {APP_FEATURES.map(f=>(
              <Card key={f.title} className="p-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">{f.icon}</span>
                  <div><p className="text-xs font-black" style={{ color:C.ink }}>{f.title}</p><p className="text-xs mt-0.5" style={{ color:C.slate }}>{f.body}</p></div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color:C.slate }}>Get the app</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 justify-center" style={{ background:"#0C1A0E" }}>
                <span className="text-base">🤖</span><span>Google Play</span>
              </button>
              <button className="flex-1 px-4 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 justify-center" style={{ background:"#0C1A0E" }}>
                <span className="text-base">🍎</span><span>App Store</span>
              </button>
              <button className="flex-1 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 justify-center" style={{ background:`${C.harvest}15`, color:C.harvest, border:`1px solid ${C.harvest}30` }}>
                <span className="text-base">📞</span><span>Dial *483*1#</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV + APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════

// ── NAV ───────────────────────────────────────────────────────────────────────
// Unified app: 4 Sprint 5 modules + 8 Platform modules + 4 Operations modules.
const NAV_OPS = [
  { id:"dashboard",    icon:"🏠", label:"Dashboard"           },
  { id:"training",     icon:"📚", label:"Training & Knowledge" },
  { id:"traceability", icon:"🔗", label:"Blockchain Trace"     },
  { id:"settings",     icon:"⚙️", label:"Settings & Config"    },
];

const NAV = [
  { id:"marketplace",  icon:"🛒", label:"Marketplace",        tag:"New" },
  { id:"supplychain",  icon:"🚚", label:"Supply Chain",       tag:"New" },
  { id:"compliance",   icon:"✅", label:"Compliance & Certs", tag:"New" },
  { id:"ai",           icon:"🤖", label:"AI Intelligence",    tag:"New" },
];

const NAV_PREV = [
  { id:"farmers",     icon:"👥", label:"Farmer Registry + Signup" },
  { id:"trade",       icon:"📈", label:"Trade Assessment" },
  { id:"saas",        icon:"💎", label:"SaaS Subscriptions" },
  { id:"weather",     icon:"🌤️", label:"Weather & Fields" },
  { id:"supplier",    icon:"🏭", label:"Supplier & RBAC" },
  { id:"analytics",   icon:"📊", label:"Analytics & SDG M&E" },
  { id:"comms",       icon:"💬", label:"Communications Hub" },
  { id:"mobile",      icon:"📱", label:"Flutter Mobile App" },
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Sprint5() {
  const [page, setPage] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);

  // Close drawer when user picks a page (mobile only — has no effect on desktop)
  const goto = (id) => { setPage(id); setNavOpen(false); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Outfit','Plus Jakarta Sans',sans-serif", background:C.chalk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#C0BAB0; border-radius:4px; }
        button { font-family:'Outfit',sans-serif; }
        select, input { font-family:'Outfit',sans-serif; }
      `}</style>

      {/* Mobile-only scrim */}
      <div className={`grow-scrim ${navOpen?"is-open":""}`} onClick={()=>setNavOpen(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`grow-sidebar ${navOpen?"is-open":""}`} style={{ width:252, flexShrink:0, display:"flex", flexDirection:"column", background:C.grove, borderRight:"1px solid rgba(255,255,255,0.06)" }}>

        {/* Brand lockup */}
        <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <XGrowMark size={40} rx={10}/>
            <div>
              <XGrowWordmark size={21} light={true}/>
              <p style={{ fontSize:10, color:"rgba(245,241,232,0.38)", marginTop:3, letterSpacing:"0.05em", fontWeight:500 }}>
                Grow. Further.
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ padding:"10px 10px", flex:1, overflowY:"auto" }}>
          {/* Operations group — Dashboard / Training / Trace / Settings */}
          <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", padding:"8px 10px 5px", color:"rgba(255,255,255,0.32)", fontFamily:"'Outfit',sans-serif" }}>
            Operations
          </p>
          {NAV_OPS.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => goto(n.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:10, marginBottom:2, cursor:"pointer",
                background: active ? "rgba(157,217,106,0.12)" : "transparent",
                border: active ? `1px solid rgba(157,217,106,0.22)` : "1px solid transparent",
                borderLeft: active ? `3px solid ${C.lime}` : "3px solid transparent",
                color: active ? "#F5F1E8" : "rgba(245,241,232,0.55)",
                fontSize:13, fontWeight: active ? 600 : 500, textAlign:"left",
                transition:"all 0.14s",
              }}>
                <span style={{ fontSize:15 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
              </button>
            );
          })}

          <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", padding:"14px 10px 5px", color:"rgba(255,255,255,0.22)", fontFamily:"'Outfit',sans-serif", borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:6 }}>
            Route to Market · Sprint 5
          </p>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => goto(n.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:10, marginBottom:2, cursor:"pointer",
                background: active ? "rgba(157,217,106,0.12)" : "transparent",
                border: active ? `1px solid rgba(157,217,106,0.22)` : "1px solid transparent",
                borderLeft: active ? `3px solid ${C.lime}` : "3px solid transparent",
                color: active ? "#F5F1E8" : "rgba(245,241,232,0.42)",
                fontSize:13, fontWeight: active ? 600 : 500, textAlign:"left",
                transition:"all 0.14s",
              }}>
                <span style={{ fontSize:15 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                <span style={{ fontSize:9, padding:"2px 6px", borderRadius:20, fontWeight:700,
                  background:`${C.lime}20`, color:C.lime }}>{n.tag}</span>
              </button>
            );
          })}

          {/* Previously built — now active */}
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
              padding:"0 10px 5px", color:"rgba(255,255,255,0.32)" }}>Platform Modules</p>
            {NAV_PREV.map(n => {
              const active = page === n.id;
              return (
                <button key={n.id} onClick={() => { setPage(n.id); setNavOpen(false); }} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:9, padding:"7px 10px",
                  borderRadius:9, marginBottom:1, cursor:"pointer",
                  background: active ? "rgba(157,217,106,0.12)" : "transparent",
                  border: active ? `1px solid rgba(157,217,106,0.22)` : "1px solid transparent",
                  borderLeft: active ? `3px solid ${C.lime}` : "3px solid transparent",
                  color: active ? "#F5F1E8" : "rgba(245,241,232,0.55)",
                  fontSize:12, fontWeight: active ? 600 : 500, textAlign:"left",
                  transition:"all 0.14s",
                }}>
                  <span style={{ fontSize:13 }}>{n.icon}</span>
                  <span style={{ flex:1 }}>{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer — progress + attribution */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, color:"rgba(245,241,232,0.45)", fontWeight:600 }}>Platform completion</span>
              <XGrowMark size={18} bg="none" stroke={C.lime} tip={C.lime}/>
            </div>
            <div style={{ height:5, borderRadius:3, background:"rgba(255,255,255,0.1)", overflow:"hidden", marginBottom:6 }}>
              <div style={{ height:"100%", borderRadius:3, width:"84%",
                background:`linear-gradient(90deg,${C.lime},#C8F590)` }}/>
            </div>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:C.lime, fontWeight:700 }}>84% · Sprint 5 of 6</span>
              <span style={{ fontSize:9, color:"rgba(245,241,232,0.25)" }}>by XCADO</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <header style={{ background:"#fff", padding:"0 24px", height:52,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0, borderBottom:`1px solid ${C.border}` }}>

          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
            {/* Hamburger — mobile only */}
            <button onClick={()=>setNavOpen(true)} aria-label="Open navigation"
              className="grow-hamburger"
              style={{ width:36, height:36, borderRadius:8, background:C.mist,
                border:`1px solid ${C.border}`, alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:C.ink, fontSize:18, marginRight:4 }}>
              ☰
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <XGrowMark size={22} rx={6}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:-0.3, color:C.grove }}>
                Grow <span style={{ color:C.field, fontWeight:700, letterSpacing:"0.14em", fontSize:10 }}>BY XCADO</span>
              </span>
            </div>
            <span style={{ color:C.border, fontSize:16 }}>/</span>
            <span style={{ fontWeight:700, color:C.ink, fontSize:13 }}>{[...NAV_OPS, ...NAV, ...NAV_PREV].find(n=>n.id===page)?.label}</span>
          </div>

          {/* Right — tagline pill + badge + avatar */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Brand tagline — hidden on mobile */}
            <div className="grow-header-tagline" style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px 4px 8px",
              borderRadius:20, background:C.grove, border:`1px solid ${C.field}` }}>
              <XGrowMark size={16} bg="none" stroke={C.lime} tip={C.lime}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12,
                color:C.lime, letterSpacing:0.4 }}>Grow. Further.</span>
            </div>
            {/* Section badge — hidden on mobile */}
            <div className="grow-header-sprint-badge" style={{ fontSize:11, padding:"4px 10px", borderRadius:20,
              background:`${C.shoot}15`, color:C.shoot, fontWeight:600 }}>
              {NAV_OPS.some(n=>n.id===page) ? "Operations"
                : NAV.some(n=>n.id===page) ? "Route to Market · Sprint 5"
                : "Platform Modules"}
            </div>
            {/* Avatar */}
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.field,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:11, fontWeight:800, color:"#F5F1E8", fontFamily:"'Barlow Condensed',sans-serif" }}>GW</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="grow-main" style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            {page==="dashboard"    && <Dashboard />}
            {page==="training"     && <TrainingHub />}
            {page==="traceability" && <Traceability />}
            {page==="settings"     && <Settings />}
            {page==="marketplace"  && <Marketplace />}
            {page==="supplychain"  && <SupplyChain />}
            {page==="compliance"   && <ComplianceCerts />}
            {page==="ai"           && <AIIntelligence />}
            {page==="farmers"      && <FarmerRegistry />}
            {page==="trade"        && <TradeAssessment />}
            {page==="saas"         && <SaaSSubscriptions />}
            {page==="weather"      && <WeatherFields />}
            {page==="supplier"     && <SupplierRBAC />}
            {page==="analytics"    && <AnalyticsSDG />}
            {page==="comms"        && <CommunicationsHub />}
            {page==="mobile"       && <FlutterMobileApp />}
          </div>
        </main>
      </div>
    </div>
  );
}
