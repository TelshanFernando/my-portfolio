Personal Portfolio Website

A modern, responsive, full-stack personal portfolio website built with Next.js, TypeScript, Tailwind CSS, and Supabase.

The project includes a dynamic public portfolio, an admin dashboard for managing portfolio content, a resume management system, contact messaging, and database-backed content management.

🚀 Live Project

Live Website: Deployed with Vercel

Local Development: http://localhost:3000

GitHub: TelshanFernando/my-portfolio

⸻

✨ Features

🌐 Public Portfolio

* Modern responsive portfolio interface
* Hero section with personal introduction
* About/Profile section
* Education timeline
* Work experience
* Projects showcase
* Technical skills
* Certifications
* Services
* Social media links
* Contact form
* Resume access/download
* Responsive navigation
* Mobile-friendly design
* Dynamic content loaded from Supabase

🔐 Admin Dashboard

The project includes an administration area for managing portfolio content.

Administrators can manage:

* Site settings
* Profile information
* Education
* Experience
* Projects
* Skills
* Certifications
* Services
* Social links
* Resumes
* Contact messages

Content can be updated without manually editing the public website.

⸻

📄 Resume Management

The portfolio includes a database-backed resume management system.

Resume features

* Upload PDF, DOC, and DOCX files
* Maximum file size: 10 MB
* Store files using Supabase Storage
* Store resume metadata in PostgreSQL
* Set one resume as the active resume
* Automatically deactivate previous active resumes
* Delete resumes
* Display the active resume on the public portfolio

Resume data

Each resume stores information such as:

* Title
* File URL
* Storage path
* Original file name
* MIME type
* File size
* Active status
* Creation date

⸻

🛠️ Technology Stack

Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

Backend

* Next.js Server Components
* Next.js Server Actions
* Supabase
* PostgreSQL

Storage

* Supabase Storage
* Resume file storage using the resumes bucket

Database

The project uses PostgreSQL through Supabase to store dynamic portfolio data.

Main data areas include:

site_settings
profiles
education
experience
projects
skills
certifications
services
social_links
resumes
contact_messages

Development & Deployment

* Git
* GitHub
* Vercel
* npm
* Turbopack

⸻

🏗️ Project Architecture

my-portfolio/
│
├── app/
│   ├── admin/
│   │   ├── certifications/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── resumes/
│   │   ├── services/
│   │   ├── settings/
│   │   ├── skills/
│   │   └── ...
│   │
│   ├── page.tsx
│   └── ...
│
├── components/
│   ├── portfolio/
│   │   └── Navbar.tsx
│   ├── ContactForm.tsx
│   └── ...
│
├── lib/
│   └── supabase/
│       ├── server.ts
│       ├── admin.ts
│       └── ...
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md

⸻

🔄 Data Flow

The application follows a database-driven architecture.

                    ┌──────────────────┐
                    │     Visitor      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Next.js       │
                    │   Portfolio UI   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Supabase      │
                    │    PostgreSQL    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Dynamic Content  │
                    └──────────────────┘
                    ┌──────────────────┐
                    │      Admin       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Admin Dashboard  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Server Actions   │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    ▼                  ▼
             ┌──────────────┐   ┌──────────────┐
             │ PostgreSQL   │   │ Supabase     │
             │ Database     │   │ Storage      │
             └──────────────┘   └──────────────┘

⸻

📦 Installation

Clone the repository:

git clone https://github.com/TelshanFernando/my-portfolio.git

Enter the project directory:

cd my-portfolio

Install dependencies:

npm install

⸻

🔑 Environment Variables

Create a .env.local file in the project root.

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Do not commit .env.local or other secret credentials to GitHub.

⸻

▶️ Run the Project Locally

Start the development server:

npm run dev

The application will normally be available at:

http://localhost:3000

For a production build:

npm run build

Then start the production server:

npm start

⸻

🗄️ Supabase Backend

Supabase provides the backend services used by this application.

PostgreSQL

Stores portfolio information including:

* Profile data
* Education
* Experience
* Projects
* Skills
* Certifications
* Services
* Social links
* Site settings
* Resume metadata
* Contact messages

Supabase Storage

The resumes storage bucket is used for uploaded resume files.

Row Level Security

