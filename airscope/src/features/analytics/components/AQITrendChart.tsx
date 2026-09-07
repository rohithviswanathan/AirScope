import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import * as echarts from "echarts";

import { mockAQITrend } from "../data/mockAQITrend";

type Range = "24H" | "7D" | "30D";

type TrendPoint = {
  time: string;
  aqi: number;
};

const RANGE_OPTIONS: Range[] = ["24H", "7D", "30D"];

/**
 * Generate deterministic mock historical data for the
 * frontend-only phase.
 *
 * The 24H dataset remains the source of truth and the
 * longer ranges are generated around a realistic baseline.
 */
function buildTrendData(range: Range): TrendPoint[] {
  if (range === "24H") {
    return mockAQITrend;
  }

  if (range === "7D") {
    return [
      { time: "Sep 01", aqi: 121 },
      { time: "Sep 02", aqi: 128 },
      { time: "Sep 03", aqi: 136 },
      { time: "Sep 04", aqi: 131 },
      { time: "Sep 05", aqi: 144 },
      { time: "Sep 06", aqi: 137 },
      { time: "Sep 07", aqi: 142 },
    ];
  }

  return [
    { time: "Aug 09", aqi: 109 },
    { time: "Aug 10", aqi: 114 },
    { time: "Aug 11", aqi: 118 },
    { time: "Aug 12", aqi: 112 },
    { time: "Aug 13", aqi: 121 },
    { time: "Aug 14", aqi: 127 },
    { time: "Aug 15", aqi: 124 },
    { time: "Aug 16", aqi: 130 },
    { time: "Aug 17", aqi: 136 },
    { time: "Aug 18", aqi: 129 },
    { time: "Aug 19", aqi: 134 },
    { time: "Aug 20", aqi: 141 },
    { time: "Aug 21", aqi: 138 },
    { time: "Aug 22", aqi: 145 },
    { time: "Aug 23", aqi: 151 },
    { time: "Aug 24", aqi: 146 },
    { time: "Aug 25", aqi: 139 },
    { time: "Aug 26", aqi: 132 },
    { time: "Aug 27", aqi: 135 },
    { time: "Aug 28", aqi: 143 },
    { time: "Aug 29", aqi: 149 },
    { time: "Aug 30", aqi: 153 },
    { time: "Aug 31", aqi: 148 },
    { time: "Sep 01", aqi: 121 },
    { time: "Sep 02", aqi: 128 },
    { time: "Sep 03", aqi: 136 },
    { time: "Sep 04", aqi: 131 },
    { time: "Sep 05", aqi: 144 },
    { time: "Sep 06", aqi: 137 },
    { time: "Sep 07", aqi: 142 },
  ];
}

function getNiceYAxisBounds(values: number[]) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  const min = Math.floor((minimum - 15) / 10) * 10;
  const max = Math.ceil((maximum + 15) / 10) * 10;

  return {
    min: Math.max(0, min),
    max,
  };
}

function getChange(values: number[]) {
  if (values.length < 2) {
    return 0;
  }

  return values[values.length - 1] - values[0];
}

