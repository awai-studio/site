// @/components/layout/Header/index.jsx

import Link from "next/link";
import styles from "./Header.module.scss";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/en/experiences", label: "Experiences" },
  { href: "/blog", label: "Notes" },
  { href: "/en/experiences", label: "Request Booking", isCta: true },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
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
    </header>
  );
}
