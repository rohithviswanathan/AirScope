import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

import { useLocation } from "../../../context/LocationProvider";
import { getAirQuality } from "../../../api/openMeteo";

setWorkerUrl(workerUrl);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type AQIMapStatus =
  | "good"
  | "moderate"
  | "poor"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

/* -------------------------------------------------------------------------- */
/* Status styles                                                              */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<
  AQIMapStatus,
  {
    color: string;
    text: string;
    label: string;
    pulseDuration: string;
  }
> = {
  good: {
    color: "#22c55e",
    text: "#d1fae5",
    label: "Good",
    pulseDuration: "3s",
  },

  moderate: {
    color: "#eab308",
    text: "#fef9c3",
    label: "Moderate",
    pulseDuration: "2.6s",
  },

  poor: {
    color: "#f97316",
    text: "#ffedd5",
    label: "Poor",
    pulseDuration: "2.1s",
  },

  unhealthy: {
    color: "#ef4444",
    text: "#fee2e2",
    label: "Unhealthy",
    pulseDuration: "1.7s",
  },

  "very-unhealthy": {
    color: "#a855f7",
    text: "#f3e8ff",
    label: "Very unhealthy",
    pulseDuration: "1.3s",
  },

  hazardous: {
    color: "#c026d3",
    text: "#fae8ff",
    label: "Hazardous",
    pulseDuration: "1s",
  },
};

/*
 * Mobile viewports get a static (non-animating) marker ring.
 * Weaker mobile GPUs struggle to composite several concurrent
 * infinite CSS animations (marker pulse + badge glow) under
 * backdrop-blur layers, which shows up as flashing/hanging
 * rather than a smooth loop. Desktop keeps the full animation.
 */
const MOBILE_BREAKPOINT_PX = 768;

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.innerWidth <= MOBILE_BREAKPOINT_PX
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getMapStatus(
  aqi: number,
): AQIMapStatus {
  if (aqi <= 50) {
    return "good";
  }

  if (aqi <= 100) {
    return "moderate";
  }

  if (aqi <= 150) {
    return "poor";
  }

  if (aqi <= 200) {
    return "unhealthy";
  }

  if (aqi <= 300) {
    return "very-unhealthy";
  }

  return "hazardous";
}

/* -------------------------------------------------------------------------- */
/* Marker                                                                     */
/* -------------------------------------------------------------------------- */