export function AQITrendChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const [range, setRange] = useState<Range>("24H");

  const reducedMotion = useReducedMotion();

  const trendData = useMemo(
    () => buildTrendData(range),
    [range],
  );

  const values = useMemo(
    () => trendData.map((point) => point.aqi),
    [trendData],
  );

  const currentAQI = values[values.length - 1] ?? 0;

  const change = getChange(values);

  const averageAQI = useMemo(() => {
    if (!values.length) {
      return 0;
    }

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length,
    );
  }, [values]);

  const peakPoint = useMemo(() => {
    if (!trendData.length) {
      return null;
    }

    return trendData.reduce((peak, point) =>
      point.aqi > peak.aqi ? point : peak,
    );
  }, [trendData]);

  const yAxisBounds = useMemo(
    () => getNiceYAxisBounds(values),
    [values],
  );

  /*
   * Initialize ECharts once.
   */
  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);

    chartInstanceRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  /*
   * Update chart whenever the selected range changes.
   */
  useEffect(() => {
    const chart = chartInstanceRef.current;

    if (!chart) {
      return;
    }

    const times = trendData.map((point) => point.time);

    chart.setOption(
      {
        animation: !reducedMotion,
        animationDuration: reducedMotion ? 0 : 650,
        animationEasing: "cubicOut",

        grid: {
          top: 22,
          right: 8,
          bottom: 28,
          left: 8,
          containLabel: true,
        },

        tooltip: {
          trigger: "axis",

          backgroundColor: "#151D27",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,

          padding: [10, 12],

          textStyle: {
            color: "#F4F7FA",
            fontSize: 12,
          },

          axisPointer: {
            type: "line",

            lineStyle: {
              color: "rgba(255,255,255,0.18)",
              width: 1,
            },
          },

          formatter: (params: unknown) => {
            const items = Array.isArray(params)
              ? params
              : [params];

            const firstItem = items[0] as
              | {
                  axisValue?: string | number;
                  data?: number | { value?: number };
                }
              | undefined;

            if (!firstItem) {
              return "";
            }

            const rawValue = firstItem.data;

            const aqi =
              typeof rawValue === "number"
                ? rawValue
                : rawValue?.value ?? 0;

            return `
              <div style="min-width: 112px;">
                <div style="
                  color: rgba(255,255,255,0.38);
                  font-size: 10px;
                  margin-bottom: 6px;
                ">
                  ${firstItem.axisValue ?? ""}
                </div>

                <div style="
                  display: flex;
                  align-items: baseline;
                  gap: 5px;
                ">
                  <span style="
                    color: #F4F7FA;
                    font-size: 20px;
                    font-weight: 600;
                    letter-spacing: -0.04em;
                  ">
                    ${aqi}
                  </span>

                  <span style="
                    color: rgba(255,255,255,0.35);
                    font-size: 10px;
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
            color: "rgba(255,255,255,0.25)",
            fontSize: 10,
            margin: 12,

            formatter: (
              value: string,
              index: number,
            ) => {
              if (range === "24H") {
                return index % 4 === 0 ? value : "";
              }

              if (range === "7D") {
                return value;
              }

              return index % 4 === 0 ? value : "";
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
            color: "rgba(255,255,255,0.22)",
            fontSize: 10,
            margin: 10,
          },

          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.045)",
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
                    color: "rgba(249,115,22,0.18)",
                  },
                  {
                    offset: 0.65,
                    color: "rgba(249,115,22,0.05)",
                  },
                  {
                    offset: 1,
                    color: "rgba(249,115,22,0)",
                  },
                ],
              },
            },

            emphasis: {
              scale: true,

              itemStyle: {
                color: "#FB923C",
                borderColor: "#0F151D",
                borderWidth: 3,
              },
            },

            /*
             * Neutral reference bands rather than assuming
             * a particular country's AQI classification system.
             */
            markArea: {
              silent: true,

              itemStyle: {
                color: "rgba(255,255,255,0.012)",
              },

              data: [
                [
                  {
                    yAxis: 100,
                  },
                  {
                    yAxis: 150,
                  },
                ],
              ],
            },

            markLine: {
              silent: true,

              symbol: "none",

              lineStyle: {
                color: "rgba(255,255,255,0.08)",
                type: "dashed",
                width: 1,
              },

              label: {
                show: false,
              },

              data: [
                {
                  yAxis: 100,
                },
                {
                  yAxis: 150,
                },
                {
                  yAxis: 200,
                },
              ],
            },

            markPoint: {
              silent: true,

              symbol: "circle",
              symbolSize: 9,

              itemStyle: {
                color: "#F97316",
                borderColor: "#0F151D",
                borderWidth: 3,
              },

              data: [
                {
                  coord: [
                    trendData.length - 1,
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
    range,
    trendData,
    values,
    yAxisBounds,
  ]);

  return (
    <motion.section
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 10 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.5,
        delay: 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full rounded-3xl border border-white/[0.06] bg-[#0F151D] p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/80">
              AQI trend
            </p>

            <span className="size-1 rounded-full bg-white/15" />

            <span className="text-[10px] uppercase tracking-[0.12em] text-white/25">
              Historical
            </span>
          </div>

          <p className="mt-1 text-xs text-white/30">
            Pollution levels over the selected period
          </p>
        </div>

        {/* Range selector */}
        <div
          className="flex w-fit items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-1"
          role="tablist"
          aria-label="AQI trend time range"
        >
          {RANGE_OPTIONS.map((option) => {
            const selected = range === option;

            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRange(option)}
                className="relative min-w-[42px] rounded-lg px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white/35 transition-colors hover:text-white/65"
              >
                {selected && (
                  <motion.span
                    layoutId="aqi-range-active"
                    className="absolute inset-0 rounded-lg bg-white/[0.08]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 ${
                    selected ? "text-white/80" : ""
                  }`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-white/22">
            Current
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-white">
              {currentAQI}
            </span>

            <span className="text-[9px] text-white/25">
              AQI
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-white/22">
            Period change
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={`text-xl font-semibold tracking-[-0.04em] ${
                change > 0
                  ? "text-orange-300/80"
                  : change < 0
                    ? "text-emerald-300/80"
                    : "text-white/70"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}
            </span>

            <span className="text-[9px] text-white/25">
              AQI
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-white/22">
            Average
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-white">
              {averageAQI}
            </span>

            <span className="text-[9px] text-white/25">
              AQI
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5">
          <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-white/22">
            Peak
          </p>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-[-0.04em] text-white">
              {peakPoint?.aqi ?? "—"}
            </span>

            <span className="truncate text-[9px] text-white/25">
              {peakPoint?.time ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-orange-400" />

          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
            AQI
          </span>
        </div>

        <div className="h-[280px] w-full">
          <div
            ref={chartRef}
            className="h-full w-full"
            role="img"
            aria-label={`AQI trend for the selected ${range} period`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-5 text-white/25">
          Values shown here are demonstration data and will be
          replaced with live environmental observations later.
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span className="size-1.5 rounded-full bg-orange-400/80" />

          <span className="text-[9px] uppercase tracking-[0.1em] text-white/25">
            Historical AQI
          </span>
        </div>
      </div>
    </motion.section>
  );
}