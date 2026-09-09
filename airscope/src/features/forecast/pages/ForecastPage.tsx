import { motion } from "motion/react";

import { AirQualityOutlook } from "../components/AirQualityOutlook";

export function ForecastPage() {
  return (
    <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Subtle background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-gradient-to-br from-[var(--accent-tertiary)]/[0.03] to-[var(--accent-primary)]/[0.02] blur-[100px]" />
        <div className="absolute top-[20%] -left-40 size-[450px] rounded-full bg-gradient-to-tr from-[var(--accent-secondary)]/[0.025] to-[var(--accent-tertiary)]/[0.02] blur-[90px]" />
        <div className="absolute bottom-0 right-[20%] size-[400px] rounded-full bg-gradient-to-tl from-[var(--accent-primary)]/[0.02] to-transparent blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
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
                  <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-tertiary)] to-[var(--accent-secondary)] shadow-[0_0_6px_rgba(124,58,237,0.3)]" />
                  Forecast
                </span>

                <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

                <span className="text-[10px] text-[var(--foreground-subtle)]">
                  Next 24 hours
                </span>
              </div>

              <h1 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                Air quality forecast
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                See how air quality is expected to change over
                the coming hours based on the current environmental
                profile.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group flex w-fit shrink-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-gradient-to-r from-[var(--control-background)] to-[var(--control-hover)] px-3.5 py-2 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_16px_rgba(148,163,184,0.12)]"
            >
              <span className="relative flex size-2.5">
                <span className="absolute size-full animate-ping rounded-full bg-gradient-to-br from-orange-400 to-orange-500/60" />

                <span className="relative size-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]">
                Forecast active
              </span>
            </motion.div>
          </div>

          {/* Decorative gradient line */}
          <div className="relative mt-7 h-px w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-tertiary)]/30 via-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/30 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-shimmer" />
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            Forecast workspace
        ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AirQualityOutlook />
        </motion.div>
      </motion.div>
    </div>
  );
}