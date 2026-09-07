import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CloudIcon,
  DropletIcon,
  WindPower01Icon,
} from "@hugeicons/core-free-icons";

const pollutants = [
  {
    name: "PM2.5",
    value: "67",
    unit: "µg/m³",
    change: "+8.3%",
    direction: "up",
  },
  {
    name: "PM10",
    value: "104",
    unit: "µg/m³",
    change: "+4.1%",
    direction: "up",
  },
  {
    name: "NO₂",
    value: "42",
    unit: "µg/m³",
    change: "-2.6%",
    direction: "down",
  },
  {
    name: "O₃",
    value: "31",
    unit: "µg/m³",
    change: "-1.4%",
    direction: "down",
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
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Overview
              </span>

              <span className="size-1 rounded-full bg-white/20" />

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

          <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2">
            <span className="relative flex size-2">
              <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[11px] font-medium text-white/50">
              Monitoring active
            </span>
          </div>
        </div>

        {/* AQI + environment */}
        <div className="mt-8 grid gap-4 xl:grid-cols-12">
          {/* AQI hero */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#101720] p-6 sm:p-7 xl:col-span-5">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 size-64 rounded-full bg-orange-500/[0.06] blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                    Current air quality
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Overall AQI
                  </p>
                </div>

                <span className="rounded-full border border-orange-400/15 bg-orange-400/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-300/80">
                  Poor
                </span>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="relative flex size-36 shrink-0 items-center justify-center rounded-full border border-orange-400/20 bg-orange-400/[0.025]">
                  <div className="absolute inset-3 rounded-full border border-orange-400/10" />

                  <div className="text-center">
                    <div className="text-5xl font-semibold tracking-[-0.06em] text-white">
                      142
                    </div>

                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                      AQI
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-medium tracking-[-0.02em] text-white">
                    Air quality needs attention.
                  </p>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                    Sensitive individuals may want to reduce prolonged
                    outdoor activity at the moment.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                    <span>Dominant pollutant</span>

                    <span className="size-1 rounded-full bg-white/20" />

                    <span className="font-medium text-white/55">
                      PM2.5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Environmental conditions */}
          <section className="grid gap-4 sm:grid-cols-2 xl:col-span-7">
            <div className="rounded-3xl border border-white/[0.07] bg-[#101720] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                    Temperature
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    29.4°
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <HugeiconsIcon
                    icon={CloudIcon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-white/45"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-white/30">
                Feels like 31.1°
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-[#101720] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                    Humidity
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    74%
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <HugeiconsIcon
                    icon={DropletIcon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-white/45"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-white/30">
                High atmospheric moisture
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-[#101720] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                    Wind
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    11
                    <span className="ml-1 text-base font-medium text-white/30">
                      km/h
                    </span>
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <HugeiconsIcon
                    icon={WindPower01Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-white/45"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-white/30">
                North-west direction
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-[#101720] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
                    Visibility
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    7.8
                    <span className="ml-1 text-base font-medium text-white/30">
                      km
                    </span>
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <div className="size-2 rounded-full bg-white/35" />
                </div>
              </div>

              <p className="mt-3 text-xs text-white/30">
                Reduced by atmospheric haze
              </p>
            </div>
          </section>
        </div>

        {/* Pollutants */}
        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-medium text-white/80">
                Pollutant levels
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                Current concentration across key pollutants
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {pollutants.map((pollutant) => (
              <div
                key={pollutant.name}
                className="group rounded-2xl border border-white/[0.06] bg-[#0F151D] p-5 transition-colors duration-200 hover:border-white/[0.1] hover:bg-[#111922]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/45">
                    {pollutant.name}
                  </span>

                  <div
                    className={`flex items-center gap-1 text-[11px] font-medium ${
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

                    {pollutant.change}
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                    {pollutant.value}
                  </span>

                  <span className="mb-1 text-xs text-white/25">
                    {pollutant.unit}
                  </span>
                </div>

                <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className={`h-full rounded-full ${
                      pollutant.name === "PM2.5"
                        ? "w-[72%] bg-orange-400/70"
                        : pollutant.name === "PM10"
                          ? "w-[61%] bg-orange-300/55"
                          : pollutant.name === "NO₂"
                            ? "w-[38%] bg-yellow-300/50"
                            : "w-[29%] bg-emerald-300/45"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming visualization placeholders */}
        <section className="mt-4 grid gap-4 xl:grid-cols-12">
          <div className="min-h-[360px] rounded-3xl border border-white/[0.06] bg-[#0F151D] p-6 xl:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">
                  AQI trend
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Pollution levels over the selected period
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.06] px-2.5 py-1 text-[10px] text-white/35">
                24 hours
              </div>
            </div>

            <div className="flex h-[275px] items-center justify-center">
              <span className="text-xs text-white/20">
                ECharts visualization next
              </span>
            </div>
          </div>

          <div className="min-h-[360px] rounded-3xl border border-white/[0.06] bg-[#0F151D] p-6 xl:col-span-5">
            <div>
              <p className="text-sm font-medium text-white/80">
                Air quality map
              </p>

              <p className="mt-1 text-xs text-white/30">
                Pollution across nearby locations
              </p>
            </div>

            <div className="flex h-[275px] items-center justify-center">
              <span className="text-xs text-white/20">
                MapLibre visualization next
              </span>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}