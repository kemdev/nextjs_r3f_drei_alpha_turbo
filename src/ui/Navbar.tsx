"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tsl", label: "TSL scene" },
  { href: "/cube", label: "Standard cube" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="z-10 mx-auto mt-10 flex w-full max-w-3xl flex-wrap gap-x-3 gap-y-1 px-3 text-base sm:gap-x-8 sm:text-xl"
      aria-label="Scenes"
    >
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`${isActive ? "bg-gray-800 font-bold" : ""} rounded-md p-2 transition-colors duration-300 hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
