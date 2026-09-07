import { useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";

import { mainNavigation, utilityNavigation } from "../../lib/navigation";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <aside className="hidden h-screen w-[248px] shrink-0 border-r border-white/[0.06] bg-[#090E14] lg:flex">
      <div className="flex h-full w-full flex-col">
        {/* Brand */}
        <div className="flex h-[76px] items-center border-b border-white/[0.06] px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-white">
              <span className="size-3.5 rounded-full bg-[#0A0F15]" />

              <span className="absolute size-6 rounded-full border border-[#0A0F15]/20" />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                AirScope
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-wide text-white/30">
                AIR QUALITY INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Workspace
          </div>

          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const active = activeItem === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveItem(item.label)}
                  className="relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-200"
                >
                  {active && (
                    <motion.div
                      layoutId="active-navigation"
                      className="absolute inset-0 rounded-xl bg-white/[0.065]"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}

                  <HugeiconsIcon
                    icon={item.icon}
                    size={18}
                    strokeWidth={1.5}
                    className={`relative z-10 transition-colors ${
                      active ? "text-white" : "text-white/35"
                    }`}
                  />

                  <span
                    className={`relative z-10 transition-colors ${
                      active ? "text-white" : "text-white/45"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* System status */}
        <div className="px-3 pb-4">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            System
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/40" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-xs font-medium text-white/60">
                Monitoring online
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-white/30">
              Environmental data systems are ready.
            </p>
          </div>
        </div>

        {/* Utility navigation */}
        <div className="border-t border-white/[0.06] px-3 py-3">
          {utilityNavigation.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              <HugeiconsIcon
                icon={item.icon}
                size={18}
                strokeWidth={1.5}
              />

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}