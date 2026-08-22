# FindIt — Intelligent Lost & Found Platform

<p align="center">
  <b>A privacy-first, AI-powered lost and found platform built for college campuses and communities.</b>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Fast_Build-646CFF?logo=vite&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Smart Item Identification (AI)](#smart-item-identification-ai)
  - [AI-Powered Matching Engine](#ai-powered-matching-engine)
  - [7-Step Proof-of-Ownership Flow](#7-step-proof-of-ownership-flow)
  - [WhatsApp Contact Integration](#whatsapp-contact-integration)
  - [Activity Heatmap](#activity-heatmap)
  - [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Authentication & Security](#authentication--security)
- [Git Workflow](#git-workflow)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

**FindIt** (internally also referred to as **ReFound**) is a full-stack MERN application designed to solve a problem every college campus faces: lost items rarely make it back to their owners because there's no centralized, trustworthy, and fast way to report and reunite them.

Instead of being a simple classifieds board, FindIt layers in:

- **Computer vision** to auto-tag uploaded item photos (category, brand, color, distinguishing features)
- **Automated matching** between "I lost this" and "I found this" reports, scored by confidence
- **A structured ownership-verification flow** so finders don't have to just "trust" a claimant blindly
- **Privacy-preserving contact** via WhatsApp deep links, so phone numbers are never publicly exposed
- **A geographic heatmap** so users and campus admins can see where items are most frequently lost/found

The goal is to turn the lost & found process from a slow, informal, trust-based exchange into something structured, fast, and safe for both parties.

---

## Key Features

### Smart Item Identification (AI)

When a user uploads a photo of a lost or found item, the app sends the image to an AI vision pipeline (Google Gemini API, with a heuristic fallback when no API key is configured) which extracts:

- **Category** (electronics, apparel, documents, accessories, etc.)
- **Brand** (when visible/identifiable)
- **Primary and secondary color**
- **Item type** (e.g., "wireless earbuds" vs. just "electronics")
- **Unique features** (scratches, stickers, engravings, case color, etc.)

This reduces the manual effort of filling out a report and standardizes the data used for matching.

### AI-Powered Matching Engine

Every time a new LOST or FOUND report is submitted, it's cross-referenced against the opposite pool of reports. The matching engine produces:

- A **Match Score** (percentage-based confidence)
- An **itemized attribute breakdown** showing exactly which fields contributed to the score (category match, color match, location proximity, time window, description similarity, etc.)
- A ranked list of potential matches, so users aren't just shown a single "best guess"

This runs on a hybrid approach: rule-based scoring for structured attributes (category, color, location, time) combined with AI-assisted semantic comparison for free-text descriptions.

### 7-Step Proof-of-Ownership Flow

To prevent false claims, FindIt doesn't let anyone simply say "that's mine" and get contact details. Instead, claims go through a structured verification pipeline:

1. **Potential Match Exploration** — The system surfaces likely matches to the user based on the matching engine's score.
2. **"Looking Sus" Trigger** — If a finder is unsure about a claimant, they can trigger a formal verification request instead of resolving informally.
3. **Neutral Claimant Notification** — The claimant receives a professionally-worded, non-accusatory notification that verification is required — no language that presumes bad faith.
4. **Confidential Verification Questionnaire** — The claimant answers specific questions about the item (details that only the true owner would know) which are never shown to the finder directly.
5. **AI & Rule-Based Confidence Evaluation** — Answers are scored against the finder's original (private) item details using a combination of rule-based matching and AI evaluation for free-text answers.
6. **Verified State Notification** — If verification passes, both parties are notified and can proceed to exchange contact info.
7. **Confidential Failed-Verification Handling** — If verification fails, the claimant is informed without leaking *which* answers were wrong or *what* the correct answers were — preventing claimants from just retrying with corrected guesses.

### WhatsApp Contact Integration

Once two parties are ready to connect (either directly, for low-risk items, or after verification for higher-value items), FindIt generates a **pre-filled WhatsApp deep link** (`wa.me`) with a templated message. This means:

- No phone numbers are ever displayed in the UI
- Users don't have to manually type out an intro message
- Communication happens entirely on WhatsApp, outside the platform, once the connection is made

### Activity Heatmap

An interactive **Leaflet-powered map** visualizes lost & found activity density across campus (or whatever geographic scope the deployment covers):

- Filterable by **timeframe**: 24 hours / 7 days / 30 days
- Filterable by **category**: electronics, documents, apparel, etc.
- Useful both for individual users (e.g., "where are phones usually found?") and for campus administrators looking to place physical drop-off points strategically

### Design System

FindIt follows a minimal, editorial, "human-designed" aesthetic rather than a generic admin-dashboard look:

- Consistent spacing and typography scale
- Dark mode support via CSS custom properties + `localStorage` persistence
- Component-driven UI built with Tailwind CSS v4 utility classes
- Icons via `lucide-react`

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite |
| **Routing** | React Router |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Maps** | Leaflet + React-Leaflet |
| **Backend Framework** | Node.js + Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | Bcrypt / Bcryptjs |
| **AI Engine** | Google Gemini API (`@google/generative-ai`) with heuristic semantic fallback |
| **Image Handling** | Multer (uploads) |

---

## Architecture

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐
│                  │ ───────────────────────> │                  │
│   React Frontend │                           │  Express Backend │
│  (Vite + Tailwind)│ <─────────────────────── │   (Node.js API)  │
│                  │                           │                  │
└─────────────────┘                           └───────┬──────────┘
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    │                   │                   │
                              ┌─────▼─────┐      ┌──────▼──────┐    ┌───────▼───────┐
                              │  MongoDB   │      │  Gemini API  │    │  WhatsApp Deep │
                              │ (Mongoose) │      │ (Vision + NLP)│   │  Link Generator│
                              └───────────┘      └─────────────┘    └───────────────┘
```

- The **frontend** is a single-page React application communicating with the backend exclusively via a REST API (`VITE_API_URL`).
- The **backend** exposes route groups for auth, items, claims, matching, and heatmap data, each backed by a corresponding Mongoose model.
- The **AI layer** is called server-side (never directly from the client) to keep API keys secure.
- **JWT tokens** are issued on login/register and stored client-side in `localStorage` (`findit_token`, `findit_user`), then sent as a Bearer token on protected requests.

---

## Project Structure

```
Lost and Found/
├── Backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/             # Business logic for each resource
│   ├── models/                  # Mongoose schemas (User, Item, Claim, etc.)
│   ├── routes/                  # Express route definitions
│   ├── middleware/               # Auth middleware, error handlers, etc.
│   ├── .env                     # Backend environment variables
│   └── server.js                # App entry point
│
└── Frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/           # Reusable UI components
    │   ├── context/              # AuthContext, ThemeContext
    │   ├── data/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/                # Route-level page components
    │   └── services/             # API service modules (authService, itemService, aiService, claimService, heatmapService)
    ├── public/
    ├── index.html
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **MongoDB** running locally, or a MongoDB Atlas connection string
- *(Optional)* A **Google Gemini API key** for AI-powered features — the app falls back to heuristic matching if this isn't provided

### Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/lost-and-found.git
cd "Lost and Found"
```

Install frontend dependencies:

```bash
cd Frontend
npm install --legacy-peer-deps
```

Install backend dependencies:

```bash
cd ../Backend
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is currently required due to peer dependency resolution between React 19 and some third-party packages (e.g., `react-leaflet`).

### Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key_optional
```

Create a `.env` file inside `Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the Express server listens on |
| `MONGO_URI` | Yes | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens — use a long, random string |
| `GEMINI_API_KEY` | No | Enables AI vision identification & smart matching; falls back to heuristic matching if omitted |
| `VITE_API_URL` | Yes | Base URL the frontend uses to reach the backend API |

### Running the App

Start the backend:

```bash
cd Backend
npm run dev
```

Start the frontend (in a separate terminal):

```bash
cd Frontend
npm run dev
```

Then open the app at:

```
http://localhost:5173
```

The backend API will be running at:

```
http://localhost:5000/api
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive a JWT | No |
| `GET` | `/api/auth/me` | Get current authenticated user's profile | Yes |

### Items *(Lost / Found Reports)*

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/items` | List all items (filterable by category, status, location) | No |
| `POST` | `/api/items` | Create a new lost or found report | Yes |
| `GET` | `/api/items/:id` | Get details of a specific item | No |
| `PUT` | `/api/items/:id` | Update an item report | Yes |
| `DELETE` | `/api/items/:id` | Delete an item report | Yes |

### Matching

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/items/:id/matches` | Get ranked potential matches for an item | Yes |

### Claims / Ownership Verification

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/claims` | Initiate a claim on a found item | Yes |
| `POST` | `/api/claims/:id/verify` | Submit verification questionnaire answers | Yes |
| `GET` | `/api/claims/:id` | Get claim status | Yes |

### Heatmap

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/heatmap` | Get aggregated location data for the activity heatmap (supports `timeframe` and `category` query params) | No |

> Exact route names/params may evolve as the project develops — check `Backend/routes/` for the current source of truth.

---

## Database Models

**User**
- `name`, `email`, `password` (hashed via bcrypt), `createdAt`

**Item**
- `title`, `description`, `category`, `color`, `brand`, `status` (`lost` / `found`), `location` (coordinates), `imageUrl`, `reportedBy` (ref: User), `createdAt`

**Claim**
- `item` (ref: Item), `claimant` (ref: User), `status` (`pending` / `verified` / `rejected`), `verificationAnswers`, `createdAt`

*(Schema details may be extended over time — see `Backend/models/` for the current implementation.)*

---

## Authentication & Security

- Passwords are hashed using **bcrypt/bcryptjs** before being stored — plaintext passwords are never persisted.
- On successful login/register, the backend issues a **JWT**, which the frontend stores in `localStorage` as `findit_token`, alongside basic user info as `findit_user`.
- Protected routes use middleware that verifies the JWT from the `Authorization: Bearer <token>` header before allowing access.
- Ownership-verification answers are stored confidentially and are never exposed to the opposing party, whether the claim succeeds or fails.
- WhatsApp contact is generated as a deep link only — raw phone numbers are never rendered in the frontend DOM.

---

## Git Workflow

This project uses a simple two-branch collaboration model:

- **`main-codes`** — the current stable, deployable version
- **feature branches** (e.g., `garvit-changes`) — used for larger feature work (new UI, AI features, claims flow, heatmap, etc.), merged into `main-codes` via pull request once tested

General flow for contributing:

```bash
git checkout -b feature/your-feature-name main-codes
# make changes
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
# open a Pull Request into main-codes
```

---

## Roadmap

- [ ] Push notifications for match alerts
- [ ] Admin dashboard for campus lost & found offices
- [ ] Multi-image upload per report
- [ ] QR-code based drop-off point check-in
- [ ] Mobile-responsive PWA support
- [ ] Rate-limiting and abuse prevention on claims
- [ ] Multi-language support

---

## Known Issues

- Peer dependency warnings may appear during `npm install` due to React 19 compatibility lag in some packages — use `--legacy-peer-deps`.
- AI-based matching accuracy depends on `GEMINI_API_KEY` being configured; without it, matching falls back to a simpler heuristic model with reduced accuracy.

---

## Contributing

1. Fork the repository
2. Create a feature branch off `main-codes`
3. Make your changes with clear, descriptive commits
4. Open a Pull Request describing what changed and why
5. Ensure the app runs locally without errors before requesting review

---

## License

This project is licensed under the **MIT License** — feel free to use, modify, and build on it.

---

## Acknowledgements

- Built as a college project exploring full-stack MERN development, AI integration, and real-world UX problems around trust and verification.
- AI features powered by the **Google Gemini API**.
- Map visualization powered by **Leaflet** and **React-Leaflet**.
