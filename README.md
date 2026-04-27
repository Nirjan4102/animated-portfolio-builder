# 🚀 Premium Portfolio Builder

Create a professional, animated, and high-conversion personal portfolio in minutes. This platform allows you to craft your digital presence with ease, powered by React, Framer Motion, and Supabase.

## ✨ Features

- **OTP Authentication**: Secure and friction-less login/signup using One-Time Passwords sent to your email.
- **Full Mobile Support**: Optimized for Android and iOS, ensuring a premium experience on any screen size.
- **Dynamic Hero Section**: Personalized tagline, profile picture, and downloadable resume.
- **Interactive Journey**: Animated timeline of your professional career.
- **Skills Marquee**: A sleek, moving display of your core competencies.
- **Project Showcase**: Beautifully rendered cards for your featured work.
- **Supabase Integration**: Secure authentication and real-time data storage.
- **Public URL**: Get a unique link (e.g., `your-site.com/username`) to share with recruiters.
- **SEO Optimized**: Built-in meta tags, sitemap, and robots.txt for Google Search Console.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router 7
- **Styling**: Vanilla CSS with Modern Glassmorphism & Responsive Media Queries
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/Database**: Supabase (Auth & Postgres)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Supabase account

### 2. Setup Supabase
1. Create a new project in Supabase.
2. Go to the **SQL Editor** and run the following to create the `portfolios` table:
   ```sql
   create table portfolios (
     id uuid primary key default uuid_generate_v4(),
     username text unique not null,
     full_name text,
     tagline text,
     profile_picture text,
     resume_link text,
     about_me text,
     show_skills boolean default true,
     skills jsonb default '[]',
     contact jsonb default '{}',
     socials jsonb default '[]',
     projects jsonb default '[]',
     certificates jsonb default '[]',
     show_journey boolean default true,
     journey jsonb default '[]',
     updated_at timestamp with time zone default now()
   );

   -- Enable RLS
   alter table portfolios enable row level security;

   -- Allow public read access
   create policy "Allow public read access" on portfolios for select using (true);

   -- Allow authenticated users to upsert their own portfolio
   create policy "Allow auth upsert" on portfolios for all using (auth.role() = 'authenticated');
   ```

### 3. Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License

Distributed under the MIT License.

## 👨‍💻 Created by
**Nirjan Mondal** - Computer Science Enthusiast
