import { motion } from "motion/react";

import { AQITrendChart } from "../components/AQITrendChart";
import { PollutionDrivers } from "../../airquality/components/PollutionDrivers";

export function AnalyticsPage() {
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
                  Analytics
                </span>

                <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

                <span className="text-[10px] text-[var(--foreground-subtle)]">
                  Historical intelligence
                </span>
              </div>

              <h1 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                Air quality analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                Understand how air quality has changed over time
                and which pollutants are contributing most to the
                current profile.
              </p>
            </div>

            <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-3 py-2">
              <span className="relative flex size-2">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

                <span className="relative size-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                Analysis active
              </span>
            </div>
          </div>
        </header>

        {/* Main analytics workspace */}
        <div className="space-y-4">
            {/* Historical trend */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AQITrendChart />
            </motion.div>

            {/* Pollution drivers */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <PollutionDrivers />
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}