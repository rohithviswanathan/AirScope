import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Location01Icon,
  WindIcon,
} from "@hugeicons/core-free-icons";

import type { AQIHeroData, AirQualityStatus } from "../types";

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

const statusConfig: Record<AirQualityStatus, StatusConfig> = {
  good: {
    label: "Good",
    headline: "The air looks good today.",
    description:
      "Air quality is currently in a range that is generally comfortable for outdoor activity.",
    guidance: "Outdoor activity is generally fine.",
    accent: "bg-emerald-400",
    accentText: "text-emerald-400",
    softBackground: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/20",
    glow: "rgba(52, 211, 153, 0.15)",
    ring: "#34D399",
    dot: "bg-emerald-400",
  },

  moderate: {
    label: "Moderate",
    headline: "Air quality is acceptable.",
    description:
      "Most people can continue normal activity, although some sensitive individuals may notice the difference.",
    guidance: "Most people can continue normal outdoor activity.",
    accent: "bg-yellow-400",
    accentText: "text-yellow-400",
    softBackground: "bg-yellow-400/[0.08]",
    border: "border-yellow-400/20",
    glow: "rgba(250, 204, 21, 0.14)",
    ring: "#FACC15",
    dot: "bg-yellow-400",
  },

  "unhealthy-sensitive": {
    label: "Poor",
    headline: "Air quality needs attention.",
    description:
      "Sensitive individuals may experience effects from prolonged exposure to the current pollution levels.",
    guidance: "Consider reducing prolonged outdoor exposure.",
    accent: "bg-orange-400",
    accentText: "text-orange-400",
    softBackground: "bg-orange-400/[0.08]",
    border: "border-orange-400/20",
    glow: "rgba(251, 146, 60, 0.16)",
    ring: "#FB923C",
    dot: "bg-orange-400",
  },

  unhealthy: {
    label: "Unhealthy",
    headline: "Air quality is unhealthy.",
    description:
      "Prolonged exposure may affect a wider range of people, especially during physically demanding outdoor activity.",
    guidance: "Consider limiting prolonged outdoor activity.",
    accent: "bg-orange-500",
    accentText: "text-orange-400",
    softBackground: "bg-orange-500/[0.08]",
    border: "border-orange-500/20",
    glow: "rgba(249, 115, 22, 0.17)",
    ring: "#F97316",
    dot: "bg-orange-500",
  },

  "very-unhealthy": {
    label: "Very unhealthy",
    headline: "Air quality is very unhealthy.",
    description:
      "Health effects may become more noticeable with continued exposure to the current conditions.",
    guidance: "Reduce outdoor exposure where possible.",
    accent: "bg-red-400",
    accentText: "text-red-400",
    softBackground: "bg-red-400/[0.08]",
    border: "border-red-400/20",
    glow: "rgba(248, 113, 113, 0.17)",
    ring: "#F87171",
    dot: "bg-red-400",
  },

  hazardous: {
    label: "Hazardous",
    headline: "Air quality is hazardous.",
    description:
      "Current pollution levels indicate a high level of concern and require minimizing exposure.",
    guidance: "Avoid prolonged outdoor exposure.",
    accent: "bg-purple-400",
    accentText: "text-purple-400",
    softBackground: "bg-purple-400/[0.08]",
    border: "border-purple-400/20",
    glow: "rgba(192, 132, 252, 0.18)",
    ring: "#C084FC",
    dot: "bg-purple-400",
  },
};

const AQI_MAX = 300;

/*
 * Mobile viewports skip non-essential Motion and CSS animations.
 * Weaker mobile GPUs struggle to composite Framer-Motion-driven
 * transforms layered under large blur/box-shadow regions —
 * it shows up as flashing/hanging rather than a smooth transition.
 * Desktop keeps the full interaction and ambient motion.
 */
const MOBILE_BREAKPOINT_PX = 768;

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth <= MOBILE_BREAKPOINT_PX;
}

