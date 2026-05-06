import { useState } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// XGROW Sprint 5 — Marketplace · Supply Chain · Compliance · AI Intelligence
// Bug fixed: Marketplace() function wrapper and LISTINGS/ORDERS/PRICE_TRENDS
// constants were dropped during original assembly. Restored via str_replace.
// Brand: Grove #0F3D20  Field #1E7A3E  Lime #9DD96A  Harvest #E8A020

const G = {
  grove:"#0F3D20", field:"#1E7A3E", shoot:"#5BB35E", lime:"#9DD96A",
  harvest:"#E8A020", earth:"#7A4E2D", chalk:"#F5F1E8", ink:"#0C1A0E",
  card:"#FFFFFF", border:"#DDD8D0", mist:"#F5F2EC", slate:"#5A6A7A",
  crimson:"#C0392B", amber:"#E8850A", sky:"#1E6B8A"
};

const Badge = ({ label, color=G.field, size="sm" }) => (
  <span style={{ display:"inline-flex", alignItems:"center", fontWeight:700, borderRadius:20,
    padding:size==="sm"?"2px 8px":"4px 12px", fontSize:size==="sm"?11:13,
    background:`${color}20`, color, border:`1px solid ${color}30` }}>{label}</span>
);
const Card = ({ children, style={} }) => (
  <div style={{ background:G.card, borderRadius:14, border:`1px solid ${G.border}`,
    boxShadow:"0 1px 4px rgba(12,26,14,0.05)", ...style }}>{children}</div>
);
const Kpi = ({ icon, label, value, sub, color=G.field }) => (
  <Card style={{ padding:"16px 18px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:G.slate }}>{label}</span>
    </div>
    <p style={{ fontSize:24, fontWeight:800, color, margin:"0 0 2px", fontFamily:"'Barlow Condensed',sans-serif" }}>{value}</p>
    {sub && <p style={{ fontSize:11, color:G.slate, margin:0 }}>{sub}</p>}
  </Card>
);
const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom:20 }}>
    <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26,
      color:G.grove, margin:"0 0 4px" }}>{children}</h2>
    {sub && <p style={{ color:G.slate, fontSize:13, margin:0 }}>{sub}</p>}
  </div>
);

// ── LISTINGS DATA (restored — was accidentally dropped in original assembly) ──
const LISTINGS = [
  { id:"L001", processorId:"P001", product:"Cold-Pressed Avocado Oil",   county:"Murang'a",  qtyKg:4200,  priceUSD:8.50,  unit:"litre", grade:"A+", certifications:["Organic EU","GlobalG.A.P.","KEPHIS"],  status:"Active",  moq:200,  leadDays:14, flag:"🥑" },
  { id:"L002", processorId:"P002", product:"Green Bean Coffee AA",        county:"Nyeri",     qtyKg:8500,  priceUSD:4.20,  unit:"kg",    grade:"AA", certifications:["Fairtrade","Rainforest Alliance","UTZ"],  status:"Active",  moq:250,  leadDays:10, flag:"☕" },
  { id:"L003", processorId:"P007", product:"Purple Tea Loose Leaf",       county:"Kericho",   qtyKg:800,   priceUSD:18.00, unit:"kg",    grade:"SP", certifications:["Organic EU","KTDA","Rainforest"],        status:"Active",  moq:100,  leadDays:7,  flag:"🍵" },
  { id:"L004", processorId:"P006", product:"Macadamia Kernel Style 1",    county:"Meru",      qtyKg:2600,  priceUSD:9.80,  unit:"kg",    grade:"A+", certifications:["Fairtrade","ISO 22000","KEPHIS"],       status:"Active",  moq:500,  leadDays:10, flag:"🥜" },
  { id:"L005", processorId:"P008", product:"Organic Moringa Powder",      county:"Isiolo",    qtyKg:640,   priceUSD:12.50, unit:"kg",    grade:"A",  certifications:["USDA Organic","KEPHIS"],                 status:"Limited", moq:50,   leadDays:21, flag:"🌿" },
  { id:"L006", processorId:"P005", product:"UHT Camel Milk",              county:"Marsabit",  qtyKg:3400,  priceUSD:3.20,  unit:"litre", grade:"A",  certifications:["Halal","KEBS"],                         status:"Active",  moq:500,  leadDays:14, flag:"🐪" },
];

