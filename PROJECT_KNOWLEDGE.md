# Project Knowledge: TechMaroc (Gaming Stores)

This document tracks my understanding of the project and logs all significant actions and decisions.

## Project Overview
TechMaroc is a React-based application, likely a platform for gaming stores or electronics. It uses a modern tech stack and features an admin dashboard and public-facing pages.

### Tech Stack
- **Frontend**: React (v19), Vite (v6), TypeScript.
- **Styling**: Tailwind CSS (v4) with `@tailwindcss/vite`.
- **Icons**: Lucide React.
- **Animations**: Motion (framer-motion).
- **Backend/Data**: 
  - Express is present in dependencies.
  - `better-sqlite3` is used (likely for local data storage or mock persistence).
  - A mock backend exists in `src/services/mockBackend.ts`.
  - Currently transitioning to **Supabase** for database and authentication.
- **Other Libs**: `jspdf` for PDF generation, `recharts` for data visualization.

## Log of Actions

### 2026-02-21
- **Project Analysis**: Analyzed project structure. Found Vite configuration and Tailwind integration.
- **Supabase Integration**:
  - Installed `@supabase/supabase-js`.
  - Created `.env` file with Supabase URL and Anon Key.
  - Initialized Supabase client in `src/lib/supabase.ts`.
- **Performance Optimization**:
  - Identified that the 3D model (13MB) was in the root instead of the `public` folder, which caused it to fail to load.
  - Implemented **Code Splitting** (Lazy Loading) for the `Model3D` component in `HomePage.tsx`.
  - Added a `Suspense` boundary with a skeleton loader to prevent the page from being white while the 3D engine initializes.
  - Fixed file paths to point to the correct `public/3D/` directory.

- **Supabase Schema**: Created full database schema in `supabase/schema.sql` with Role-Based Access Control (RBAC) and Row-Level Security (RLS). Fixed initial syntax error in policy definitions (`FOR ALL` correctly implemented).
  - Fixed Recharts "width/height should be greater than 0" warnings in `AdminDashboard.tsx` by adding `w-full` and `min-w-0` to chart containers.
- The project has a complex admin dashboard (`src/pages/AdminDashboard.tsx` mentioned in previous conversations).
- It involves order management, store visibility, and image uploads.
- The user is moving away from a mock backend/SQLite setup towards Supabase.
