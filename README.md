# ThingsTo

ThingsTo is a modern web app for managing your personal to-do list, built with React, Vite, and Supabase. It provides a simple, fast, and secure way to track tasks, with user authentication and persistent storage.

## Features
- User registration and login (Supabase authentication)
- Add, edit, complete, and delete to-do items
- Soft delete for tasks (can be restored in database)
- Responsive, accessible UI
- Persistent storage (Supabase for authenticated users, localStorage for guests)
- Account menu and profile options

## Tech Stack
- React 18
- Vite
- Supabase (database & auth)
- React Router
- Modern CSS

## Getting Started
1. Clone the repository
2. Install dependencies:
	```bash
	npm install
	```
3. Set up a Supabase project and add your credentials to `.env`:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
4. Start the development server:
	```bash
	npm run dev
	```

## Folder Structure
- `src/pages/` — Main app pages (Login, Register, Todos, Home)
- `src/components/` — UI components (Header, TodosBase)
- `src/helper/` — Supabase client setup
- `public/` — Static assets

## License
MIT
