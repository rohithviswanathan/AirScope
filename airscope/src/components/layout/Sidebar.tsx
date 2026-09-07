import { useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  mainNavigation,
  utilityNavigation,
} from "../../lib/navigation";

export function Sidebar() {
  const [activeItem, setActiveItem] =
    useState("Overview");

  return (
    <aside className="hidden h-dvh w-[248px] shrink-0 border-r border-white/[0.06] bg-[#090E14] lg:flex">
      <div className="flex h-full w-full flex-col">
        {/* ─────────────────────────────────────────────
            Brand
        ───────────────────────────────────────────── */}
        <div className="flex h-[76px] shrink-0 items-center border-b border-white/[0.06] px-5">
          <motion.button
            type="button"
            initial={false}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 rounded-xl p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/15"
          >
            {/* Brand mark */}
            <motion.div
              variants={{
                hover: {
                  rotate: -4,
                  scale: 1.04,
                },
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 22,
              }}
              className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_24px_rgba(255,255,255,0.04)]"
            >
              <span className="size-3.5 rounded-full bg-[#0A0F15]" />

              <motion.span
                variants={{
                  hover: {
                    scale: 1.08,
                    opacity: 1,
                  },
                }}
                initial={{
                  scale: 0.9,
                  opacity: 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="absolute size-6 rounded-full border border-[#0A0F15]/20"
              />

              <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/[0.04]" />
            </motion.div>

            {/* Brand text */}
            <div className="min-w-0 leading-none">
              <div className="text-[15px] font-semibold tracking-[-0.025em] text-white transition-colors duration-200 group-hover:text-white/95">
                AirScope
              </div>

              <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/25 transition-colors duration-200 group-hover:text-white/35">
                Air quality intelligence
              </div>
            </div>
          </motion.button>
        </div>

        {/* ─────────────────────────────────────────────
            Main navigation
        ───────────────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-6"
          aria-label="Primary navigation"
        >
          <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Workspace
          </div>

          <div className="space-y-1">
            {mainNavigation.map((item, index) => {
              const active =
                activeItem === item.label;

              return (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setActiveItem(item.label)
                  }
                  initial={false}
                  whileHover={{
                    x: active ? 0 : 2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                  }}
                  className={`group relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/15 ${
                    active
                      ? "text-white"
                      : "text-white/40 hover:text-white/75"
                  }`}
                >
                  {/* Active background */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-background"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-xl bg-white/[0.065]"
                    />
                  )}

                  {/* Active edge */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-edge"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-white/75 shadow-[0_0_8px_rgba(255,255,255,0.16)]"
                    />
                  )}

                  {/* Hover wash */}
                  {!active && (
                    <span className="absolute inset-0 rounded-xl bg-white/[0.025] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  )}

                  {/* Icon */}
                  <motion.span
                    animate={{
                      scale: active ? 1 : 0.96,
                    }}
                    whileHover={{
                      scale: 1.06,
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
                        active
                          ? "text-white/90"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    />
                  </motion.span>

                  {/* Label */}
                  <span
                    className={`relative z-10 truncate transition-colors duration-200 ${
                      active
                        ? "font-medium text-white/90"
                        : "text-white/45 group-hover:text-white/75"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {active && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="relative z-10 ml-auto size-1.5 rounded-full bg-white/65"
                    />
                  )}

                  {/* Small nav index */}
                  {!active && (
                    <span className="relative z-10 ml-auto hidden text-[9px] tabular-nums text-white/10 transition-colors group-hover:text-white/20 xl:block">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* ─────────────────────────────────────────────
            System status
        ───────────────────────────────────────────── */}
        <div className="shrink-0 px-3 pb-4">
          <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
            System
          </div>

          <motion.div
            whileHover={{
              borderColor:
                "rgba(255,255,255,0.10)",
              backgroundColor:
                "rgba(255,255,255,0.035)",
            }}
            transition={{
              duration: 0.2,
            }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {/* Status indicator */}
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                  <span className="relative size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.35)]" />
                </span>

                <span className="truncate text-xs font-medium text-white/60">
                  Monitoring online
                </span>
              </div>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-300/55">
                Live
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-white/25">
              Environmental data systems are ready.
            </p>

            {/* Status line */}
            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-px flex-1 bg-white/[0.05]" />

              <span className="text-[8px] uppercase tracking-[0.1em] text-white/15">
                All systems normal
              </span>

              <span className="h-px flex-1 bg-white/[0.05]" />
            </div>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────
            Utility navigation
        ───────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
          {utilityNavigation.map((item) => (
            <motion.button
              key={item.label}
              type="button"
              whileHover={{
                x: 2,
              }}
              whileTap={{
                scale: 0.985,
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
              }}
              className="group flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-white/40 outline-none transition-colors duration-200 hover:bg-white/[0.035] hover:text-white/75 focus-visible:ring-2 focus-visible:ring-white/15"
            >
              <HugeiconsIcon
                icon={item.icon}
                size={18}
                strokeWidth={1.5}
                className="text-white/30 transition-colors duration-200 group-hover:text-white/60"
              />

              <span>{item.label}</span>

              <span className="ml-auto text-[9px] text-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  );
}