# Personal Portfolio

A full-stack portfolio website built with Next.js, TypeScript, Tailwind CSS, and Supabase. Includes a public-facing portfolio and a custom admin dashboard to manage content without touching the codebase.

## Features

* **Public Portfolio:** Displays profile details, work experience, projects, skills, education, certifications, and offered services.
* **Admin Dashboard:** Full CRUD control over all portfolio content, uploaded resumes, profile images, and site settings.
* **Contact API:** Integrated contact form with backend routing to capture visitor messages.
* **SEO Optimized:** Dynamic `sitemap.ts` and `robots.ts` configuration.
* **Responsive:** Mobile-first layout designed with Tailwind CSS.

## Tech Stack

* **Framework:** Next.js (App Router), React
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database & Auth:** Supabase (PostgreSQL)
* **Version Control:** Git, GitHub

## Project Structure

```text
my-portfolio/
├── app/
│   ├── admin/             # Dashboard routes (CRUD for all sections)
│   │   ├── certifications/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── messages/
│   │   ├── profile/
│   │   ├── resumes/
│   │   ├── services/
│   │   ├── settings/
│   │   ├── skills/
│   │   └── social-links/
│   ├── api/
│   │   └── contact/       # Contact form route handler
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── admin/             # UI components for admin panel
│   ├── portfolio/         # UI components for public views
│   └── ContactForm.tsx
├── lib/
│   └── supabase/          # Supabase client setup
├── public/
├── package.json
└── README.md