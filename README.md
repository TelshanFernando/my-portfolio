Personal Portfolio

A modern, responsive personal portfolio website built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

The website presents my professional background, skills, projects, education, certifications, services, and contact information through a dynamic portfolio and admin dashboard.

✨ Features

* Responsive personal portfolio website
* Dynamic profile information
* About Me section
* Work experience section
* Projects showcase
* Skills section
* Education history
* Certifications
* Services section
* Contact form
* Social media links
* Resume management
* Profile image management
* Dynamic content powered by Supabase
* Admin dashboard for managing portfolio content
* SEO metadata
* Sitemap and robots configuration

🛠️ Technologies Used

* Next.js – React framework for the web application
* React – User interface development
* TypeScript – Type-safe JavaScript
* Tailwind CSS – Styling and responsive design
* Supabase – Database and backend services
* PostgreSQL – Database
* Git & GitHub – Version control and source code management

📁 Project Structure

my-portfolio/
├── app/
│   ├── admin/
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
│   │   └── contact/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── admin/
│   ├── portfolio/
│   └── ContactForm.tsx
│
├── lib/
│   └── supabase/
│
├── public/
│
├── package.json
└── README.md

🚀 Getting Started

1. Clone the repository

git clone https://github.com/TelshanFernando/my-portfolio.git

2. Navigate to the project

cd my-portfolio

3. Install dependencies

npm install

4. Configure environment variables

Create a .env.local file in the project root.

Add the required Supabase configuration:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

If your application uses a Supabase service-role key, keep it server-side and never expose it in client-side code or commit it to GitHub.

5. Start the development server

npm run dev

Open:

http://localhost:3000

🗄️ Supabase

The application uses Supabase to store and retrieve portfolio information such as:

* Profile
* Education
* Experience
* Projects
* Skills
* Certifications
* Services
* Social links
* Resumes
* Contact messages
* Site settings

Portfolio content can be updated through the admin dashboard instead of manually changing the main portfolio page.

🔐 Admin Dashboard

The admin area provides management interfaces for the portfolio content.

Administrators can manage:

* Profile information
* Profile image
* Education
* Experience
* Projects
* Skills
* Certifications
* Services
* Social links
* Resumes
* Site settings
* Contact messages

📱 Responsive Design

The portfolio is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Tailwind CSS responsive utilities are used to adapt the layout and components to different screen sizes.

🔧 Development Experience

This project provided practical experience with:

* Building applications with Next.js and React
* Working with TypeScript
* Creating responsive interfaces with Tailwind CSS
* Connecting a frontend application to Supabase
* Working with database-driven content
* Building admin CRUD functionality
* Handling image and file URLs
* Creating API routes
* Debugging frontend and database-related issues
* Using Git and GitHub for version control
* Deploying and maintaining a web application

📌 Project Status

Active personal project

The project is being continuously improved with new features, UI updates, and bug fixes.

👤 Author

Telshan Fernando

* GitHub: https://github.com/TelshanFernando
* Portfolio: https://my-portfolio-ten-lilac-k1x0cb2icf.vercel.app

📄 License

This project is intended as a personal portfolio project.
