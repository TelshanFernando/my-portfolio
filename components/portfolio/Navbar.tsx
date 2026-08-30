
"use client";

import { useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  name: string;
  navigation: NavigationItem[];
};

const fallbackNavigation: NavigationItem[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

function normalizeNavigation(items: NavigationItem[]) {
  const source = items.length > 0 ? items : fallbackNavigation;
  const seen = new Set<string>();

  return source
    .map((item) => {
      const href = item.href.startsWith("#") ? item.href : `#${item.href.replace(/^\//, "")}`;
      return { ...item, href };
    })
    .filter((item) => {
      if (!item.href || seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
}

export default function Navbar({ name, navigation }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const items = normalizeNavigation(navigation);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="group shrink-0 font-semibold tracking-tight text-white transition hover:text-zinc-200"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
            {name}
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm text-zinc-300 md:flex"
          aria-label="Main navigation"
        >
          {items.map((item) => (
            <a
              key={item.href}
              className="rounded-full px-3 py-2 transition-all duration-200 hover:bg-white/10 hover:text-white"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="hidden rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-black sm:inline-flex"
          >
            Contact
          </a>

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-zinc-200 transition-all duration-200 hover:bg-white/10 hover:text-white md:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-white/10 bg-zinc-950/95 px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200"
            >
              Contact Me
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}