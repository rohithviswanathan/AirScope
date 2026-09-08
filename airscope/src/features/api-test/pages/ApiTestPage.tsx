import { motion } from "motion/react";

import { useAirScopeData } from "../../../api/useAirScopeData";
import type { OpenMeteoLocation } from "../../../api/types";

const bengaluru: OpenMeteoLocation = {
  id: 1277333,
  name: "Bengaluru",
  country: "India",
  country_code: "IN",
  admin1: "Karnataka",
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: "Asia/Kolkata",
};

export function ApiTestPage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAirScopeData({
    location: bengaluru,
  });

  if (isLoading) {
    return (
      <PageShell>
        <StatusMessage>
          Loading live Bengaluru data...
        </StatusMessage>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-5">
          <p className="text-sm font-medium text-red-300/80">
            API request failed
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--foreground-muted)]">
            {error instanceof Error
              ? error.message
              : "Unknown error"}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--control-background)] px-3 py-2 text-xs font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--control-hover)]"
          >
            Retry request
          </button>
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell>
        <StatusMessage>
          No data returned.
        </StatusMessage>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-subtle)]">
            Development
          </span>

          <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />

          <span className="text-[10px] text-[var(--foreground-subtle)]">
            API verification
          </span>
        </div>

        <h1 className="mt-2 text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Open-Meteo data inspector
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
          Temporary development view for validating the normalized
          AirScope data before connecting it to the production UI.
        </p>
      </div>

      {/* Status */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />
            <span className="relative size-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-xs font-medium text-[var(--foreground-secondary)]">
            Live API connected
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isFetching && (
            <span className="text-[10px] text-[var(--foreground-subtle)]">
              Refreshing...
            </span>
          )}

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--control-hover)] hover:text-[var(--foreground-secondary)]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Location */}
      <section className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
          Location
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DataItem
            label="City"
            value={data.location.name}
          />

          <DataItem
            label="Country"
            value={data.location.country}
          />

          <DataItem
            label="Latitude"
            value={data.location.latitude.toFixed(4)}
          />

          <DataItem
            label="Longitude"
            value={data.location.longitude.toFixed(4)}
          />
        </div>
      </section>

      {/* Air quality */}
      <section className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Air quality
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Normalized current air-quality data.
            </p>
          </div>

          <div className="rounded-xl border border-orange-400/10 bg-orange-400/[0.04] px-3 py-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
              Status
            </p>

            <p className="mt-0.5 text-xs font-semibold capitalize text-orange-300/75">
              {data.airQuality.status.replace(
                "-",
                " ",
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="AQI"
            value={String(data.airQuality.aqi)}
          />

          <MetricCard
            label="Dominant pollutant"
            value={
              data.airQuality.dominantPollutant
            }
          />

          <MetricCard
            label="Pollutants measured"
            value={String(
              data.airQuality.pollutants.length,
            )}
          />

          <MetricCard
            label="Updated"
            value={formatTimestamp(
              data.airQuality.updatedAt,
            )}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.airQuality.pollutants.map(
            (pollutant) => (
              <div
                key={pollutant.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[var(--foreground-secondary)]">
                    {pollutant.pollutant}
                  </span>

                  <span className="text-[10px] text-[var(--foreground-subtle)]">
                    {pollutant.unit}
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  {formatNumber(
                    pollutant.concentration,
                  )}
                </p>

                <p className="mt-1 text-[10px] text-[var(--foreground-subtle)]">
                  {pollutant.description}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Weather */}
      <section className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            Weather
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Current environmental conditions.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Temperature"
            value={`${formatNumber(
              data.weather.temperature,
            )} °C`}
          />

          <MetricCard
            label="Feels like"
            value={`${formatNumber(
              data.weather.apparentTemperature,
            )} °C`}
          />

          <MetricCard
            label="Humidity"
            value={`${Math.round(
              data.weather.humidity,
            )}%`}
          />

          <MetricCard
            label="Wind"
            value={`${formatNumber(
              data.weather.windSpeed,
            )} km/h`}
          />

          <MetricCard
            label="Direction"
            value={
              data.weather.windDirectionLabel
            }
          />

          <MetricCard
            label="Visibility"
            value={`${formatNumber(
              data.weather.visibility,
            )} km`}
          />

          <MetricCard
            label="Wind bearing"
            value={`${Math.round(
              data.weather.windDirection,
            )}°`}
          />

          <MetricCard
            label="Weather code"
            value={String(
              data.weather.weatherCode,
            )}
          />
        </div>
      </section>

      {/* Trend */}
      <section className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            Normalized trend
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Last available hourly AQI values from the API response.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {data.trend.map(
              (point) => (
                <div
                  key={`${point.time}-${point.aqi}`}
                  className="min-w-[86px] rounded-xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-3"
                >
                  <p className="truncate text-[9px] text-[var(--foreground-subtle)]">
                    {formatTimestamp(
                      point.time,
                    )}
                  </p>

                  <p className="mt-1.5 text-lg font-semibold text-[var(--foreground)]">
                    {point.aqi}
                  </p>

                  <p className="text-[9px] text-[var(--foreground-faint)]">
                    AQI
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Raw normalized object */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            Normalized AirScope object
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            This is the exact application-level object the UI will consume.
          </p>
        </div>

        <pre className="mt-5 max-h-[500px] overflow-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-4 text-[11px] leading-5 text-[var(--foreground-muted)]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
    </PageShell>
  );
}

function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
    >
      {children}
    </motion.div>
  );
}

function StatusMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-[var(--foreground-muted)]">
        {children}
      </p>
    </div>
  );
}

function DataItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function formatNumber(
  value: number,
) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function formatTimestamp(
  value: string,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      hour12: true,
    },
  ).format(date);
}