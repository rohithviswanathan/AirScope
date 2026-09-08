import { motion } from "motion/react";

import { AirQualityOutlook } from "../components/AirQualityOutlook";

export function ForecastPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Header */}
        <header className="mb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
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

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                See how air quality is expected to change over
                the coming hours based on the current environmental
                profile.
              </p>
            </div>

            <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-3 py-2">
              <span className="relative flex size-2">
                <span className="absolute size-full animate-ping rounded-full bg-orange-400/20" />

                <span className="relative size-2 rounded-full bg-orange-400" />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                Forecast active
              </span>
            </div>
          </div>
        </header>

        {/* Forecast workspace */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AirQualityOutlook />
        </motion.div>
      </motion.div>
    </div>
  );
}