function createMarkerElement(
  aqi: number,
  status: AQIMapStatus,
  name: string,
) {
  const colors =
    STATUS_STYLES[status];

  const mobile =
    isMobileViewport();

  const marker =
    document.createElement("div");

  Object.assign(
    marker.style,
    {
      width: "64px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  );

  marker.setAttribute(
    "aria-label",
    `${name}, AQI ${aqi}, ${colors.label}`,
  );

  const button =
    document.createElement("button");

  button.type = "button";

  button.setAttribute(
    "aria-label",
    `${name} air quality, AQI ${aqi}`,
  );

  Object.assign(
    button.style,
    {
      position: "relative",
      width: "46px",
      height: "46px",
      padding: "0",
      margin: "0",
      borderRadius: "999px",
      border: `2px solid ${colors.color}`,
      background:
        "var(--map-marker-background)",
      color:
        "var(--foreground)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "700",
      fontFamily:
        "Inter, system-ui, sans-serif",
      cursor: "pointer",
      boxShadow: `
        0 0 0 5px ${colors.color}18,
        var(--map-marker-shadow)
      `,
      transition:
        "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease, background-color 220ms ease",
      zIndex: "2",
    },
  );

  /*
   * Pulsing ring behind the marker.
   * Desktop: animates via CSS keyframes, speed scales with severity.
   * Mobile: rendered as a static ring at reduced opacity — no
   * animation loop — to avoid compositing multiple infinite
   * animations on weaker mobile GPUs (see isMobileViewport above).
   */
  const pulseRing =
    document.createElement("span");

  Object.assign(
    pulseRing.style,
    {
      position: "absolute",
      inset: "-2px",
      borderRadius: "999px",
      border: `2px solid ${colors.color}`,
      pointerEvents: "none",
    },
  );

  if (mobile) {
    Object.assign(
      pulseRing.style,
      {
        opacity: "0.32",
        animation: "none",
      },
    );
  } else {
    Object.assign(
      pulseRing.style,
      {
        opacity: "0.55",
        willChange:
          "transform, opacity",
        animation: `airscope-marker-pulse ${colors.pulseDuration} cubic-bezier(0.22, 1, 0.36, 1) infinite`,
      },
    );
  }

  const outerGlow =
    document.createElement("span");

  Object.assign(
    outerGlow.style,
    {
      position: "absolute",
      inset: "-7px",
      borderRadius: "999px",
      border: `1px solid ${colors.color}20`,
      pointerEvents: "none",
    },
  );

  const innerGlow =
    document.createElement("span");

  Object.assign(
    innerGlow.style,
    {
      position: "absolute",
      inset: "4px",
      borderRadius: "999px",
      background:
        `radial-gradient(circle at 35% 30%, ${colors.color}38, transparent 72%)`,
      pointerEvents: "none",
    },
  );

  const value =
    document.createElement("span");

  Object.assign(
    value.style,
    {
      position: "relative",
      zIndex: "2",
      transition: "transform 220ms ease",
    },
  );

  value.textContent =
    String(aqi);

  button.appendChild(
    pulseRing,
  );

  button.appendChild(
    outerGlow,
  );

  button.appendChild(
    innerGlow,
  );

  button.appendChild(
    value,
  );

  button.addEventListener(
    "mouseenter",
    () => {
      button.style.transform =
        "scale(1.14) translateY(-2px)";

      button.style.background =
        "var(--map-marker-hover)";

      button.style.boxShadow = `
        0 0 0 7px ${colors.color}26,
        0 14px 28px -6px ${colors.color}55,
        var(--map-marker-hover-shadow)
      `;

      value.style.transform =
        "scale(1.05)";
    },
  );

  button.addEventListener(
    "mouseleave",
    () => {
      button.style.transform =
        "scale(1) translateY(0)";

      button.style.background =
        "var(--map-marker-background)";

      button.style.boxShadow = `
        0 0 0 5px ${colors.color}18,
        var(--map-marker-shadow)
      `;

      value.style.transform =
        "scale(1)";
    },
  );

  marker.appendChild(
    button,
  );

  return marker;
}

/* -------------------------------------------------------------------------- */
/* Popup                                                                      */
/* -------------------------------------------------------------------------- */

function createPopup({
  name,
  country,
  aqi,
  pm25,
  status,
}: {
  name: string;
  country: string;
  aqi: number;
  pm25: number;
  status: AQIMapStatus;
}) {
  const colors =
    STATUS_STYLES[status];

  /*
   * Ring fraction for the AQI dial.
   * AQI scale is treated as 0-300+ for the conic sweep,
   * clamped so hazardous readings still read as "full".
   */
  const ringFraction =
    Math.min(
      (aqi / 300) * 100,
      100,
    );

  return new Popup({
    offset: 34,
    closeButton: false,
    closeOnClick: true,
    className:
      "airscope-map-popup",
  }).setHTML(`
    <div
      style="
        min-width: 200px;
        font-family: Inter, system-ui, sans-serif;
        color: var(--foreground);
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        "
      >
        <div>
          <div
            style="
              font-size: 13px;
              font-weight: 600;
              color: var(--foreground);
            "
          >
            ${name}
          </div>

          <div
            style="
              margin-top: 2px;
              font-size: 9px;
              color: var(--foreground-subtle);
            "
          >
            ${country}
          </div>
        </div>

        <span
          style="
            width: 7px;
            height: 7px;
            flex-shrink: 0;
            border-radius: 999px;
            background: ${colors.color};
            box-shadow: 0 0 10px ${colors.color}88;
          "
        ></span>
      </div>

      <div
        style="
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 16px;
        "
      >
        <div
          style="
            position: relative;
            width: 58px;
            height: 58px;
            border-radius: 999px;
            flex-shrink: 0;
            background: conic-gradient(${colors.color} ${ringFraction}%, ${colors.color}1a 0);
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div
            style="
              width: 46px;
              height: 46px;
              border-radius: 999px;
              background: var(--map-popup-background);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <span
              style="
                font-size: 18px;
                line-height: 1;
                font-weight: 700;
                letter-spacing: -0.04em;
                color: var(--foreground);
              "
            >
              ${aqi}
            </span>
          </div>
        </div>

        <div>
          <div
            style="
              font-size: 9px;
              color: var(--foreground-subtle);
              text-transform: uppercase;
              letter-spacing: 0.1em;
            "
          >
            AQI
          </div>

          <div
            style="
              margin-top: 6px;
              display: inline-flex;
              padding: 4px 8px;
              border-radius: 999px;
              background: ${colors.color}18;
              color: ${colors.text};
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              white-space: nowrap;
            "
          >
            ${colors.label}
          </div>
        </div>
      </div>

      <div
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
          padding-top: 11px;
          border-top: 1px solid var(--border);
        "
      >
        <div>
          <div
            style="
              color: var(--foreground-subtle);
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            "
          >
            PM2.5
          </div>

          <div
            style="
              margin-top: 3px;
              color: var(--foreground-secondary);
              font-size: 11px;
              font-weight: 600;
            "
          >
            ${pm25.toFixed(1)} µg/m³
          </div>
        </div>

        <div>
          <div
            style="
              color: var(--foreground-subtle);
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            "
          >
            Source
          </div>

          <div
            style="
              margin-top: 3px;
              color: var(--foreground-secondary);
              font-size: 11px;
              font-weight: 600;
            "
          >
            Live API
          </div>
        </div>
      </div>
    </div>
  `);
}

/* -------------------------------------------------------------------------- */
/* Loading / error                                                            */
/* -------------------------------------------------------------------------- */

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface)]/55 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <span className="relative flex size-2">
          <span className="absolute size-full animate-ping rounded-full bg-emerald-400/25" />

          <span className="relative size-2 rounded-full bg-emerald-400" />
        </span>

        <span className="text-xs font-medium text-[var(--foreground-secondary)]">
          Loading live air quality...
        </span>
      </div>
    </div>
  );
}

