# 🌐 DenyTeam — Custom Frontend Portfolio Platform

Welcome to the central repository of my frontend ecosystem. This project is a custom-built, highly optimized personal portfolio website that dynamically manages, filters, and renders my web development works.

ℹ️ **Live Showcase:** You can view the fully operational interactive portfolio here: [https://gopdon32.github.io/DenyTeam/](https://gopdon32.github.io/DenyTeam/)

---

## 🛠️ Architecture & Technical Features

Instead of hardcoding components, I designed this platform to follow clean and scalable software engineering principles:

- 🗄️ **Dynamic Data Management (CMS-like):** Project data, descriptions, dates, and images are managed via a structured local configuration layer (`lang.json` / `data/`).
- 🔍 **Interactive Filtering System:** Built-in client-side filtering logic allowing users to seamlessly sort projects by tags (e.g., "All", "Layout/HTML/CSS", "JavaScript Core").
- 📦 **Modular Architecture:** The repository serves as a monorepo-style structure where independent sub-projects are neatly organized inside the `/pages/` directory and routed dynamically.
- 📱 **Advanced Responsive Layouts:** Optimized for high performance and fluid responsiveness across all viewports using modern CSS Grid, Flexbox, and Mobile-First strategies.

---

## 📂 Repository Structure Highlights

- `/pages/` — Contains isolated, standalone production-ready UI web apps, components, and responsive pages.
- `/js/` & `/css/` — Main architecture driving the central portfolio engine, themes, and animations.
- `/data/` — Configuration schemas and data objects driving the dynamic portfolio content.

---

## 🚀 Technical Stack

- **Core:** Semantic HTML5, Advanced CSS3 (Grid/Flexbox/Variables), JavaScript (ES6+ Architecture)
- **Design System:** Translated from precision Figma templates into clean production code
- **Environment:** VS Code, Git version control, GitHub Actions / Pages deployment

---

## ✅ Added: Markdown blog + Decap (Netlify) CMS

I added a Markdown-based blog workflow and a minimal Decap (Netlify) CMS admin UI.

- `content/posts/` — store full posts as Markdown with YAML frontmatter.
- `admin/` — Decap CMS UI and `admin/config.yml` configured for GitHub backend.
- `scripts/generate-index.js` + `.github/workflows/generate-index.yml` — a GitHub Action that regenerates `data/projects.json` from Markdown frontmatter on push.

### Quick actions for final setup

1. Commit & push current changes to `main`:

```powershell
git add .
git commit -m "Add markdown blog, admin UI and index generator"
git push origin main
```

2. Register a GitHub OAuth App to enable CMS login:
   - Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: DenyTeam CMS
   - Homepage URL: https://gopdon32.github.io/DenyTeam/
   - Authorization callback URL: https://gopdon32.github.io/DenyTeam/admin/
   - Copy the `Client ID` and paste it into `admin/config.yml` (uncomment `client_id`).

3. After pushing, check Actions → `Generate blog index` to verify the Action runs and updates `data/projects.json`.

If you want, paste the `Client ID` here and I will add it to `admin/config.yml` and commit the change for you.