function useIsMobileViewport() {
  const [mobile, setMobile] = useState(isMobileViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT_PX}px)`,
    );

    const handleChange = () => {
      setMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return mobile;
}

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

  const mobile = useIsMobileViewport();

  const motionEnabled = !reducedMotion && !mobile;

  const skipAmbientLoop = !motionEnabled;

  const config = statusConfig[data.status];

  const progress = getProgress(data.aqi);

  const radius = 82;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = circumference * (1 - progress);

  const markerPosition = getSeverityPosition(data.aqi);

  return (
    <motion.section
      initial={
        !motionEnabled
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
        duration: motionEnabled ? 0.6 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-[var(--surface-secondary)] via-[var(--surface)] to-[var(--surface-secondary)] transition-colors duration-200 shadow-[0_8px_40px_rgba(15,23,42,0.12)]"
    >
      {/* Ambient glow with gradient */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
        animate={
          skipAmbientLoop
            ? { opacity: 0.7 }
            : {
                opacity: [0.55, 0.85, 0.55],
                scale: [1, 1.06, 1],
              }
        }
        transition={{
          duration: 7,
          repeat: skipAmbientLoop ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle gradient mesh overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.015] via-transparent to-transparent opacity-60" />

      <div className="relative p-5 sm:p-7 lg:p-8">
        {/* Top row with enhanced styling */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Location with gradient */}
          <div className="flex min-w-0 items-center gap-3">
            <motion.div
              whileHover={motionEnabled ? { scale: 1.05 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)] shadow-[0_2px_8px_rgba(148,163,184,0.08)]"
            >
              <HugeiconsIcon
                icon={Location01Icon}
                size={16}
                strokeWidth={1.5}
                className="text-[var(--foreground-muted)]"
              />
            </motion.div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--foreground-secondary)]">
                {data.city}, {data.country}
              </p>

              <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                Current air quality
              </p>
            </div>
          </div>

          {/* Status badge with enhanced styling */}
          <AnimatePresence mode="wait">
            <motion.div
              key={data.status}
              initial={
                !motionEnabled
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
                !motionEnabled
                  ? undefined
                  : {
                      opacity: 0,
                      y: 4,
                    }
              }
              transition={{
                duration: motionEnabled ? 0.22 : 0,
              }}
              className={`inline-flex items-center gap-2 w-fit rounded-full border ${config.border} ${config.softBackground} px-3.5 py-1.5 ${config.accentText} text-[10px] font-semibold uppercase tracking-[0.12em] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}
            >
              <span
                className={`size-1.5 rounded-full ${config.dot} shadow-[0_0_6px_currentColor]`}
              />
              {config.label}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main area with improved spacing */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-12 xl:grid-cols-[310px_minmax(0,1fr)]">
          {/* AQI Gauge with enhanced presentation */}
          <div className="mx-auto w-full max-w-[270px]">
            <div className="relative aspect-square w-full">
              {/* Outer atmosphere with stronger glow */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-full"
                style={{
                  boxShadow: `0 0 80px ${config.glow}, 0 0 120px ${config.glow}`,
                }}
                animate={
                  skipAmbientLoop
                    ? { opacity: 0.6 }
                    : {
                        opacity: [0.5, 0.7, 0.5],
                        scale: [1, 1.03, 1],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: skipAmbientLoop ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Gauge */}
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
                  stroke="var(--foreground-faint)"
                  strokeOpacity="0.55"
                  strokeWidth="8"
                />

                {/* Inner ring */}
                <circle
                  cx="110"
                  cy="110"
                  r="68"
                  fill="none"
                  stroke="var(--foreground-faint)"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />

                {/* Progress with enhanced glow */}
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
                    duration: motionEnabled ? 1.15 : 0,
                    delay: motionEnabled ? 0.08 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  transform="rotate(-90 110 110)"
                  style={{
                    filter: `drop-shadow(0 0 12px ${config.glow})`,
                  }}
                />

                {/* Gauge ticks */}
                {Array.from({
                  length: 24,
                }).map((_, index) => {
                  const angle = (index / 24) * 360;

                  const radians = (angle * Math.PI) / 180;

                  const outerRadius = 98;

                  const innerRadius = index % 4 === 0 ? 93 : 95;

                  const x1 = 110 + Math.cos(radians) * innerRadius;

                  const y1 = 110 + Math.sin(radians) * innerRadius;

                  const x2 = 110 + Math.cos(radians) * outerRadius;

                  const y2 = 110 + Math.sin(radians) * outerRadius;

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--foreground-faint)"
                      strokeOpacity={index % 4 === 0 ? 0.8 : 0.4}
                      strokeWidth={index % 4 === 0 ? 1.4 : 1}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Center value with gradient background */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={
                    motionEnabled
                      ? { opacity: 0, scale: 0.95 }
                      : { opacity: 1, scale: 1 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: motionEnabled ? 0.5 : 0,
                    delay: motionEnabled ? 0.2 : 0,
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/[0.03] to-transparent"
                />

                <span className="relative z-10 mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-subtle)]">
                  AQI
                </span>

                <motion.span
                  key={data.aqi}
                  initial={
                    !motionEnabled
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
                    duration: motionEnabled ? 0.45 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-10 text-[64px] font-semibold leading-none tracking-[-0.08em] text-[var(--foreground)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] sm:text-[70px]"
                >
                  {data.aqi}
                </motion.span>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={data.status}
                    initial={
                      !motionEnabled
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            y: 3,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={
                      !motionEnabled
                        ? undefined
                        : {
                            opacity: 0,
                            y: -3,
                          }
                    }
                    transition={{
                      duration: motionEnabled ? 0.2 : 0,
                    }}
                    className={`relative z-10 mt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${config.accentText} drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
                  >
                    {config.label}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* AQI scale with enhanced styling */}
            <div className="mt-3 px-5">
              <div className="relative h-2 overflow-hidden rounded-full bg-gradient-to-r from-[var(--control-hover)] to-[var(--control-background)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 flex">
                  <span className="w-[16.67%] bg-gradient-to-r from-emerald-400/60 to-emerald-400/50" />
                  <span className="w-[16.67%] bg-gradient-to-r from-yellow-400/60 to-yellow-400/50" />
                  <span className="w-[16.67%] bg-gradient-to-r from-orange-300/65 to-orange-300/55" />
                  <span className="w-[16.67%] bg-gradient-to-r from-orange-500/65 to-orange-500/55" />
                  <span className="w-[16.67%] bg-gradient-to-r from-red-400/65 to-red-400/55" />
                  <span className="w-[16.67%] bg-gradient-to-r from-purple-400/65 to-purple-400/55" />
                </div>

                <motion.span
                  className="absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--surface-secondary)] bg-gradient-to-br from-[var(--foreground)] to-[var(--foreground-secondary)] shadow-[0_0_12px_rgba(100,116,139,0.4),0_2px_4px_rgba(0,0,0,0.2)]"
                  initial={{
                    left: "0%",
                  }}
                  animate={{
                    left: markerPosition,
                  }}
                  transition={{
                    duration: motionEnabled ? 0.9 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>

              <div className="mt-2.5 flex justify-between text-[8px] font-medium text-[var(--foreground-faint)]">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300</span>
              </div>
            </div>
          </div>

          {/* Interpretation with enhanced typography */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className={`size-2.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`}
              />

              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${config.accentText}`}
              >
                {config.label}
              </span>
            </div>

            <h2 className="mt-3.5 max-w-2xl text-[clamp(1.6rem,2.6vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)]">
              {config.headline}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              {config.description}
            </p>

            {/* Key information with gradient cards */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <motion.div
                whileHover={motionEnabled ? { y: -2, scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)] p-4 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
              >
                <div className="relative flex items-center justify-between gap-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--foreground-subtle)]">
                    Dominant pollutant
                  </p>

                  <span
                    className={`size-2 rounded-full ${config.dot} shadow-[0_0_6px_currentColor]`}
                  />
                </div>

                <p className="relative mt-2.5 text-lg font-medium tracking-[-0.02em] text-[var(--foreground-secondary)]">
                  {data.dominantPollutant}
                </p>

                <p className="relative mt-1 text-[10px] text-[var(--foreground-subtle)]">
                  Primary contributor
                </p>
              </motion.div>

              <motion.div
                whileHover={motionEnabled ? { y: -2, scale: 1.01 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)] p-4 transition-all hover:border-[var(--foreground-faint)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.12)]"
              >
                <p className="relative text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--foreground-subtle)]">
                  Updated
                </p>

                <div className="relative mt-2.5 flex items-center gap-2">
                  <span className="text-lg font-medium tracking-[-0.02em] text-[var(--foreground-secondary)]">
                    {data.updatedAt}
                  </span>

                  <span className="relative flex size-2">
                    <span
                      className={`${motionEnabled ? "animate-ping" : ""} absolute size-full rounded-full bg-emerald-400/30`}
                    />

                    <span className="relative size-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  </span>
                </div>

                <p className="relative mt-1 text-[10px] text-[var(--foreground-subtle)]">
                  Environmental snapshot
                </p>
              </motion.div>
            </div>

            {/* Guidance with enhanced styling */}
            <motion.div
              whileHover={motionEnabled ? { scale: 1.01 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative mt-4 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--control-background)] via-[var(--control-background)] to-[var(--accent-glow)]/50 p-4 transition-all hover:border-[var(--border-hover)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.1)]"
            >
              <div className="relative flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${config.softBackground} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}
                >
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    size={16}
                    strokeWidth={1.5}
                    className={config.accentText}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--foreground-secondary)]">
                    Today's guidance
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-[var(--foreground-muted)]">
                    {config.guidance}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom environmental context with enhanced styling */}
        <div className="relative mt-8 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--control-background)] to-[var(--control-hover)]">
              <HugeiconsIcon
                icon={WindIcon}
                size={14}
                strokeWidth={1.5}
                className="text-[var(--foreground-subtle)]"
              />
            </div>

            <p className="text-[10px] leading-5 text-[var(--foreground-subtle)]">
              Air quality changes with weather, wind, emissions and other
              environmental conditions.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--control-background)] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
            <span className="size-1.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_4px_rgba(99,102,241,0.3)]" />
            Live environmental snapshot
          </span>
        </div>
      </div>
    </motion.section>
  );
}
