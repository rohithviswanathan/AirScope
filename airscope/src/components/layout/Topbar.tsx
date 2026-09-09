import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Location01Icon,
  Moon02Icon,
  Search01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";

import { useTheme } from "../theme/ThemeProvider";
import { useLocation } from "../../context/LocationProvider";

import { searchLocation } from "../../api/openMeteo";
import type { OpenMeteoLocation } from "../../api/types";

export function Topbar() {
  const [searchValue, setSearchValue] =
    useState("");

  const [searchFocused, setSearchFocused] =
    useState(false);

  const [
    searchResults,
    setSearchResults,
  ] = useState<OpenMeteoLocation[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchError, setSearchError] =
    useState<string | null>(null);

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const {
    location,
    setLocation,
  } = useLocation();

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const searchRequestRef =
    useRef(0);

  /*
   * Cmd/Ctrl + K focuses the search.
   */
  useEffect(() => {
    const handleShortcut = (
      event: KeyboardEvent,
    ) => {
      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key.toLowerCase() ===
          "k"
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

  /*
   * Search Open-Meteo when the user stops typing.
   *
   * The small delay prevents an API request on every
   * individual keystroke.
   */
  useEffect(() => {
    const query =
      searchValue.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);

      return;
    }

    const timeout = window.setTimeout(
      async () => {
        const requestId =
          ++searchRequestRef.current;

        setSearchLoading(true);
        setSearchError(null);

        try {
          const results =
            await searchLocation(
              query,
            );

        if (
          requestId !==
          searchRequestRef.current
        ) {
          return;
        }

          setSearchResults(
            results.slice(0, 6),
          );
        } catch (error) {
          if (
            requestId !==
            searchRequestRef.current
          ) {
            return;
          }

          console.error(
            "AirScope location search error:",
            error,
          );

          setSearchResults([]);

          setSearchError(
            "Unable to search locations.",
          );
        } finally {
          if (
            requestId ===
            searchRequestRef.current
          ) {
            setSearchLoading(false);
          }
        }
      },
      350,
    );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [searchValue]);

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setSearchError(null);

    searchInputRef.current?.focus();
  };

  const handleSelectLocation = (
    nextLocation: OpenMeteoLocation,
  ) => {
    setLocation(
      nextLocation,
    );

    setSearchValue("");
    setSearchResults([]);
    setSearchError(null);
    setSearchFocused(false);

    searchInputRef.current?.blur();
  };

  const showSearchPanel =
    searchFocused &&
    searchValue.trim().length >=
      2;

  const shortcutLabel =
    typeof navigator !==
      "undefined" &&
    navigator.platform
      .toLowerCase()
      .includes("mac")
      ? "⌘"
      : "Ctrl";

  return (
    <header className="relative z-30 hidden h-[76px] shrink-0 items-center border-b border-[var(--border)] bg-[var(--surface-secondary)]/90 px-6 backdrop-blur-xl transition-colors duration-200 lg:flex xl:px-8">
      {/* Subtle gradient accent bar at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] opacity-60" />
      
      <div className="flex w-full items-center gap-5">
        {/* ------------------------------------------------------------------ */}
        {/* Current location with vibrant accent                               */}
        {/* ------------------------------------------------------------------ */}

        <motion.button
          type="button"
          whileTap={{
            scale: 0.985,
          }}
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left outline-none transition-all hover:bg-[var(--control-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
          aria-label={`Current location: ${location.name}, ${location.country}`}
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--accent-glow)] transition-all duration-200 group-hover:border-[var(--accent-secondary)]/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <HugeiconsIcon
              icon={Location01Icon}
              size={17}
              strokeWidth={1.5}
              className="text-[var(--accent-primary)] transition-colors duration-200 group-hover:text-[var(--accent-secondary)]"
            />

            <span className="absolute -right-0.5 -top-0.5 flex size-2">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-2 rounded-full border border-[var(--surface-secondary)] bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="max-w-[150px] truncate text-sm font-medium tracking-[-0.01em] text-[var(--foreground)]">
                {location.name}
              </p>

              <span className="text-[9px] uppercase tracking-[0.08em] text-[var(--foreground-faint)]">
                {location.country_code ??
                  location.country_code}
              </span>
            </div>

            <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-[var(--foreground-subtle)]">
              {location.admin1
                ? `${location.admin1}, ${location.country}`
                : location.country}
            </p>
          </div>
        </motion.button>

        {/* Divider with gradient */}
        <div className="relative h-8 w-px shrink-0 bg-gradient-to-b from-[var(--accent-primary)]/20 via-[var(--border)] to-[var(--accent-secondary)]/20" />

        {/* ------------------------------------------------------------------ */}
        {/* Search with vibrant focus states                                   */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="relative w-full max-w-[520px]">
            <motion.div
              animate={{
                scale:
                  searchFocused
                    ? 1.005
                    : 1,
                opacity:
                  searchFocused
                    ? 1
                    : 0,
              }}
              transition={{
                duration: 0.18,
              }}
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/10 to-[var(--accent-primary)]/10 blur-md"
            />

            <div
              className={`relative flex h-10 items-center overflow-hidden rounded-xl border bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-all duration-200 ${
                searchFocused
                  ? "border-[var(--accent-secondary)]/40 shadow-[0_0_0_4px_rgba(99,102,241,0.08),0_8px_30px_rgba(6,182,212,0.12)]"
                  : "border-[var(--border)] hover:border-[var(--accent-primary)]/30"
              }`}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className={`ml-3.5 shrink-0 transition-colors duration-200 ${
                  searchFocused
                    ? "text-[var(--accent-secondary)]"
                    : "text-[var(--foreground-subtle)]"
                }`}
              />

              <input
                ref={
                  searchInputRef
                }
                type="search"
                value={
                  searchValue
                }
                onChange={(
                  event,
                ) =>
                  setSearchValue(
                    event.target
                      .value,
                  )
                }
                onFocus={() =>
                  setSearchFocused(
                    true,
                  )
                }
                onBlur={() => {
                  window.setTimeout(
                    () => {
                      setSearchFocused(
                        false,
                      );
                    },
                    120,
                  );
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Escape"
                  ) {
                    clearSearch();
                    setSearchFocused(
                      false,
                    );
                  }
                }}
                placeholder="Search city or location..."
                aria-label="Search city or location"
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-subtle)]"
              />

              {searchValue ? (
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
                  onMouseDown={(
                    event,
                  ) =>
                    event.preventDefault()
                  }
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                  className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
                >
                  <HugeiconsIcon
                    icon={
                      Cancel01Icon
                    }
                    size={14}
                    strokeWidth={1.5}
                  />
                </motion.button>
              ) : (
                <div className="mr-2 flex shrink-0 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--control-background)] px-1.5 py-0.5 text-[9px] text-[var(--foreground-faint)]">
                  <span>
                    {
                      shortcutLabel
                    }
                  </span>

                  <span className="text-[var(--accent-primary)]">
                    K
                  </span>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Search results with enhanced styling                            */}
            {/* ---------------------------------------------------------------- */}

            <AnimatePresence>
              {showSearchPanel && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                    scale: 0.99,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                    scale: 0.99,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[var(--accent-primary)]/20 bg-[var(--surface-elevated)] shadow-[0_20px_60px_rgba(15,23,42,0.25),0_0_0_1px_rgba(99,102,241,0.08)] backdrop-blur-xl"
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

                  {!searchLoading &&
                    searchError && (
                      <div className="px-4 py-4">
                        <p className="text-xs text-red-400/80">
                          {
                            searchError
                          }
                        </p>
                      </div>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    searchResults.length ===
                      0 && (
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
                    searchResults.length >
                      0 && (
                      <div className="p-1.5">
                        <div className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]/60">
                          Locations
                        </div>

                        <div className="space-y-0.5">
                          {searchResults.map(
                            (
                              result,
                            ) => {
                              const countryCode =
                                result.country_code ??
                                "";

                              const subtitle =
                                [
                                  result.admin1,
                                  result.country,
                                ]
                                  .filter(
                                    Boolean,
                                  )
                                  .join(
                                    ", ",
                                  );

                              return (
                                <button
                                  key={`${result.id}-${result.latitude}-${result.longitude}`}
                                  type="button"
                                  onMouseDown={(
                                    event,
                                  ) =>
                                    event.preventDefault()
                                  }
                                  onClick={() =>
                                    handleSelectLocation(
                                      result,
                                    )
                                  }
                                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-gradient-to-r hover:from-[var(--control-hover)] hover:to-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
                                >
                                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-colors group-hover:border-[var(--accent-secondary)]/30">
                                    <HugeiconsIcon
                                      icon={
                                        Location01Icon
                                      }
                                      size={
                                        15
                                      }
                                      strokeWidth={
                                        1.5
                                      }
                                      className="text-[var(--foreground-subtle)] transition-colors group-hover:text-[var(--accent-secondary)]"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="truncate text-xs font-medium text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]">
                                        {
                                          result.name
                                        }
                                      </p>

                                      {countryCode && (
                                        <span className="shrink-0 text-[8px] uppercase tracking-[0.08em] text-[var(--foreground-faint)]">
                                          {
                                            countryCode
                                          }
                                        </span>
                                      )}
                                    </div>

                                    <p className="mt-0.5 truncate text-[10px] text-[var(--foreground-subtle)]">
                                      {
                                        subtitle
                                      }
                                    </p>
                                  </div>

                                  <span className="shrink-0 text-[10px] text-[var(--accent-secondary)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                                    →
                                  </span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="relative h-8 w-px shrink-0 bg-gradient-to-b from-[var(--accent-primary)]/20 via-[var(--border)] to-[var(--accent-secondary)]/20" />

        {/* ------------------------------------------------------------------ */}
        {/* Right actions with vibrant accents                                 */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex shrink-0 items-center gap-2">
          {/* Live data with enhanced glow */}
          <div className="hidden items-center gap-2 rounded-full border border-[var(--accent-secondary)]/20 bg-gradient-to-r from-emerald-400/[0.06] to-[var(--accent-secondary)]/[0.04] px-3 py-1.5 md:flex">
            <span className="relative flex size-1.5">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </span>

            <span className="text-[10px] font-medium text-emerald-400/80">
              Live data
            </span>
          </div>

          {/* Theme toggle with gradient hover */}
          <motion.button
            type="button"
            whileTap={{
              scale: 0.93,
            }}
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            aria-pressed={
              theme === "light"
            }
            title={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="group relative flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] text-[var(--foreground-muted)] outline-none transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
          >
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/0 to-[var(--accent-secondary)]/0 opacity-0 transition-opacity group-hover:opacity-10" />
            
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
                    theme ===
                    "dark"
                      ? Sun03Icon
                      : Moon02Icon
                  }
                  size={17}
                  strokeWidth={1.5}
                  className="transition-colors group-hover:text-[var(--accent-primary)]"
                />
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Search focus accent with gradient */}
      <motion.div
        aria-hidden="true"
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX:
            searchFocused ? 1 : 0,
          opacity:
            searchFocused ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-40 origin-center -translate-x-1/2 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)]"
      />
    </header>
  );
}