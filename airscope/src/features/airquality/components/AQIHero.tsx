import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Location01Icon,
  WindIcon,
} from "@hugeicons/core-free-icons";

import type {
  AQIHeroData,
  AirQualityStatus,
} from "../types";

type AQIHeroProps = {
  data: AQIHeroData;
};

type StatusConfig = {
  label: string;
  headline: string;
  description: string;
  guidance: string;
  accent: string;
  accentText: string;
  softBackground: string;
  border: string;
  glow: string;
  ring: string;
  dot: string;
};

const statusConfig: Record<
  AirQualityStatus,
  StatusConfig
> = {
  good: {
    label: "Good",
    headline: "The air looks good today.",
    description:
      "Air quality is currently in a range that is generally comfortable for outdoor activity.",
    guidance:
      "Outdoor activity is generally fine.",
    accent: "bg-emerald-400",
    accentText: "text-emerald-300",
    softBackground: "bg-emerald-400/[0.07]",
    border: "border-emerald-400/15",
    glow: "rgba(52, 211, 153, 0.12)",
    ring: "#34D399",
    dot: "bg-emerald-400",
  },

  moderate: {
    label: "Moderate",
    headline: "Air quality is acceptable.",
    description:
      "Most people can continue normal activity, although some sensitive individuals may notice the difference.",
    guidance:
      "Most people can continue normal outdoor activity.",
    accent: "bg-yellow-400",
    accentText: "text-yellow-300",
    softBackground: "bg-yellow-400/[0.07]",
    border: "border-yellow-400/15",
    glow: "rgba(250, 204, 21, 0.11)",
    ring: "#FACC15",
    dot: "bg-yellow-400",
  },

  "unhealthy-sensitive": {
    label: "Poor",
    headline: "Air quality needs attention.",
    description:
      "Sensitive individuals may experience effects from prolonged exposure to the current pollution levels.",
    guidance:
      "Consider reducing prolonged outdoor exposure.",
    accent: "bg-orange-400",
    accentText: "text-orange-300",
    softBackground: "bg-orange-400/[0.07]",
    border: "border-orange-400/15",
    glow: "rgba(251, 146, 60, 0.14)",
    ring: "#FB923C",
    dot: "bg-orange-400",
  },

  unhealthy: {
    label: "Unhealthy",
    headline: "Air quality is unhealthy.",
    description:
      "Prolonged exposure may affect a wider range of people, especially during physically demanding outdoor activity.",
    guidance:
      "Consider limiting prolonged outdoor activity.",
    accent: "bg-orange-500",
    accentText: "text-orange-300",
    softBackground: "bg-orange-500/[0.07]",
    border: "border-orange-500/15",
    glow: "rgba(249, 115, 22, 0.15)",
    ring: "#F97316",
    dot: "bg-orange-500",
  },

  "very-unhealthy": {
    label: "Very unhealthy",
    headline: "Air quality is very unhealthy.",
    description:
      "Health effects may become more noticeable with continued exposure to the current conditions.",
    guidance:
      "Reduce outdoor exposure where possible.",
    accent: "bg-red-400",
    accentText: "text-red-300",
    softBackground: "bg-red-400/[0.07]",
    border: "border-red-400/15",
    glow: "rgba(248, 113, 113, 0.15)",
    ring: "#F87171",
    dot: "bg-red-400",
  },

  hazardous: {
    label: "Hazardous",
    headline: "Air quality is hazardous.",
    description:
      "Current pollution levels indicate a high level of concern and require minimizing exposure.",
    guidance:
      "Avoid prolonged outdoor exposure.",
    accent: "bg-purple-400",
    accentText: "text-purple-300",
    softBackground: "bg-purple-400/[0.07]",
    border: "border-purple-400/15",
    glow: "rgba(192, 132, 252, 0.16)",
    ring: "#C084FC",
    dot: "bg-purple-400",
  },
};

const AQI_MAX = 300;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getProgress(aqi: number) {
  return clamp(aqi / AQI_MAX, 0, 1);
}

function getSeverityPosition(aqi: number) {
  return `${getProgress(aqi) * 100}%`;
}

