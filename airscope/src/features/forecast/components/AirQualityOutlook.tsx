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
import type { OpenMeteoLocation } from "../../../api/types";

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
  };
}

function formatForecastTime(
  timestamp: string,
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
        "Asia/Kolkata",
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

  const {
    data,
    isLoading,
    isError,
  } =
    useAirScopeData({
      location:
        BENGALURU_LOCATION,
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
              color: "#FB923C",
              width: 2.2,
            },

            itemStyle: {
              color: "#FB923C",
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
                      "rgba(251,146,60,0.18)",
                  },
                  {
                    offset: 0.6,
                    color:
                      "rgba(251,146,60,0.05)",
                  },
                  {
                    offset: 1,
                    color:
                      "rgba(251,146,60,0)",
                  },
                ],
              },
            },

            emphasis: {
              scale: true,

              itemStyle: {
                color: "#FDBA74",
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
              ],
            },

            markPoint: {
              silent: true,

              symbol: "circle",
              symbolSize: 9,

              itemStyle: {
                color: "#FB923C",
                borderColor:
                  colors.surface,
                borderWidth: 3,
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
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="animate-pulse">
          <div className="h-4 w-44 rounded bg-[var(--control-hover)]" />
          <div className="mt-2 h-3 w-72 rounded bg-[var(--control-hover)]" />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-[var(--control-background)]"
              />
            ))}
          </div>

          <div className="mt-4 h-[280px] rounded-2xl bg-[var(--control-background)]" />
        </div>
      </section>
    );
  }

  if (
    isError ||
    !data ||
    !forecastData.length
  ) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          Air quality outlook unavailable
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Forecast data could not be loaded from the environmental service.
        </p>
      </section>
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
      className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Air quality outlook
            </p>

            <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />

            <span className="rounded-full border border-orange-400/10 bg-orange-400/[0.04] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-orange-300/70">
              Next 24 hours
            </span>
          </div>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-[var(--foreground-muted)]">
            Expected AQI changes from the current environmental forecast.
          </p>
        </div>

        {/* Trend */}
        <div
          className={`flex w-fit items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${
            improving
              ? "border-emerald-400/10 bg-emerald-400/[0.035]"
              : change > 0
                ? "border-orange-400/10 bg-orange-400/[0.035]"
                : "border-[var(--border)] bg-[var(--control-background)]"
          }`}
        >
          <div
            className={`flex size-8 items-center justify-center rounded-xl ${
              improving
                ? "bg-emerald-400/[0.07]"
                : change > 0
                  ? "bg-orange-400/[0.07]"
                  : "bg-[var(--control-background)]"
            }`}
          >
            <HugeiconsIcon
              icon={
                change < 0
                  ? ArrowDown01Icon
                  : ArrowUp01Icon
              }
              size={15}
              strokeWidth={1.6}
              className={
                change < 0
                  ? "text-emerald-300/70"
                  : "text-orange-300/70"
              }
            />
          </div>

          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                improving
                  ? "text-emerald-300/70"
                  : change > 0
                    ? "text-orange-300/70"
                    : "text-[var(--foreground-secondary)]"
              }`}
            >
              {trendLabel}
            </p>

            <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
              {Math.abs(change)} AQI points over 24h
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid border-y border-[var(--border)] sm:grid-cols-3">
        <div className="p-5 sm:border-r sm:border-[var(--border)]">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Current
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
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

        <div className="border-t border-[var(--border)] p-5 sm:border-t-0 sm:border-r">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Expected peak
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
              {highestPoint?.aqi ??
                "—"}
            </span>

            <span className="text-[9px] text-orange-300/60">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-[var(--foreground-faint)]">
            {highestPoint
              ? `Around ${formatForecastTime(
                  highestPoint.time,
                )}`
              : "No peak available"}
          </p>
        </div>

        <div className="border-t border-[var(--border)] p-5 sm:border-t-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-subtle)]">
            Expected average
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">
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

      {/* Chart */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-orange-400" />

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

      {/* Timeline */}
      <div className="border-t border-[var(--border)] px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={14}
              strokeWidth={1.5}
              className="text-[var(--foreground-subtle)]"
            />

            <span className="text-[10px] font-medium text-[var(--foreground-muted)]">
              Forecast timeline
            </span>
          </div>

          <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
            Live forecast
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
          {forecastData
            .filter(
              (_, index) =>
                index % 2 ===
                0,
            )
            .map(
              (point) => {
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
                    }}
                    className={`rounded-xl border p-2.5 ${
                      isPeak
                        ? "border-orange-400/15 bg-orange-400/[0.045]"
                        : "border-[var(--border-subtle)] bg-[var(--control-background)]"
                    }`}
                  >
                    <p className="truncate text-[9px] text-[var(--foreground-subtle)]">
                      {formatForecastTime(
                        point.time,
                      )}
                    </p>

                    <p
                      className={`mt-1.5 text-sm font-semibold tracking-[-0.03em] ${
                        isPeak
                          ? "text-orange-300/80"
                          : "text-[var(--foreground-secondary)]"
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