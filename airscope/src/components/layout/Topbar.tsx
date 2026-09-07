import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  Moon02Icon,
  Search01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "../theme/ThemeProvider";

export function Topbar() {
  const [searchValue, setSearchValue] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] =
    useState(false);

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * Command shortcut
   * Cmd/Ctrl + K focuses the search field.
   */
  useEffect(() => {
    const handleShortcut = (
      event: KeyboardEvent,
    ) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut,
      );
    };
  }, []);

  const clearSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  return (
    <header className="relative z-30 hidden h-[76px] shrink-0 items-center border-b border-white/[0.06] bg-[#090E14]/75 px-6 backdrop-blur-xl lg:flex xl:px-8">
      <div className="flex w-full items-center gap-5">
        {/* ─────────────────────────────────────────────
            Current location
        ───────────────────────────────────────────── */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left outline-none transition-colors hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-white/15"
          aria-label="Current location: Bengaluru, India"
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] transition-colors duration-200 group-hover:border-white/[0.11] group-hover:bg-white/[0.045]">
            <HugeiconsIcon
              icon={Location01Icon}
              size={17}
              strokeWidth={1.5}
              className="text-white/40 transition-colors duration-200 group-hover:text-white/70"
            />

            {/* Location status */}
            <span className="absolute -right-0.5 -top-0.5 flex size-2">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-2 rounded-full border border-[#090E14] bg-emerald-400" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium tracking-[-0.01em] text-white/85">
                Bengaluru, India
              </p>

              <span className="text-[9px] text-white/15">
                LOCAL
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-white/25">
              Current location
            </p>
          </div>
        </motion.button>

        {/* Divider */}
        <div className="h-8 w-px shrink-0 bg-white/[0.06]" />

        {/* ─────────────────────────────────────────────
            Search
        ───────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 justify-center">
          <motion.div
            animate={{
              scale: searchFocused ? 1.005 : 1,
            }}
            transition={{
              duration: 0.18,
            }}
            className="relative w-full max-w-[500px]"
          >
            {/* Search glow */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: searchFocused ? 1 : 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="pointer-events-none absolute -inset-px rounded-xl bg-white/[0.035] blur-sm"
            />

            <div
              className={`relative flex h-10 items-center overflow-hidden rounded-xl border bg-white/[0.025] transition-colors duration-200 ${
                searchFocused
                  ? "border-white/[0.14] bg-white/[0.04]"
                  : "border-white/[0.07] hover:border-white/[0.1]"
              }`}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className={`ml-3.5 shrink-0 transition-colors duration-200 ${
                  searchFocused
                    ? "text-white/50"
                    : "text-white/25"
                }`}
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
                onFocus={() =>
                  setSearchFocused(true)
                }
                onBlur={() =>
                  setSearchFocused(false)
                }
                placeholder="Search city or location..."
                aria-label="Search city or location"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/25"
              />

              {/* Clear */}
              {searchValue && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </motion.button>
              )}

              {/* Shortcut */}
              {!searchValue && (
                <div className="mr-2 flex shrink-0 items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.015] px-1.5 py-0.5 text-[9px] text-white/20">
                  <span>
                    {navigator.platform
                      .toLowerCase()
                      .includes("mac")
                      ? "⌘"
                      : "Ctrl"}
                  </span>

                  <span>K</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px shrink-0 bg-white/[0.06]" />

        {/* ─────────────────────────────────────────────
            Right actions
        ───────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Live data */}
          <motion.div
            whileHover={{
              backgroundColor:
                "rgba(52,211,153,0.055)",
              borderColor:
                "rgba(52,211,153,0.15)",
            }}
            transition={{
              duration: 0.2,
            }}
            className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-1.5 md:flex"
          >
            <span className="relative flex size-1.5">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
            </span>

            <span className="text-[10px] font-medium text-emerald-300/65">
              Live data
            </span>
          </motion.div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            aria-pressed={theme === "light"}
            title={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="flex size-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-white/35 outline-none transition-colors hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white/70 focus-visible:ring-2 focus-visible:ring-white/15"
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.span
                key={theme}
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
                    theme === "dark"
                      ? Sun03Icon
                      : Moon02Icon
                  }
                  size={17}
                  strokeWidth={1.5}
                />
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Avatar */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            aria-label="Open profile"
            className="group relative flex size-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.045] text-[10px] font-semibold text-white/70 outline-none transition-colors hover:border-white/[0.12] hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-white/15"
          >
            <span className="absolute inset-[2px] rounded-[8px] border border-white/[0.035]" />

            <span className="relative z-10">
              R
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom accent */}
      <motion.div
        aria-hidden="true"
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: searchFocused ? 1 : 0,
          opacity: searchFocused ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-40 origin-center -translate-x-1/2 bg-white/20"
      />
    </header>
  );
}