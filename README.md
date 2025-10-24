# JuSeek

A minimal frontend scaffold with `src/` organized as:

```
src/
├── api/
│   ├── newsAPI.js
│   └── translateAPI.js
│
├── components/
│   ├── NewsCard.jsx
│   ├── CountrySelector.jsx
│   └── TrendMap.jsx
│
├── pages/
│   └── Home.jsx
│
├── App.jsx
└── main.jsx
```

- `api/`: data fetching and translation helpers
- `components/`: reusable UI components
- `pages/`: page-level containers
- `App.jsx`: app root
- `main.jsx`: entry point mounting React

## Getting Started

This repository currently includes placeholders only. To run as a React app, you can initialize with Vite:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

Then integrate the existing `src/` files as needed.
