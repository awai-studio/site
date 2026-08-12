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
      ariaLabel="Moblie navigation"
    >
      <div className={styles.menu}>
        <CloseButton
          className={styles.closeButton}
          onClick={onClose}
          arialabel="メニューを閉じる"
        />
        <nav
          id="mobile-menu"
          className={styles.nav}
          aria-label="Moble navigation"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </Modal>
  );
}
