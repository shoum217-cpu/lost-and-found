# ReFound – MIT Bengaluru Lost & Found Platform

A modern Lost & Found web application for MIT Bengaluru students.
Report, discover, and return lost belongings on campus.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/refound.git
cd refound
```

### 2. Install dependencies

Frontend:
```bash
npm install
```

Backend:
```bash
cd server
npm install
```

### 3. Set up environment variables

Frontend:
```bash
cp .env.example .env
```
Edit `.env` and add: `VITE_API_URL=http://localhost:5000/api`

Backend:
```bash
cd server
cp .env.example .env
```
Edit `.env` and add your `MONGO_URI`.

> **Note:** The app currently runs using mock data on the frontend while the backend API is being built.

### 4. Start the dev servers

Frontend:
```bash
# In the root directory
npm run dev
```

Backend:
```bash
# In the server/ directory
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, ItemCard, etc.)
├── pages/            # One file per route
├── layouts/          # Page layouts (MainLayout wraps Navbar + Footer)
├── services/         # API/data functions (authService, itemService)
├── data/             # Mock data for development
├── hooks/            # Custom React hooks (to be built)
├── App.jsx           # Router setup
├── main.jsx          # React entry point
└── index.css         # Tailwind + global styles

server/
├── config/           # DB connection
├── controllers/      # Route logic
├── models/           # Mongoose schemas
├── routes/           # Express routes
├── middleware/       # Custom middleware (Auth, etc.)
└── server.js         # Entry point
```

## Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Home | No |
| `/search` | Search & Browse | No |
| `/report` | Report Lost/Found | Yes (coming soon) |
| `/item/:id` | Item Details | No |
| `/dashboard` | User Dashboard | Yes (coming soon) |
| `/login` | Login | No |
| `/register` | Register | No |

---

## Backend Integration (Next Steps)

The project is structured and ready for MongoDB Atlas. To activate:

1. **Create a MongoDB Atlas cluster**
2. **Add connection string** to `server/.env` as `MONGO_URI`
3. **Finish implementations** in `server/controllers`
4. **Uncomment API fetch calls** in `src/services`

---

## Development Notes

- Mock data lives in `src/data/mockItems.js` — safe to modify for testing
- All services have commented-out `fetch` API equivalents ready to activate
- Auth pages (Login, Register) use a separate minimal layout

---

## Contributing

Two-developer project. Please:
- Work on separate feature branches
- Use descriptive commit messages
- Never commit `.env`

---

## Built by

Students at MIT Bengaluru 🎓
