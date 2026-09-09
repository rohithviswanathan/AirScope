import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { useLocation } from "../../context/LocationProvider";
import { searchLocation } from "../../api/openMeteo";
import type { OpenMeteoLocation } from "../../api/types";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [searchResults, setSearchResults] = useState<OpenMeteoLocation[]>([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const [searchError, setSearchError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const searchRequestRef = useRef(0);

  const { location, setLocation } = useLocation();

  /*
   * Focus the search field whenever it opens.
   */
  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [searchOpen]);

  /*
   * Close search with Escape.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchValue("");
        setSearchResults([]);
        setSearchError(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  /*
   * Search Open-Meteo after the user pauses typing.
   */
  useEffect(() => {
    const query = searchValue.trim();

    if (!searchOpen || query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);

      return;
    }

    const timeout = window.setTimeout(async () => {
      const requestId = ++searchRequestRef.current;

      setSearchLoading(true);
      setSearchError(null);

      try {
        const results = await searchLocation(query);

        if (requestId !== searchRequestRef.current) {
          return;
        }

        setSearchResults(results.slice(0, 6));
      } catch (error) {
        if (requestId !== searchRequestRef.current) {
          return;
        }

        console.error("AirScope mobile location search error:", error);

        setSearchResults([]);
        setSearchError("Unable to search locations.");
      } finally {
        if (requestId === searchRequestRef.current) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchOpen, searchValue]);

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setSearchError(null);

    searchInputRef.current?.focus();
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchValue("");
    setSearchResults([]);
    setSearchError(null);
  };

  const toggleSearch = () => {
    if (searchOpen) {
      closeSearch();
      return;
    }

    setSearchOpen(true);
  };

  const handleSelectLocation = (nextLocation: OpenMeteoLocation) => {
    setLocation(nextLocation);

    closeSearch();
  };

  const showResults = searchOpen && searchValue.trim().length >= 2;

  return (
    <header
      className="relative z-30 flex min-h-16 shrink-0 items-center border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-secondary)]/95 via-[var(--surface-secondary)]/90 to-[var(--surface-secondary)]/95 backdrop-blur-xl transition-colors duration-200 lg:hidden"
      style={{
        paddingTop: "max(0px, env(safe-area-inset-top))",
      }}
    >
      {/* Gradient accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--accent-primary)]/50 via-[var(--accent-secondary)]/40 to-[var(--accent-primary)]/50 opacity-70" />

      <div className="flex min-h-16 w-full min-w-0 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        {/* Menu with vibrant hover states */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.94,
          }}
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="group relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] text-[var(--foreground-muted)] outline-none transition-all duration-200 hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/0 to-[var(--accent-secondary)]/0 opacity-0 transition-opacity group-hover:opacity-10" />

          <HugeiconsIcon
            icon={Menu01Icon}
            size={20}
            strokeWidth={1.5}
            className="transition-colors group-hover:text-[var(--accent-primary)]"
          />
        </motion.button>

        {/* Brand / current location with enhanced styling */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5 overflow-hidden">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_20px_rgba(99,102,241,0.25),0_4px_12px_rgba(6,182,212,0.15)]">
            <span className="relative z-10 size-2.5 rounded-full bg-[var(--background)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]" />

            <span className="absolute size-5 rounded-full border border-[var(--background)]/15" />

            <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/[0.06]" />

            {/* Shimmer effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="min-w-0 max-w-full">
            <p className="max-w-[150px] truncate text-sm font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:max-w-[180px]">
              {location.name}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />

                <span className="relative size-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.11em] text-emerald-400/80">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Search with gradient states */}
        <div className="flex shrink-0 items-center gap-2">
          <motion.button
            type="button"
            whileTap={{
              scale: 0.94,
            }}
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Search locations"}
            aria-expanded={searchOpen}
            className={`group relative flex size-10 items-center justify-center rounded-xl border outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40 ${
              searchOpen
                ? "border-[var(--accent-secondary)]/40 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/15 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-[var(--accent-primary)]"
                : "border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] text-[var(--foreground-muted)] hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.12)] hover:text-[var(--accent-secondary)]"
            }`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/0 to-[var(--accent-secondary)]/0 opacity-0 transition-opacity group-hover:opacity-10" />

            <AnimatePresence mode="wait" initial={false}>
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
                  icon={searchOpen ? Cancel01Icon : Search01Icon}
                  size={19}
                  strokeWidth={1.5}
                />
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Expandable search with vibrant styling */}
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
            className="absolute inset-x-0 bottom-0 translate-y-full border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-secondary)]/98 via-[var(--surface-secondary)]/95 to-[var(--surface-secondary)]/98 px-4 pb-3 pt-2 shadow-[0_18px_50px_rgba(15,23,42,0.18),0_0_0_1px_rgba(99,102,241,0.08)] backdrop-blur-xl"
          >
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-secondary)]/70"
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeSearch();
                  }
                }}
                placeholder="Search city or location..."
                aria-label="Search city or location"
                autoComplete="off"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--foreground-subtle)] focus:border-[var(--accent-secondary)]/40 focus:bg-[var(--control-hover)] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08),0_0_15px_rgba(6,182,212,0.12)]"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>

            {/* Search results with enhanced styling */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className="mt-2 overflow-hidden rounded-2xl border border-[var(--accent-primary)]/20 bg-[var(--surface-elevated)] shadow-[0_12px_40px_rgba(15,23,42,0.2),0_0_0_1px_rgba(99,102,241,0.08)]"
                >
                  {searchLoading && (
                    <div className="flex items-center gap-3 px-4 py-4">
                      <span className="relative flex size-2">
                        <span className="absolute size-full animate-ping rounded-full bg-[var(--accent-secondary)]/25" />

                        <span className="relative size-2 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                      </span>

                      <span className="text-xs text-[var(--foreground-muted)]">
                        Searching locations...
                      </span>
                    </div>
                  )}

                  {!searchLoading && searchError && (
                    <div className="px-4 py-4">
                      <p className="text-xs text-red-400/80">{searchError}</p>
                    </div>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.length === 0 && (
                      <div className="px-4 py-4">
                        <p className="text-xs font-medium text-[var(--foreground-secondary)]">
                          No locations found
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--foreground-subtle)]">
                          Try another city or place name.
                        </p>
                      </div>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.length > 0 && (
                      <div className="p-1.5">
                        <div className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]/70">
                          Locations
                        </div>

                        <div className="space-y-0.5">
                          {searchResults.map((result) => {
                            const subtitle = [result.admin1, result.country]
                              .filter(Boolean)
                              .join(", ");

                            return (
                              <button
                                key={`${result.id}-${result.latitude}-${result.longitude}`}
                                type="button"
                                onClick={() => handleSelectLocation(result)}
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-gradient-to-r hover:from-[var(--control-hover)] hover:to-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
                              >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-colors group-hover:border-[var(--accent-secondary)]/30">
                                  <HugeiconsIcon
                                    icon={Location01Icon}
                                    size={15}
                                    strokeWidth={1.5}
                                    className="text-[var(--foreground-subtle)] transition-colors group-hover:text-[var(--accent-secondary)]"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-xs font-medium text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]">
                                      {result.name}
                                    </p>

                                    {result.country_code && (
                                      <span className="shrink-0 text-[8px] uppercase tracking-[0.08em] text-[var(--foreground-faint)]">
                                        {result.country_code}
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-0.5 truncate text-[10px] text-[var(--foreground-subtle)]">
                                    {subtitle}
                                  </p>
                                </div>

                                <span className="shrink-0 text-[10px] text-[var(--accent-secondary)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                                  →
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Helper text with accent */}
            {!showResults && (
              <div className="mt-2 flex items-center gap-2 px-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className="text-[var(--accent-primary)]/60"
                />

                <span className="text-[10px] text-[var(--foreground-subtle)]">
                  Search for a city or location
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
