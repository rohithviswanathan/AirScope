import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileHeader } from "./MobileHeader";
import { mainNavigation, utilityNavigation } from "../../lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C11] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <MobileHeader
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          <main className="relative min-h-0 flex-1 overflow-hidden">
            {/* Ambient atmosphere */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -left-40 -top-40 size-[520px] rounded-full bg-cyan-500/[0.035] blur-[120px]" />

              <div className="absolute right-[-180px] top-[15%] size-[460px] rounded-full bg-blue-500/[0.025] blur-[120px]" />

              <div className="absolute bottom-[-220px] left-[35%] size-[500px] rounded-full bg-emerald-500/[0.018] blur-[140px]" />
            </div>

            <div className="relative h-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 330,
                damping: 32,
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.06] bg-[#090E14] lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white">
                    <span className="size-2.5 rounded-full bg-[#0A0F15]" />
                  </div>

                  <span className="text-sm font-semibold text-white">
                    AirScope
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="flex size-9 items-center justify-center rounded-xl text-white/45 hover:bg-white/[0.05] hover:text-white"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={19}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <nav className="flex-1 px-3 py-6">
                <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Workspace
                </div>

                <div className="space-y-1">
                  {mainNavigation.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm ${
                        index === 0
                          ? "bg-white/[0.07] text-white"
                          : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={1.5}
                      />

                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="border-t border-white/[0.06] p-3">
                {utilityNavigation.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/45 hover:bg-white/[0.04] hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={18}
                      strokeWidth={1.5}
                    />

                    {item.label}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}