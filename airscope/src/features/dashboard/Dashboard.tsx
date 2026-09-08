import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudIcon,
  DropletIcon,
  WindPower01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

import { AQIHero } from "../airquality/components/AQIHero";
import { AQITrendChart } from "../analytics/components/AQITrendChart";
import { AirQualityMap } from "../map/components/AirQualityMap";
import { PollutionDrivers } from "../airquality/components/PollutionDrivers";
import { AirQualityOutlook } from "../forecast/components/AirQualityOutlook";

import { useAirScopeData } from "../../api/useAirScopeData";
import type { OpenMeteoLocation } from "../../api/types";
import type {
  AirScopePollutant,
} from "../../api/airScopeTypes";

const BENGALURU_LOCATION: OpenMeteoLocation = {
  id: 1277333,
  name: "Bengaluru",
  country: "India",
  country_code: "IN",
  admin1: "Karnataka",
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: "Asia/Kolkata",
};

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
      <div className="animate-pulse space-y-7">
        <div className="space-y-3">
          <div className="h-3 w-20 rounded bg-[var(--control-hover)]" />

          <div className="h-10 w-72 max-w-full rounded-xl bg-[var(--control-hover)]" />

          <div className="h-4 w-[520px] max-w-full rounded bg-[var(--control-hover)]" />
        </div>

        <div className="h-[580px] rounded-[28px] border border-[var(--border)] bg-[var(--surface-secondary)]" />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]"
              />
            ),
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-48 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
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
      <div className="w-full max-w-md rounded-3xl border border-red-400/15 bg-red-400/[0.035] p-6 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-red-400/[0.08] text-red-300/80">
          !
        </div>

        <h1 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Unable to load air quality
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--control-background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--control-hover)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAirScopeData({
    location: BENGALURU_LOCATION,
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
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
      >
        {/* ─────────────────────────────────────────────
            Page heading
        ───────────────────────────────────────────── */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
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

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              A live view of the atmosphere around you,
              from current pollution levels to emerging
              trends.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-3 py-2 transition-colors duration-200">
            <span className="relative flex size-2">
              <span
                className={`absolute size-full rounded-full bg-emerald-400/30 ${
                  !isFetching
                    ? "animate-ping"
                    : "animate-pulse"
                }`}
              />

              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[11px] font-medium text-[var(--foreground-secondary)]">
              {isFetching
                ? "Updating data"
                : "Monitoring active"}
            </span>
          </div>
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
            Environment
        ───────────────────────────────────────────── */}
        <section className="mt-5">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Environmental conditions
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Conditions that can influence local air quality
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Temperature */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-5 transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--surface-elevated)]">
              <div className="flex items-start justify-between gap-4">
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

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--control-background)] transition-colors duration-200 group-hover:bg-[var(--control-hover)]">
                  <HugeiconsIcon
                    icon={CloudIcon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Feels like{" "}
                {formatNumber(
                  data.weather
                    .apparentTemperature,
                )}
                °
              </p>
            </div>

            {/* Humidity */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-5 transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--surface-elevated)]">
              <div className="flex items-start justify-between gap-4">
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

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--control-background)] transition-colors duration-200 group-hover:bg-[var(--control-hover)]">
                  <HugeiconsIcon
                    icon={DropletIcon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Relative atmospheric humidity
              </p>
            </div>

            {/* Wind */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-5 transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--surface-elevated)]">
              <div className="flex items-start justify-between gap-4">
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

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--control-background)] transition-colors duration-200 group-hover:bg-[var(--control-hover)]">
                  <HugeiconsIcon
                    icon={WindPower01Icon}
                    size={19}
                    strokeWidth={1.5}
                    className="text-[var(--foreground-muted)] transition-colors duration-200 group-hover:text-[var(--foreground-secondary)]"
                  />
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-[var(--foreground-muted)]">
                {data.weather.windDirectionLabel} direction ·{" "}
                {Math.round(
                  data.weather.windDirection,
                )}
                °
              </p>
            </div>

            {/* Visibility */}
            <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-5 transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--surface-elevated)]">
              <div className="flex items-start justify-between gap-4">
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

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--control-background)]">
                  <div className="size-2 rounded-full bg-[var(--foreground-muted)] transition-transform duration-200 group-hover:scale-125" />
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-[var(--foreground-muted)]">
                Current atmospheric visibility
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            Pollutants
        ───────────────────────────────────────────── */}
        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between px-1">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                  Pollutant levels
                </p>

                <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />

                <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                  Live snapshot
                </span>
              </div>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Current measured concentration across key pollutants
              </p>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-[var(--foreground-faint)] sm:block">
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
                    }}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--foreground-faint)] hover:bg-[var(--surface-secondary)]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 shrink-0 rounded-full ${pollutant.color}`}
                          />

                          <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--foreground-secondary)]">
                            {pollutant.name}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[10px] text-[var(--foreground-subtle)]">
                          {pollutant.fullName}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--control-background)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                        {relativeStatus}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mt-6">
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
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300/70">
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
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                        <span>
                          Relative concentration
                        </span>

                        <span>
                          {relativeStatus}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--control-hover)]">
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
                          className={`h-full rounded-full ${pollutant.color}`}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
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

        {/* ─────────────────────────────────────────────
            Analytics + Map
        ───────────────────────────────────────────── */}
        <section className="mt-7 grid gap-4 xl:grid-cols-12 xl:items-stretch">
          <div className="min-w-0 xl:col-span-7 xl:h-full">
            <AQITrendChart />
          </div>

          <div className="min-w-0 xl:col-span-5 xl:h-full">
            <AirQualityMap />
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            Pollution Drivers
        ───────────────────────────────────────────── */}
        <section className="mt-4">
          <PollutionDrivers />
        </section>

        {/* ─────────────────────────────────────────────
            Outlook
        ───────────────────────────────────────────── */}
        <section className="mt-4 pb-4">
          <AirQualityOutlook />
        </section>
      </motion.div>
    </div>
  );
}
