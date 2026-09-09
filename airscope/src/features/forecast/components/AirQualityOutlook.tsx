import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import * as echarts from "echarts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

import { useTheme } from "../../../components/theme/ThemeProvider";
import { useAirScopeData } from "../../../api/useAirScopeData";
import { useLocation } from "../../../context/LocationProvider";

function getThemeColors() {
  const styles = getComputedStyle(
    document.documentElement,
  );

  return {
    foreground:
      styles
        .getPropertyValue("--foreground")
        .trim() || "#F4F7FA",

    foregroundSecondary:
      styles
        .getPropertyValue("--foreground-secondary")
        .trim() ||
      "rgba(244,247,250,0.72)",

    foregroundMuted:
      styles
        .getPropertyValue("--foreground-muted")
        .trim() ||
      "rgba(244,247,250,0.4)",

    foregroundSubtle:
      styles
        .getPropertyValue("--foreground-subtle")
        .trim() ||
      "rgba(244,247,250,0.25)",

    foregroundFaint:
      styles
        .getPropertyValue("--foreground-faint")
        .trim() ||
      "rgba(244,247,250,0.15)",

    border:
      styles
        .getPropertyValue("--border")
        .trim() ||
      "rgba(255,255,255,0.07)",

    surface:
      styles
        .getPropertyValue("--surface")
        .trim() || "#0F151D",

    surfaceElevated:
      styles
        .getPropertyValue("--surface-elevated")
        .trim() || "#151D27",

    chartGrid:
      styles
        .getPropertyValue("--chart-grid")
        .trim() ||
      "rgba(255,255,255,0.045)",

    accentPrimary:
      styles
        .getPropertyValue("--accent-primary")
        .trim() || "#818cf8",

    accentSecondary:
      styles
        .getPropertyValue("--accent-secondary")
        .trim() || "#38bdf8",

    accentGlow:
      styles
        .getPropertyValue("--accent-glow")
        .trim() || "rgba(99,102,241,0.15)",
  };
}

function formatForecastTime(
  timestamp: string,
  timezone?: string,
) {
  const date = new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone:
        timezone || "Asia/Kolkata",
    },
  ).format(date);
}

