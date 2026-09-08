import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  LngLatBounds,
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

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

type AirQualityLocation = {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  status: AQIMapStatus;
  longitude: number;
  latitude: number;
};

/* -------------------------------------------------------------------------- */
/* Monitored locations                                                        */
/*                                                                            */
/* These are geographic points only.                                         */
/* AQI and pollutant values are always fetched from the API.                 */
/* -------------------------------------------------------------------------- */

const MONITORED_LOCATIONS = [
  {
    id: "koramangala",
    name: "Koramangala",
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    latitude: 12.9784,
    longitude: 77.6412,
  },
  {
    id: "whitefield",
    name: "Whitefield",
    latitude: 12.9698,
    longitude: 77.75,
  },
  {
    id: "hebbal",
    name: "Hebbal",
    latitude: 13.0358,
    longitude: 77.5946,
  },
  {
    id: "electronic-city",
    name: "Electronic City",
    latitude: 12.8458,
    longitude: 77.6648,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Status configuration                                                       */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<
  AQIMapStatus,
  {
    color: string;
    text: string;
    label: string;
  }
> = {
  good: {
    color: "#22c55e",
    text: "#d1fae5",
    label: "Good",
  },

  moderate: {
    color: "#eab308",
    text: "#fef9c3",
    label: "Moderate",
  },

  poor: {
    color: "#f97316",
    text: "#ffedd5",
    label: "Poor",
  },

  unhealthy: {
    color: "#ef4444",
    text: "#fee2e2",
    label: "Unhealthy",
  },

  "very-unhealthy": {
    color: "#a855f7",
    text: "#f3e8ff",
    label: "Very unhealthy",
  },

  hazardous: {
    color: "#c026d3",
    text: "#fae8ff",
    label: "Hazardous",
  },
};

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
/* API                                                                        */
/* -------------------------------------------------------------------------- */

async function fetchMapLocation(
  location: (typeof MONITORED_LOCATIONS)[number],
): Promise<AirQualityLocation | null> {
  const response = await getAirQuality(
    location.latitude,
    location.longitude,
    "Asia/Kolkata",
  );

  const aqi = response.current?.us_aqi;
  const pm25 = response.current?.pm2_5;

  if (
    typeof aqi !== "number" ||
    typeof pm25 !== "number"
  ) {
    return null;
  }

  return {
    id: location.id,
    name: location.name,
    aqi,
    pm25,
    status: getMapStatus(aqi),
    longitude: location.longitude,
    latitude: location.latitude,
  };
}

async function fetchMapLocations(): Promise<
  AirQualityLocation[]
> {
  const results =
    await Promise.allSettled(
      MONITORED_LOCATIONS.map(
        (location) =>
          fetchMapLocation(location),
      ),
    );

  const locations =
    results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<AirQualityLocation | null> =>
          result.status === "fulfilled",
      )
      .map(
        (result) => result.value,
      )
      .filter(
        (
          location,
        ): location is AirQualityLocation =>
          location !== null,
      );

  if (!locations.length) {
    throw new Error(
      "No monitored locations returned usable air-quality data.",
    );
  }

  console.table(
    locations.map(
      (location) => ({
        location:
          location.name,
        aqi: location.aqi,
        pm25: location.pm25,
        latitude:
          location.latitude,
        longitude:
          location.longitude,
        status:
          location.status,
      }),
    ),
  );

  return locations;
}

/* -------------------------------------------------------------------------- */
/* Marker                                                                     */
/* -------------------------------------------------------------------------- */

function createMarkerElement(
  aqi: number,
  status: AQIMapStatus,
  name: string,
  onSelect: () => void,
) {
  const colors =
    STATUS_STYLES[status];

  const marker =
    document.createElement("div");

  Object.assign(
    marker.style,
    {
      width: "50px",
      height: "50px",
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
    `View ${name} air quality`,
  );

  Object.assign(
    button.style,
    {
      position: "relative",
      width: "40px",
      height: "40px",
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
      fontSize: "10px",
      fontWeight: "700",
      fontFamily:
        "Inter, system-ui, sans-serif",
      cursor: "pointer",
      boxShadow: `0 0 0 4px ${colors.color}18, var(--map-marker-shadow)`,
      transition:
        "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
      zIndex: "2",
    },
  );

  const glow =
    document.createElement("span");

  Object.assign(
    glow.style,
    {
      position: "absolute",
      inset: "4px",
      borderRadius: "999px",
      background: `radial-gradient(circle at 35% 30%, ${colors.color}35, transparent 70%)`,
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
    },
  );

  value.textContent =
    String(aqi);

  button.appendChild(glow);
  button.appendChild(value);

  button.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      onSelect();
    },
  );

  button.addEventListener(
    "mouseenter",
    () => {
      button.style.transform =
        "scale(1.1)";

      button.style.background =
        "var(--map-marker-hover)";

      button.style.boxShadow = `0 0 0 6px ${colors.color}24, var(--map-marker-hover-shadow)`;
    },
  );

  button.addEventListener(
    "mouseleave",
    () => {
      button.style.transform =
        "scale(1)";

      button.style.background =
        "var(--map-marker-background)";

      button.style.boxShadow = `0 0 0 4px ${colors.color}18, var(--map-marker-shadow)`;
    },
  );

  marker.appendChild(button);

  return marker;
}

