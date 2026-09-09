import { motion } from "motion/react";
import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  mainNavigation,
} from "../../lib/navigation";

export function Sidebar() {
  return (
    <aside className="hidden h-dvh w-[248px] shrink-0 border-r border-[var(--border)] bg-gradient-to-b from-[var(--surface-secondary)] via-[var(--surface-secondary)] to-[var(--surface)] transition-colors duration-200 lg:flex">
      {/* Subtle gradient accent bar at right edge */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-[var(--accent-primary)]/30 via-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/30 opacity-60" />
      
      <div className="flex h-full w-full flex-col">
        {/* ─────────────────────────────────────────────
            Brand with vibrant enhancements
        ───────────────────────────────────────────── */}
        <div className="relative flex h-[76px] shrink-0 items-center border-b border-[var(--border)] px-5">
          {/* Gradient accent line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[var(--accent-primary)]/40 via-[var(--accent-secondary)]/40 to-[var(--accent-primary)]/40 opacity-60" />
          
          <NavLink
            to="/overview"
            aria-label="Go to AirScope overview"
            className="group relative flex items-center gap-3 rounded-xl p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
          >
            {/* Brand mark with gradient glow */}
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
              className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_24px_rgba(99,102,241,0.25),0_8px_16px_rgba(6,182,212,0.15)]"
            >
              <span className="relative z-10 size-3.5 rounded-full bg-[var(--background)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" />

              <span className="absolute size-6 rounded-full border border-[var(--background)]/20" />

              <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/[0.08]" />
              
              {/* Animated shimmer effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>

            {/* Brand text with gradient */}
            <div className="min-w-0 leading-none">
              <div className="text-[15px] font-semibold tracking-[-0.025em] text-[var(--foreground)] transition-all duration-200 group-hover:text-[var(--accent-primary)]">
                AirScope
              </div>

              <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)] transition-colors duration-200 group-hover:text-[var(--accent-secondary)]/80">
                Air quality intelligence
              </div>
            </div>
          </NavLink>
        </div>

        {/* ─────────────────────────────────────────────
            Main navigation with vibrant states
        ───────────────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-6"
          aria-label="Primary navigation"
        >
          <div className="mb-3 flex items-center gap-2 px-3">
            <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-primary)]/40 to-transparent" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]/70">
              Workspace
            </span>
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
                    className={`relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40 ${
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                    }`}
                  >
                    {/* Active background with gradient */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-background"
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
                      <motion.div
                        layoutId="sidebar-active-edge"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                        className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_12px_rgba(99,102,241,0.35),0_0_24px_rgba(6,182,212,0.2)]"
                      />
                    )}

                    {/* Hover wash with gradient */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--control-hover)] to-[var(--accent-glow)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    )}

                    {/* Icon with color transitions */}
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
                        className={`transition-all duration-200 ${
                          isActive
                            ? "text-[var(--accent-primary)] drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                            : "text-[var(--foreground-subtle)] group-hover:text-[var(--accent-secondary)]"
                        }`}
                      />
                      
                      {/* Icon glow on active */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-[var(--accent-primary)]/20 blur-md" />
                      )}
                    </motion.span>

                    {/* Label */}
                    <span
                      className={`relative z-10 truncate transition-colors duration-200 ${
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
                        className="relative z-10 ml-auto size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                      />
                    )}

                    {/* Navigation index with accent */}
                    {!isActive && (
                      <span className="relative z-10 ml-auto hidden text-[9px] tabular-nums text-[var(--foreground-faint)] transition-colors group-hover:text-[var(--accent-primary)]/60 xl:block">
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
            System status with vibrant enhancements
        ───────────────────────────────────────────── */}
        <div className="shrink-0 px-3 pb-4">
          <div className="mb-3 flex items-center gap-2 px-3">
            <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-secondary)]/40 to-transparent" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-secondary)]/70">
              System
            </span>
          </div>

          <motion.div
            whileHover={{
              borderColor: "rgba(99, 102, 241, 0.25)",
              backgroundColor: "rgba(99, 102, 241, 0.06)",
            }}
            transition={{
              duration: 0.2,
            }}
            className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)] p-4 shadow-[0_4px_24px_rgba(15,23,42,0.12)] transition-all duration-200"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.02] to-[var(--accent-secondary)]/[0.04] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                  <span className="relative size-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </span>

                <span className="truncate text-xs font-medium text-[var(--foreground-secondary)]">
                  Monitoring online
                </span>
              </div>

              <span className="relative overflow-hidden rounded-full border border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.08] to-emerald-500/[0.04] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-400/80 shadow-[inset_0_0_8px_rgba(52,211,153,0.1)]">
                Live
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                />
              </span>
            </div>

            <p className="relative mt-2 text-[10px] leading-4 text-[var(--foreground-subtle)]">
              Environmental data systems are ready.
            </p>

            <div className="relative mt-3 flex items-center gap-1.5">
              <span className="h-px flex-1 bg-gradient-to-r from-[var(--border-subtle)] to-[var(--accent-primary)]/20" />

              <span className="text-[8px] uppercase tracking-[0.1em] text-[var(--accent-primary)]/60">
                All systems normal
              </span>

              <span className="h-px flex-1 bg-gradient-to-l from-[var(--border-subtle)] to-[var(--accent-secondary)]/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}