export function AirQualityOutlook() {
  const chartRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const chartInstanceRef =
    useRef<echarts.ECharts | null>(
      null,
    );

  const reducedMotion =
    useReducedMotion();

  const { theme } =
    useTheme();

  const { location } =
    useLocation();

  const {
    data,
    isLoading,
    isError,
  } =
    useAirScopeData({
      location,
    });

  const currentAQI =
    data?.airQuality.aqi ?? 0;

  /*
   * The normalized forecast contains future hourly points.
   * We only show the next 24 hours in this component.
   */
  const forecastData =
    useMemo(() => {
      return (
        data?.forecast
          ?.slice(0, 24) ??
        []
      );
    }, [data]);

  const highestPoint =
    useMemo(() => {
      if (
        !forecastData.length
      ) {
        return null;
      }

      return forecastData.reduce(
        (
          highest,
          point,
        ) =>
          point.aqi >
          highest.aqi
            ? point
            : highest,
      );
    }, [forecastData]);

  const averageAQI =
    useMemo(() => {
      if (
        !forecastData.length
      ) {
        return 0;
      }

      return Math.round(
        forecastData.reduce(
          (
            sum,
            point,
          ) =>
            sum + point.aqi,
          0,
        ) /
          forecastData.length,
      );
    }, [forecastData]);

  const finalAQI =
    forecastData[
      forecastData.length - 1
    ]?.aqi ??
    currentAQI;

  const change =
    finalAQI - currentAQI;

  const improving =
    change < 0;

  const trendLabel =
    change === 0
      ? "Stable"
      : improving
        ? "Improving"
        : "Worsening";

  useEffect(() => {
    if (
      !chartRef.current
    ) {
      return;
    }

    const chart =
      echarts.init(
        chartRef.current,
      );

    chartInstanceRef.current =
      chart;

    const resizeObserver =
      new ResizeObserver(
        () => {
          chart.resize();
        },
      );

    resizeObserver.observe(
      chartRef.current,
    );

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current =
        null;
    };
  }, []);

  useEffect(() => {
    const chart =
      chartInstanceRef.current;

    if (
      !chart ||
      !forecastData.length
    ) {
      return;
    }

    const colors =
      getThemeColors();

    const times =
      forecastData.map(
        (point) =>
          point.time,
      );

    const values =
      forecastData.map(
        (point) =>
          point.aqi,
      );

    const peakIndex =
      forecastData.findIndex(
        (point) =>
          point.aqi ===
          highestPoint?.aqi,
      );

    const minimum =
      Math.min(
        currentAQI,
        ...values,
      );

    const maximum =
      Math.max(
        currentAQI,
        ...values,
      );

    const yMin =
      Math.max(
        0,
        Math.floor(
          (minimum - 10) / 10,
        ) * 10,
      );

    const yMax =
      Math.ceil(
        (maximum + 10) / 10,
      ) * 10;

    chart.setOption(
      {
        animation:
          !reducedMotion,

        animationDuration:
          reducedMotion
            ? 0
            : 800,

        animationEasing:
          "cubicOut",

        grid: {
          top: 28,
          right: 8,
          bottom: 28,
          left: 8,
          containLabel: true,
        },

        tooltip: {
          trigger: "axis",

          backgroundColor:
            colors.surfaceElevated,

          borderColor:
            colors.border,

          borderWidth: 1,

          padding: [10, 12],

          textStyle: {
            color:
              colors.foreground,
            fontSize: 12,
          },

          axisPointer: {
            type: "line",

            lineStyle: {
              color:
                colors.foregroundFaint,
              width: 1,
            },
          },

          formatter: (
            params: unknown,
          ) => {
            const items =
              Array.isArray(params)
                ? params
                : [params];

            const first =
              items[0] as
                | {
                    axisValue?: string;
                    data?: number;
                  }
                | undefined;

            if (!first) {
              return "";
            }

            return `
              <div style="min-width:125px;">
                <div style="
                  color:${colors.foregroundMuted};
                  font-size:10px;
                  margin-bottom:6px;
                ">
                  ${
                    first.axisValue
                      ? formatForecastTime(
                          first.axisValue,
                          location.timezone,
                        )
                      : ""
                  }
                </div>

                <div style="
                  display:flex;
                  align-items:baseline;
                  justify-content:space-between;
                  gap:18px;
                ">
                  <span style="
                    color:${colors.foregroundSecondary};
                    font-size:11px;
                  ">
                    Expected AQI
                  </span>

                  <span style="
                    color:${colors.foreground};
                    font-size:18px;
                    font-weight:600;
                    letter-spacing:-0.04em;
                  ">
                    ${first.data ?? 0}
                  </span>
                </div>
              </div>
            `;
          },
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: times,

          axisLine: {
            show: false,
          },

          axisTick: {
            show: false,
          },

          axisLabel: {
            color:
              colors.foregroundSubtle,

            fontSize: 10,
            margin: 12,

            formatter: (
              value: string,
              index: number,
            ) => {
              return index %
                4 ===
                0
                ? formatForecastTime(
                    value,
                    location.timezone,
                  )
                : "";
            },
          },
        },

        yAxis: {
          type: "value",

          min: yMin,
          max:
            yMax > yMin
              ? yMax
              : yMin + 20,

          splitNumber: 3,

          axisLine: {
            show: false,
          },

          axisTick: {
            show: false,
          },

          axisLabel: {
            color:
              colors.foregroundSubtle,

            fontSize: 10,
            margin: 10,
          },

          splitLine: {
            lineStyle: {
              color:
                colors.chartGrid,
            },
          },
        },

        series: [
          {
            name:
              "Expected AQI",

            type: "line",

            data: values,

            smooth: 0.36,

            symbol: "none",

            lineStyle: {
              color: "#FDBA74",
              width: 2.5,
            },

            itemStyle: {
              color: "#FDBA74",
            },

            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,

                colorStops: [
                  {
                    offset: 0,
                    color:
                      "rgba(253,186,116,0.22)",
                  },
                  {
                    offset: 0.6,
                    color:
                      "rgba(253,186,116,0.07)",
                  },
                  {
                    offset: 1,
                    color:
                      "rgba(253,186,116,0)",
                  },
                ],
              },
            },

            emphasis: {
              scale: true,

              itemStyle: {
                color: "#FED7AA",
                borderColor:
                  colors.surface,
                borderWidth: 3,
                shadowBlur: 12,
                shadowColor: "rgba(253,186,116,0.4)",
              },
            },

            markLine: {
              silent: true,

              symbol: "none",

              lineStyle: {
                color:
                  colors.foregroundFaint,
                type: "dashed",
                width: 1,
              },

              label: {
                show: false,
              },

              data: [
                {
                  yAxis: 50,
                },
                {
                  yAxis: 100,
                },
              ],
            },

            markPoint: {
              silent: true,

              symbol: "circle",
              symbolSize: 10,

              itemStyle: {
                color: "#FDBA74",
                borderColor:
                  colors.surface,
                borderWidth: 3,
                shadowColor: "rgba(253,186,116,0.4)",
                shadowBlur: 10,
              },

              data: [
                {
                  coord: [
                    0,
                    currentAQI,
                  ],
                },

                ...(highestPoint &&
                peakIndex >= 0
                  ? [
                      {
                        coord: [
                          peakIndex,
                          highestPoint.aqi,
                        ],
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
      true,
    );
  }, [
    currentAQI,
    forecastData,
    highestPoint,
    reducedMotion,
    theme,
  ]);

  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-4 w-44 rounded bg-[var(--control-hover)]" />
            <div className="h-4 w-28 rounded bg-[var(--control-background)]" />
          </div>
          
          <div className="mt-2 h-3 w-72 rounded bg-[var(--control-background)]" />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--foreground-faint)]/10 to-transparent animate-shimmer" style={{ animationDelay: `${index * 0.15}s` }} />
              </div>
            ))}
          </div>

          <div className="relative mt-4 h-[280px] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--foreground-faint)]/10 to-transparent animate-shimmer" />
          </div>
        </div>
      </motion.section>
    );
  }

  if (
    isError ||
    !data ||
    !forecastData.length
  ) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--error)]/15 to-[var(--error)]/8 shadow-[0_0_16px_rgba(220,38,38,0.12)]">
            <span className="text-lg font-bold text-[var(--error)]">!</span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Air quality outlook unavailable
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Forecast data could not be loaded from the environmental service.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={
        reducedMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              y: 10,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration:
          reducedMotion ? 0 : 0.5,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] transition-colors duration-200 shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
    >
      {/* Subtle gradient mesh overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/[0.02] via-transparent to-transparent opacity-60" />

      {/* Header with enhanced styling */}
      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_6px_rgba(56,189,248,0.3)]" />
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                Air quality outlook
              </p>
            </div>

            <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

            <span className="rounded-full border border-orange-400/20 bg-gradient-to-br from-orange-400/[0.08] to-orange-400/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-orange-400/85 shadow-[inset_0_1px_0_rgba(251,146,60,0.12)]">
              Next 24 hours
            </span>
          </div>

          <p className="mt-2 max-w-xl text-xs leading-5 text-[var(--foreground-muted)]">
            Expected AQI changes from the current environmental forecast.
          </p>
        </div>

        {/* Trend with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`group flex w-fit items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all ${
            improving
              ? "border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.08] to-emerald-400/[0.04] shadow-[inset_0_1px_0_rgba(52,211,153,0.12)]"
              : change > 0
                ? "border-orange-400/20 bg-gradient-to-br from-orange-400/[0.08] to-orange-400/[0.04] shadow-[inset_0_1px_0_rgba(251,146,60,0.12)]"
                : "border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]"
          }`}
        >
          <div
            className={`flex size-9 items-center justify-center rounded-xl transition-all ${
              improving
                ? "bg-gradient-to-br from-emerald-400/[0.15] to-emerald-400/[0.08] shadow-[inset_0_1px_0_rgba(52,211,153,0.15)]"
                : change > 0
                  ? "bg-gradient-to-br from-orange-400/[0.15] to-orange-400/[0.08] shadow-[inset_0_1px_0_rgba(251,146,60,0.15)]"
                  : "bg-[var(--control-background)]"
            }`}
          >
            <HugeiconsIcon
              icon={
                change < 0
                  ? ArrowDown01Icon
                  : ArrowUp01Icon
              }
              size={16}
              strokeWidth={1.6}
              className={
                change < 0
                  ? "text-emerald-400/90"
                  : "text-orange-400/90"
              }
            />
          </div>

          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors group-hover:text-[var(--foreground-secondary)] ${
                improving
                  ? "text-emerald-400/90"
                  : change > 0
                    ? "text-orange-400/90"
                    : "text-[var(--foreground-secondary)]"
              }`}
            >
              {trendLabel}
            </p>

            <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
              {Math.abs(change)} AQI points over 24h
            </p>
          </div>
        </motion.div>
      </div>

      {/* Summary with enhanced cards */}
      <div className="relative grid border-y border-[var(--border)] sm:grid-cols-3">
        <div className="group p-5 sm:border-r sm:border-[var(--border)]">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Current
          </p>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)] group-hover:text-[var(--foreground-secondary)]">
              {currentAQI}
            </span>

            <span className="text-[9px] text-[var(--foreground-subtle)]">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-[var(--foreground-faint)]">
            Current API reading
          </p>
        </div>

        <div className="group border-t border-[var(--border)] p-5 transition-colors hover:bg-gradient-to-br hover:from-[var(--control-background)] hover:to-[var(--accent-glow)]/30 sm:border-t-0 sm:border-r">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Expected peak
          </p>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)] group-hover:text-orange-400/90">
              {highestPoint?.aqi ??
                "—"}
            </span>

            <span className="text-[9px] text-orange-400/75">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-[var(--foreground-faint)]">
            {highestPoint
              ? `Around ${formatForecastTime(
                  highestPoint.time,
                  location.timezone,
                )}`
              : "No peak available"}
          </p>
        </div>

        <div className="group border-t border-[var(--border)] p-5 transition-colors hover:bg-gradient-to-br hover:from-[var(--control-background)] hover:to-[var(--accent-glow)]/30 sm:border-t-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Expected average
          </p>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)] group-hover:text-[var(--foreground-secondary)]">
              {averageAQI}
            </span>

            <span className="text-[9px] text-[var(--foreground-subtle)]">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-[var(--foreground-faint)]">
            Next 24 forecast points
          </p>
        </div>
      </div>

      {/* Chart with enhanced presentation */}
      <div className="relative p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
              Expected AQI
            </span>
          </div>

          <span className="text-[9px] text-[var(--foreground-faint)]">
            Hourly API forecast
          </span>
        </div>

        <div className="h-[280px] w-full">
          <div
            ref={chartRef}
            className="h-full w-full"
            role="img"
            aria-label="Expected AQI over the next 24 hours"
          />
        </div>
      </div>

      {/* Timeline with enhanced styling */}
      <div className="relative border-t border-[var(--border)] px-5 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={14}
                strokeWidth={1.5}
                className="text-[var(--foreground-subtle)]"
              />
            </div>

            <span className="text-[10px] font-medium text-[var(--foreground-muted)]">
              Forecast timeline
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--control-background)] px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_4px_rgba(56,189,248,0.3)]" />
            <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
              Live forecast
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
          {forecastData
            .filter(
              (_, index) =>
                index % 2 ===
                0,
            )
            .map(
              (point, index) => {
                const isPeak =
                  point.aqi ===
                  highestPoint?.aqi;

                return (
                  <motion.div
                    key={
                      point.time
                    }
                    initial={
                      reducedMotion
                        ? {
                            opacity:
                              1,
                            y: 0,
                          }
                        : {
                            opacity:
                              0,
                            y: 5,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration:
                        reducedMotion
                          ? 0
                          : 0.3,
                      delay: index * 0.03,
                    }}
                    whileHover={{ 
                      y: -2,
                      scale: 1.03,
                    }}
                    className={`group relative overflow-hidden rounded-xl border p-2.5 transition-all ${
                      isPeak
                        ? "border-orange-400/25 bg-gradient-to-br from-orange-400/[0.1] to-orange-400/[0.05] shadow-[inset_0_1px_0_rgba(251,146,60,0.15)] hover:shadow-[0_4px_12px_rgba(251,146,60,0.15)]"
                        : "border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] hover:border-[var(--foreground-faint)] hover:shadow-[0_4px_12px_rgba(148,163,184,0.12)]"
                    }`}
                  >
                    {/* Subtle accent overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                    
                    <p className="relative truncate text-[9px] text-[var(--foreground-subtle)] group-hover:text-[var(--foreground-muted)]">
                      {formatForecastTime(
                        point.time,
                        location.timezone,
                      )}
                    </p>

                    <p
                      className={`relative mt-1.5 text-sm font-semibold tracking-[-0.03em] transition-colors ${
                        isPeak
                          ? "text-orange-400/90 group-hover:text-orange-400"
                          : "text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {point.aqi}
                    </p>
                  </motion.div>
                );
              },
            )}
        </div>
      </div>
    </motion.section>
  );
}