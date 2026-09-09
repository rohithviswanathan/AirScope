import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import * as echarts from "echarts";

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

    controlBackground:
      styles
        .getPropertyValue(
          "--control-background",
        )
        .trim() ||
      "rgba(255,255,255,0.025)",

    controlHover:
      styles
        .getPropertyValue("--control-hover")
        .trim() ||
      "rgba(255,255,255,0.05)",

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
  };
}

function formatChartTime(
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
        timezone || "UTC",
    },
  ).format(date);
}

function getNiceYAxisBounds(
  values: number[],
) {
  if (!values.length) {
    return {
      min: 0,
      max: 100,
    };
  }

  const minimum =
    Math.min(...values);

  const maximum =
    Math.max(...values);

  const min =
    Math.floor(
      (minimum - 10) / 10,
    ) * 10;

  const max =
    Math.ceil(
      (maximum + 10) / 10,
    ) * 10;

  return {
    min: Math.max(
      0,
      min,
    ),
    max: Math.max(
      max,
      min + 20,
    ),
  };
}

function getChange(
  values: number[],
) {
  if (
    values.length < 2
  ) {
    return 0;
  }

  return (
    values[
      values.length - 1
    ] - values[0]
  );
}

export function AQITrendChart() {
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

  const trendData =
    data?.trend ?? [];

  const values = useMemo(
    () =>
      trendData.map(
        (point) =>
          point.aqi,
      ),
    [trendData],
  );

  const currentAQI =
    values[
      values.length - 1
    ] ?? 0;

  const change =
    getChange(values);

  const averageAQI =
    useMemo(() => {
      if (!values.length) {
        return 0;
      }

      return Math.round(
        values.reduce(
          (
            sum,
            value,
          ) =>
            sum + value,
          0,
        ) /
          values.length,
      );
    }, [values]);

  const peakPoint =
    useMemo(() => {
      if (
        !trendData.length
      ) {
        return null;
      }

      return trendData.reduce(
        (
          peak,
          point,
        ) =>
          point.aqi >
          peak.aqi
            ? point
            : peak,
      );
    }, [trendData]);

  const yAxisBounds =
    useMemo(
      () =>
        getNiceYAxisBounds(
          values,
        ),
      [values],
    );

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
      !trendData.length
    ) {
      return;
    }

    const colors =
      getThemeColors();

    const times =
      trendData.map(
        (point) =>
          point.time,
      );

    chart.setOption(
      {
        animation:
          !reducedMotion,

        animationDuration:
          reducedMotion
            ? 0
            : 650,

        animationEasing:
          "cubicOut",

        grid: {
          top: 22,
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
                    data?:
                      | number
                      | {
                          value?: number;
                        };
                  }
                | undefined;

            if (!first) {
              return "";
            }

            const rawValue =
              first.data;

            const aqi =
              typeof rawValue ===
              "number"
                ? rawValue
                : rawValue?.value ??
                  0;

            return `
              <div style="min-width:112px;">
                <div style="
                  color:${colors.foregroundMuted};
                  font-size:10px;
                  margin-bottom:6px;
                ">
                  ${
                    first.axisValue
                      ? formatChartTime(
                          first.axisValue,
                          location.timezone
                        )
                      : ""
                  }
                </div>

                <div style="
                  display:flex;
                  align-items:baseline;
                  gap:5px;
                ">
                  <span style="
                    color:${colors.foreground};
                    font-size:20px;
                    font-weight:600;
                    letter-spacing:-0.04em;
                  ">
                    ${aqi}
                  </span>

                  <span style="
                    color:${colors.foregroundSubtle};
                    font-size:10px;
                  ">
                    AQI
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
                ? formatChartTime(
                    value,
                    location.timezone
                  )
                : "";
            },
          },
        },

        yAxis: {
          type: "value",

          min: yAxisBounds.min,
          max: yAxisBounds.max,

          splitNumber: 4,

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
            name: "AQI",

            type: "line",

            data: values,

            smooth: 0.32,

            symbol: "none",

            lineStyle: {
              color: colors.accentSecondary,
              width: 2.5,
            },

            itemStyle: {
              color: colors.accentSecondary,
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
                      "rgba(56,189,248,0.20)",
                  },
                  {
                    offset: 0.65,
                    color:
                      "rgba(56,189,248,0.06)",
                  },
                  {
                    offset: 1,
                    color:
                      "rgba(56,189,248,0)",
                  },
                ],
              },
            },

            emphasis: {
              scale: true,

              itemStyle: {
                color: colors.accentPrimary,
                borderColor:
                  colors.surface,
                borderWidth: 3,
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
                {
                  yAxis: 150,
                },
              ],
            },

            markPoint: {
              silent: true,

              symbol: "circle",
              symbolSize: 10,

              itemStyle: {
                color: colors.accentSecondary,
                borderColor:
                  colors.surface,
                borderWidth: 3,
                shadowColor: "rgba(56,189,248,0.4)",
                shadowBlur: 8,
              },

              data: [
                {
                  coord: [
                    trendData.length -
                      1,
                    currentAQI,
                  ],
                },
              ],
            },
          },
        ],
      },
      true,
    );
  }, [
    currentAQI,
    reducedMotion,
    theme,
    trendData,
    values,
    yAxisBounds,
  ]);

  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] p-5 sm:p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 rounded bg-[var(--control-hover)]" />
            <div className="h-4 w-20 rounded bg-[var(--control-background)]" />
          </div>
          
          <div className="mt-2 h-3 w-64 rounded bg-[var(--control-background)]" />

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="relative h-20 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]"
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

  if (isError || !data) {
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
              AQI trend unavailable
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Historical observations could not be loaded.
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
        delay: 0.05,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] p-5 transition-colors duration-200 shadow-[0_8px_32px_rgba(15,23,42,0.12)] sm:p-6"
    >
      {/* Subtle gradient mesh overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/[0.02] via-transparent to-transparent opacity-60" />

      {/* Header with enhanced styling */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-background)] px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_6px_rgba(56,189,248,0.3)]" />
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                AQI trend
              </p>
            </div>

            <span className="size-1 shrink-0 rounded-full bg-[var(--foreground-faint)]" />

            <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
              Last 24 hours
            </span>
          </div>

          <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
            Historical air-quality observations from the API
          </p>
        </div>
      </div>

      {/* Summary with enhanced cards */}
      <div className="relative mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)]/50 p-3.5 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
            Current
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {currentAQI}
            </span>

            <span className="text-[9px] text-[var(--foreground-subtle)]">
              AQI
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)]/50 p-3.5 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
            24h change
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span
              className={`text-xl font-semibold tracking-[-0.04em] ${
                change > 0
                  ? "text-orange-400/90"
                  : change < 0
                    ? "text-emerald-400/90"
                    : "text-[var(--foreground-secondary)]"
              }`}
            >
              {change > 0
                ? "+"
                : ""}
              {change}
            </span>

            <span className="text-[9px] text-[var(--foreground-subtle)]">
              AQI
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)]/50 p-3.5 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
            Average
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {averageAQI}
            </span>

            <span className="text-[9px] text-[var(--foreground-subtle)]">
              AQI
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)]/50 p-3.5 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
            Peak
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {peakPoint?.aqi ??
                "—"}
            </span>

            <span className="truncate text-[9px] text-[var(--foreground-subtle)]">
              {peakPoint
                ? formatChartTime(
                    peakPoint.time,
                    location.timezone
                  )
                : ""}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Chart with enhanced presentation */}
      <div className="relative mt-5">
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex items-center gap-2">
          <span className="size-2 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_8px_rgba(56,189,248,0.4)]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
            AQI
          </span>
        </div>

        <div className="h-[280px] w-full">
          <div
            ref={chartRef}
            className="h-full w-full"
            role="img"
            aria-label="AQI trend for the last 24 hours"
          />
        </div>
      </div>

      {/* Footer with enhanced styling */}
      <div className="relative mt-4 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-5 text-[var(--foreground-subtle)]">
          Historical values are supplied by the current AirScope environmental data source.
        </p>

        <div className="inline-flex items-center gap-2 shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--control-background)] px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] shadow-[0_0_6px_rgba(56,189,248,0.3)]" />

          <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
            Live API history
          </span>
        </div>
      </div>
    </motion.section>
  );
}