// @/components/layout/Header/index.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import MobileMenu from "@/components/layout/MobileMenu";
import styles from "./Header.module.scss";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/en/experiences", label: "Experiences" },
  { href: "/blog", label: "Notes" },
  { href: "/en/experiences", label: "Request Booking", isCta: true },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" onClick={handleClose}>
        Awai Studio
      </Link>

      <nav className={styles.pcNav} aria-label="Primary navigation">
        {
          navItems.map((item) => (
            <Link
              key={item.label}
              className={item.isCta ? styles.navCta : undefined}
              href={item.href}
            >
              {item.label}
            </Link>
          ))
        }
      </nav>

      <button
        className={`${styles.menuBtn} ${isOpen ? styles.isOpen : ""}`}
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        // このボタンに対応している要素に同じ名称のIDをつける。
        aria-controls="mobile-menu"
      >
        <span />
        <span />
        <span />
      </button>

      <MobileMenu 
        isOpen={isOpen}
        onClose={handleClose}
        navItems={navItems}
      />
    </header>
  );
}
