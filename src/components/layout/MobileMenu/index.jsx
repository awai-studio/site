// @/components/layout/MobileMenu/index.jsx

"use client";

import Link from "next/link";
import Modal from "@/components/ui/Modal";
import CloseButton from "@/components/ui/CloseButton";
import styles from "./MobileMenu.module.scss";

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      animation="slideRight"
      size="drawer"
      placement="right"
      ariaLabel="Mobile navigation"
    >
      <div className={styles.menu}>
        <CloseButton
          className={styles.closeButton}
          onClick={onClose}
          ariaLabel="メニューを閉じる"
        />
        <nav
          id="mobile-menu"
          className={styles.nav}
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              data-gtm-event={item.gtmEvent}
              data-gtm-location={item.gtmLocationSp}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </Modal>
  );
}
