import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import * as echarts from "echarts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

import { mockPollutionDrivers } from "../data/mockPollutionDrivers";

const DRIVER_COLORS = [
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#64748B",
];

export function PollutionDrivers() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const [activeDriver, setActiveDriver] = useState<string | null>(
    null,
  );

  const activeIndex = mockPollutionDrivers.findIndex(
    (driver) => driver.id === activeDriver,
  );

  const dominantDriver = mockPollutionDrivers[0];

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);

    chartInstanceRef.current = chart;

    const renderChart = () => {
      chart.setOption({
        animation: true,
        animationDuration: 700,
        animationEasing: "cubicOut",

        tooltip: {
          trigger: "item",

          backgroundColor: "#151D27",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          padding: [10, 12],

          textStyle: {
            color: "#F4F7FA",
            fontSize: 12,
          },

          formatter: (params: {
            name: string;
            value: number;
          }) => {
            return `
              <div style="min-width: 125px;">
                <div style="
                  color: rgba(255,255,255,0.4);
                  font-size: 10px;
                  margin-bottom: 6px;
                ">
                  Estimated contribution
                </div>

                <div style="
                  display: flex;
                  align-items: baseline;
                  justify-content: space-between;
                  gap: 18px;
                ">
                  <span style="
                    color: rgba(255,255,255,0.65);
                    font-size: 12px;
                    font-weight: 500;
                  ">
                    ${params.name}
                  </span>

                  <span style="
                    color: #F4F7FA;
                    font-size: 17px;
                    font-weight: 600;
                  ">
                    ${params.value}%
                  </span>
                </div>
              </div>
            `;
          },
        },

        series: [
          {
            name: "Pollution contribution",
            type: "pie",

            radius: ["61%", "84%"],
            center: ["50%", "50%"],

            avoidLabelOverlap: true,

            itemStyle: {
              borderColor: "#0F151D",
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
                shadowColor: "rgba(0,0,0,0.25)",
              },
            },

            data: mockPollutionDrivers.map(
              (driver, index) => ({
                name: driver.pollutant,
                value: driver.value,
                itemStyle: {
                  color: DRIVER_COLORS[index],
                  opacity:
                    activeDriver === null ||
                    activeIndex === index
                      ? 1
                      : 0.28,
                },
              }),
            ),
          },
        ],
      });

      if (activeIndex >= 0) {
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: activeIndex,
        });
      }
    };

    renderChart();

    chart.on("mouseover", (params) => {
      if (
        "dataIndex" in params &&
        typeof params.dataIndex === "number"
      ) {
        const driver =
          mockPollutionDrivers[params.dataIndex];

        if (driver) {
          setActiveDriver(driver.id);
        }
      }
    });

    chart.on("mouseout", () => {
      setActiveDriver(null);
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.off("mouseover");
      chart.off("mouseout");
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  /*
   * Update segment emphasis when a row is hovered.
   */
  useEffect(() => {
    const chart = chartInstanceRef.current;

    if (!chart) {
      return;
    }

    chart.setOption({
      series: [
        {
          data: mockPollutionDrivers.map(
            (driver, index) => ({
              name: driver.pollutant,
              value: driver.value,
              itemStyle: {
                color: DRIVER_COLORS[index],
                opacity:
                  activeDriver === null ||
                  activeIndex === index
                    ? 1
                    : 0.28,
              },
            }),
          ),
        },
      ],
    });

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
  }, [activeDriver, activeIndex]);

  const handleDriverEnter = (id: string) => {
    setActiveDriver(id);

    const index = mockPollutionDrivers.findIndex(
      (driver) => driver.id === id,
    );

    if (index >= 0 && chartInstanceRef.current) {
      chartInstanceRef.current.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });

      chartInstanceRef.current.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: index,
      });
    }
  };

  const handleDriverLeave = () => {
    setActiveDriver(null);

    chartInstanceRef.current?.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });
  };

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
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0F151D]"
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white/80">
                Pollution drivers
              </p>

              <HugeiconsIcon
                icon={InformationCircleIcon}
                size={14}
                strokeWidth={1.5}
                className="text-white/20"
              />

              <span className="size-1 rounded-full bg-white/15" />
              <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                Current profile
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-white/30">
              Estimated contribution from the pollutants currently
              measured.
            </p>
          </div>

          <div className="w-fit rounded-xl border border-orange-400/10 bg-orange-400/[0.035] px-3 py-2">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
              Largest contributor
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-orange-300/70">
              {dominantDriver.pollutant} · {dominantDriver.value}%
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="mt-7 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-center">
          {/* Donut */}
          <div className="relative mx-auto size-[210px] w-full max-w-[210px]">
            <div
              ref={chartRef}
              className="absolute inset-0 size-full"
              role="img"
              aria-label="Estimated pollution contribution by pollutant"
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/25">
                  Main driver
                </p>

                <p
                  className={`mt-1 text-xl font-semibold tracking-[-0.035em] transition-colors ${
                    activeDriver
                      ? "text-white"
                      : "text-white"
                  }`}
                >
                  {
                    (
                      mockPollutionDrivers.find(
                        (driver) =>
                          driver.id === activeDriver,
                      ) ?? dominantDriver
                    ).pollutant
                  }
                </p>

                <p className="mt-0.5 text-xs font-medium text-orange-300/70">
                  {
                    (
                      mockPollutionDrivers.find(
                        (driver) =>
                          driver.id === activeDriver,
                      ) ?? dominantDriver
                    ).value
                  }
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Driver rows */}
          <div className="space-y-3">
            {mockPollutionDrivers.map(
              (driver, index) => {
                const isActive =
                  activeDriver === driver.id;

                return (
                  <motion.div
                    key={driver.id}
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
                      delay: 0.08 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() =>
                      handleDriverEnter(driver.id)
                    }
                    onMouseLeave={
                      handleDriverLeave
                    }
                    onFocus={() =>
                      handleDriverEnter(driver.id)
                    }
                    onBlur={
                      handleDriverLeave
                    }
                    tabIndex={0}
                    className={`group rounded-2xl border p-4 outline-none transition-all duration-200 ${
                      isActive
                        ? "border-white/[0.11] bg-white/[0.035]"
                        : "border-transparent bg-transparent hover:border-white/[0.06] hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="size-2 shrink-0 rounded-full transition-transform duration-200"
                          style={{
                            backgroundColor:
                              DRIVER_COLORS[index],
                            transform: isActive
                              ? "scale(1.35)"
                              : "scale(1)",
                          }}
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white/65">
                            {driver.pollutant}
                          </p>

                          {driver.concentration > 0 && (
                            <p className="mt-0.5 text-[10px] text-white/25">
                              {driver.concentration}{" "}
                              {driver.unit}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs font-semibold text-white/75">
                          {driver.value}%
                        </span>

                        {index === 0 && (
                          <span className="rounded-full bg-orange-400/[0.07] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-orange-300/65">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contribution bar */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${driver.value}%`,
                        }}
                        transition={{
                          duration: 0.75,
                          delay: 0.15 + index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            DRIVER_COLORS[index],
                          opacity: isActive ? 1 : 0.72,
                        }}
                      />
                    </div>

                    {/* Description */}
                    <AnimateDescription
                      description={driver.description}
                      visible={isActive}
                    />
                  </motion.div>
                );
              },
            )}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-7 border-t border-white/[0.06] pt-5">
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
              <p className="text-xs font-medium text-white/55">
                What's influencing the current reading?
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                {dominantDriver.pollutant} is currently the
                largest contributor in this demonstration profile,
                accounting for approximately{" "}
                <span className="font-medium text-white/50">
                  {dominantDriver.value}%
                </span>{" "}
                of the measured pollution mix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

type AnimateDescriptionProps = {
  description: string;
  visible: boolean;
};

function AnimateDescription({
  description,
  visible,
}: AnimateDescriptionProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: visible ? "auto" : 0,
        opacity: visible ? 1 : 0,
        marginTop: visible ? 8 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="overflow-hidden"
    >
      <p className="text-[10px] leading-5 text-white/25">
        {description}
      </p>
    </motion.div>
  );
}