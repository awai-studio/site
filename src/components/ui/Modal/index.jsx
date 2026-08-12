// @/components/ui/Modal/index.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function Modal({
  isOpen,
  onClose,
  animation = "slideRight",
  size = "lg",
  placement= "center",
  closeOnBackdrop = true,
  closeOnEsc = true,
  ariaLabel = "ダイアログ",
  children,
}) {
  const [isReady, setIsReady] = useState(false);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const firstTarget = panelRef.current?.querySelector(FOCUSABLE_SELECTOR);
      (firstTarget || panelRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEsc) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || [],
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableItems.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  const handleBackdropClick = (event) => {
    if (!closeOnBackdrop) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isReady) {
    return null;
  }

  const modal = (
    <div
      className={`
        ${styles.backdrop}
        ${styles[placement]}
        ${isOpen ? styles.isOpen : ""}
      `}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div ref={panelRef} className={`
        ${styles.panel}
        ${styles[animation]}
        ${styles[size]}
      `}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "true" : undefined}
      aria-label={isOpen ? ariaLabel : undefined}
      tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )

  return createPortal(modal, document.body);
}