/* -------------------------------------------------------------------------- */
/* Popup                                                                      */
/* -------------------------------------------------------------------------- */

function createPopup(
  location: AirQualityLocation,
) {
  const colors =
    STATUS_STYLES[
      location.status
    ];

  return new Popup({
    offset: 28,
    closeButton: false,
    closeOnClick: true,
    className:
      "airscope-map-popup",
  }).setHTML(`
    <div
      style="
        min-width:180px;
        font-family:Inter,system-ui,sans-serif;
        color:var(--foreground);
      "
    >
      <div
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        "
      >
        <div
          style="
            font-size:12px;
            font-weight:600;
            color:var(--foreground);
          "
        >
          ${location.name}
        </div>

        <span
          style="
            width:7px;
            height:7px;
            flex-shrink:0;
            border-radius:999px;
            background:${colors.color};
            box-shadow:0 0 10px ${colors.color}88;
          "
        ></span>
      </div>

      <div
        style="
          display:flex;
          align-items:baseline;
          gap:6px;
          margin-top:12px;
        "
      >
        <span
          style="
            font-size:26px;
            line-height:1;
            font-weight:700;
            letter-spacing:-0.05em;
            color:var(--foreground);
          "
        >
          ${location.aqi}
        </span>

        <span
          style="
            font-size:9px;
            color:var(--foreground-subtle);
            text-transform:uppercase;
            letter-spacing:0.1em;
          "
        >
          AQI
        </span>
      </div>

      <div
        style="
          margin-top:9px;
          display:inline-flex;
          padding:4px 7px;
          border-radius:999px;
          background:${colors.color}18;
          color:${colors.text};
          font-size:9px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:0.08em;
        "
      >
        ${colors.label}
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
          margin-top:12px;
          padding-top:10px;
          border-top:1px solid var(--border);
        "
      >
        <div>
          <div
            style="
              color:var(--foreground-subtle);
              font-size:9px;
              text-transform:uppercase;
              letter-spacing:0.08em;
            "
          >
            PM2.5
          </div>

          <div
            style="
              margin-top:3px;
              color:var(--foreground-secondary);
              font-size:11px;
              font-weight:600;
            "
          >
            ${location.pm25.toFixed(1)} µg/m³
          </div>
        </div>

        <div>
          <div
            style="
              color:var(--foreground-subtle);
              font-size:9px;
              text-transform:uppercase;
              letter-spacing:0.08em;
            "
          >
            Status
          </div>

          <div
            style="
              margin-top:3px;
              color:var(--foreground-secondary);
              font-size:11px;
              font-weight:600;
            "
          >
            ${colors.label}
          </div>
        </div>
      </div>
    </div>
  `);
}

