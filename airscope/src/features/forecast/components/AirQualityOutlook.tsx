import { useEffect, useMemo, useRef } from "react";
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

import { mockAirQualityOutlook } from "../data/mockAirQualityOutlook";

export function AirQualityOutlook() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef =
    useRef<echarts.ECharts | null>(null);

  const reducedMotion = useReducedMotion();

  const currentAQI =
    mockAirQualityOutlook[0]?.aqi ?? 0;

  const finalAQI =
    mockAirQualityOutlook[
      mockAirQualityOutlook.length - 1
    ]?.aqi ?? 0;

  const highestPoint = useMemo(() => {
    return mockAirQualityOutlook.reduce(
      (highest, point) =>
        point.aqi > highest.aqi ? point : highest,
    );
  }, []);

  const averageAQI = useMemo(() => {
    if (!mockAirQualityOutlook.length) {
      return 0;
    }

    const total = mockAirQualityOutlook.reduce(
      (sum, point) => sum + point.aqi,
      0,
    );

    return Math.round(
      total / mockAirQualityOutlook.length,
    );
  }, []);

  const change = finalAQI - currentAQI;
  const improving = change < 0;

  const trendLabel =
    change === 0
      ? "Stable"
      : improving
        ? "Improving"
        : "Worsening";

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const times = mockAirQualityOutlook.map(
      (point) => point.time,
    );

    const values = mockAirQualityOutlook.map(
      (point) => point.aqi,
    );

    const peakIndex =
      mockAirQualityOutlook.findIndex(
        (point) => point.aqi === highestPoint.aqi,
      );

    chart.setOption({
      animation: !reducedMotion,
      animationDuration: reducedMotion ? 0 : 850,
      animationEasing: "cubicOut",

      grid: {
        top: 28,
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
            color: "rgba(255,255,255,0.16)",
            width: 1,
          },
        },

        formatter: (params: unknown) => {
          const items = Array.isArray(params)
            ? params
            : [params];

          const first = items[0] as
            | {
                axisValue?: string;
                data?: number;
              }
            | undefined;

          if (!first) {
            return "";
          }

          return `
            <div style="min-width: 125px;">
              <div style="
                color: rgba(255,255,255,0.38);
                font-size: 10px;
                margin-bottom: 6px;
              ">
                ${first.axisValue ?? ""}
              </div>

              <div style="
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 18px;
              ">
                <span style="
                  color: rgba(255,255,255,0.58);
                  font-size: 11px;
                ">
                  Expected AQI
                </span>

                <span style="
                  color: #F4F7FA;
                  font-size: 18px;
                  font-weight: 600;
                  letter-spacing: -0.04em;
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
          color: "rgba(255,255,255,0.23)",
          fontSize: 10,
          margin: 12,

          formatter: (
            value: string,
            index: number,
          ) => {
            if (index % 4 !== 0) {
              return "";
            }

            return value;
          },
        },
      },

      yAxis: {
        type: "value",

        min: 110,
        max: 170,

        splitNumber: 3,

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: "rgba(255,255,255,0.2)",
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
          name: "Expected AQI",
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
                  color: "rgba(251,146,60,0.18)",
                },
                {
                  offset: 0.6,
                  color: "rgba(251,146,60,0.05)",
                },
                {
                  offset: 1,
                  color: "rgba(251,146,60,0)",
                },
              ],
            },
          },

          emphasis: {
            scale: true,

            itemStyle: {
              color: "#FDBA74",
              borderColor: "#0F151D",
              borderWidth: 3,
            },
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
                yAxis: 150,
              },
            ],
          },

          markPoint: {
            silent: true,

            symbol: "circle",
            symbolSize: 9,

            itemStyle: {
              color: "#FB923C",
              borderColor: "#0F151D",
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor:
                "rgba(251,146,60,0.35)",
            },

            data: [
              {
                coord: [0, currentAQI],
              },
              {
                coord: [
                  peakIndex,
                  highestPoint.aqi,
                ],
              },
            ],
          },
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [
    currentAQI,
    highestPoint,
    reducedMotion,
  ]);

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
        duration: reducedMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0F151D]"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-white/80">
              Air quality outlook
            </p>

            <span className="size-1 rounded-full bg-white/15" />

            <span className="rounded-full border border-orange-400/10 bg-orange-400/[0.04] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-orange-300/60">
              Next 24 hours
            </span>
          </div>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/30">
            Expected changes in air quality based on the
            current environmental profile.
          </p>
        </div>

        {/* Trend status */}
        <div
          className={`flex w-fit items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${
            improving
              ? "border-emerald-400/10 bg-emerald-400/[0.035]"
              : change > 0
                ? "border-orange-400/10 bg-orange-400/[0.035]"
                : "border-white/[0.07] bg-white/[0.025]"
          }`}
        >
          <div
            className={`flex size-8 items-center justify-center rounded-xl ${
              improving
                ? "bg-emerald-400/[0.07]"
                : change > 0
                  ? "bg-orange-400/[0.07]"
                  : "bg-white/[0.04]"
            }`}
          >
            <HugeiconsIcon
              icon={
                improving
                  ? ArrowDown01Icon
                  : ArrowUp01Icon
              }
              size={15}
              strokeWidth={1.6}
              className={
                improving
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
                  : "text-orange-300/70"
              }`}
            >
              {trendLabel}
            </p>

            <p className="mt-0.5 text-[10px] text-white/25">
              {Math.abs(change)} AQI points over 24h
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid border-y border-white/[0.06] sm:grid-cols-3">
        <div className="p-5 sm:border-r sm:border-white/[0.06]">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/22">
            Current
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-white">
              {currentAQI}
            </span>

            <span className="text-[9px] text-white/25">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-white/20">
            Starting point
          </p>
        </div>

        <div className="border-t border-white/[0.06] p-5 sm:border-t-0 sm:border-r">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/22">
            Expected peak
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-white">
              {highestPoint.aqi}
            </span>

            <span className="text-[9px] text-orange-300/55">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-white/20">
            Around {highestPoint.time}
          </p>
        </div>

        <div className="border-t border-white/[0.06] p-5 sm:border-t-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/22">
            Expected average
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-[-0.045em] text-white">
              {averageAQI}
            </span>

            <span className="text-[9px] text-white/25">
              AQI
            </span>
          </div>

          <p className="mt-1 text-[9px] text-white/20">
            Across the outlook
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-orange-400" />

            <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-white/25">
              Expected AQI
            </span>
          </div>

          <span className="text-[9px] text-white/20">
            Hourly outlook
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
      <div className="border-t border-white/[0.06] px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={14}
              strokeWidth={1.5}
              className="text-white/25"
            />

            <span className="text-[10px] font-medium text-white/35">
              Outlook timeline
            </span>
          </div>

          <span className="text-[9px] uppercase tracking-[0.1em] text-white/15">
            Mock forecast
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
          {mockAirQualityOutlook
            .filter((_, index) => {
              return index % 2 === 0;
            })
            .map((point, index) => {
              const isCurrent = index === 0;

              const isPeak =
                point.aqi === highestPoint.aqi;

              return (
                <motion.div
                  key={`${point.time}-${index}`}
                  initial={
                    reducedMotion
                      ? { opacity: 1, y: 0 }
                      : {
                          opacity: 0,
                          y: 5,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: reducedMotion
                      ? 0
                      : 0.3,
                    delay:
                      reducedMotion
                        ? 0
                        : index * 0.025,
                  }}
                  className={`rounded-xl border p-2.5 ${
                    isCurrent
                      ? "border-orange-400/15 bg-orange-400/[0.045]"
                      : isPeak
                        ? "border-white/[0.09] bg-white/[0.035]"
                        : "border-white/[0.045] bg-white/[0.015]"
                  }`}
                >
                  <p className="truncate text-[9px] text-white/25">
                    {point.time}
                  </p>

                  <p
                    className={`mt-1.5 text-sm font-semibold tracking-[-0.03em] ${
                      isCurrent
                        ? "text-orange-300/80"
                        : "text-white/65"
                    }`}
                  >
                    {point.aqi}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </div>
    </motion.section>
  );
}