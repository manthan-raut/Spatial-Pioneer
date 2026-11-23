# Spatial Pioneer

Website for **Spatial Pioneer** — GIS Mapping · Land Survey · Drone Mapping · Web & Mobile GIS · Spatial Analytics.

**Live site:** https://manthan-raut.github.io/Spatial-Pioneer/

Built with React 19, Vite, Three.js (React Three Fiber) and Framer Motion, plus a small Node/Express API for the contact form.

## Run locally

```bash
npm install
npm run dev      # site on http://localhost:5173, API on :5050
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server + API with auto-reload |
| `npm run build` | Production build into `client/dist` |
| `npm start` | Express serves `client/dist` and the API on port 5050 (`PORT` to change) |

## Project layout

```
client/            React app (Vite)
  src/components/  one .jsx + .css per page section
  src/data/content.js   all site text — edit copy here
  src/styles/global.css colours, fonts, shared styles
server/            Express API: POST /api/contact, GET /api/health
.github/workflows/ GitHub Pages deployment
```

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). GitHub Pages only hosts static files, so on the
live site the contact form opens the visitor's email app with the request filled in.
To store requests on a server instead, deploy the whole app (`npm run build && npm start`)
to a Node host such as Render or Railway.

## Before launch

Text marked `// PLACEHOLDER` in `client/src/data/content.js` (numbers, contact details,
product names, certificates) is sample content and must be replaced with real company data.

Satellite imagery © Esri, Maxar, Earthstar Geographics; map data © OpenStreetMap contributors.
