import { motion } from "motion/react";
import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  mainNavigation,
} from "../../lib/navigation";

export function Sidebar() {
  return (
    <aside className="hidden h-dvh w-[248px] shrink-0 border-r border-[var(--border)] bg-[var(--surface-secondary)] transition-colors duration-200 lg:flex">
      <div className="flex h-full w-full flex-col">
        {/* ─────────────────────────────────────────────
            Brand
        ───────────────────────────────────────────── */}
        <div className="flex h-[76px] shrink-0 items-center border-b border-[var(--border)] px-5">
          <NavLink
            to="/overview"
            aria-label="Go to AirScope overview"
            className="group flex items-center gap-3 rounded-xl p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
          >
            {/* Brand mark */}
            <motion.div
              initial={false}
              whileHover={{
                rotate: -4,
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 22,
              }}
              className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--foreground)] shadow-[0_0_24px_rgba(0,0,0,0.06)]"
            >
              <span className="size-3.5 rounded-full bg-[var(--background)]" />

              <span className="absolute size-6 rounded-full border border-[var(--background)]/20" />

              <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/[0.04]" />
            </motion.div>

            {/* Brand text */}
            <div className="min-w-0 leading-none">
              <div className="text-[15px] font-semibold tracking-[-0.025em] text-[var(--foreground)] transition-opacity duration-200 group-hover:opacity-90">
                AirScope
              </div>

              <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)] transition-colors duration-200 group-hover:text-[var(--foreground-muted)]">
                Air quality intelligence
              </div>
            </div>
          </NavLink>
        </div>

        {/* ─────────────────────────────────────────────
            Main navigation
        ───────────────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-6"
          aria-label="Primary navigation"
        >
          <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            Workspace
          </div>

          <div className="space-y-1">
            {mainNavigation.map((item, index) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/overview"}
                className="group block outline-none"
              >
                {({ isActive }) => (
                  <motion.div
                    initial={false}
                    whileHover={{
                      x: isActive ? 0 : 2,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                    }}
                    className={`relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)] ${
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                    }`}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-background"
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
                      <motion.div
                        layoutId="sidebar-active-edge"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                        className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[var(--foreground-secondary)] shadow-[0_0_8px_rgba(100,116,139,0.18)]"
                      />
                    )}

                    {/* Hover wash */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-xl bg-[var(--control-background)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    )}

                    {/* Icon */}
                    <motion.span
                      animate={{
                        scale: isActive ? 1 : 0.96,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 24,
                      }}
                      className="relative z-10 flex shrink-0"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={1.5}
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "text-[var(--foreground)]"
                            : "text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-muted)]"
                        }`}
                      />
                    </motion.span>

                    {/* Label */}
                    <span
                      className={`relative z-10 truncate transition-colors duration-200 ${
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
                      <span className="relative z-10 ml-auto hidden text-[9px] tabular-nums text-[var(--foreground-faint)] transition-colors group-hover:text-[var(--foreground-subtle)] xl:block">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ─────────────────────────────────────────────
            System status
        ───────────────────────────────────────────── */}
        <div className="shrink-0 px-3 pb-4">
          <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            System
          </div>

          <motion.div
            whileHover={{
              borderColor:
                "color-mix(in srgb, var(--foreground) 10%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--foreground) 3.5%, transparent)",
            }}
            transition={{
              duration: 0.2,
            }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--control-background)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                  <span className="relative size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.35)]" />
                </span>

                <span className="truncate text-xs font-medium text-[var(--foreground-secondary)]">
                  Monitoring online
                </span>
              </div>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-300/70">
                Live
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-[var(--foreground-subtle)]">
              Environmental data systems are ready.
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-px flex-1 bg-[var(--border-subtle)]" />

              <span className="text-[8px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                All systems normal
              </span>

              <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}