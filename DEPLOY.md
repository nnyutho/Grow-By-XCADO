# Deploying Grow by XCADO

This guide walks you through publishing Grow by XCADO to GitHub and deploying
it to Vercel.

---

## Prerequisites

- Node.js 18+ and npm (verified with `node -v` / `npm -v`)
- A GitHub account
- A Vercel account (free Hobby tier works)
- `git` installed on your machine

---

## 1. Local sanity check

From the `grow-by-xcado` folder:

```bash
npm install
npm run build
npm run preview     # smoke-test http://localhost:4173
```

A successful build emits these files (sizes approximate):

```
dist/index.html                 ~1.3 kB
dist/assets/index-*.css         ~13  kB
dist/assets/index-*.js          ~116 kB
dist/assets/charts-*.js         ~563 kB
dist/assets/vendor-*.js         ~0.03 kB
```

The recharts/d3 vendor chunk is the heaviest piece - that warning during
build is expected and harmless.

---

## 2. Push to GitHub

### 2a. Initialise the repo

```bash
cd grow-by-xcado
git init
git branch -M main
git add .
git commit -m "Initial commit: Grow by XCADO - farmer-side platform with real seed data"
```

### 2b. Create the GitHub repo

Go to https://github.com/new and create a new **empty** repository named
`grow-by-xcado` (or whatever you prefer). Do **not** add a README/license/.gitignore
- the local repo already has them.

### 2c. Wire up the remote and push

GitHub will show you the exact command after creating the repo. It will look
like one of these depending on your auth setup:

**HTTPS (uses a Personal Access Token):**
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/grow-by-xcado.git
git push -u origin main
```

**SSH (uses an SSH key already on your account):**
```bash
git remote add origin git@github.com:<YOUR_USERNAME>/grow-by-xcado.git
git push -u origin main
```

If you don't have a Personal Access Token: https://github.com/settings/tokens
> Generate a fine-grained token with `Contents: Read and write` for this repo.

---

## 3. Deploy to Vercel

### 3a. Import the repo

1. Go to https://vercel.com/new
2. Click **Import Git Repository**, find `grow-by-xcado`, click **Import**
3. Vercel auto-detects Vite from `vercel.json` - the defaults are correct:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3b. Set environment variables

Under **Environment Variables**, add the values from `.env.example`:

| Key                       | Value                              |
|--------------------------|------------------------------------|
| `VITE_APP_NAME`          | `Grow by XCADO`                    |
| `VITE_APP_VERSION`       | `1.0.0`                            |
| `VITE_APP_ENV`           | `production`                       |
| `VITE_API_BASE_URL`      | (leave blank to use mock data)     |
| `VITE_USE_MOCK_API`      | `true`                             |
| `VITE_TRACE_BASE_URL`    | `https://grow.xcado.africa/trace`  |

When the real backend is ready, flip `VITE_USE_MOCK_API` to `false` and set
`VITE_API_BASE_URL` to your API origin.

### 3c. Deploy

Hit **Deploy**. The first build takes 60-90 seconds. Vercel will give you a
URL like `https://grow-by-xcado.vercel.app`. Every subsequent push to `main`
auto-deploys.

### 3d. (Optional) Custom domain

In the project's **Settings -> Domains**, add `grow.xcado.africa` (or whatever
you choose) and follow the DNS instructions. Vercel will provision an SSL
certificate automatically.

---

## 4. Real data layout

The frontend currently runs on real seed data parsed from XCADO's farmer
rosters:

| Source file                                      | Records imported |
|--------------------------------------------------|------------------|
| `Chebarbar Farmers Import_ver_2 .csv`            | 162              |
| `Chebarbar Farmers Import_ver_2_ (003).csv`      | 126 (deduped)    |
| `Nandi Subscriber Import_ver_2.csv`              | 117              |
| `Lessos Sheet 1.0.xlsx`                          | 119              |
| `Chebarbar.xlsx`                                 | (deduped)        |
| **Unique farmers**                               | **524**          |

Derived layers (crops, listings, orders, shipments) are realistic mock
records built on top of the real farmer roster, with crops drawn from the
real warehouse-to-product mapping (Baraton -> French Beans / Snow Peas /
Sugar Snaps / Avocado; Meru Greens EPZ -> Avocado / Mangoes / Macadamia;
etc.).

### Image-only PDFs (not yet imported)

The following PDFs are scanned images and need OCR before they can be
parsed - they are not yet in the seed data:

- `Tachasis Farmers.pdf` / `Tachasis Farmers List.pdf`
- `Arwos- Farmers Data.pdf`
- `Sangalo Farmers.pdf`
- `Kosirai Farmers Data.pdf`
- `Lessons Farmers Data.pdf`

To OCR them later: `pip install pdf2image pytesseract` and run them through
Tesseract, then run `parse/parse_all.py` again.

---

## 5. Wiring the real backend

The `xgrow-platform-sprint5/6` PHP backend lives in
`../XGROW System/` (route_*.php files + `api_*.php` + `xgrow_schema.sql`).

When that backend is ready:

1. Deploy it under a subdomain (e.g. `api.grow.xcado.africa`)
2. Import `xgrow_schema.sql` into MySQL and seed it with the same
   `farmers.json` from `parse/farmers.json` (524 records)
3. In Vercel env vars: set `VITE_API_BASE_URL` and flip
   `VITE_USE_MOCK_API` to `false`
4. Redeploy - the same React app now talks to live data instead of mocks

---

## Troubleshooting

**Build fails with "Unable to parse HTML" on Vercel:** Check that
`index.html` made it into the commit (`git ls-files | grep index.html`).
Some editors strip trailing characters - re-save it if so.

**Logo doesn't load on Vercel:** Ensure `public/xcado-logo.png` and
`public/xcado-logo-mark.png` are committed. Files in `public/` are served
from the site root, so `/xcado-logo-mark.png` is the correct path.

**Mock data not showing:** Confirm `VITE_USE_MOCK_API=true` in Vercel's env
vars - the default `.env.example` value gets baked into the build at
`npm run build` time.

---

(c) XCADO Group | Grow. Further.
