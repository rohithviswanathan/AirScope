import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import * as echarts from "echarts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

import { useTheme } from "../../../components/theme/ThemeProvider";
import { useAirScopeData } from "../../../api/useAirScopeData";
import { useLocation } from "../../../context/LocationProvider";

const POLLUTANT_COLORS = [
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#22C55E",
  "#38BDF8",
  "#94A3B8",
];

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
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function makePollutantId(
  pollutant: string,
) {
  return pollutant
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getRelativeStatus(
  value: number,
  maximum: number,
) {
  if (maximum <= 0) {
    return "Current";
  }

  const ratio = value / maximum;

  if (ratio >= 0.75) {
    return "Higher";
  }

  if (ratio >= 0.4) {
    return "Moderate";
  }

  return "Lower";
}

export function PollutionDrivers() {
  const chartRef =
    useRef<HTMLDivElement | null>(null);

  const chartInstanceRef =
    useRef<echarts.ECharts | null>(null);

  const [activePollutant, setActivePollutant] =
    useState<string | null>(null);

  const { theme } = useTheme();

  const { location } = useLocation();

  const {
    data,
    isLoading,
    isError,
  } = useAirScopeData({
    location,
  });

  const pollutants = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.airQuality.pollutants.map(
      (pollutant, index) => ({
        ...pollutant,

        id: makePollutantId(
          pollutant.pollutant,
        ),

        color:
          POLLUTANT_COLORS[index] ??
          POLLUTANT_COLORS[
            POLLUTANT_COLORS.length - 1
          ],
      }),
    );
  }, [data]);

  const maximumConcentration =
    useMemo(() => {
      return Math.max(
        ...pollutants.map(
          (pollutant) =>
            pollutant.concentration,
        ),
        1,
      );
    }, [pollutants]);

  const dominantPollutant =
    useMemo(() => {
      if (!data) {
        return null;
      }

      return (
        pollutants.find(
          (pollutant) =>
            pollutant.pollutant ===
            data.airQuality.dominantPollutant,
        ) ??
        pollutants[0] ??
        null
      );
    }, [data, pollutants]);

  const activePollutantData =
    pollutants.find(
      (pollutant) =>
        pollutant.id === activePollutant,
    ) ??
    dominantPollutant ??
    null;

  useEffect(() => {
    if (
      !chartRef.current ||
      !pollutants.length
    ) {
      return;
    }

    const chart = echarts.init(
      chartRef.current,
    );

    chartInstanceRef.current =
      chart;

    const resizeObserver =
      new ResizeObserver(() => {
        chart.resize();
      });

    resizeObserver.observe(
      chartRef.current,
    );

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current =
        null;
    };
  }, [pollutants.length]);

  useEffect(() => {
    const chart =
      chartInstanceRef.current;

    if (
      !chart ||
      !pollutants.length
    ) {
      return;
    }

    const colors =
      getThemeColors();

    const activeIndex =
      pollutants.findIndex(
        (pollutant) =>
          pollutant.id ===
          activePollutant,
      );

    chart.setOption(
      {
        animation: true,
        animationDuration: 650,
        animationEasing: "cubicOut",

        tooltip: {
          trigger: "item",

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

          formatter: (
            params: unknown,
          ) => {
            const item =
              params as {
                name?: string;
                value?: number;
              };

            return `
              <div style="min-width:135px;">
                <div style="
                  color:${colors.foregroundMuted};
                  font-size:10px;
                  margin-bottom:6px;
                ">
                  Relative concentration
                </div>

                <div style="
                  display:flex;
                  align-items:baseline;
                  justify-content:space-between;
                  gap:18px;
                ">
                  <span style="
                    color:${colors.foregroundSecondary};
                    font-size:12px;
                    font-weight:500;
                  ">
                    ${item.name ?? ""}
                  </span>

                  <span style="
                    color:${colors.foreground};
                    font-size:16px;
                    font-weight:600;
                  ">
                    ${formatNumber(
                      item.value ?? 0,
                    )}
                  </span>
                </div>

                <div style="
                  color:${colors.foregroundSubtle};
                  font-size:9px;
                  margin-top:4px;
                ">
                  µg/m³
                </div>
              </div>
            `;
          },
        },

        series: [
          {
            name:
              "Pollutant concentration",

            type: "pie",

            radius: [
              "61%",
              "84%",
            ],

            center: [
              "50%",
              "50%",
            ],

            avoidLabelOverlap:
              true,

            itemStyle: {
              borderColor:
                colors.surface,

              borderWidth: 3,
            },

            label: {
              show: false,
            },

            labelLine: {
              show: false,
            },

            emphasis: {
              scale: true,
              scaleSize: 5,

              itemStyle: {
                shadowBlur: 20,

                shadowColor:
                  theme === "light"
                    ? "rgba(15,23,42,0.14)"
                    : "rgba(0,0,0,0.25)",
              },
            },

            data: pollutants.map(
              (pollutant, index) => ({
                name:
                  pollutant.pollutant,

                value:
                  pollutant.concentration,

                itemStyle: {
                  color:
                    pollutant.color,

                  opacity:
                    activePollutant ===
                      null ||
                    activeIndex ===
                      index
                      ? 1
                      : 0.25,
                },
              }),
            ),
          },
        ],
      },
      true,
    );

    chart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });

    if (activeIndex >= 0) {
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: activeIndex,
      });
    }
  }, [
    activePollutant,
    pollutants,
    theme,
  ]);

  useEffect(() => {
    const chart =
      chartInstanceRef.current;

    if (!chart || !pollutants.length) {
      return;
    }

    chart.off("mouseover");
    chart.off("mouseout");

    chart.on(
      "mouseover",
      (params) => {
        if (
          "dataIndex" in params &&
          typeof params.dataIndex ===
            "number"
        ) {
          const pollutant =
            pollutants[
              params.dataIndex
            ];

          if (pollutant) {
            setActivePollutant(
              pollutant.id,
            );
          }
        }
      },
    );

    chart.on(
      "mouseout",
      () => {
        setActivePollutant(
          null,
        );
      },
    );

    return () => {
      chart.off("mouseover");
      chart.off("mouseout");
    };
  }, [pollutants]);

  const handleEnter = (
    id: string,
  ) => {
    setActivePollutant(id);

    const index =
      pollutants.findIndex(
        (pollutant) =>
          pollutant.id === id,
      );

    if (
      index >= 0 &&
      chartInstanceRef.current
    ) {
      chartInstanceRef.current.dispatchAction(
        {
          type: "downplay",
          seriesIndex: 0,
        },
      );

      chartInstanceRef.current.dispatchAction(
        {
          type: "highlight",
          seriesIndex: 0,
          dataIndex: index,
        },
      );
    }
  };

  const handleLeave = () => {
    setActivePollutant(null);

    chartInstanceRef.current?.dispatchAction(
      {
        type: "downplay",
        seriesIndex: 0,
      },
    );
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-[var(--control-hover)]" />
          <div className="mt-2 h-3 w-72 rounded bg-[var(--control-hover)]" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
            <div className="mx-auto size-[210px] rounded-full bg-[var(--control-background)]" />

            <div className="space-y-3">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 rounded-2xl bg-[var(--control-background)]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          Pollution profile unavailable
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Current pollutant data could not be loaded.
        </p>
      </section>
    );
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200"
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                Pollutant profile
              </p>

              <HugeiconsIcon
                icon={
                  InformationCircleIcon
                }
                size={14}
                strokeWidth={1.5}
                className="text-[var(--foreground-faint)]"
              />

              <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />

              <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                Live concentrations
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              Current pollutant concentrations reported by the air-quality service.
            </p>
          </div>

          {dominantPollutant && (
            <div className="w-fit rounded-xl border border-orange-400/10 bg-orange-400/[0.035] px-3 py-2">
              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
                AQI driver
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-orange-300/70">
                {data.airQuality.dominantPollutant}
              </p>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="mt-7 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-center">
          {/* Donut */}
          <div className="relative mx-auto size-[210px] w-full max-w-[210px]">
            <div
              ref={chartRef}
              className="absolute inset-0 size-full"
              role="img"
              aria-label="Relative pollutant concentration profile"
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
              {activePollutantData && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--foreground-subtle)]">
                    {activePollutant
                      ? "Selected"
                      : "AQI driver"}
                  </p>

                  <motion.p
                    key={
                      activePollutantData.id
                    }
                    initial={{
                      opacity: 0,
                      y: 3,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[var(--foreground)]"
                  >
                    {
                      activePollutantData.pollutant
                    }
                  </motion.p>

                  <motion.p
                    key={`${activePollutantData.id}-value`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="mt-0.5 text-xs font-medium text-orange-300/70"
                  >
                    {formatNumber(
                      activePollutantData.concentration,
                    )}{" "}
                    µg/m³
                  </motion.p>
                </div>
              )}
            </div>
          </div>

          {/* Pollutant rows */}
          <div className="space-y-3">
            {pollutants.map(
              (pollutant) => {
                const isActive =
                  activePollutant ===
                  pollutant.id;

                const relativeLevel =
                  Math.max(
                    6,
                    Math.min(
                      100,
                      (pollutant.concentration /
                        maximumConcentration) *
                        100,
                    ),
                  );

                const status =
                  getRelativeStatus(
                    pollutant.concentration,
                    maximumConcentration,
                  );

                return (
                  <motion.div
                    key={pollutant.id}
                    initial={{
                      opacity: 0,
                      x: 8,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    onMouseEnter={() =>
                      handleEnter(
                        pollutant.id,
                      )
                    }
                    onMouseLeave={
                      handleLeave
                    }
                    onFocus={() =>
                      handleEnter(
                        pollutant.id,
                      )
                    }
                    onBlur={
                      handleLeave
                    }
                    tabIndex={0}
                    className={`group rounded-2xl border p-4 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--foreground-faint)] ${
                      isActive
                        ? "border-[var(--foreground-faint)] bg-[var(--control-hover)]"
                        : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--control-background)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <motion.span
                          animate={{
                            scale:
                              isActive
                                ? 1.35
                                : 1,
                          }}
                          className="size-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              pollutant.color,
                          }}
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
                            {
                              pollutant.pollutant
                            }
                          </p>

                          <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                            {pollutant.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs font-semibold text-[var(--foreground-secondary)]">
                          {formatNumber(
                            pollutant.concentration,
                          )}{" "}
                          µg/m³
                        </span>

                        {pollutant.pollutant ===
                          data.airQuality
                            .dominantPollutant && (
                          <span className="rounded-full bg-orange-400/[0.07] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-orange-300/65">
                            Driver
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--control-hover)]">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${relativeLevel}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              pollutant.color,
                            opacity:
                              isActive
                                ? 1
                                : 0.72,
                          }}
                        />
                      </div>

                      <span className="w-14 text-right text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              },
            )}
          </div>
        </div>

        {/* Insight */}
        {dominantPollutant && (
          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-400/[0.07]">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={15}
                  strokeWidth={1.5}
                  className="text-orange-300/65"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--foreground-secondary)]">
                  What's influencing the current AQI?
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                  The current AQI data identifies{" "}
                  <span className="font-medium text-[var(--foreground-secondary)]">
                    {
                      data.airQuality
                        .dominantPollutant
                    }
                  </span>{" "}
                  as the dominant pollutant for this reading.
                  The chart above compares the live concentrations
                  reported for each measured pollutant.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}