import { useQuery } from "@tanstack/react-query";

import {
  getAirQuality,
  getWeather,
} from "./openMeteo";

import { normalizeOpenMeteo } from "./normalizeOpenMeteo";

import type {
  OpenMeteoLocation,
} from "./types";

import type {
  AirScopeData,
} from "./airScopeTypes";

type UseAirScopeDataOptions = {
  location: OpenMeteoLocation | null;
  enabled?: boolean;
};

async function fetchAirScopeData(
  location: OpenMeteoLocation,
): Promise<AirScopeData> {
  const [
    weather,
    airQuality,
  ] = await Promise.all([
    getWeather(
      location.latitude,
      location.longitude,
      location.timezone ?? "auto",
    ),

    getAirQuality(
      location.latitude,
      location.longitude,
      location.timezone ?? "auto",
    ),
  ]);

  return normalizeOpenMeteo(
    location,
    weather,
    airQuality,
  );
}

export function useAirScopeData({
  location,
  enabled = true,
}: UseAirScopeDataOptions) {
  return useQuery({
    queryKey: [
      "airScope",
      "location",
      location?.id,
      location?.latitude,
      location?.longitude,
    ],

    queryFn: () => {
      if (!location) {
        throw new Error(
          "A location is required to fetch AirScope data.",
        );
      }

      return fetchAirScopeData(location);
    },

    enabled:
      enabled && location !== null,

    staleTime: 60_000,

    gcTime: 5 * 60_000,

    retry: 1,

    refetchOnWindowFocus: true,
  });
}