export function AQIHero({ data }: AQIHeroProps) {
  const reducedMotion = useReducedMotion();

  const config = statusConfig[data.status];

  const progress = getProgress(data.aqi);

  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const markerPosition = getSeverityPosition(data.aqi);

  return (
    <motion.section
      initial={
        reducedMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              y: 14,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#101720]"
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full blur-[130px]"
        style={{
          background: config.glow,
        }}
        animate={
          reducedMotion
            ? { opacity: 0.8 }
            : {
                opacity: [0.55, 0.8, 0.55],
                scale: [1, 1.04, 1],
              }
        }
        transition={{
          duration: 6,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative p-5 sm:p-7 lg:p-8">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
              <HugeiconsIcon
                icon={Location01Icon}
                size={16}
                strokeWidth={1.5}
                className="text-white/40"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/80">
                {data.city}, {data.country}
              </p>

              <p className="mt-0.5 text-[10px] text-white/25">
                Current air quality
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={data.status}
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      y: -4,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: 4,
                    }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.22,
              }}
              className={`w-fit rounded-full border ${config.border} ${config.softBackground} px-3 py-1.5 ${config.accentText} text-[10px] font-semibold uppercase tracking-[0.12em]`}
            >
              {config.label}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main area */}
        <div className="mt-7 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-12 xl:grid-cols-[310px_minmax(0,1fr)]">
          {/* AQI Gauge */}
          <div className="mx-auto w-full max-w-[270px]">
            <div className="relative aspect-square w-full">
              {/* Outer atmosphere */}
              <div
                aria-hidden="true"
                className="absolute inset-[13%] rounded-full"
                style={{
                  boxShadow: `0 0 70px ${config.glow}`,
                }}
              />

              {/* SVG gauge */}
              <svg
                viewBox="0 0 220 220"
                className="absolute inset-0 size-full"
                aria-hidden="true"
              >
                {/* Background ring */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth="8"
                />

                {/* Inner ring */}
                <circle
                  cx="110"
                  cy="110"
                  r="68"
                  fill="none"
                  stroke="rgba(255,255,255,0.025)"
                  strokeWidth="1"
                />

                {/* Progress */}
                <motion.circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={config.ring}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{
                    strokeDashoffset: circumference,
                  }}
                  animate={{
                    strokeDashoffset: dashOffset,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 1.15,
                    delay: reducedMotion ? 0 : 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  transform="rotate(-90 110 110)"
                  style={{
                    filter: `drop-shadow(0 0 8px ${config.glow})`,
                  }}
                />

                {/* Gauge ticks */}
                {Array.from({ length: 24 }).map(
                  (_, index) => {
                    const angle =
                      (index / 24) * 360;

                    const radians =
                      (angle * Math.PI) / 180;

                    const outerRadius = 98;
                    const innerRadius =
                      index % 4 === 0 ? 93 : 95;

                    const x1 =
                      110 +
                      Math.cos(radians) *
                        innerRadius;

                    const y1 =
                      110 +
                      Math.sin(radians) *
                        innerRadius;

                    const x2 =
                      110 +
                      Math.cos(radians) *
                        outerRadius;

                    const y2 =
                      110 +
                      Math.sin(radians) *
                        outerRadius;

                    return (
                      <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={
                          index % 4 === 0
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.07)"
                        }
                        strokeWidth={
                          index % 4 === 0 ? 1.4 : 1
                        }
                        strokeLinecap="round"
                      />
                    );
                  },
                )}
              </svg>

              {/* Center value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                  AQI
                </span>

                <motion.span
                  key={data.aqi}
                  initial={
                    reducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          y: 5,
                          scale: 0.95,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: reducedMotion
                      ? 0
                      : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-[64px] font-semibold leading-none tracking-[-0.08em] text-white sm:text-[70px]"
                >
                  {data.aqi}
                </motion.span>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={data.status}
                    initial={
                      reducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 3 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, y: -3 }
                    }
                    transition={{
                      duration: reducedMotion
                        ? 0
                        : 0.2,
                    }}
                    className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${config.accentText}`}
                  >
                    {config.label}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Scale */}
            <div className="mt-2 px-5">
              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="absolute inset-0 flex">
                  <span className="w-[16.67%] bg-emerald-400/50" />
                  <span className="w-[16.67%] bg-yellow-400/50" />
                  <span className="w-[16.67%] bg-orange-300/55" />
                  <span className="w-[16.67%] bg-orange-500/55" />
                  <span className="w-[16.67%] bg-red-400/55" />
                  <span className="w-[16.67%] bg-purple-400/55" />
                </div>

                <motion.span
                  className="absolute top-1/2 size-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#101720] bg-white shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                  initial={{
                    left: "0%",
                  }}
                  animate={{
                    left: markerPosition,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[8px] font-medium text-white/20">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300</span>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${config.dot}`}
              />

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${config.accentText}`}
              >
                {config.label}
              </span>
            </div>

            <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,2.6vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.045em] text-white">
              {config.headline}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              {config.description}
            </p>

            {/* Key information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/25">
                    Dominant pollutant
                  </p>

                  <span
                    className={`size-1.5 rounded-full ${config.dot}`}
                  />
                </div>

                <p className="mt-2 text-lg font-medium tracking-[-0.02em] text-white/80">
                  {data.dominantPollutant}
                </p>

                <p className="mt-1 text-[10px] text-white/25">
                  Primary contributor
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/25">
                  Updated
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-medium tracking-[-0.02em] text-white/80">
                    {data.updatedAt}
                  </span>

                  <span className="relative flex size-1.5">
                    <span className="absolute size-full animate-ping rounded-full bg-emerald-400/30" />
                    <span className="relative size-1.5 rounded-full bg-emerald-400" />
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-white/25">
                  Environmental snapshot
                </p>
              </div>
            </div>

            {/* Guidance */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-black/[0.08] p-4">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${config.softBackground}`}
              >
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={15}
                  strokeWidth={1.5}
                  className={config.accentText}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-white/55">
                  Today's guidance
                </p>

                <p className="mt-1 text-xs leading-5 text-white/30">
                  {config.guidance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom environmental context */}
        <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <HugeiconsIcon
              icon={WindIcon}
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-white/25"
            />

            <p className="text-[10px] leading-5 text-white/25">
              Air quality changes with weather, wind, emissions
              and other environmental conditions.
            </p>
          </div>

          <p className="shrink-0 text-[9px] font-medium uppercase tracking-[0.12em] text-white/15">
            Live environmental snapshot
          </p>
        </div>
      </div>
    </motion.section>
  );
}