// ── ORDERS DATA (restored) ──
const ORDERS = [
  { id:"ORD-001", listingId:"L001", buyer:"Meridian Foods UK",       qtyKg:1200, totalUSD:10200, status:"Dispatched",  escrow:"Released", date:"Apr 24" },
  { id:"ORD-002", listingId:"L002", buyer:"Specialty Roasters JP",   qtyKg:2000, totalUSD:8400,  status:"In Transit",  escrow:"Held",     date:"Apr 22" },
  { id:"ORD-003", listingId:"L003", buyer:"BioSource Netherlands",   qtyKg:500,  totalUSD:9000,  status:"Confirmed",   escrow:"Funded",   date:"Apr 26" },
  { id:"ORD-004", listingId:"L004", buyer:"African Roots Canada",    qtyKg:800,  totalUSD:7840,  status:"Delivered",   escrow:"Released", date:"Apr 18" },
];

// ── PRICE TRENDS DATA (restored) ──
const MONTHS = ["May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
const PRICE_TRENDS = MONTHS.map((m,i) => ({
  m,
  avocado: [8.1,8.2,8.3,8.45,8.5,8.6,8.65,8.55,8.40,8.35,8.42,8.50][i],
  coffee:  [3.9,4.0,4.1,4.15,4.20,4.25,4.22,4.18,4.15,4.18,4.20,4.28][i],
  moringa: [11.5,11.8,12.0,12.2,12.5,12.8,12.7,12.6,12.5,12.5,12.5,12.6][i],
}));

const SUPPLY_STAGES = [
  { stage:"Farm Harvest",    icon:"🌱", color:G.lime    },
  { stage:"KEPHIS Inspect",  icon:"🔬", color:G.field   },
  { stage:"Packhouse",       icon:"🏭", color:G.harvest },
  { stage:"Xcado QC Seal",   icon:"⭐", color:G.earth   },
  { stage:"Port Loading",    icon:"⚓", color:G.sky     },
  { stage:"Vessel",          icon:"🚢", color:G.grove   },
];

const CERTS = [
  { org:"Murang'a Avocado Pressers", cert:"GlobalG.A.P.", status:"Certified",   expiry:"Dec 2025", daysLeft:235, flag:"🥑" },
  { org:"Murang'a Avocado Pressers", cert:"Organic EU",   status:"Certified",   expiry:"Mar 2026", daysLeft:330, flag:"🥑" },
  { org:"Kilifi Coconut Processors", cert:"ISO 22000",    status:"Renewal Due", expiry:"Jun 2025", daysLeft:45,  flag:"🥥" },
  { org:"Lake Vic Fish Fillets",     cert:"HACCP",        status:"Lapsed",      expiry:"Mar 2025", daysLeft:0,   flag:"🐟" },
  { org:"Nyeri Highlands Coffee",    cert:"Fairtrade",    status:"Certified",   expiry:"Jan 2026", daysLeft:280, flag:"☕" },
  { org:"Kericho Purple Tea",        cert:"Rainforest",   status:"Certified",   expiry:"Apr 2026", daysLeft:360, flag:"🍵" },
];

const AI_INSIGHTS = [
  { icon:"📈", title:"Moringa demand surge",    body:"28 buyer signals in 7 days — 45% above 30-day avg. Recommend raising listing price 8%.",          urgency:"high"   },
  { icon:"🌾", title:"Avocado yield forecast",  body:"Murang'a County: projected 15% yield increase in May flush. Secure buyers now at current FOB.",   urgency:"medium" },
  { icon:"⏰", title:"Purple Tea peak flush",   body:"Apr–May is premium flush season. KTDA data shows 12% quality uplift during this window.",           urgency:"medium" },
  { icon:"🚢", title:"Red Sea rerouting alert", body:"EU-bound shipping adding 11 days via Cape of Good Hope. Processed goods (oil, powder) unaffected.", urgency:"low"    },
  { icon:"💱", title:"Coffee FOB momentum",     body:"Nyeri AA tracking USD 4.28/kg — 2% above listed price. Tokyo auction premium opportunity.",        urgency:"medium" },
];

// ── MODULE: MARKETPLACE ───────────────────────────────────────────────────────
function Marketplace() {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Oils","Beverages","Nuts","Superfoods","Dairy"];
  const visible = filter === "All" ? LISTINGS : LISTINGS.filter(l =>
    (filter==="Oils"      && (l.product.includes("Oil")))
    ||(filter==="Beverages" && (l.product.includes("Coffee")||l.product.includes("Tea")))
    ||(filter==="Nuts"      && l.product.includes("Macadamia"))
    ||(filter==="Superfoods"&& l.product.includes("Moringa"))
    ||(filter==="Dairy"     && l.product.includes("Milk"))
  );
  const totalGMV = LISTINGS.reduce((s,l) => s + l.qtyKg*l.priceUSD, 0);

  return (
    <div>
      <SectionTitle sub="Verified produce listings · FOB Mombasa pricing · One-click enquiry">
        🛒 XGROW Marketplace
      </SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <Kpi icon="📦" label="Active Listings"  value={LISTINGS.length}  sub="verified produce"        color={G.field}   />
        <Kpi icon="📋" label="Open Orders"      value={ORDERS.length}    sub="in pipeline"             color={G.harvest} />
        <Kpi icon="💰" label="Available Value"  value={`USD ${(totalGMV/1000).toFixed(0)}K`} sub="total inventory" color={G.shoot} />
        <Kpi icon="⭐" label="Certified Stock"  value={LISTINGS.filter(l=>l.certifications.length>2).length} sub="multi-cert" color={G.earth} />
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer",
            border:`1px solid ${filter===c?G.field:G.border}`,
            background:filter===c?`${G.field}12`:G.card,
            color:filter===c?G.field:G.slate, fontFamily:"'Outfit',sans-serif"
          }}>{c}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {visible.map(l => (
          <Card key={l.id} style={{ overflow:"hidden" }}>
            <div style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:26 }}>{l.flag}</span>
                <Badge label={l.status} color={l.status==="Active"?G.field:G.amber}/>
              </div>
              <p style={{ fontSize:13, fontWeight:700, color:G.grove, margin:"0 0 2px", lineHeight:1.2 }}>{l.product}</p>
              <p style={{ fontSize:11, color:G.slate, margin:"0 0 8px" }}>📍 {l.county} · Grade {l.grade}</p>
              <p style={{ fontSize:20, fontWeight:800, color:G.harvest, margin:"0 0 4px",
                fontFamily:"'Barlow Condensed',sans-serif" }}>
                USD {l.priceUSD.toFixed(2)}/{l.unit}
              </p>
              <p style={{ fontSize:11, color:G.slate, margin:"0 0 8px" }}>
                {(l.qtyKg/1000).toFixed(1)}T available · MOQ {l.moq} {l.unit}s
              </p>
              <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:10 }}>
                {l.certifications.slice(0,2).map(c => <Badge key={c} label={c} color={G.field}/>)}
                {l.certifications.length>2 && <Badge label={`+${l.certifications.length-2}`} color={G.slate}/>}
              </div>
              <button style={{ width:"100%", padding:"7px", borderRadius:8, background:G.field,
                color:"#fff", border:"none", fontWeight:700, fontSize:12, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif" }}>Enquire →</button>
            </div>
          </Card>
        ))}
      </div>
      <p style={{ fontWeight:800, color:G.grove, margin:"0 0 10px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18 }}>
        Recent Orders
      </p>
      <Card style={{ overflow:"hidden", marginBottom:24 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:G.grove }}>
              {["Order","Product","Buyer","Volume","Value","Escrow","Status"].map(h => (
                <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10,
                  fontWeight:700, color:G.lime, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o,i) => {
              const l = LISTINGS.find(ls => ls.id === o.listingId);
              return (
                <tr key={o.id} style={{ borderBottom:`1px solid ${G.border}`, background:i%2===0?G.card:G.mist }}>
                  <td style={{ padding:"8px 12px", fontFamily:"monospace", fontSize:11, color:G.sky }}>{o.id}</td>
                  <td style={{ padding:"8px 12px", fontWeight:700, color:G.grove }}>{l?.flag} {l?.product?.split(" ").slice(0,2).join(" ")}</td>
                  <td style={{ padding:"8px 12px", fontSize:12, color:G.slate }}>{o.buyer}</td>
                  <td style={{ padding:"8px 12px", fontFamily:"monospace" }}>{(o.qtyKg/1000).toFixed(1)}T</td>
                  <td style={{ padding:"8px 12px", fontFamily:"monospace", fontWeight:700, color:G.harvest }}>USD {o.totalUSD.toLocaleString()}</td>
                  <td style={{ padding:"8px 12px" }}><Badge label={o.escrow} color={o.escrow==="Released"?G.field:o.escrow==="Held"?G.amber:G.shoot}/></td>
                  <td style={{ padding:"8px 12px" }}><Badge label={o.status} color={o.status==="Delivered"?G.field:o.status==="Dispatched"?G.shoot:G.harvest}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <p style={{ fontWeight:800, color:G.grove, margin:"0 0 10px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18 }}>
        12-Month FOB Price Trends (USD/kg)
      </p>
      <Card style={{ padding:20 }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={PRICE_TRENDS}>
            <CartesianGrid strokeDasharray="3 3" stroke={G.border}/>
            <XAxis dataKey="m" tick={{ fontSize:10, fill:G.slate }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:10, fill:G.slate }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ borderRadius:10, border:"none" }}/>
            <Line type="monotone" dataKey="avocado" name="Avocado Oil" stroke={G.field}   strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="coffee"  name="Coffee AA"   stroke={G.harvest} strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="moringa" name="Moringa"     stroke={G.shoot}   strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── MODULE: SUPPLY CHAIN ──────────────────────────────────────────────────────
function SupplyChain() {
  const [selected, setSelected] = useState(ORDERS[1]);
  const stageIndex = (status) => {
    const map = { "Confirmed":1,"Escrow Funded":2,"Quality Check":2,"Dispatched":3,"In Transit":4,"Delivered":5 };
    return map[status]||0;
  };
  return (
    <div>
      <SectionTitle sub="Farm → packhouse → port → vessel · Real-time stage tracking">
        🚚 Supply Chain Tracker
      </SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:16 }}>
        <div>
          {ORDERS.map(o => (
            <div key={o.id} onClick={() => setSelected(o)} style={{
              padding:"12px 14px", borderRadius:12, marginBottom:6, cursor:"pointer",
              border:`1.5px solid ${selected?.id===o.id?G.field:G.border}`,
              background:selected?.id===o.id?`${G.field}08`:G.card }}>
              <p style={{ fontSize:12, fontWeight:700, color:G.grove, margin:"0 0 2px" }}>
                {LISTINGS.find(l=>l.id===o.listingId)?.flag} {o.buyer.split(" ").slice(0,2).join(" ")}
              </p>
              <p style={{ fontSize:11, color:G.slate, margin:"0 0 4px", fontFamily:"monospace" }}>{o.id}</p>
              <Badge label={o.status} color={o.status==="Delivered"?G.field:o.status==="In Transit"?G.shoot:G.harvest}/>
            </div>
          ))}
        </div>
        {selected && (
          <Card style={{ padding:22 }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, color:G.grove,
              margin:"0 0 4px", fontWeight:800 }}>Order {selected.id}</p>
            <p style={{ fontSize:12, color:G.slate, margin:"0 0 20px" }}>
              {selected.buyer} · USD {selected.totalUSD.toLocaleString()}
            </p>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:14, top:8, bottom:8, width:2, background:G.border }}/>
              {SUPPLY_STAGES.map((stage, i) => {
                const done = i <= stageIndex(selected.status);
                return (
                  <div key={stage.stage} style={{ display:"flex", gap:12, marginBottom:14, position:"relative", zIndex:1 }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                      background:done?stage.color:G.border,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                      {done ? stage.icon : "○"}
                    </div>
                    <div style={{ padding:"4px 0" }}>
                      <p style={{ fontSize:13, fontWeight:700, color:done?G.grove:G.slate, margin:0 }}>{stage.stage}</p>
                      <p style={{ fontSize:11, color:G.slate, margin:0 }}>{done ? "✓ Completed" : "Pending"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── MODULE: COMPLIANCE TRACKER ────────────────────────────────────────────────
function ComplianceTracker() {
  const alerts = CERTS.filter(c => c.status === "Renewal Due" || c.status === "Lapsed");
  const certColor = s => s==="Certified"?G.field:s==="Renewal Due"?G.amber:G.crimson;
  return (
    <div>
      <SectionTitle sub="Certification status · Expiry alerts · KEPHIS · GlobalG.A.P. · Organic EU">
        🛡️ Compliance Tracker
      </SectionTitle>
      {alerts.length > 0 && (
        <div style={{ padding:"12px 16px", borderRadius:12, background:`${G.crimson}08`,
          border:`1px solid ${G.crimson}25`, marginBottom:16 }}>
          <p style={{ fontWeight:700, color:G.crimson, margin:"0 0 6px" }}>
            ⚠️ {alerts.length} Certification(s) require immediate action
          </p>
          {alerts.map(a => (
            <p key={a.cert+a.org} style={{ fontSize:12, color:G.grove, margin:"2px 0" }}>
              • {a.flag} {a.org} — {a.cert} {a.status==="Lapsed" ? "has lapsed" : `expires in ${a.daysLeft} days`}
            </p>
          ))}
        </div>
      )}
      <Card style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:G.grove }}>
              {["Organisation","Certification","Status","Expiry","Days Left","Action"].map(h => (
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:10,
                  fontWeight:700, color:G.lime, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CERTS.map((c, i) => (
              <tr key={c.cert+c.org} style={{ borderBottom:`1px solid ${G.border}`,
                background:i%2===0?G.card:G.mist }}>
                <td style={{ padding:"10px 14px", fontWeight:700, color:G.grove }}>{c.flag} {c.org}</td>
                <td style={{ padding:"10px 14px" }}>{c.cert}</td>
                <td style={{ padding:"10px 14px" }}><Badge label={c.status} color={certColor(c.status)}/></td>
                <td style={{ padding:"10px 14px", fontSize:12, color:G.slate }}>{c.expiry}</td>
                <td style={{ padding:"10px 14px", fontWeight:800, color:certColor(c.status),
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:18 }}>
                  {c.daysLeft || "LAPSED"}
                </td>
                <td style={{ padding:"10px 14px" }}>
                  <button style={{ padding:"5px 10px", borderRadius:6, fontSize:11, fontWeight:700,
                    cursor:"pointer", border:`1px solid ${certColor(c.status)}`,
                    background:"transparent", color:certColor(c.status), fontFamily:"'Outfit',sans-serif" }}>
                    {c.status==="Lapsed"?"Renew Now":"Manage"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── MODULE: AI INTELLIGENCE ───────────────────────────────────────────────────
function AIIntelligence() {
  const urgColor = u => u==="high"?G.crimson:u==="medium"?G.amber:G.field;
  return (
    <div>
      <SectionTitle sub="Demand forecasting · Yield prediction · Harvest timing · Price momentum">
        🤖 AI Intelligence
      </SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <Kpi icon="📡" label="Active Signals"  value={AI_INSIGHTS.length}                                color={G.crimson}/>
        <Kpi icon="🔴" label="High Priority"   value={AI_INSIGHTS.filter(a=>a.urgency==="high").length} color={G.crimson}/>
        <Kpi icon="⭐" label="Model Accuracy"  value="87.4%"                                             color={G.field}  />
      </div>
      {AI_INSIGHTS.map((ins, i) => (
        <div key={i} style={{ padding:"14px 18px", borderRadius:12, marginBottom:10,
          background:`${urgColor(ins.urgency)}06`,
          border:`1px solid ${urgColor(ins.urgency)}20`,
          borderLeft:`4px solid ${urgColor(ins.urgency)}` }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{ins.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                <p style={{ fontSize:13, fontWeight:700, color:G.grove, margin:0 }}>{ins.title}</p>
                <Badge label={ins.urgency} color={urgColor(ins.urgency)}/>
              </div>
              <p style={{ fontSize:12, color:G.slate, margin:0, lineHeight:1.5 }}>{ins.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── NAV & APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"marketplace", icon:"🛒", label:"Marketplace"       },
  { id:"supply",      icon:"🚚", label:"Supply Chain"       },
  { id:"compliance",  icon:"🛡️", label:"Compliance Tracker" },
  { id:"ai",          icon:"🤖", label:"AI Intelligence"    },
];

export default function App() {
  const [page, setPage] = useState("marketplace");
  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Outfit','DM Sans',sans-serif", background:G.chalk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Outfit:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box } button { font-family:'Outfit',sans-serif }
      `}</style>
      <aside style={{ width:220, background:G.grove, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:800, color:G.lime, margin:0 }}>XGROW</p>
          <p style={{ fontSize:10, color:"rgba(157,217,106,0.5)", margin:"2px 0 0", letterSpacing:"0.1em" }}>GROW. FURTHER. · Sprint 5</p>
        </div>
        <div style={{ padding:10, flex:1 }}>
          {NAV.map(n => {
            const a = page===n.id;
            return <button key={n.id} onClick={()=>setPage(n.id)} style={{
              width:"100%", display:"flex", gap:10, alignItems:"center", padding:"9px 10px",
              borderRadius:10, marginBottom:2, cursor:"pointer",
              background:a?"rgba(157,217,106,0.15)":"transparent",
              border:a?"1px solid rgba(157,217,106,0.3)":"1px solid transparent",
              borderLeft:a?`3px solid ${G.lime}`:"3px solid transparent",
              color:a?G.lime:"rgba(157,217,106,0.45)", fontSize:13, fontWeight:a?700:500, textAlign:"left"
            }}><span>{n.icon}</span><span>{n.label}</span></button>;
          })}
        </div>
      </aside>
      <main style={{ flex:1, padding:24, overflowY:"auto" }}>
        {page==="marketplace" && <Marketplace/>}
        {page==="supply"      && <SupplyChain/>}
        {page==="compliance"  && <ComplianceTracker/>}
        {page==="ai"          && <AIIntelligence/>}
      </main>
    </div>
  );
}
