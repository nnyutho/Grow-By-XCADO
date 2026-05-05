import { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell, PieChart, Pie
} from "recharts";

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
// Tile that wraps the official Xcado logo PNG. `bg="none"` renders the bare
// logo (e.g. on light surfaces). Default renders a dark-green rounded tile.
const XGrowMark = ({ size=36, bg="#0F3D20", stroke="#F5F1E8", tip="#9DD96A", rx=13 }) => (
  <span style={{
    width:size, height:size, borderRadius:rx, flexShrink:0,
    background: bg === "none" ? "transparent" : bg,
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    border: bg === "none" ? "none" : `1px solid ${stroke}1A`,
  }}>
    <img
      src="/xcado-logo-mark.png"
      alt="Xcado"
      style={{ width: size * 0.78, height: size * 0.78, objectFit:"contain", display:"block" }}
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
// NAV + APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"marketplace", icon:"🛒", label:"Marketplace",        tag:"New" },
  { id:"supplychain",  icon:"🚚", label:"Supply Chain",       tag:"New" },
  { id:"compliance",   icon:"✅", label:"Compliance & Certs", tag:"New" },
  { id:"ai",           icon:"🤖", label:"AI Intelligence",    tag:"New" },
];

const PREV_BUILT = [
  ["👥","Farmer Registry + Signup"],
  ["📈","Trade Assessment"],
  ["💎","SaaS Subscriptions"],
  ["🌤️","Weather & Fields"],
  ["🏭","Supplier & RBAC"],
  ["📊","Analytics & SDG M&E"],
  ["💬","Communications Hub"],
  ["📱","Flutter Mobile App"],
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Sprint5() {
  const [page, setPage] = useState("marketplace");

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

      {/* ── SIDEBAR ── */}
      <aside style={{ width:252, flexShrink:0, display:"flex", flexDirection:"column", background:C.grove, borderRight:"1px solid rgba(255,255,255,0.06)" }}>

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
          <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", padding:"8px 10px 5px", color:"rgba(255,255,255,0.22)", fontFamily:"'Outfit',sans-serif" }}>
            Route to Market · Sprint 5
          </p>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
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

          {/* Previously built */}
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em",
              padding:"0 10px 5px", color:"rgba(255,255,255,0.18)" }}>Previously Built</p>
            {PREV_BUILT.map(([icon, label]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 10px",
                fontSize:11, color:"rgba(245,241,232,0.2)" }}>
                <span style={{ fontSize:12, opacity:0.4 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
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
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <XGrowMark size={22} rx={6}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, letterSpacing:-0.3, color:C.grove }}>
                Grow <span style={{ color:C.field, fontWeight:700, letterSpacing:"0.14em", fontSize:10 }}>BY XCADO</span>
              </span>
            </div>
            <span style={{ color:C.border, fontSize:16 }}>/</span>
            <span style={{ fontWeight:700, color:C.ink, fontSize:13 }}>{NAV.find(n=>n.id===page)?.label}</span>
          </div>

          {/* Right — tagline pill + badge + avatar */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Brand tagline */}
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px 4px 8px",
              borderRadius:20, background:C.grove, border:`1px solid ${C.field}` }}>
              <XGrowMark size={16} bg="none" stroke={C.lime} tip={C.lime}/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12,
                color:C.lime, letterSpacing:0.4 }}>Grow. Further.</span>
            </div>
            {/* Sprint badge */}
            <div style={{ fontSize:11, padding:"4px 10px", borderRadius:20,
              background:`${C.shoot}15`, color:C.shoot, fontWeight:600 }}>
              Route to Market · Sprint 5
            </div>
            {/* Avatar */}
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.field,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:11, fontWeight:800, color:"#F5F1E8", fontFamily:"'Barlow Condensed',sans-serif" }}>GW</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            {page==="marketplace" && <Marketplace />}
            {page==="supplychain" && <SupplyChain />}
            {page==="compliance"  && <ComplianceCerts />}
            {page==="ai"          && <AIIntelligence />}
          </div>
        </main>
      </div>
    </div>
  );
}
