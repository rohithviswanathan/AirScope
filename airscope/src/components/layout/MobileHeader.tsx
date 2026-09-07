import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({
  onMenuClick,
}: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [searchOpen]);

  const toggleSearch = () => {
    setSearchOpen((current) => !current);

    if (searchOpen) {
      setSearchValue("");
    }
  };

  return (
    <header
      className="relative z-30 flex min-h-16 shrink-0 items-center border-b border-white/[0.06] bg-[#090E14]/85 px-4 backdrop-blur-xl lg:hidden"
      style={{
        paddingTop:
          "max(0px, env(safe-area-inset-top))",
      }}
    >
      <div className="flex min-h-16 w-full items-center justify-between gap-3">
        {/* Menu */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-white/50 transition-colors hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            size={20}
            strokeWidth={1.5}
          />
        </motion.button>

        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-[0_0_24px_rgba(255,255,255,0.08)]">
            <span className="size-2.5 rounded-full bg-[#0A0F15]" />

            <span className="absolute size-5 rounded-full border border-[#0A0F15]/15" />

            <span className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.06]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.025em] text-white">
              AirScope
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                <span className="relative size-1.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.11em] text-white/25">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Search / Location */}
        <div className="flex shrink-0 items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={toggleSearch}
            aria-label={
              searchOpen
                ? "Close search"
                : "Search locations"
            }
            aria-expanded={searchOpen}
            className={`flex size-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
              searchOpen
                ? "border-white/[0.11] bg-white/[0.07] text-white"
                : "border-white/[0.06] bg-white/[0.025] text-white/50 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={searchOpen ? "close" : "search"}
                initial={{
                  opacity: 0,
                  rotate: -45,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 45,
                  scale: 0.7,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="flex"
              >
                <HugeiconsIcon
                  icon={
                    searchOpen
                      ? Cancel01Icon
                      : Search01Icon
                  }
                  size={19}
                  strokeWidth={1.5}
                />
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Expandable search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -6,
            }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 bottom-0 translate-y-full border-b border-white/[0.06] bg-[#090E14]/95 px-4 pb-3 pt-2 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          >
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value,
                  )
                }
                placeholder="Search city or location..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-10 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.14] focus:bg-white/[0.04]"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 px-1">
              <HugeiconsIcon
                icon={Location01Icon}
                size={12}
                strokeWidth={1.5}
                className="text-white/20"
              />

              <span className="text-[10px] text-white/25">
                Search will use your selected location
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}