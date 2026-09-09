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
    <div className="relative h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      {/* Vibrant gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Indigo ambient glow - top left */}
        <motion.div
          className="absolute -left-40 -top-40 size-[500px] rounded-full bg-gradient-to-br from-[var(--accent-primary)]/[0.08] to-[var(--accent-secondary)]/[0.04] blur-[120px]"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.08, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan ambient glow - top right */}
        <motion.div
          className="absolute -right-48 top-[10%] size-[580px] rounded-full bg-gradient-to-bl from-[var(--accent-secondary)]/[0.06] to-[var(--accent-primary)]/[0.03] blur-[140px]"
          animate={{
            opacity: [0.35, 0.6, 0.35],
            scale: [1.02, 1, 1.02],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple accent glow - bottom center */}
        <motion.div
          className="absolute bottom-[-200px] left-[35%] size-[480px] rounded-full bg-[var(--aqi-hazardous)]/[0.04] blur-[130px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.015] via-transparent to-[var(--accent-secondary)]/[0.02]" />
      </div>

      <div className="relative flex h-dvh min-h-0">
        {/* Desktop navigation */}
        <Sidebar />

        <div className="relative flex h-dvh min-h-0 min-w-0 flex-1 flex-col">
          {/* Desktop topbar */}
          <Topbar />

          {/* Mobile topbar */}
          <MobileHeader
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* Enhanced atmospheric background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              {/* Cyan ambient glow - enhanced with gradient */}
              <motion.div
                className="absolute -left-52 -top-52 size-[600px] rounded-full bg-gradient-to-br from-[var(--accent-secondary)]/[0.03] to-[var(--accent-primary)]/[0.02] blur-[130px]"
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

              {/* Blue ambient glow - enhanced */}
              <motion.div
                className="absolute -right-56 top-[12%] size-[560px] rounded-full bg-gradient-to-bl from-[var(--accent-primary)]/[0.025] to-[var(--accent-secondary)]/[0.015] blur-[140px]"
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

              {/* Green ambient glow - enhanced */}
              <motion.div
                className="absolute bottom-[-260px] left-[30%] size-[520px] rounded-full bg-gradient-to-tr from-emerald-500/[0.02] to-[var(--accent-secondary)]/[0.01] blur-[150px]"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Subtle dashboard grid with accent colors */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(99,102,241,0.12) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(6,182,212,0.1) 1px,
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

              {/* Top fade with gradient tint */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/20 to-transparent" />

              {/* Bottom gradient accent */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--accent-primary)]/[0.03] to-transparent" />
            </div>

            {/* Application content */}
            <div className="relative min-h-full">
              {children}
            </div>
          </main>

          {/* Data attribution with enhanced styling */}
          <footer className="relative shrink-0 border-t border-[var(--border)] bg-gradient-to-r from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] px-4 py-3">
            {/* Subtle top border gradient */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/15 to-[var(--accent-primary)]/20" />
            
            <div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
              <span className="text-[10px] text-[var(--foreground-subtle)]">
                Weather and air quality data by
              </span>

              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
                className="group text-[10px] font-medium text-[var(--accent-primary)] underline underline-offset-2 transition-all hover:text-[var(--accent-secondary)] hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                Open-Meteo
              </a>

              <span className="text-[10px] text-[var(--foreground-faint)]">
                ·
              </span>

              <span className="text-[10px] text-[var(--foreground-subtle)]">
                Air quality forecasts by
              </span>

              <a
                href="https://atmosphere.copernicus.eu/"
                target="_blank"
                rel="noreferrer"
                className="group text-[10px] font-medium text-[var(--accent-primary)] underline underline-offset-2 transition-all hover:text-[var(--accent-secondary)] hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                CAMS
              </a>

              <span className="text-[10px] text-[var(--foreground-faint)]">
                ·
              </span>

              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
                className="group text-[10px] text-[var(--foreground-subtle)] underline underline-offset-2 transition-colors hover:text-[var(--accent-primary)]"
              >
                CC BY 4.0
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile navigation with vibrant enhancements */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Enhanced overlay with gradient tint */}
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
              className="fixed inset-0 z-40 cursor-default bg-gradient-to-b from-black/70 via-black/65 to-black/70 backdrop-blur-[4px] lg:hidden"
            />

            {/* Enhanced drawer with gradient */}
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
              className="fixed inset-y-0 left-0 z-50 flex min-h-dvh w-[min(86vw,310px)] flex-col border-r border-[var(--border)] bg-gradient-to-b from-[var(--surface-secondary)] via-[var(--surface-secondary)] to-[var(--surface)] shadow-[20px_0_60px_rgba(15,23,42,0.25),0_0_0_1px_rgba(99,102,241,0.08)] lg:hidden"
            >
              {/* Gradient accent bar at top */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--accent-primary)]/50 via-[var(--accent-secondary)]/40 to-[var(--accent-primary)]/50 opacity-70" />
              
              {/* Drawer header with enhanced styling */}
              <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* Brand mark with gradient */}
                  <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_16px_rgba(99,102,241,0.25)]">
                    <span className="relative z-10 size-2.5 rounded-full bg-[var(--background)]" />

                    <span className="absolute size-5 rounded-full border border-[var(--background)]/15" />
                    
                    <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/[0.06]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                      AirScope
                    </p>

                    <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--accent-secondary)]/80">
                      Air quality intelligence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation"
                  className="group flex size-9 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-muted)] transition-all hover:bg-gradient-to-br hover:from-[var(--control-hover)] hover:to-[var(--accent-glow)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={19}
                    strokeWidth={1.5}
                    className="transition-colors"
                  />
                </button>
              </div>

              {/* Navigation with vibrant states */}
              <nav
                className="relative flex-1 overflow-y-auto px-3 py-6"
                aria-label="Primary navigation"
              >
                <div className="mb-3 flex items-center gap-2 px-3">
                  <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-primary)]/40 to-transparent" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]/70">
                    Workspace
                  </span>
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
                            className={`relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40 ${
                              isActive
                                ? "text-[var(--foreground)]"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                            }`}
                          >
                            {/* Active background with gradient */}
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-background"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/12 via-[var(--accent-secondary)]/8 to-[var(--accent-primary)]/12 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)]"
                              />
                            )}

                            {/* Active edge with gradient */}
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-edge"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                                className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_10px_rgba(99,102,241,0.35)]"
                              />
                            )}

                            {/* Hover wash with gradient */}
                            {!isActive && (
                              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--control-hover)] to-[var(--accent-glow)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                            )}

                            {/* Icon with color transitions */}
                            <HugeiconsIcon
                              icon={
                                item.icon
                              }
                              size={18}
                              strokeWidth={1.5}
                              className={`relative z-10 transition-all ${
                                isActive
                                  ? "text-[var(--accent-primary)] drop-shadow-[0_0_6px_rgba(99,102,241,0.25)]"
                                  : "text-[var(--foreground-subtle)] group-hover:text-[var(--accent-secondary)]"
                              }`}
                            />

                            {/* Label */}
                            <span
                              className={`relative z-10 truncate transition-colors ${
                                isActive
                                  ? "font-medium text-[var(--foreground)]"
                                  : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]"
                              }`}
                            >
                              {item.label}
                            </span>

                            {/* Active indicator with gradient */}
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
                                className="relative z-10 ml-auto size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_6px_rgba(99,102,241,0.4)]"
                              />
                            )}

                            {/* Navigation index with accent */}
                            {!isActive && (
                              <span className="relative z-10 ml-auto hidden text-[9px] tabular-nums text-[var(--foreground-faint)] transition-colors group-hover:text-[var(--accent-primary)]/60 sm:block">
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

              {/* Bottom area with enhanced styling */}
              <div className="relative shrink-0 border-t border-[var(--border)] p-3">
                {/* Gradient accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--accent-secondary)]/30 via-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/30 opacity-60" />
                
                {/* System status with gradient */}
                <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-1.5">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                      <span className="relative size-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
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