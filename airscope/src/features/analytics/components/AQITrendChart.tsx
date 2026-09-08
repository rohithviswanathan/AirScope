import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import * as echarts from "echarts";

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
  };
}

function formatChartTime(
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

  const {
    data,
    isLoading,
    isError,
  } =
    useAirScopeData({
      location:
        BENGALURU_LOCATION,
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
              color: "#F97316",
              width: 2,
            },

            itemStyle: {
              color: "#F97316",
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
                      "rgba(249,115,22,0.18)",
                  },
                  {
                    offset: 0.65,
                    color:
                      "rgba(249,115,22,0.05)",
                  },
                  {
                    offset: 1,
                    color:
                      "rgba(249,115,22,0)",
                  },
                ],
              },
            },

            emphasis: {
              scale: true,

              itemStyle: {
                color: "#FB923C",
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
              symbolSize: 9,

              itemStyle: {
                color: "#F97316",
                borderColor:
                  colors.surface,
                borderWidth: 3,
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
      <section className="h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-[var(--control-hover)]" />
          <div className="mt-2 h-3 w-64 rounded bg-[var(--control-hover)]" />

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-2xl bg-[var(--control-background)]"
              />
            ))}
          </div>

          <div className="mt-4 h-[280px] rounded-2xl bg-[var(--control-background)]" />
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          AQI trend unavailable
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Historical observations could not be loaded.
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
        delay: 0.05,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              AQI trend
            </p>

            <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />

            <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
              Last 24 hours
            </span>
          </div>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Historical air-quality observations from the API
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-3.5">
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
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-3.5">
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--foreground-subtle)]">
            24h change
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span
              className={`text-xl font-semibold tracking-[-0.04em] ${
                change > 0
                  ? "text-orange-300/80"
                  : change < 0
                    ? "text-emerald-300/80"
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
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-3.5">
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
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--control-background)] p-3.5">
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
                  )
                : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-orange-400" />

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

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-5 text-[var(--foreground-subtle)]">
          Historical values are supplied by the current AirScope environmental data source.
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span className="size-1.5 rounded-full bg-orange-400/80" />

          <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
            Live API history
          </span>
        </div>
      </div>
    </motion.section>
  );
}