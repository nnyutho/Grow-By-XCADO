# Grow by XCADO

The farmer-side platform of the **XCADO Group** ecosystem.

Grow gives smallholder farmers, cooperatives, and warehouse aggregators a single
home for marketplace listings, supply-chain visibility, compliance/certification,
training, and end-to-end traceability — with the XCADO export desk acting as the
buy-side counterparty.

> **Tagline:** Grow. Further.

---

## Stack

- **React 18** + **Vite 5** (ES module build)
- **Tailwind CSS 3** with the XCADO brand palette
- **Recharts** for data visualisation
- **Axios** with a mock-API switch (`VITE_USE_MOCK_API`)
- Single-page app — Vercel-ready (`vercel.json`)

## Real seed data

The mock API layer is seeded from real farmer rosters supplied by XCADO:

| Source                                      | Records |
| ------------------------------------------- | ------- |
| Chebarbar Farmers Import (CSV)              | 288     |
| Nandi Subscriber Import (CSV)               | 117     |
| Lessos Sheet 1.0 (XLSX)                     | 119     |
| **Total unique farmers**                    | **524** |

These power the Marketplace, Dashboard, Training, and Traceability modules.
Crops, listings, orders, and shipments are derivative realistic layers built on
top of this real roster.

> Image-only PDFs (Tachasis, Arwos, Sangalo, Kosirai, Lessons) require OCR to
> extract — these are not yet imported. See `DEPLOY.md` for the OCR follow-up
> workflow.

## Local dev

```bash
npm install
cp .env.example .env.local   # tweak VITE_* vars if needed
npm run dev                  # http://localhost:5173
```

## Production build

```bash
npm run build                # outputs to ./dist
npm run preview              # smoke-test the build at :4173
```

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the full GitHub + Vercel walkthrough.

---

© XCADO Group · Grow. Further.
