import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// XGROW Brand: Grove #0F3D20, Field #1E7A3E, Shoot #5BB35E, Lime #9DD96A
// Harvest #E8A020, Earth #7A4E2D, Chalk #F5F1E8, Ink #0C1A0E
// Fonts: Barlow Condensed 800 + Outfit  |  Tagline: Grow. Further.
// Domain: xgrow.xcado.africa  |  Database: xgrow_db

const G = {
  grove:"#0F3D20", field:"#1E7A3E", shoot:"#5BB35E", lime:"#9DD96A",
  harvest:"#E8A020", earth:"#7A4E2D", chalk:"#F5F1E8", ink:"#0C1A0E",
  card:"#FFFFFF", border:"#DDD8D0", mist:"#F5F2EC", slate:"#5A6A7A"
};

const Badge = ({ label, color=G.field }) => (
  <span style={{ display:"inline-flex", alignItems:"center", fontWeight:700, borderRadius:20,
    padding:"2px 9px", fontSize:11, background:`${color}20`, color, border:`1px solid ${color}30` }}>
    {label}
  </span>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:G.card, borderRadius:14, border:`1px solid ${G.border}`,
    boxShadow:"0 1px 4px rgba(12,26,14,0.05)", ...style }}>
    {children}
  </div>
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

const COUNTY_DATA = [
  { name:"Murang'a", produce:"Avocado Oil", gmv:2.4, color:G.field  },
  { name:"Nyeri",    produce:"Coffee AA",   gmv:3.1, color:G.grove  },
  { name:"Kericho",  produce:"Purple Tea",  gmv:4.2, color:G.earth  },
  { name:"Meru",     produce:"Macadamia",   gmv:2.8, color:G.harvest},
  { name:"Homa Bay", produce:"Nile Perch",  gmv:1.8, color:G.shoot  },
  { name:"Isiolo",   produce:"Moringa",     gmv:0.9, color:G.lime   },
];

const SACCOS = [
  { name:"Sunrise SACCO",             county:"Kiambu",  members:1240, plan:"Growth",     certified:true  },
  { name:"Mt Kenya SACCO",            county:"Nyeri",   members:880,  plan:"Enterprise", certified:true  },
  { name:"Lake Basin Co-op",          county:"Kisumu",  members:2100, plan:"Growth",     certified:false },
  { name:"Rift Valley Farmers SACCO", county:"Nakuru",  members:560,  plan:"Starter",    certified:false },
];

const PRICES = [
  { commodity:"Avocado Oil",   unit:"litre", farmKES:620,  fobUSD:8.50,  trend:"up"    },
  { commodity:"Coffee AA",     unit:"kg",    farmKES:410,  fobUSD:4.20,  trend:"up"    },
  { commodity:"Purple Tea",    unit:"kg",    farmKES:1200, fobUSD:18.00, trend:"up"    },
  { commodity:"Macadamia",     unit:"kg",    farmKES:850,  fobUSD:9.80,  trend:"up"    },
  { commodity:"Moringa Powder",unit:"kg",    farmKES:980,  fobUSD:12.50, trend:"up"    },
  { commodity:"Camel Milk",    unit:"litre", farmKES:290,  fobUSD:3.20,  trend:"stable"},
];

const CERTIFICATIONS = [
  "GlobalG.A.P.","Organic EU","Fairtrade","KEPHIS Phytosanitary",
  "ISO 22000","USDA Organic","Rainforest Alliance","Halal Certification"
];

const NAV = [
  { id:"dash",      icon:"🏠", label:"Dashboard"       },
  { id:"saccos",    icon:"🤝", label:"SACCOs & Co-ops"  },
  { id:"market",    icon:"📊", label:"Market Prices"    },
  { id:"certified", icon:"⭐", label:"Xcado Certified"  },
];

