import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Telshan Fernando | Software Developer",
    template: "%s | Telshan Fernando",
  },
  description:
    "Portfolio of Telshan Fernando — software developer showcasing projects, experience, skills, education, and certifications.",
  keywords: [
    "Telshan Fernando",
    "software developer",
    "web developer",
    "Next.js",
    "React",
    "TypeScript",
    "portfolio",
  ],
  authors: [{ name: "Telshan Fernando" }],
  creator: "Telshan Fernando",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    title: "Telshan Fernando | Software Developer",
    description:
      "Portfolio of Telshan Fernando — software developer showcasing projects, experience, skills, education, and certifications.",
    siteName: "Telshan Fernando",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telshan Fernando | Software Developer",
    description:
      "Portfolio of Telshan Fernando — software developer and technology enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}