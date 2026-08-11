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
| Backend (planned) | Supabase (Auth, PostgreSQL, Storage) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/refound.git
cd refound
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The app runs without Supabase credentials (uses mock data). A warning will appear in the console.

### 4. Start the dev server

```bash
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
├── lib/              # Supabase client config
├── services/         # API/data functions (authService, itemService)
├── data/             # Mock data for development
├── hooks/            # Custom React hooks (to be built)
├── App.jsx           # Router setup
├── main.jsx          # React entry point
└── index.css         # Tailwind + global styles
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

## Supabase Integration (Next Steps)

The project is structured and ready for Supabase. To activate:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Add credentials** to your `.env` file
3. **Create the `items` table** in Supabase with columns matching `src/data/mockItems.js`
4. **Enable Row Level Security (RLS)** on the `items` table
5. **Uncomment** the Supabase query code in `src/services/itemService.js`
6. **Implement auth** in `src/services/authService.js`

---

## Development Notes

- Mock data lives in `src/data/mockItems.js` — safe to modify for testing
- All services have commented-out Supabase equivalents ready to activate
- Auth pages (Login, Register) use a separate minimal layout
- Image upload will use **Supabase Storage** (bucket: `item-images`)

---

## Contributing

Two-developer project. Please:
- Work on separate feature branches
- Use descriptive commit messages
- Never commit `.env`

---

## Built by

Students at MIT Bengaluru 🎓
