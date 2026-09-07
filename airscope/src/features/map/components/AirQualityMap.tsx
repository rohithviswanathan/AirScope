import { useEffect, useRef, useState } from "react";
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

import {
  mockAirQualityLocations,
} from "../data/mockLocations";
import type {
  AQIMapStatus,
  AirQualityLocation,
} from "../data/mockLocations";

setWorkerUrl(workerUrl);

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
};

function createMarkerElement(
  aqi: number,
  status: AQIMapStatus,
  name: string,
  onSelect: () => void,
) {
  const colors = STATUS_STYLES[status];

  /*
   * MapLibre owns the transform on the root element.
   * We therefore animate only the inner button.
   */
  const marker = document.createElement("div");

  marker.setAttribute(
    "aria-label",
    `${name}, AQI ${aqi}, ${colors.label}`,
  );

  Object.assign(marker.style, {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  });

  const button = document.createElement("button");

  button.type = "button";

  button.setAttribute(
    "aria-label",
    `View ${name} air quality`,
  );

  Object.assign(button.style, {
    position: "relative",
    width: "40px",
    height: "40px",
    padding: "0",
    margin: "0",
    borderRadius: "999px",
    border: `2px solid ${colors.color}`,
    background: "#111922",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "Inter, system-ui, sans-serif",
    cursor: "pointer",
    boxShadow: `0 0 0 4px ${colors.color}18, 0 8px 22px rgba(0,0,0,0.4)`,
    transition:
      "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
    zIndex: "2",
  });

  const innerGlow = document.createElement("span");

  Object.assign(innerGlow.style, {
    position: "absolute",
    inset: "4px",
    borderRadius: "999px",
    background: `radial-gradient(circle at 35% 30%, ${colors.color}35, transparent 70%)`,
    pointerEvents: "none",
  });

  const value = document.createElement("span");

  Object.assign(value.style, {
    position: "relative",
    zIndex: "2",
  });

  value.textContent = String(aqi);

  button.appendChild(innerGlow);
  button.appendChild(value);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect();
  });

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.1)";
    button.style.background = "#17212c";
    button.style.boxShadow = `0 0 0 6px ${colors.color}24, 0 12px 28px rgba(0,0,0,0.5)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
    button.style.background = "#111922";
    button.style.boxShadow = `0 0 0 4px ${colors.color}18, 0 8px 22px rgba(0,0,0,0.4)`;
  });

  marker.appendChild(button);

  return marker;
}

function createPopup(
  location: AirQualityLocation,
) {
  const colors = STATUS_STYLES[location.status];

  return new Popup({
    offset: 28,
    closeButton: false,
    closeOnClick: true,
    className: "airscope-map-popup",
  }).setHTML(`
    <div
      style="
        min-width: 180px;
        font-family: Inter, system-ui, sans-serif;
        color: #f4f7fa;
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
        <div
          style="
            font-size: 12px;
            font-weight: 600;
          "
        >
          ${location.name}
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
          align-items: baseline;
          gap: 6px;
          margin-top: 12px;
        "
      >
        <span
          style="
            font-size: 26px;
            line-height: 1;
            font-weight: 700;
            letter-spacing: -0.05em;
          "
        >
          ${location.aqi}
        </span>

        <span
          style="
            font-size: 9px;
            color: rgba(255,255,255,0.36);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          "
        >
          AQI
        </span>
      </div>

      <div
        style="
          margin-top: 9px;
          display: inline-flex;
          padding: 4px 7px;
          border-radius: 999px;
          background: ${colors.color}18;
          color: ${colors.text};
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        "
      >
        ${colors.label}
      </div>

      <div
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
        "
      >
        <div>
          <div
            style="
              color: rgba(255,255,255,0.32);
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
              color: rgba(255,255,255,0.7);
              font-size: 11px;
              font-weight: 600;
            "
          >
            ${location.pm25} µg/m³
          </div>
        </div>

        <div>
          <div
            style="
              color: rgba(255,255,255,0.32);
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            "
          >
            Status
          </div>

          <div
            style="
              margin-top: 3px;
              color: rgba(255,255,255,0.7);
              font-size: 11px;
              font-weight: 600;
            "
          >
            ${colors.label}
          </div>
        </div>
      </div>
    </div>
  `);
}

export function AirQualityMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedLocation, setSelectedLocation] =
    useState<string | null>(null);

  const highestAQI = Math.max(
    ...mockAirQualityLocations.map(
      (location) => location.aqi,
    ),
  );

  const highestLocation =
    mockAirQualityLocations.find(
      (location) => location.aqi === highestAQI,
    );

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container) {
      return;
    }

    const map = new Map({
      container,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [77.5946, 12.9716],
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

    const markers: Marker[] = [];

    const handleLoad = () => {
      map.resize();

      /*
       * AQI visual layer.
       *
       * The soft circles behind the markers turn the map
       * itself into a pollution visualization.
       */
      const geojson = {
        type: "FeatureCollection" as const,
        features: mockAirQualityLocations.map(
          (location) => ({
            type: "Feature" as const,
            properties: {
              aqi: location.aqi,
              status: location.status,
              name: location.name,
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

      map.addSource("aqi-locations", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "aqi-glow",
        type: "circle",
        source: "aqi-locations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "aqi"],
            90,
            20,
            160,
            36,
            220,
            48,
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
            "#94a3b8",
          ],
          "circle-opacity": 0.11,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "aqi-core",
        type: "circle",
        source: "aqi-locations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "aqi"],
            90,
            5,
            160,
            8,
            220,
            11,
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
            "#94a3b8",
          ],
          "circle-opacity": 0.45,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255,255,255,0.2)",
        },
      });

      /*
       * HTML markers sit above the visualization layer.
       */
      mockAirQualityLocations.forEach((location) => {
        const markerElement = createMarkerElement(
          location.aqi,
          location.status,
          location.name,
          () => {
            setSelectedLocation(location.id);
          },
        );

        const popup = createPopup(location);

        const marker = new Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([
            location.longitude,
            location.latitude,
          ])
          .setPopup(popup)
          .addTo(map);

        markerElement.addEventListener("click", () => {
          setSelectedLocation(location.id);
        });

        markers.push(marker);
      });

      requestAnimationFrame(() => {
        map.resize();
      });
    };

    const handleError = (event: unknown) => {
      console.error(
        "AirScope MapLibre error:",
        event,
      );
    };

    map.once("load", handleLoad);
    map.on("error", handleError);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    requestAnimationFrame(() => {
      map.resize();
    });

    return () => {
      resizeObserver.disconnect();

      markers.forEach((marker) => {
        marker.remove();
      });

      map.remove();
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0F151D]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/80">
              Air quality map
            </p>

            <span className="size-1 rounded-full bg-white/15" />
          </div>

          <p className="mt-1 text-xs text-white/30">
            Pollution across nearby locations
          </p>
        </div>

        {highestLocation && (
          <div className="hidden rounded-xl border border-orange-400/10 bg-orange-400/[0.035] px-3 py-2 text-right sm:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
              Highest AQI
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-orange-300/70">
              {highestLocation.name} · {highestAQI}
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative mt-5 min-h-[450px] flex-1 w-full">
        <div
          ref={mapContainerRef}
          className="absolute inset-0 min-h-[390px]"
          aria-label="Interactive air quality map of Bengaluru"
        />

        {/* Selected location indicator */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/[0.08] bg-[#0B1016]/90 px-2.5 py-1.5 backdrop-blur-md"
          >
            <p className="text-[9px] uppercase tracking-[0.1em] text-white/30">
              Selected
            </p>

            <p className="mt-0.5 text-[10px] font-medium text-white/65">
              {
                mockAirQualityLocations.find(
                  (location) =>
                    location.id === selectedLocation,
                )?.name
              }
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-white/[0.08] bg-[#0B1016]/90 px-2.5 py-2 backdrop-blur-md">
          <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-white/35">
            AQI
          </span>

          <span className="mx-0.5 h-3 w-px bg-white/10" />

          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-[9px] text-white/35">
            Good
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-yellow-400" />
          <span className="text-[9px] text-white/35">
            Moderate
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-orange-400" />
          <span className="text-[9px] text-white/35">
            Poor
          </span>

          <span className="ml-1 size-1.5 rounded-full bg-red-400" />
          <span className="text-[9px] text-white/35">
            Unhealthy
          </span>
        </div>

        {/* Map interaction hint */}
        <div className="pointer-events-none absolute right-3 bottom-3 hidden rounded-lg border border-white/[0.06] bg-[#0B1016]/80 px-2.5 py-1.5 backdrop-blur-md sm:block">
          <span className="text-[9px] text-white/25">
            Select a location
          </span>
        </div>
      </div>
    </motion.section>
  );
}