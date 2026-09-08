import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileHeader } from "./MobileHeader";
import {
  mainNavigation,
  utilityNavigation,
} from "../../lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
   * Close mobile navigation with Escape
   * and prevent the page behind the drawer
   * from scrolling while it is open.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <div className="flex h-dvh min-h-0">
        {/* Desktop navigation */}
        <Sidebar />

        <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col">
          {/* Desktop topbar */}
          <Topbar />

          {/* Mobile topbar */}
          <MobileHeader
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* Atmospheric background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              {/* Cyan ambient glow */}
              <motion.div
                className="absolute -left-52 -top-52 size-[600px] rounded-full bg-cyan-500/[0.025] blur-[130px]"
                animate={{
                  opacity: [0.55, 0.8, 0.55],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Blue ambient glow */}
              <motion.div
                className="absolute -right-56 top-[12%] size-[560px] rounded-full bg-blue-500/[0.02] blur-[140px]"
                animate={{
                  opacity: [0.4, 0.65, 0.4],
                  scale: [1.02, 1, 1.02],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Green ambient glow */}
              <div className="absolute bottom-[-260px] left-[30%] size-[520px] rounded-full bg-emerald-500/[0.012] blur-[150px]" />

              {/* Subtle dashboard grid */}
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(100,116,139,0.08) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(100,116,139,0.08) 1px,
                      transparent 1px
                    )
                  `,
                  backgroundSize:
                    "48px 48px",
                  maskImage:
                    "linear-gradient(to bottom, black, transparent 85%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black, transparent 85%)",
                }}
              />

              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--background)]/30 to-transparent" />
            </div>

            {/* Application content */}
            <div className="relative min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
              }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 cursor-default bg-black/65 backdrop-blur-[3px] lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="AirScope navigation"
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 32,
                mass: 0.9,
              }}
              className="fixed inset-y-0 left-0 z-50 flex min-h-dvh w-[min(86vw,310px)] flex-col border-r border-[var(--border)] bg-[var(--surface-secondary)] shadow-[20px_0_60px_rgba(0,0,0,0.18)] lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* Brand mark */}
                  <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--foreground)]">
                    <span className="size-2.5 rounded-full bg-[var(--background)]" />

                    <span className="absolute size-5 rounded-full border border-[var(--background)]/15" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                      AirScope
                    </p>

                    <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
                      Air quality intelligence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-muted)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={19}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Navigation */}
              <nav
                className="flex-1 overflow-y-auto px-3 py-6"
                aria-label="Primary navigation"
              >
                <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                  Workspace
                </div>

                <div className="space-y-1">
                  {mainNavigation.map(
                    (item, index) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        end={
                          item.path ===
                          "/overview"
                        }
                        onClick={
                          closeMobileMenu
                        }
                        className="group block outline-none"
                      >
                        {({ isActive }) => (
                          <motion.div
                            initial={false}
                            animate={{
                              x: isActive
                                ? 0
                                : 0,
                            }}
                            whileTap={{
                              scale: 0.985,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 28,
                            }}
                            className={`relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)] ${
                              isActive
                                ? "text-[var(--foreground)]"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                            }`}
                          >
                            {/* Active background */}
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-background"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                                className="absolute inset-0 rounded-xl bg-[var(--control-hover)]"
                              />
                            )}

                            {/* Active edge */}
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-edge"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                                className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[var(--foreground-secondary)]"
                              />
                            )}

                            {/* Hover wash */}
                            {!isActive && (
                              <span className="absolute inset-0 rounded-xl bg-[var(--control-background)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                            )}

                            {/* Icon */}
                            <HugeiconsIcon
                              icon={
                                item.icon
                              }
                              size={18}
                              strokeWidth={1.5}
                              className={`relative z-10 transition-colors ${
                                isActive
                                  ? "text-[var(--foreground)]"
                                  : "text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-muted)]"
                              }`}
                            />

                            {/* Label */}
                            <span
                              className={`relative z-10 truncate transition-colors ${
                                isActive
                                  ? "font-medium text-[var(--foreground-secondary)]"
                                  : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]"
                              }`}
                            >
                              {item.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                              <motion.span
                                initial={{
                                  opacity: 0,
                                  scale: 0.7,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                className="relative z-10 ml-auto size-1.5 rounded-full bg-[var(--foreground-secondary)]"
                              />
                            )}

                            {/* Navigation index */}
                            {!isActive && (
                              <span className="relative z-10 ml-auto hidden text-[9px] tabular-nums text-[var(--foreground-faint)] transition-colors group-hover:text-[var(--foreground-subtle)] sm:block">
                                {String(
                                  index + 1,
                                ).padStart(
                                  2,
                                  "0",
                                )}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </NavLink>
                    ),
                  )}
                </div>
              </nav>

              {/* Bottom area */}
              <div className="shrink-0 border-t border-[var(--border)] p-3">
                {utilityNavigation.map(
                  (item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--control-background)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={1.5}
                        className="text-[var(--foreground-subtle)] transition-colors group-hover:text-[var(--foreground-muted)]"
                      />

                      <span>{item.label}</span>
                    </button>
                  ),
                )}

                {/* System status */}
                <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--control-background)] p-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-1.5">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                      <span className="relative size-1.5 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-[10px] font-medium text-[var(--foreground-secondary)]">
                      Monitoring online
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] leading-4 text-[var(--foreground-subtle)]">
                    Environmental data systems are ready.
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}