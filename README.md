# portfolio-showcase

A single-page showcase for six quant/systems projects — dark premium
aesthetic, amber accent, IBM Plex — with a live split-flap ticker demo in
the hero (the same zero-dependency component running on THESIS).

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Before deploying — 2 edits in src/App.jsx
1. `GITHUB_USER` — your GitHub username (repo links are built from it)
2. `THESIS_URL` — your live THESIS dashboard URL

## Deploy to Vercel (same flow as THESIS's frontend)
```bash
git init && git add . && git commit -m "Initial commit"
# create portfolio-showcase repo on github.com/new, push, then:
# vercel.com → Add New Project → import the repo → Framework: Vite → Deploy
```
Optional: add a `projects.jeremyxiang.com` subdomain in Vercel → Settings →
Domains, plus a CNAME record in Cloudflare (same as thesis.jeremyxiang.com).

Then link it from jeremyxiang.com's nav/projects section.
