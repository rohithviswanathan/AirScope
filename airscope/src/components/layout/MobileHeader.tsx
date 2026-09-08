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
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { useLocation } from "../../context/LocationProvider";
import { searchLocation } from "../../api/openMeteo";
import type { OpenMeteoLocation } from "../../api/types";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({
  onMenuClick,
}: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<OpenMeteoLocation[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchError, setSearchError] =
    useState<string | null>(null);

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  const searchRequestRef =
    useRef(0);

  const { location, setLocation } =
    useLocation();

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
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        searchOpen
      ) {
        setSearchOpen(false);
        setSearchValue("");
        setSearchResults([]);
        setSearchError(null);
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

  /*
   * Search Open-Meteo after the user pauses typing.
   */
  useEffect(() => {
    const query =
      searchValue.trim();

    if (
      !searchOpen ||
      query.length < 2
    ) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);

      return;
    }

    const timeout =
      window.setTimeout(
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
             * Ignore stale responses from older
             * searches.
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
              "AirScope mobile location search error:",
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
  }, [
    searchOpen,
    searchValue,
  ]);

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

  const handleSelectLocation = (
    nextLocation: OpenMeteoLocation,
  ) => {
    setLocation(
      nextLocation,
    );

    closeSearch();
  };

  const showResults =
    searchOpen &&
    searchValue.trim().length >=
      2;

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
          whileTap={{
            scale: 0.94,
          }}
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

        {/* Brand / current location */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[var(--foreground)] shadow-[0_0_24px_rgba(0,0,0,0.06)]">
            <span className="size-2.5 rounded-full bg-[var(--background)]" />

            <span className="absolute size-5 rounded-full border border-[var(--background)]/15" />

            <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/[0.04]" />
          </div>

          <div className="min-w-0">
            <p className="max-w-[150px] truncate text-sm font-semibold tracking-[-0.025em] text-[var(--foreground)]">
              {location.name}
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
            whileTap={{
              scale: 0.94,
            }}
            onClick={
              toggleSearch
            }
            aria-label={
              searchOpen
                ? "Close search"
                : "Search locations"
            }
            aria-expanded={
              searchOpen
            }
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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
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
                    event.target.value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Escape"
                  ) {
                    closeSearch();
                  }
                }}
                placeholder="Search city or location..."
                aria-label="Search city or location"
                autoComplete="off"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--control-background)] pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition-colors duration-200 placeholder:text-[var(--foreground-subtle)] focus:border-[var(--foreground-faint)] focus:bg-[var(--control-hover)]"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)]"
                >
                  <HugeiconsIcon
                    icon={
                      Cancel01Icon
                    }
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>

            {/* Search results */}
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
                  className="mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg"
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
                                      size={15}
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

                                      {result.country_code && (
                                        <span className="shrink-0 text-[8px] uppercase tracking-[0.08em] text-[var(--foreground-faint)]">
                                          {
                                            result.country_code
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

            {/* Helper text */}
            {!showResults && (
              <div className="mt-2 flex items-center gap-2 px-1">
                <HugeiconsIcon
                  icon={
                    Location01Icon
                  }
                  size={12}
                  strokeWidth={1.5}
                  className="text-[var(--foreground-faint)]"
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