export default function App() {
  const [page, setPage] = useState("dash");

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Outfit','DM Sans',sans-serif", background:G.chalk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Outfit:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box }
        button { font-family:'Outfit',sans-serif }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width:220, background:G.grove, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:800,
            color:G.lime, margin:0, letterSpacing:-0.5 }}>XGROW</p>
          <p style={{ fontSize:10, color:"rgba(157,217,106,0.5)", margin:"2px 0 0", letterSpacing:"0.1em" }}>
            GROW. FURTHER.
          </p>
        </div>
        <div style={{ padding:10, flex:1 }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width:"100%", display:"flex", gap:10, alignItems:"center",
                padding:"9px 10px", borderRadius:10, marginBottom:2, cursor:"pointer",
                background: active ? "rgba(157,217,106,0.15)" : "transparent",
                border: active ? "1px solid rgba(157,217,106,0.3)" : "1px solid transparent",
                borderLeft: active ? `3px solid ${G.lime}` : "3px solid transparent",
                color: active ? G.lime : "rgba(157,217,106,0.45)",
                fontSize:13, fontWeight: active ? 700 : 500, textAlign:"left"
              }}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize:10, color:"rgba(157,217,106,0.4)", margin:"0 0 4px" }}>xgrow.xcado.africa</p>
          <p style={{ fontSize:11, fontWeight:700, color:G.lime }}>Sprint 1 — Foundation</p>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, padding:24, overflowY:"auto" }}>

        {/* DASHBOARD */}
        {page === "dash" && (
          <>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, color:G.grove, margin:"0 0 4px", fontWeight:800 }}>
              XCADO Limited Dashboard
            </h2>
            <p style={{ color:G.slate, fontSize:13, margin:"0 0 20px" }}>Real-time overview of your export operations</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              <Kpi icon="👩‍🌾" label="Registered Farmers" value="0"          sub="across 0 counties"        color={G.field}   />
              <Kpi icon="📦" label="Active Listings"      value="0"          sub="0 drafts, 0 expired"       color={G.harvest} />
              <Kpi icon="💰" label="GMV This Month"       value="KES 0"      sub="0 completed orders"        color={G.shoot}   />
              <Kpi icon="🏦" label="Escrow In-Flight"     value="KES 0"      sub="0 active orders"           color={G.earth}   />
              <Kpi icon="⭐" label="Rating"               value="No reviews" sub="0 reviews"                 color={G.harvest} />
              <Kpi icon="✅" label="Verification"         value="Unverified" sub="Complete for full access"  color={G.grove}   />
            </div>
            <Card style={{ padding:20, marginBottom:16 }}>
              <p style={{ fontWeight:800, color:G.grove, margin:"0 0 14px",
                fontFamily:"'Barlow Condensed',sans-serif", fontSize:18 }}>
                County GMV Breakdown (USD M)
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={COUNTY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G.border}/>
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:G.slate }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:10, fill:G.slate }} axisLine={false} tickLine={false}/>
                  <Tooltip formatter={v => [`USD ${v}M`, "GMV"]} contentStyle={{ borderRadius:10, border:"none" }}/>
                  <Bar dataKey="gmv" radius={[6,6,0,0]}>
                    {COUNTY_DATA.map((d,i) => <Cell key={i} fill={d.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Card style={{ padding:16 }}>
                <p style={{ fontWeight:800, color:G.grove, margin:"0 0 10px",
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:16 }}>Action Items</p>
                {[{ icon:"⚠️", text:"Complete verification for full market access" },
                  { icon:"📋", text:"Create your first produce listing" },
                  { icon:"🤝", text:"Connect with a buyer via the Trade Exchange" }].map((a,i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"8px 0",
                    borderBottom:`1px solid ${G.border}80` }}>
                    <span style={{ fontSize:14 }}>{a.icon}</span>
                    <span style={{ fontSize:12, color:G.slate }}>{a.text}</span>
                  </div>
                ))}
              </Card>
              <Card style={{ padding:16 }}>
                <p style={{ fontWeight:800, color:G.grove, margin:"0 0 10px",
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:16 }}>Platform Overview</p>
                {[["Active Processors","8"],["Verified Buyers","15"],["Counties Covered","12"],["Certifications Tracked","8"]].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between",
                    padding:"6px 0", borderBottom:`1px solid ${G.border}80`, fontSize:12 }}>
                    <span style={{ color:G.slate }}>{k}</span>
                    <span style={{ fontWeight:700, color:G.grove }}>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        {/* SACCOS */}
        {page === "saccos" && (
          <>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, color:G.grove,
              margin:"0 0 4px", fontWeight:800 }}>SACCO & Co-op Directory</h2>
            <p style={{ color:G.slate, fontSize:13, margin:"0 0 20px" }}>
              Registered organisations on the XGROW platform
            </p>
            {SACCOS.map(s => (
              <Card key={s.name} style={{ padding:"14px 18px", marginBottom:10,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                    <p style={{ fontWeight:700, color:G.grove, margin:0, fontSize:14 }}>{s.name}</p>
                    {s.certified && <Badge label="⭐ Xcado Certified" color={G.harvest}/>}
                    <Badge label={s.plan}/>
                  </div>
                  <p style={{ fontSize:12, color:G.slate, margin:0 }}>
                    📍 {s.county} County · {s.members.toLocaleString()} members
                  </p>
                </div>
                <button style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${G.field}`,
                  background:"transparent", color:G.field, cursor:"pointer",
                  fontWeight:700, fontSize:12 }}>
                  View Profile →
                </button>
              </Card>
            ))}
          </>
        )}

        {/* MARKET PRICES */}
        {page === "market" && (
          <>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, color:G.grove,
              margin:"0 0 4px", fontWeight:800 }}>Market Prices — Live</h2>
            <p style={{ color:G.slate, fontSize:13, margin:"0 0 20px" }}>
              Farm gate vs FOB Mombasa · Refreshed every 15 minutes
            </p>
            <Card style={{ overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:G.grove }}>
                    {["Commodity","Unit","Farm Gate (KES)","FOB Mombasa (USD)","Trend","Export Premium"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11,
                        fontWeight:700, color:G.lime, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRICES.map((p,i) => {
                    const premium = Math.round(((p.fobUSD * 130) - p.farmKES) / p.farmKES * 100);
                    return (
                      <tr key={p.commodity} style={{ borderBottom:`1px solid ${G.border}`,
                        background:i%2===0?G.card:G.mist }}>
                        <td style={{ padding:"10px 14px", fontWeight:700, color:G.grove }}>{p.commodity}</td>
                        <td style={{ padding:"10px 14px", color:G.slate }}>/{p.unit}</td>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", fontWeight:700 }}>
                          KES {p.farmKES.toLocaleString()}
                        </td>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", fontWeight:800, color:G.field }}>
                          USD {p.fobUSD.toFixed(2)}
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <Badge label={p.trend==="up" ? "↑ Rising" : "→ Stable"}
                            color={p.trend==="up" ? G.shoot : G.slate}/>
                        </td>
                        <td style={{ padding:"10px 14px", fontWeight:800, color:G.harvest }}>
                          +{premium}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* XCADO CERTIFIED */}
        {page === "certified" && (
          <>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, color:G.grove,
              margin:"0 0 8px", fontWeight:800 }}>Xcado Certified Programme</h2>
            <p style={{ color:G.slate, fontSize:13, margin:"0 0 20px", lineHeight:1.6, maxWidth:560 }}>
              Xcado Certified is the platform's quality and compliance mark. Processors who achieve it
              unlock priority placement in the Trade Catalogue, AI matching priority, and reduced escrow fees.
            </p>
            {CERTIFICATIONS.map(cert => (
              <Card key={cert} style={{ padding:"12px 16px", marginBottom:8,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${G.field}15`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📜</div>
                  <div>
                    <p style={{ fontWeight:700, color:G.grove, margin:0 }}>{cert}</p>
                    <p style={{ fontSize:11, color:G.slate, margin:0 }}>Required for EU / UK / USA market access</p>
                  </div>
                </div>
                <Badge label="Track Status" color={G.field}/>
              </Card>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
