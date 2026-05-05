import { useState, useEffect } from 'react'
import Sprint5 from './Sprint5.jsx'
import Sprint6 from './Sprint6.jsx'

// ── Grow by XCADO — App Shell ────────────────────────────────────────────────
// Grow is the farmer-side platform of the XCADO Group ecosystem.
// The platform is split across two snapshots:
//   • Sprint 5 — Marketplace / Supply Chain / Compliance / AI Intelligence
//   • Sprint 6 — Dashboard / Training / Traceability / Settings
// The toggle in the top-right lets QA/stakeholders click through every module.
// In production this can be replaced with proper routing.

const STORAGE_KEY = 'grow_active_sprint'

export default function App() {
  const [sprint, setSprint] = useState(() => {
    if (typeof window === 'undefined') return '6'
    return window.localStorage.getItem(STORAGE_KEY) || '6'
  })

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, sprint) } catch {}
  }, [sprint])

  return (
    <div style={{ position: 'relative' }}>
      {/* Sprint switcher — fixed top-right, shows on every page */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: 4,
          borderRadius: 999,
          background: 'rgba(15, 61, 32, 0.92)',
          border: '1px solid rgba(157, 217, 106, 0.35)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
          backdropFilter: 'blur(6px)',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(245, 241, 232, 0.55)',
            padding: '0 8px 0 10px',
          }}
        >
          View
        </span>
        {[
          { id: '5', label: 'Sprint 5' },
          { id: '6', label: 'Sprint 6' },
        ].map((opt) => {
          const active = sprint === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setSprint(opt.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: 'none',
                background: active ? '#9DD96A' : 'transparent',
                color: active ? '#0F3D20' : '#F5F1E8',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {sprint === '5' ? <Sprint5 /> : <Sprint6 />}
    </div>
  )
}
