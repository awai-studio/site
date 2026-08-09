"use client";

import Link from "next/link";
import { useRef } from "react";
import Modal from "@/components/ui/Modal";
import styles from "./MobileMenu.module.scss";

function isCurrentPath(pathname, item) {
  if (item.activePrefix === "/") return pathname === "/";
  return pathname.startsWith(item.activePrefix);
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
  pathname,
  returnFocusRef,
}) {
  const closeButtonRef = useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      animation="slideRight"
      size="drawer"
      placement="right"
      ariaLabel="Site menu"
      initialFocusRef={closeButtonRef}
      returnFocusRef={returnFocusRef}
    >
      <div className={styles.menu} id="awai-mobile-navigation">
        <div className={styles.menuHeader}>
          <span className={styles.eyebrow}>Awai Studio</span>
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
          >
            <span />
            <span />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <Link
              key={`${item.label}-${item.activePrefix}`}
              className={item.isCta ? styles.mobileCta : undefined}
              href={item.href}
              onClick={onClose}
              aria-current={isCurrentPath(pathname, item) ? "page" : undefined}
            >
              <span className={styles.itemNumber}>0{index + 1}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className={styles.menuNote}>
          Quiet cultural experiences in Kyoto, through tea, silence, and
          reflection.
        </p>
      </div>
    </Modal>
  );
}
