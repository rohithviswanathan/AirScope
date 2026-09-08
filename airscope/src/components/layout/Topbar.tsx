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

          /*
           * Ignore an older request if the user has
           * already typed something newer.
           */
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
    <header className="relative z-30 hidden h-[76px] shrink-0 items-center border-b border-[var(--border)] bg-[var(--surface-secondary)]/80 px-6 backdrop-blur-xl transition-colors duration-200 lg:flex xl:px-8">
      <div className="flex w-full items-center gap-5">
        {/* ------------------------------------------------------------------ */}
        {/* Current location                                                   */}
        {/* ------------------------------------------------------------------ */}

        <motion.button
          type="button"
          whileTap={{
            scale: 0.985,
          }}
          className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left outline-none transition-colors hover:bg-[var(--control-background)] focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
          aria-label={`Current location: ${location.name}, ${location.country}`}
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--control-background)] transition-colors duration-200 group-hover:border-[var(--foreground-faint)] group-hover:bg-[var(--control-hover)]">
            <HugeiconsIcon
              icon={Location01Icon}
              size={17}
              strokeWidth={1.5}
              className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
            />

            <span className="absolute -right-0.5 -top-0.5 flex size-2">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-2 rounded-full border border-[var(--surface-secondary)] bg-emerald-400" />
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

        {/* Divider */}
        <div className="h-8 w-px shrink-0 bg-[var(--border)]" />

        {/* ------------------------------------------------------------------ */}
        {/* Search                                                             */}
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
              className="pointer-events-none absolute -inset-px rounded-xl bg-[var(--control-hover)] blur-sm"
            />

            <div
              className={`relative flex h-10 items-center overflow-visible rounded-xl border bg-[var(--control-background)] transition-colors duration-200 ${
                searchFocused
                  ? "border-[var(--foreground-faint)] bg-[var(--control-hover)]"
                  : "border-[var(--border)] hover:border-[var(--foreground-faint)]"
              }`}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className={`ml-3.5 shrink-0 transition-colors duration-200 ${
                  searchFocused
                    ? "text-[var(--foreground-muted)]"
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
                  /*
                   * Delay closing so a result button can
                   * receive its click before the dropdown disappears.
                   */
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
                  className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
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

                  <span>
                    K
                  </span>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Search results                                                    */}
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
                  className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                >
                  {searchLoading && (
                    <div className="flex items-center gap-3 px-4 py-4">
                      <span className="relative flex size-2">
                        <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />
                        <span className="relative size-2 rounded-full bg-emerald-400" />
                      </span>

                      <span className="text-xs text-[var(--foreground-muted)]">
                        Searching locations...
                      </span>
                    </div>
                  )}

                  {!searchLoading &&
                    searchError && (
                      <div className="px-4 py-4">
                        <p className="text-xs text-red-300/75">
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
                        <div className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
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
                                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
                                >
                                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--control-background)]">
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
                                      className="text-[var(--foreground-subtle)] transition-colors group-hover:text-[var(--foreground-secondary)]"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="truncate text-xs font-medium text-[var(--foreground-secondary)]">
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

                                  <span className="shrink-0 text-[10px] text-[var(--foreground-faint)] opacity-0 transition-opacity group-hover:opacity-100">
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

        {/* Divider */}
        <div className="h-8 w-px shrink-0 bg-[var(--border)]" />

        {/* ------------------------------------------------------------------ */}
        {/* Right actions                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex shrink-0 items-center gap-2">
          {/* Live data */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-1.5 md:flex">
            <span className="relative flex size-1.5">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

              <span className="relative size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
            </span>

            <span className="text-[10px] font-medium text-emerald-300/65">
              Live data
            </span>
          </div>

          {/* Theme */}
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
            className="flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--control-background)] text-[var(--foreground-muted)] outline-none transition-colors hover:border-[var(--foreground-faint)] hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
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
                    theme ===
                    "dark"
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
            whileTap={{
              scale: 0.94,
            }}
            aria-label="Open profile"
            className="group relative flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--control-background)] text-[10px] font-semibold text-[var(--foreground-secondary)] outline-none transition-colors hover:border-[var(--foreground-faint)] hover:bg-[var(--control-hover)] focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
          >
            <span className="absolute inset-[2px] rounded-[8px] border border-[var(--border-subtle)]" />

            <span className="relative z-10">
              R
            </span>
          </motion.button>
        </div>
      </div>

      {/* Search focus accent */}
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
        className="pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-40 origin-center -translate-x-1/2 bg-[var(--foreground-secondary)]/30"
      />
    </header>
  );
}