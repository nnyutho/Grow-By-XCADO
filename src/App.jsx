import UnifiedApp from './Sprint5.jsx'

// ── Grow by XCADO — App Shell ────────────────────────────────────────────────
// Unified single-app: all 16 modules accessible from one sidebar:
//   Operations           — Dashboard · Training · Traceability · Settings
//   Route to Market      — Marketplace · Supply Chain · Compliance · AI
//   Platform Modules     — Farmer Registry · Trade · SaaS · Weather
//                          Supplier & RBAC · Analytics & SDG · Comms · Mobile
// (Sprint5.jsx is the unified shell; Sprint6.jsx exports its 4 module
//  functions which Sprint5 imports and renders.)

export default function App() {
  return <UnifiedApp />
}
