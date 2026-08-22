# FindIt — Intelligent Lost & Found Platform

FindIt is a modern, privacy-first public lost and found web application. It combines vision AI item identification, automatic lost ↔ found matching, an encrypted 7-step proof-of-ownership flow, WhatsApp communication, and geographic activity heatmap visualization.

---

## Key Features

- **Smart Item Identification (AI)**: Automatically identifies category, brand, color, item type, and unique features from uploaded photos.
- **AI-Powered Item Matching**: Cross-matches LOST and FOUND reports in real time, calculating a confidence Match Score with itemized attribute breakdowns.
- **7-Step Proof-of-Ownership Flow**:
  1. Potential Match exploration
  2. "Looking Sus" trigger — Finder requests ownership verification
  3. Professional, neutral claimant notification
  4. Confidential verification questionnaire
  5. AI & rule-based confidence evaluation
  6. Verified state notification to both parties
  7. Confidential failed verification handling without answer leakage
- **WhatsApp Contact**: Direct, pre-filled WhatsApp communication with finders who opt in, keeping phone numbers private.
- **Activity Heatmap**: Interactive Leaflet-powered geographic density map with timeframe (24h/7d/30d) and category filters.
- **Premium Design System**: Minimal, editorial, human-designed consumer startup interface with dark mode support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Lucide React, Leaflet |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt |
| AI Engine | Google Gemini API (`@google/generative-ai`) + Heuristic Semantic Fallback |

---

## Getting Started

### 1. Install Dependencies

Frontend:
```bash
cd Frontend
npm install --legacy-peer-deps
```

Backend:
```bash
cd Backend
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create `Backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key_optional
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

Frontend:
```bash
cd Frontend
npm run dev
```

Backend:
```bash
cd Backend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
