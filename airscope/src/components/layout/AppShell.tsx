import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
   * Close the mobile navigation with Escape
   * and prevent the page behind the drawer from scrolling.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
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
    <div className="min-h-dvh bg-[#080C11] text-white">
      <div className="flex min-h-dvh">
        {/* Desktop navigation */}
        <Sidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col h-dvh">
          {/* Desktop topbar */}
          <Topbar />

          {/* Mobile topbar */}
          <MobileHeader
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* Atmospheric background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              {/* Ambient glows */}
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

              <motion.div
                className="absolute -right-56 top-[12%] size-[560px] rounded-full bg-blue-500/[0.022] blur-[140px]"
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

              <div className="absolute bottom-[-260px] left-[30%] size-[520px] rounded-full bg-emerald-500/[0.012] blur-[150px]" />

              {/* Very subtle dashboard grid */}
              <div
                className="absolute inset-0 opacity-[0.22]"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(255,255,255,0.018) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(255,255,255,0.018) 1px,
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
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#080C11]/25 to-transparent" />
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
              className="fixed inset-y-0 left-0 z-50 flex min-h-dvh w-[min(86vw,310px)] flex-col border-r border-white/[0.07] bg-[#090E14] shadow-[20px_0_60px_rgba(0,0,0,0.28)] lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <span className="size-2.5 rounded-full bg-[#0A0F15]" />
                    <span className="absolute size-5 rounded-full border border-[#0A0F15]/15" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-[-0.02em] text-white">
                      AirScope
                    </p>

                    <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
                      Air quality intelligence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation"
                  className="flex size-9 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
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
                <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Workspace
                </div>

                <div className="space-y-1">
                  {mainNavigation.map(
                    (item, index) => {
                      const isActive = index === 0;

                      return (
                        <motion.button
                          key={item.label}
                          type="button"
                          initial={{
                            opacity: 0,
                            x: -8,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.22,
                            delay:
                              0.06 +
                              index * 0.04,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          onClick={
                            closeMobileMenu
                          }
                          className={`group relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/15 ${
                            isActive
                              ? "text-white"
                              : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-nav"
                              className="absolute inset-0 rounded-xl bg-white/[0.07]"
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 32,
                              }}
                            />
                          )}

                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-white/70" />
                          )}

                          <HugeiconsIcon
                            icon={item.icon}
                            size={18}
                            strokeWidth={1.5}
                            className={`relative z-10 transition-colors ${
                              isActive
                                ? "text-white/90"
                                : "text-white/30 group-hover:text-white/60"
                            }`}
                          />

                          <span className="relative z-10">
                            {item.label}
                          </span>
                        </motion.button>
                      );
                    },
                  )}
                </div>
              </nav>

              {/* Bottom area */}
              <div className="shrink-0 border-t border-white/[0.06] p-3">
                {utilityNavigation.map(
                  (item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={1.5}
                      />

                      <span>{item.label}</span>
                    </button>
                  ),
                )}

                {/* Status */}
                <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-1.5">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-400/35" />
                      <span className="relative size-1.5 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-[10px] font-medium text-white/55">
                      Monitoring online
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] leading-4 text-white/25">
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