Supabase Row Level Security (RLS) is used to control database access.

For example, the public portfolio only needs access to the currently active resume rather than every resume record.

⸻

📄 Server-Side Supabase Client

The project uses the Supabase SSR package to create a server-side client.

Example architecture:

Next.js Server Component
          │
          ▼
lib/supabase/server.ts
          │
          ▼
       Supabase
          │
          ▼
     PostgreSQL

This allows server-side portfolio data to be retrieved securely.

⸻

⚡ Server Actions

Server Actions are used for backend operations such as resume management.

Example operations include:

Upload Resume
      │
      ├── Validate file
      ├── Upload to Supabase Storage
      ├── Deactivate old resume
      └── Create database record

Resume deletion:

Delete Resume
      │
      ├── Find storage path
      ├── Delete storage file
      └── Delete database record

⸻

📊 Dynamic Content

The homepage retrieves multiple data sources from Supabase.

Examples include:

Profiles
Education
Experience
Projects
Skills
Certifications
Services
Social Links
Resume
Site Settings

Content is ordered using fields such as:

display_order

This allows the administrator to control the order in which content appears on the website.

⸻

🎨 UI & Responsive Design

The website is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Tailwind CSS is used for:

* Layout
* Spacing
* Typography
* Responsive breakpoints
* Buttons
* Cards
* Forms
* Navigation
* Interactive states

The UI focuses on a clean, modern portfolio presentation.

⸻

🔎 SEO & Metadata

The website includes dynamic metadata based on site settings.

Supported metadata includes:

* Website title
* Site description
* Favicon
* Open Graph title
* Open Graph description

This allows the site’s SEO information to be managed through the database.

⸻

📬 Contact System

The portfolio includes a contact form allowing visitors to send messages.

The intended data flow is:

Visitor
   │
   ▼
Contact Form
   │
   ▼
Next.js
   │
   ▼
Supabase
   │
   ▼
contact_messages
   │
   ▼
Admin Dashboard

This provides a centralized way to manage messages received through the portfolio.

⸻

🔐 Security Considerations

The project uses several security practices:

* Supabase Row Level Security
* Server-side Supabase client
* Server Actions for backend operations
* Environment variables for Supabase configuration
* File type validation
* File size validation
* Controlled public database access
* Separate storage and database handling
* No secret credentials committed to Git

Resume Upload Validation

Allowed file types:

PDF
DOC
DOCX

Maximum file size:

10 MB

⸻

🚀 Deployment

The project is designed to be deployed using Vercel.

Deployment workflow:

Local Development
       │
       ▼
      Git
       │
       ▼
    GitHub
       │
       ▼
    Vercel
       │
       ▼
 Production Website

When changes are pushed to the GitHub repository, Vercel can automatically build and deploy the latest version.

⸻

🧪 Development Workflow

Typical development workflow:

# Start project
npm run dev
# Check project
npm run build
# Check Git status
git status
# Add changes
git add .
# Commit changes
git commit -m "Your commit message"
# Push changes
git push origin main

⸻

📌 Project Goals

The main goals of this project are:

1. Build a professional personal portfolio.
2. Demonstrate full-stack development skills.
3. Use a modern React/Next.js architecture.
4. Implement a real PostgreSQL backend.
5. Create an administrative content management system.
6. Implement file storage and resume management.
7. Practice secure database access using RLS.
8. Deploy a production-ready application.
9. Create a portfolio that can be maintained without modifying source code for every content update.

⸻

💡 Key Technical Highlights

This project demonstrates experience with:

* Full-stack Next.js development
* React component architecture
* TypeScript
* Tailwind CSS
* PostgreSQL
* Supabase
* Row Level Security
* Supabase Storage
* Server Components
* Server Actions
* CRUD operations
* File uploads
* Database-driven UI
* Responsive web design
* SEO metadata
* Git/GitHub
* Vercel deployment

⸻

👨‍💻 Author

Telshan Fernando

Student & Developer

This portfolio project was created to showcase technical skills, projects, education, experience, certifications, and professional development.

⸻

📜 License

This project is intended primarily as a personal portfolio project.

The source code may be used for learning and reference, but personal content, images, resume files, and other proprietary assets should not be reused without permission.