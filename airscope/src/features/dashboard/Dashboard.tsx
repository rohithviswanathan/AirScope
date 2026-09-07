import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CloudIcon,
  DropletIcon,
  WindPower01Icon,
} from "@hugeicons/core-free-icons";

import { AQIHero } from "../airquality/components/AQIHero";
import { mockAQIHero } from "../airquality/data/mockAirQuality";
import { AQITrendChart } from "../analytics/components/AQITrendChart";
import { AirQualityMap } from "../map/components/AirQualityMap";
import { PollutionDrivers } from "../airquality/components/PollutionDrivers";
import { AirQualityOutlook } from "../forecast/components/AirQualityOutlook";

const pollutants = [
  {
    name: "PM2.5",
    fullName: "Fine particulate matter",
    value: "67",
    unit: "µg/m³",
    change: "+8.3%",
    direction: "up",
    status: "High",
    statusClass: "text-orange-300/75",
    statusBackground: "bg-orange-400/[0.06]",
    indicator: "bg-orange-400",
    barWidth: "72%",
    description: "Primary contributor",
  },
  {
    name: "PM10",
    fullName: "Coarse particulate matter",
    value: "104",
    unit: "µg/m³",
    change: "+4.1%",
    direction: "up",
    status: "High",
    statusClass: "text-orange-300/70",
    statusBackground: "bg-orange-400/[0.06]",
    indicator: "bg-orange-300",
    barWidth: "61%",
    description: "Elevated concentration",
  },
  {
    name: "NO₂",
    fullName: "Nitrogen dioxide",
    value: "42",
    unit: "µg/m³",
    change: "-2.6%",
    direction: "down",
    status: "Moderate",
    statusClass: "text-yellow-300/70",
    statusBackground: "bg-yellow-400/[0.05]",
    indicator: "bg-yellow-300",
    barWidth: "38%",
    description: "Trending downward",
  },
  {
    name: "O₃",
    fullName: "Ground-level ozone",
    value: "31",
    unit: "µg/m³",
    change: "-1.4%",
    direction: "down",
    status: "Low",
    statusClass: "text-emerald-300/70",
    statusBackground: "bg-emerald-400/[0.05]",
    indicator: "bg-emerald-300",
    barWidth: "29%",
    description: "Lower than yesterday",
  },
];

const environmentalMetrics = [
  {
    label: "Temperature",
    value: "29.4°",
    description: "Feels like 31.1°",
    icon: CloudIcon,
  },
  {
    label: "Humidity",
    value: "74%",
    description: "High atmospheric moisture",
    icon: DropletIcon,
  },
  {
    label: "Wind",
    value: "11",
    unit: "km/h",
    description: "North-west direction",
    icon: WindPower01Icon,
  },
];

export function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Overview
              </span>

              <span className="size-1 shrink-0 rounded-full bg-white/20" />

              <span className="text-[10px] text-white/25">
                September 7, 2026
              </span>
            </div>

            <h1 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] text-white">
              Bengaluru air quality
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
              A live view of the atmosphere around you, from current
              pollution levels to emerging trends.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2">
            <span className="relative flex size-2">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[11px] font-medium text-white/50">
              Monitoring active
            </span>
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            AQI Hero
        ───────────────────────────────────────────── */}
        <section className="mt-7 sm:mt-8">
          <AQIHero data={mockAQIHero} />
        </section>

        {/* ─────────────────────────────────────────────
            Environment
        ───────────────────────────────────────────── */}
        <section className="mt-5">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-white/80">
              Environmental conditions
            </p>

            <p className="mt-1 text-xs text-white/30">
              Conditions that can influence local air quality
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {environmentalMetrics.map((metric) => (
              <div
                key={metric.label}
                className="group rounded-2xl border border-white/[0.06] bg-[#101720] p-5 transition-colors duration-200 hover:border-white/[0.1] hover:bg-[#111922]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
                      {metric.label}
                    </p>

                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-[28px] font-semibold tracking-[-0.045em] text-white">
                        {metric.value}
                      </span>

                      {metric.unit && (
                        <span className="text-xs font-medium text-white/25">
                          {metric.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                    <HugeiconsIcon
                      icon={metric.icon}
                      size={19}
                      strokeWidth={1.5}
                      className="text-white/40 transition-colors duration-200 group-hover:text-white/60"
                    />
                  </div>
                </div>

                <p className="mt-3 truncate text-xs text-white/30">
                  {metric.description}
                </p>
              </div>
            ))}

            {/* Visibility */}
            <div className="group rounded-2xl border border-white/[0.06] bg-[#101720] p-5 transition-colors duration-200 hover:border-white/[0.1] hover:bg-[#111922]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
                    Visibility
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-semibold tracking-[-0.045em] text-white">
                      7.8
                    </span>

                    <span className="text-xs font-medium text-white/25">
                      km
                    </span>
                  </div>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                  <div className="size-2 rounded-full bg-white/35 transition-transform duration-200 group-hover:scale-125" />
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-white/30">
                Reduced by atmospheric haze
              </p>
            </div>
          </div>
        </section>

        {/* Pollutants */}
        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between px-1">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white/80">
                  Pollutant levels
                </p>

                <span className="size-1 rounded-full bg-white/15" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-white/20">
                  Live snapshot
                </span>
              </div>

              <p className="mt-1 text-xs text-white/30">
                Current concentration across key pollutants
              </p>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-white/20 sm:block">
              µg/m³
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {pollutants.map((pollutant, index) => (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -3 }}
                className="group rounded-2xl border border-white/[0.06] bg-[#0F151D] p-5 transition-colors duration-200 hover:border-white/[0.11] hover:bg-[#111922]"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 shrink-0 rounded-full ${pollutant.indicator}`}
                      />

                      <span className="text-sm font-semibold tracking-[-0.02em] text-white/75">
                        {pollutant.name}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-[10px] text-white/25">
                      {pollutant.fullName}
                    </p>
                  </div>

                  <div
                    className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${pollutant.statusBackground} ${pollutant.statusClass}`}
                  >
                    {pollutant.status}
                  </div>
                </div>

                {/* Value */}
                <div className="mt-6">
                  <div className="flex items-end gap-1.5">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.15 + index * 0.06,
                      }}
                      className="text-[34px] font-semibold leading-none tracking-[-0.055em] text-white"
                    >
                      {pollutant.value}
                    </motion.span>

                    <span className="mb-0.5 text-xs font-medium text-white/25">
                      {pollutant.unit}
                    </span>
                  </div>
                </div>

                {/* Change */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-medium ${
                      pollutant.direction === "up"
                        ? "text-orange-300/65"
                        : "text-emerald-300/65"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        pollutant.direction === "up"
                          ? ArrowUp01Icon
                          : ArrowDown01Icon
                      }
                      size={13}
                      strokeWidth={1.8}
                    />

                    <span>{pollutant.change}</span>

                    <span className="text-white/20">
                      vs yesterday
                    </span>
                  </div>
                </div>

                {/* Visual scale */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.1em] text-white/20">
                    <span>Relative level</span>

                    <span>{pollutant.status}</span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: pollutant.barWidth }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-full rounded-full ${pollutant.indicator}`}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 border-t border-white/[0.05] pt-3">
                  <p className="text-[10px] text-white/25">
                    {pollutant.description}
                  </p>
                </div>
              </motion.div>
            ))}
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