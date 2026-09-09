import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons";

import { AirQualityMap } from "../../map/components/AirQualityMap";
import { useLocation } from "../../../context/LocationProvider";

export function LocationsPage() {
  const { location } = useLocation();

  return (
    <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Subtle background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-gradient-to-br from-[var(--accent-primary)]/[0.03] to-[var(--accent-secondary)]/[0.02] blur-[100px]" />
        <div className="absolute top-[20%] -left-40 size-[450px] rounded-full bg-gradient-to-tr from-[var(--accent-secondary)]/[0.025] to-[var(--accent-tertiary)]/[0.02] blur-[90px]" />
        <div className="absolute bottom-0 right-[20%] size-[400px] rounded-full bg-gradient-to-tl from-[var(--accent-primary)]/[0.02] to-transparent blur-[80px]" />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="relative"
      >
        {/* ─────────────────────────────────────────────
            Header with enhanced styling
        ───────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
                  <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
                  Locations
                </span>

                <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

                <span className="text-[10px] text-[var(--foreground-subtle)]">
                  Environmental monitoring
                </span>
              </div>

              <h1 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                Monitored locations
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                Explore current air quality across locations
                available in the AirScope monitoring view.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Current location with enhanced styling */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-gradient-to-r from-[var(--control-background)] to-[var(--control-hover)] px-3.5 py-2 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_16px_rgba(148,163,184,0.12)]"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-colors group-hover:shadow-[0_2px_8px_rgba(148,163,184,0.1)]">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={13}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>

                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="max-w-[180px] truncate text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]">
                    {location.name}
                  </span>

                  {location.country_code && (
                    <>
                      <span className="size-0.5 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

                      <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
                        {location.country_code}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Monitoring state with enhanced styling */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group flex items-center gap-2 rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.08] to-emerald-400/[0.04] px-3.5 py-2 shadow-[inset_0_1px_0_rgba(52,211,153,0.12)] transition-all hover:shadow-[0_4px_16px_rgba(52,211,153,0.12)]"
              >
                <span className="relative flex size-2">
                  <span className="absolute size-full animate-ping rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500/60" />

                  <span className="relative size-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-emerald-400/85 group-hover:text-emerald-400">
                  Monitoring active
                </span>
              </motion.div>
            </div>
          </div>

          {/* Decorative gradient line */}
          <div className="relative mt-7 h-px w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/30 via-[var(--accent-secondary)]/20 to-[var(--accent-tertiary)]/30 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-shimmer" />
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            Location workspace with enhanced styling
        ───────────────────────────────────────────── */}
        <motion.section
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
        >
          {/* Subtle gradient mesh overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-tertiary)]/[0.015] via-transparent to-transparent opacity-60" />

          {/* Workspace header with enhanced styling */}
          <div className="relative flex flex-col gap-4 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] shadow-[0_2px_8px_rgba(148,163,184,0.08)]"
              >
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-[var(--foreground-muted)] transition-colors group-hover:text-[var(--foreground-secondary)]"
                />
              </motion.div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                  Air quality monitoring map
                </p>

                <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                  View the locations currently represented in the
                  monitoring network.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] px-2.5 py-1.5 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_12px_rgba(148,163,184,0.1)]"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]">
                  <HugeiconsIcon
                    icon={Activity01Icon}
                    size={13}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-subtle)] transition-colors group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>

                <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-muted)]">
                  Live monitoring
                </span>
              </motion.div>
            </div>
          </div>

          {/* Map container with enhanced presentation */}
          <div className="relative h-[520px] sm:h-[560px]">
            {/* Top gradient overlay for depth */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[var(--surface-secondary)]/40 to-transparent" />
            
            {/* Side gradient overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--surface-secondary)]/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--surface-secondary)]/30 to-transparent" />
            
            {/* Bottom gradient overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[var(--surface-secondary)]/40 to-transparent" />
            
            <AirQualityMap />
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}