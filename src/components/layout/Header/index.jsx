"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "@/components/layout/MobileMenu";
import styles from "./Header.module.scss";

const navItems = [
  { href: "/", label: "Home", activePrefix: "/" },
  {
    href: "/en/experiences",
    label: "Experiences",
    activePrefix: "/en/experiences",
  },
  {
    href: "/en/experiences",
    label: "Request Booking",
    activePrefix: "/en/booking",
    isCta: true,
  },
  { href: "/blog", label: "Notes", activePrefix: "/blog" },
];

function isCurrentPath(pathname, item) {
  if (item.activePrefix === "/") return pathname === "/";
  return pathname.startsWith(item.activePrefix);
}

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 960px)");
    const closeAtDesktop = (event) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  return (
    <header className={styles.header}>
      <Link
        className={styles.logo}
        href="/"
        aria-label="Awai Studio home"
        onClick={() => setIsOpen(false)}
      >
        <img src="/images/logo-awai-white.png" alt="" />
        <span>Studio</span>
      </Link>

      <nav className={styles.pcNav} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link
            key={`${item.label}-${item.activePrefix}`}
            className={item.isCta ? styles.navCta : undefined}
            href={item.href}
            aria-current={isCurrentPath(pathname, item) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        ref={menuButtonRef}
        className={`${styles.menuButton} ${isOpen ? styles.isOpen : ""}`}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="awai-mobile-navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navItems={navItems}
        pathname={pathname}
        returnFocusRef={menuButtonRef}
      />
    </header>
  );
}
