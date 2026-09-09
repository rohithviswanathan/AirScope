import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudIcon,
  DropletIcon,
  WindPower01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Refresh01Icon
} from "@hugeicons/core-free-icons";

import { AQIHero } from "../airquality/components/AQIHero";

import { useAirScopeData } from "../../api/useAirScopeData";
import type {
  AirScopePollutant,
} from "../../api/airScopeTypes";
import { useLocation } from "../../context/LocationProvider";


const DISPLAY_POLLUTANTS = [
  {
    pollutant: "PM2.5",
    color: "bg-orange-400",
  },
  {
    pollutant: "PM10",
    color: "bg-orange-300",
  },
  {
    pollutant: "NO₂",
    color: "bg-yellow-300",
  },
  {
    pollutant: "O₃",
    color: "bg-emerald-300",
  },
] as const;

function formatDate(
  timestamp: string,
  timezone?: string,
) {
  if (!timestamp) {
    return "—";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone || "Asia/Kolkata",
  }).format(date);
}

function formatUpdatedTime(
  timestamp: string,
  timezone?: string,
) {
  if (!timestamp) {
    return "—";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || "Asia/Kolkata",
  }).format(date);
}

function formatNumber(
  value: number,
) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function getPollutant(
  pollutants: AirScopePollutant[],
  name: string,
) {
  return pollutants.find(
    (pollutant) =>
      pollutant.pollutant === name,
  );
}

function getPollutantStatus(
  value: number,
  maximum: number,
) {
  if (maximum <= 0) {
    return "Current";
  }

  const relative = value / maximum;

  if (relative >= 0.75) {
    return "Higher";
  }

  if (relative >= 0.4) {
    return "Moderate";
  }

  return "Lower";
}

function DashboardLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="space-y-7">
        {/* Header skeleton with gradient shimmer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 rounded bg-[var(--control-hover)]" />
            <div className="h-3 w-16 rounded bg-[var(--control-background)]" />
          </div>
          
          <div className="h-10 w-72 max-w-full rounded-xl bg-[var(--control-hover)]" />
          
          <div className="h-4 w-[520px] max-w-full rounded bg-[var(--control-background)]" />
        </div>

        {/* Main AQI card skeleton */}
        <div className="relative h-[580px] overflow-hidden rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--control-hover)]/30 to-transparent animate-shimmer" />
        </div>

        {/* Environment cards skeleton */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="relative h-32 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--control-hover)]/20 to-transparent animate-shimmer" style={{ animationDelay: `${index * 0.15}s` }} />
              </div>
            ),
          )}
        </div>

        {/* Pollutant cards skeleton */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="relative h-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-secondary)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--control-hover)]/20 to-transparent animate-shimmer" style={{ animationDelay: `${index * 0.15 + 0.2}s` }} />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[600px] w-full max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[var(--error)]/20 bg-gradient-to-br from-[var(--error-bg)] via-[var(--surface-secondary)] to-[var(--error-bg)]/50 p-6 text-center shadow-[0_8px_40px_rgba(220,38,38,0.08)]">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--error)]/[0.02] to-transparent pointer-events-none" />
          
          {/* Icon with glow */}
          <div className="relative mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--error)]/15 to-[var(--error)]/8 shadow-[0_0_24px_rgba(220,38,38,0.15)]">
            <span className="text-xl font-bold text-[var(--error)]">!</span>
          </div>

          <h1 className="relative mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            Unable to load air quality
          </h1>

          <p className="relative mt-2.5 text-sm leading-6 text-[var(--foreground-muted)]">
            {message}
          </p>

          <motion.button
            type="button"
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--control-background)] to-[var(--control-hover)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_16px_rgba(148,163,184,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40"
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              size={16}
              strokeWidth={1.8}
              className="text-[var(--foreground-muted)]"
            />
            Try again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export function Dashboard() {
  const { location } = useLocation();
  
  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAirScopeData({
    location,
  });

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (isError || !data) {
    return (
      <DashboardErrorState
        message={
          error instanceof Error
            ? error.message
            : "The environmental data service did not return a usable response."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const pollutants = DISPLAY_POLLUTANTS.map(
    (definition) => {
      const pollutant = getPollutant(
        data.airQuality.pollutants,
        definition.pollutant,
      );

      return {
        name: definition.pollutant,
        fullName:
          pollutant?.description ??
          "Measured air pollutant",
        value: pollutant?.concentration ?? 0,
        unit:
          pollutant?.unit ?? "µg/m³",
        color: definition.color,
        description:
          pollutant?.description ??
          "Current concentration",
      };
    },
  );

  const maximumDisplayedPollutant =
    Math.max(
      ...pollutants.map(
        (pollutant) => pollutant.value,
      ),
      1,
    );

  const updatedTime = formatUpdatedTime(
    data.airQuality.updatedAt,
    data.location.timezone,
  );

  const currentDate = formatDate(
    data.airQuality.updatedAt,
    data.location.timezone,
  );

  const windUnit = "km/h";

  return (
    <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Subtle background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-gradient-to-br from-[var(--accent-primary)]/[0.03] to-[var(--accent-secondary)]/[0.02] blur-[100px]" />
        <div className="absolute top-[30%] -left-40 size-[400px] rounded-full bg-gradient-to-tr from-[var(--accent-secondary)]/[0.025] to-[var(--accent-tertiary)]/[0.02] blur-[90px]" />
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
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative"
      >
        {/* ─────────────────────────────────────────────
            Page heading with enhanced styling
        ───────────────────────────────────────────── */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
                <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
                Overview
              </span>

              <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

              <span className="text-[10px] text-[var(--foreground-subtle)]">
                {currentDate}
              </span>
            </div>

            <h1 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {data.location.name} air quality
            </h1>

            <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              A live view of the atmosphere around you,
              from current pollution levels to emerging
              trends.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group flex w-fit shrink-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-gradient-to-r from-[var(--control-background)] to-[var(--control-hover)] px-3.5 py-2 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_16px_rgba(148,163,184,0.12)]"
          >
            <span className="relative flex size-2.5">
              <span
                className={`absolute size-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.4)] ${
                  !isFetching
                    ? "animate-ping"
                    : "animate-pulse"
                }`}
              />

              <span className="relative size-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </span>

            <span className="text-[11px] font-medium text-[var(--foreground-secondary)]">
              {isFetching
                ? "Updating data"
                : "Monitoring active"}
            </span>
          </motion.div>
        </header>

        {/* ─────────────────────────────────────────────
            AQI Hero
        ───────────────────────────────────────────── */}
        <section className="mt-7 sm:mt-8">
          <AQIHero
            data={{
              city: data.location.name,
              country: data.location.country,
              aqi: data.airQuality.aqi,
              status: data.airQuality.status,
              dominantPollutant:
                data.airQuality.dominantPollutant,
              updatedAt: updatedTime,
            }}
          />
        </section>

        {/* ─────────────────────────────────────────────
            Environment with section header enhancement
        ───────────────────────────────────────────── */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3 px-1">
            <div className="h-px w-8 bg-gradient-to-r from-[var(--accent-primary)]/40 to-transparent" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                Environmental conditions
              </p>
              <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                Conditions that can influence local air quality
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Temperature */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] p-5 transition-all duration-200 hover:border-[var(--foreground-faint)] hover:shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.02] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
                    Temperature
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold tracking-[-0.045em] text-[var(--foreground)]">
                      {formatNumber(
                        data.weather.temperature,
                      )}°
                    </span>
                  </div>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-all duration-200 group-hover:shadow-[0_4px_12px_rgba(148,163,184,0.15)]">
                  <HugeiconsIcon
                    icon={CloudIcon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="relative mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Feels like{" "}
                {formatNumber(
                  data.weather
                    .apparentTemperature,
                )}
                °
              </p>
            </motion.div>

            {/* Humidity */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] p-5 transition-all duration-200 hover:border-[var(--foreground-faint)] hover:shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/[0.02] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
                    Humidity
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold tracking-[-0.045em] text-[var(--foreground)]">
                      {Math.round(
                        data.weather.humidity,
                      )}
                      %
                    </span>
                  </div>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-all duration-200 group-hover:shadow-[0_4px_12px_rgba(148,163,184,0.15)]">
                  <HugeiconsIcon
                    icon={DropletIcon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="relative mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Relative atmospheric humidity
              </p>
            </motion.div>

            {/* Wind */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] p-5 transition-all duration-200 hover:border-[var(--foreground-faint)] hover:shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-tertiary)]/[0.02] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
                    Wind
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold tracking-[-0.045em] text-[var(--foreground)]">
                      {formatNumber(
                        data.weather.windSpeed,
                      )}
                    </span>

                    <span className="text-xs font-medium text-[var(--foreground-subtle)]">
                      {windUnit}
                    </span>
                  </div>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-all duration-200 group-hover:shadow-[0_4px_12px_rgba(148,163,184,0.15)]">
                  <HugeiconsIcon
                    icon={WindPower01Icon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="relative mt-3 truncate text-xs text-[var(--foreground-muted)]">
                {data.weather.windDirectionLabel} direction ·{" "}
                {Math.round(
                  data.weather.windDirection,
                )}
                °
              </p>
            </motion.div>

            {/* Visibility */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] p-5 transition-all duration-200 hover:border-[var(--foreground-faint)] hover:shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.02] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
                    Visibility
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold tracking-[-0.045em] text-[var(--foreground)]">
                      {formatNumber(
                        data.weather.visibility,
                      )}
                    </span>

                    <span className="text-xs font-medium text-[var(--foreground-subtle)]">
                      km
                    </span>
                  </div>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] transition-all duration-200 group-hover:shadow-[0_4px_12px_rgba(148,163,184,0.15)]">
                  <div className="size-2 rounded-full bg-gradient-to-br from-[var(--foreground-muted)] to-[var(--foreground-subtle)] transition-transform duration-200 group-hover:scale-125" />
                </div>
              </div>

              <p className="relative mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Current atmospheric visibility
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            Pollutants with enhanced section header
        ───────────────────────────────────────────── */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[var(--accent-secondary)]/40 to-transparent" />
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                    Pollutant levels
                  </p>

                  <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_6px_rgba(99,102,241,0.3)]" />

                  <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                    Live snapshot
                  </span>
                </div>

                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Current measured concentration across key pollutants
                </p>
              </div>
            </div>

            <span className="hidden rounded-full border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)] sm:block">
              µg/m³
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {pollutants.map(
              (pollutant, index) => {
                const relativeLevel =
                  Math.max(
                    8,
                    Math.min(
                      100,
                      (pollutant.value /
                        maximumDisplayedPollutant) *
                        100,
                    ),
                  );

                const relativeStatus =
                  getPollutantStatus(
                    pollutant.value,
                    maximumDisplayedPollutant,
                  );

                return (
                  <motion.div
                    key={pollutant.name}
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
                      delay:
                        index * 0.06,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    whileHover={{
                      y: -3,
                      scale: 1.01,
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--foreground-faint)] hover:shadow-[0_8px_32px_rgba(148,163,184,0.14)]"
                  >
                    {/* Subtle accent gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />

                    {/* Header */}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`size-2.5 shrink-0 rounded-full ${pollutant.color} shadow-[0_0_8px_currentColor]`}
                          />

                          <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--foreground-secondary)]">
                            {pollutant.name}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[10px] text-[var(--foreground-subtle)]">
                          {pollutant.fullName}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        {relativeStatus}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="relative mt-6">
                      <div className="flex items-end gap-1.5">
                        <span className="text-[34px] font-semibold leading-none tracking-[-0.055em] text-[var(--foreground)]">
                          {formatNumber(
                            pollutant.value,
                          )}
                        </span>

                        <span className="mb-0.5 text-xs font-medium text-[var(--foreground-subtle)]">
                          {pollutant.unit}
                        </span>
                      </div>
                    </div>

                    {/* Live reading */}
                    <div className="relative mt-4 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/80">
                      {pollutant.value >
                      0 ? (
                        <>
                          <HugeiconsIcon
                            icon={
                              pollutant.value >=
                              maximumDisplayedPollutant *
                                0.5
                                ? ArrowUp01Icon
                                : ArrowDown01Icon
                            }
                            size={13}
                            strokeWidth={1.8}
                            className="text-emerald-400/80"
                          />

                          <span>
                            Live concentration
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--foreground-subtle)]">
                          No current reading
                        </span>
                      )}
                    </div>

                    {/* Visual scale */}
                    <div className="relative mt-5">
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                        <span>
                          Relative concentration
                        </span>

                        <span>
                          {relativeStatus}
                        </span>
                      </div>

                      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gradient-to-r from-[var(--control-hover)] to-[var(--control-background)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${relativeLevel}%`,
                          }}
                          transition={{
                            duration: 0.8,
                            delay:
                              0.2 +
                              index * 0.07,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className={`h-full rounded-full ${pollutant.color} shadow-[0_0_8px_currentColor]`}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="relative mt-4 border-t border-[var(--border-subtle)] pt-3">
                      <p className="text-[10px] text-[var(--foreground-subtle)]">
                        {pollutant.description}
                      </p>
                    </div>
                  </motion.div>
                );
              },
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
}