function ErrorOverlay({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface)]/70 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xs rounded-2xl border border-red-400/15 bg-[var(--surface-elevated)]/95 p-5 text-center shadow-xl">
        <p className="text-sm font-medium text-red-300/80">
          Unable to load map data
        </p>

        <p className="mt-1.5 text-xs leading-5 text-[var(--foreground-muted)]">
          Live air-quality readings could not be loaded for this city.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--control-background)] px-3 py-2 text-xs font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--control-hover)]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function AirQualityMap() {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const { location } =
    useLocation();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "airScope",
      "cityMap",
      location.id,
    ],

    queryFn: async () => {
      return getAirQuality(
        location.latitude,
        location.longitude,
        location.timezone ??
          "Asia/Kolkata",
      );
    },

    staleTime:
      60_000,

    gcTime:
      5 * 60_000,

    retry: 1,

    refetchOnWindowFocus:
      true,
  });

  const mapData =
    useMemo(() => {
      const aqi =
        data?.current?.us_aqi;

      const pm25 =
        data?.current?.pm2_5;

      if (
        typeof aqi !== "number" ||
        typeof pm25 !== "number"
      ) {
        return null;
      }

      return {
        aqi,
        pm25,
        status:
          getMapStatus(aqi),
      };
    }, [data]);

  useEffect(() => {
    const container =
      mapContainerRef.current;

    if (
      !container ||
      !mapData
    ) {
      return;
    }

    /*
     * Fade the map in once tiles + marker are ready,
     * instead of popping in abruptly.
     */
    container.style.opacity =
      "0";

    container.style.transition =
      "opacity 480ms cubic-bezier(0.22, 1, 0.36, 1)";

    const map =
      new Map({
        container,

        style:
          "https://tiles.openfreemap.org/styles/liberty",

        center: [
          location.longitude,
          location.latitude,
        ],

        /*
         * City-level view.
         *
         * We deliberately do not fit bounds to
         * neighborhood points anymore because the map
         * represents the currently selected city.
         */
        zoom: 11,

        minZoom: 8,

        maxZoom: 16,

        attributionControl: {},
      });

    map.addControl(
      new NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-right",
    );

    const handleLoad =
      () => {
        map.resize();

        /*
         * City AQI visualization.
         *
         * One point = the currently selected city.
         */
        const geojson =
          {
            type:
              "FeatureCollection" as const,

            features: [
              {
                type:
                  "Feature" as const,

                properties: {
                  aqi:
                    mapData.aqi,

                  status:
                    mapData.status,

                  name:
                    location.name,
                },

                geometry: {
                  type:
                    "Point" as const,

                  coordinates: [
                    location.longitude,
                    location.latitude,
                  ],
                },
              },
            ],
          };

        map.addSource(
          "city-aqi",
          {
            type: "geojson",
            data: geojson,
          },
        );

        /*
         * Soft city glow.
         */
        map.addLayer({
          id: "city-aqi-glow",

          type: "circle",

          source:
            "city-aqi",

          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "aqi"],

              0,
              28,

              50,
              34,

              100,
              44,

              150,
              56,

              200,
              68,

              300,
              84,
            ],

            "circle-color": [
              "match",
              ["get", "status"],

              "good",
              "#22c55e",

              "moderate",
              "#eab308",

              "poor",
              "#f97316",

              "unhealthy",
              "#ef4444",

              "very-unhealthy",
              "#a855f7",

              "hazardous",
              "#c026d3",

              "#94a3b8",
            ],

            "circle-opacity":
              0.12,

            "circle-blur":
              1,
          },
        });

        /*
         * More concentrated city indicator.
         */
        map.addLayer({
          id: "city-aqi-core",

          type: "circle",

          source:
            "city-aqi",

          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "aqi"],

              0,
              7,

              50,
              8,

              100,
              10,

              150,
              12,

              200,
              14,

              300,
              16,
            ],

            "circle-color": [
              "match",
              ["get", "status"],

              "good",
              "#22c55e",

              "moderate",
              "#eab308",

              "poor",
              "#f97316",

              "unhealthy",
              "#ef4444",

              "very-unhealthy",
              "#a855f7",

              "hazardous",
              "#c026d3",

              "#94a3b8",
            ],

            "circle-opacity":
              0.42,

            "circle-stroke-width":
              1,

            "circle-stroke-color":
              "rgba(255,255,255,0.25)",
          },
        });

        /*
         * City marker.
         */
        const markerElement =
          createMarkerElement(
            mapData.aqi,
            mapData.status,
            location.name,
          );

        const popup =
          createPopup({
            name:
              location.name,

            country:
              location.country ??
              location.country_code ??
              "Unknown",

            aqi:
              mapData.aqi,

            pm25:
              mapData.pm25,

            status:
              mapData.status,
        });

        new Marker({
          element:
            markerElement,

          anchor:
            "center",
        })
          .setLngLat([
            location.longitude,
            location.latitude,
          ])
          .setPopup(
            popup,
          )
          .addTo(map);

        requestAnimationFrame(
          () => {
            map.resize();

            requestAnimationFrame(
              () => {
                container.style.opacity =
                  "1";
              },
            );
          },
        );
      };

    const handleError =
      (event: unknown) => {
        console.error(
          "AirScope MapLibre error:",
          event,
        );

        /*
         * Still reveal the map on error so the
         * user isn't staring at a blank fade.
         */
        container.style.opacity =
          "1";
      };

    map.once(
      "load",
      handleLoad,
    );

    map.on(
      "error",
      handleError,
    );

    const resizeObserver =
      new ResizeObserver(
        () => {
          map.resize();
        },
      );

    resizeObserver.observe(
      container,
    );

    requestAnimationFrame(
      () => {
        map.resize();
      },
    );

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, [
    location,
    mapData,
  ]);

  const activeColors =
    mapData
      ? STATUS_STYLES[
          mapData.status
        ]
      : null;

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
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Air quality map
            </p>

            <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />
          </div>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Live air quality across {location.name}
          </p>
        </div>

        {mapData && activeColors && (
          <div
            className="airscope-badge-glow hidden shrink-0 rounded-xl border px-3 py-2 text-right sm:block"
            style={{
              borderColor: `${activeColors.color}26`,
              backgroundColor: `${activeColors.color}0d`,
              color: activeColors.color,
            }}
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
              Current AQI
            </p>

            <p
              className="mt-0.5 text-[11px] font-medium"
              style={{ color: activeColors.color }}
            >
              {mapData.aqi} · {activeColors.label}
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative mt-5 min-h-[450px] w-full flex-1">
        <div
          ref={
            mapContainerRef
          }
          className="absolute inset-0 min-h-[390px]"
          aria-label={`Live air quality map of ${location.name}`}
        />

        {isLoading && (
          <LoadingOverlay />
        )}

        {isError && (
          <ErrorOverlay
            onRetry={() =>
              refetch()
            }
          />
        )}

        {/* Current city */}
        {mapData && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/90 px-3 py-2 shadow-sm backdrop-blur-md transition-shadow duration-300">
            <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
              Selected city
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-[var(--foreground-secondary)]">
              {location.name}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/90 px-2.5 py-2 shadow-sm backdrop-blur-md">
          <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
            AQI
          </span>

          <span className="mx-0.5 h-3 w-px bg-[var(--border)]" />

          <span
            className={`size-1.5 rounded-full bg-emerald-400 transition-all duration-300 ${
              mapData?.status === "good"
                ? "scale-125 shadow-[0_0_8px_2px_rgba(52,211,153,0.55)]"
                : ""
            }`}
          />

          <span className="text-[9px] text-[var(--foreground-muted)]">
            Good
          </span>

          <span
            className={`ml-1 size-1.5 rounded-full bg-yellow-400 transition-all duration-300 ${
              mapData?.status === "moderate"
                ? "scale-125 shadow-[0_0_8px_2px_rgba(250,204,21,0.55)]"
                : ""
            }`}
          />

          <span className="text-[9px] text-[var(--foreground-muted)]">
            Moderate
          </span>

          <span
            className={`ml-1 size-1.5 rounded-full bg-orange-400 transition-all duration-300 ${
              mapData?.status === "poor"
                ? "scale-125 shadow-[0_0_8px_2px_rgba(251,146,60,0.55)]"
                : ""
            }`}
          />

          <span className="text-[9px] text-[var(--foreground-muted)]">
            Poor
          </span>

          <span
            className={`ml-1 size-1.5 rounded-full bg-red-400 transition-all duration-300 ${
              mapData?.status === "unhealthy"
                ? "scale-125 shadow-[0_0_8px_2px_rgba(248,113,113,0.55)]"
                : ""
            }`}
          />

          <span className="text-[9px] text-[var(--foreground-muted)]">
            Unhealthy
          </span>

          <span
            className={`ml-1 size-1.5 rounded-full bg-purple-400 transition-all duration-300 ${
              mapData?.status === "very-unhealthy" ||
              mapData?.status === "hazardous"
                ? "scale-125 shadow-[0_0_8px_2px_rgba(192,132,252,0.55)]"
                : ""
            }`}
          />

          <span className="text-[9px] text-[var(--foreground-muted)]">
            Very unhealthy
          </span>
        </div>

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/85 px-2.5 py-1.5 shadow-sm backdrop-blur-md sm:block">
          <span className="text-[9px] text-[var(--foreground-subtle)]">
            Drag to explore · Scroll to zoom
          </span>
        </div>
      </div>
    </motion.section>
  );
}