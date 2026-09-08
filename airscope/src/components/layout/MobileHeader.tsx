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
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        searchOpen
      ) {
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
      className="relative z-30 flex min-h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--surface-secondary)]/90 px-4 backdrop-blur-xl transition-colors duration-200 lg:hidden"
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
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--control-background)] text-[var(--foreground-muted)] outline-none transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            size={20}
            strokeWidth={1.5}
          />
        </motion.button>

        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[var(--foreground)] shadow-[0_0_24px_rgba(0,0,0,0.06)]">
            <span className="size-2.5 rounded-full bg-[var(--background)]" />

            <span className="absolute size-5 rounded-full border border-[var(--background)]/15" />

            <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/[0.04]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.025em] text-[var(--foreground)]">
              AirScope
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                <span className="relative size-1.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.11em] text-[var(--foreground-subtle)]">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
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
            className={`flex size-10 items-center justify-center rounded-xl border outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)] ${
              searchOpen
                ? "border-[var(--foreground-faint)] bg-[var(--control-hover)] text-[var(--foreground)]"
                : "border-[var(--border)] bg-[var(--control-background)] text-[var(--foreground-muted)] hover:border-[var(--foreground-faint)] hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)]"
            }`}
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={
                  searchOpen
                    ? "close"
                    : "search"
                }
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
            className="absolute inset-x-0 bottom-0 translate-y-full border-b border-[var(--border)] bg-[var(--surface-secondary)]/95 px-4 pb-3 pt-2 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]"
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
                aria-label="Search city or location"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--control-background)] pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition-colors duration-200 placeholder:text-[var(--foreground-subtle)] focus:border-[var(--foreground-faint)] focus:bg-[var(--control-hover)]"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchValue("")
                  }
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
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
                className="text-[var(--foreground-faint)]"
              />

              <span className="text-[10px] text-[var(--foreground-subtle)]">
                Search will use your selected location
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}