/* -------------------------------------------------------------------------- */
/* States                                                                     */
/* -------------------------------------------------------------------------- */

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface)]/55 backdrop-blur-[2px]">
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
          Live air-quality readings could not be loaded for the monitored areas.
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
  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState<string | null>(
    null,
  );

  const {
    data: mapLocations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "airScope",
      "mapLocations",
    ],

    queryFn:
      fetchMapLocations,

    staleTime:
      60_000,

    gcTime:
      5 * 60_000,

    retry: 1,

    refetchOnWindowFocus:
      true,
  });

  const highestAQI =
    useMemo(() => {
      if (!mapLocations.length) {
        return 0;
      }

      return Math.max(
        ...mapLocations.map(
          (location) =>
            location.aqi,
        ),
      );
    }, [mapLocations]);

  const highestLocation =
    useMemo(() => {
      if (!mapLocations.length) {
        return null;
      }

      return mapLocations.find(
        (location) =>
          location.aqi ===
          highestAQI,
      ) ?? null;
    }, [
      highestAQI,
      mapLocations,
    ]);

  const selectedLocationData =
    useMemo(() => {
      if (!selectedLocation) {
        return null;
      }

      return (
        mapLocations.find(
          (location) =>
            location.id ===
            selectedLocation,
        ) ?? null
      );
    }, [
      mapLocations,
      selectedLocation,
    ]);

  useEffect(() => {
    const container =
      document.getElementById(
        "airscope-map-container",
      ) as HTMLDivElement | null;

    if (
      !container ||
      !mapLocations.length
    ) {
      return;
    }

    const map = new Map({
      container,

      style:
        "https://tiles.openfreemap.org/styles/liberty",

      center: [
        77.5946,
        12.9716,
      ],

      zoom: 10.5,

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

    const markers: Marker[] =
      [];

    const handleLoad = () => {
      map.resize();

      /* -------------------------------------------------------------------- */
      /* AQI glow layer                                                       */
      /* -------------------------------------------------------------------- */

      const geojson = {
        type: "FeatureCollection" as const,

        features:
          mapLocations.map(
            (location) => ({
              type: "Feature" as const,

              properties: {
                aqi: location.aqi,
                status:
                  location.status,
                name:
                  location.name,
              },

              geometry: {
                type: "Point" as const,

                coordinates: [
                  location.longitude,
                  location.latitude,
                ],
              },
            }),
          ),
      };

      map.addSource(
        "aqi-locations",
        {
          type: "geojson",
          data: geojson,
        },
      );

      map.addLayer({
        id: "aqi-glow",

        type: "circle",

        source:
          "aqi-locations",

        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "aqi"],

            0,
            12,

            50,
            16,

            100,
            22,

            150,
            32,

            220,
            46,

            300,
            58,
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
            0.11,

          "circle-blur": 1,
        },
      });

      /* -------------------------------------------------------------------- */
      /* AQI core layer                                                       */
      /* -------------------------------------------------------------------- */

      map.addLayer({
        id: "aqi-core",

        type: "circle",

        source:
          "aqi-locations",

        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "aqi"],

            0,
            4,

            50,
            5,

            100,
            7,

            150,
            9,

            220,
            11,

            300,
            13,
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
            0.45,

          "circle-stroke-width":
            1,

          "circle-stroke-color":
            "rgba(255,255,255,0.2)",
        },
      });

      /* -------------------------------------------------------------------- */
      /* HTML markers                                                         */
      /* -------------------------------------------------------------------- */

      const bounds =
        new LngLatBounds();

      mapLocations.forEach(
        (location) => {
          bounds.extend([
            location.longitude,
            location.latitude,
          ]);

          const markerElement =
            createMarkerElement(
              location.aqi,
              location.status,
              location.name,
              () => {
                setSelectedLocation(
                  location.id,
                );
              },
            );

          const popup =
            createPopup(
              location,
            );

          const marker =
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

          markers.push(
            marker,
          );
        },
      );

      /* -------------------------------------------------------------------- */
      /* Frame monitored locations                                            */
      /* -------------------------------------------------------------------- */

      if (
        mapLocations.length >
          1 &&
        !bounds.isEmpty()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: 70,
            maxZoom: 12,
            duration: 0,
          },
        );
      }

      requestAnimationFrame(
        () => {
          map.resize();
        },
      );
    };

    const handleError = (
      event: unknown,
    ) => {
      console.error(
        "AirScope MapLibre error:",
        event,
      );
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

      markers.forEach(
        (marker) => {
          marker.remove();
        },
      );

      map.remove();
    };
  }, [mapLocations]);

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
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--foreground-secondary)]">
              Air quality map
            </p>

            <span className="size-1 rounded-full bg-[var(--foreground-faint)]" />
          </div>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Live modelled air quality across monitored areas
          </p>
        </div>

        {highestLocation && (
          <div className="hidden rounded-xl border border-orange-400/10 bg-orange-400/[0.035] px-3 py-2 text-right sm:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
              Highest AQI
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-orange-300/70">
              {highestLocation.name} ·{" "}
              {highestAQI}
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative mt-5 min-h-[450px] w-full flex-1">
        <div
          id="airscope-map-container"
          className="absolute inset-0 min-h-[390px]"
          aria-label="Interactive live modelled air quality map of Bengaluru"
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

        {/* Selected location */}
        {selectedLocationData && (
          <motion.div
            initial={{
              opacity: 0,
              y: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="pointer-events-none absolute left-3 top-3 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/90 px-2.5 py-1.5 shadow-sm backdrop-blur-md"
          >
            <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--foreground-subtle)]">
              Selected
            </p>

            <p className="mt-0.5 text-[10px] font-medium text-[var(--foreground-secondary)]">
              {selectedLocationData.name}
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/90 px-2.5 py-2 shadow-sm backdrop-blur-md">
          <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
            AQI
          </span>

          <span className="mx-0.5 h-3 w-px bg-[var(--border)]" />

          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-[9px] text-[var(--foreground-muted)]">
            Good
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-yellow-400" />
          <span className="text-[9px] text-[var(--foreground-muted)]">
            Moderate
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-orange-400" />
          <span className="text-[9px] text-[var(--foreground-muted)]">
            Poor
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-red-400" />
          <span className="text-[9px] text-[var(--foreground-muted)]">
            Unhealthy
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-purple-400" />
          <span className="text-[9px] text-[var(--foreground-muted)]">
            Very unhealthy
          </span>
        </div>

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/85 px-2.5 py-1.5 shadow-sm backdrop-blur-md sm:block">
          <span className="text-[9px] text-[var(--foreground-subtle)]">
            Select a location
          </span>
        </div>
      </div>
    </motion.section>
  );
}