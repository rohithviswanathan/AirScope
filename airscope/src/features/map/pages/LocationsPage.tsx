import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons";

import { AirQualityMap } from "../../map/components/AirQualityMap";

export function LocationsPage() {
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

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
                Explore current air quality across monitored areas
                and compare pollution conditions around Bengaluru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-3 py-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={13}
                  strokeWidth={1.5}
                  className="text-[var(--foreground-muted)]"
                />

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                  Bengaluru
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2">
                <span className="relative flex size-1.5">
                  <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />
                  <span className="relative size-1.5 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-emerald-300/65">
                  Monitoring active
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Location workspace */}
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
            duration: 0.45,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
        >
          {/* Workspace header */}
          <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--control-background)]">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-[var(--foreground-muted)]"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                  Air quality monitoring map
                </p>

                <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                  Select a monitored area to inspect its current
                  conditions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1.5">
                <HugeiconsIcon
                  icon={Activity01Icon}
                  size={13}
                  strokeWidth={1.5}
                  className="text-[var(--foreground-subtle)]"
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
                  Live monitoring
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[520px] sm:h-[560px]">
            <AirQualityMap />
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}