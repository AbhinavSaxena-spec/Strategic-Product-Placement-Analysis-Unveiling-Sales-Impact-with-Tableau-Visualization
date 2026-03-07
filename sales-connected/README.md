# SALES — Strategic Product Placement Analysis

A React + Vite frontend for the Strategic Product Placement Analysis project,
with built-in Tableau embed support on the Dashboard and Story pages.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

## 📁 Project Structure

```
sales-app/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx          # App entry point
    ├── App.jsx           # Router + layout
    ├── index.css         # Global styles & CSS variables
    ├── components/
    │   ├── Navbar.jsx         # Fixed top navigation
    │   ├── Navbar.module.css
    │   ├── Footer.jsx         # Site footer
    │   ├── Footer.module.css
    │   ├── TableauEmbed.jsx   # Reusable Tableau iframe panel
    │   └── TableauEmbed.module.css
    └── pages/
        ├── Home.jsx           # Landing hero page
        ├── Home.module.css
        ├── About.jsx          # Project methodology
        ├── About.module.css
        ├── Dashboard.jsx      # Tableau Dashboard embed + KPIs
        ├── Dashboard.module.css
        ├── Story.jsx          # Tableau Story embed + highlights
        ├── Story.module.css
        ├── Contact.jsx        # Contact form
        └── Contact.module.css
```

## 📊 Embedding Your Tableau Dashboards

### On the **Dashboard** page:
1. Go to your published Tableau Public viz
2. Click **Share** → copy the **Link**
3. Paste into the URL field on the Dashboard page → click **Embed**

### On the **Story** page:
1. Same steps — paste your Tableau Story URL
2. Click **Embed**

The app automatically appends `?:embed=yes&:showVizHome=no&:toolbar=yes`
to the URL for a clean, full-screen embed experience.

## 🛠 Build for Production

```bash
npm run build
# Output goes to /dist folder
```

## 📦 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **Vite 5** — Build tool & dev server
- **CSS Modules** — Scoped component styles
- **Google Fonts** — Oswald + Lato typography
