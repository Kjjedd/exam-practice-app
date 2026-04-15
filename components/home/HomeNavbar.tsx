"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavbarLink = Readonly<{
  label: string;
  href: string;
}>;

const navbarLinks: readonly NavbarLink[] = [
  {
    label: "Overview",
    href: "#overview"
  },
  {
    label: "Start",
    href: "#start"
  },
  {
    label: "Shortcuts",
    href: "#shortcuts"
  }
] as const;

export function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        className={`mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-full px-4 py-3 transition-all duration-300 sm:px-6 ${
          isScrolled
            ? "bg-white/70 shadow-[0_18px_45px_rgba(16,36,62,0.1)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="text-lg font-semibold tracking-[-0.04em] text-ink">
          Exam Mate
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navbarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink/68 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/import"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          Try now
        </Link>
      </div>
    </header>
  );
}
