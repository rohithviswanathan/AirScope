import type {
  OpenMeteoAirQualityResponse,
  OpenMeteoLocation,
  OpenMeteoWeatherResponse,
} from "./types";

import type {
  AirScopeCurrentAirQuality,
  AirScopeCurrentWeather,
  AirScopeData,
  AirScopeForecastPoint,
  AirScopeLocation,
  AirScopePollutant,
  AirScopeTrendPoint,
  AirQualityStatus,
} from "./airScopeTypes";

function getAirQualityStatus(
  aqi: number,
): AirQualityStatus {
  if (aqi <= 50) {
    return "good";
  }

  if (aqi <= 100) {
    return "moderate";
  }

  if (aqi <= 150) {
    return "unhealthy-sensitive";
  }

  if (aqi <= 200) {
    return "unhealthy";
  }

  if (aqi <= 300) {
    return "very-unhealthy";
  }

  return "hazardous";
}

function getWindDirectionLabel(
  degrees: number,
): string {
  const directions = [
    "North",
    "North-east",
    "East",
    "South-east",
    "South",
    "South-west",
    "West",
    "North-west",
  ];

  const index =
    Math.round(degrees / 45) % 8;

  return directions[index];
}

function getPollutantDescription(
  pollutant: string,
): string {
  switch (pollutant) {
    case "PM2.5":
      return "Fine particulate matter";

    case "PM10":
      return "Coarse particulate matter";

    case "NO₂":
      return "Nitrogen dioxide";

    case "O₃":
      return "Ground-level ozone";

    case "SO₂":
      return "Sulphur dioxide";

    case "CO":
      return "Carbon monoxide";

    default:
      return "Measured air pollutant";
  }
}

function getPollutantId(
  pollutant: string,
): string {
  return pollutant
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeLocation(
  location: OpenMeteoLocation,
): AirScopeLocation {
  return {
    id: location.id,
    name: location.name,
    country:
      location.country ?? "Unknown",
    countryCode:
      location.country_code,
    admin1: location.admin1,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  };
}

function normalizeWeather(
  weather: OpenMeteoWeatherResponse,
): AirScopeCurrentWeather {
  const current = weather.current;

  return {
    temperature:
      current?.temperature_2m ?? 0,

    apparentTemperature:
      current?.apparent_temperature ?? 0,

    humidity:
      current?.relative_humidity_2m ?? 0,

    windSpeed:
      current?.wind_speed_10m ?? 0,

    windDirection:
      current?.wind_direction_10m ?? 0,

    windDirectionLabel:
      getWindDirectionLabel(
        current?.wind_direction_10m ?? 0,
      ),

    /*
     * Open-Meteo returns visibility in metres.
     */
    visibility:
      (current?.visibility ?? 0) / 1000,

    weatherCode:
      current?.weather_code ?? 0,
  };
}

function getCurrentPollutants(
  airQuality: OpenMeteoAirQualityResponse,
): AirScopePollutant[] {
  const current = airQuality.current;

  if (!current) {
    return [];
  }

  const definitions = [
    {
      pollutant: "PM2.5",
      value: current.pm2_5,
      unit: "µg/m³",
    },
    {
      pollutant: "PM10",
      value: current.pm10,
      unit: "µg/m³",
    },
    {
      pollutant: "NO₂",
      value: current.nitrogen_dioxide,
      unit: "µg/m³",
    },
    {
      pollutant: "O₃",
      value: current.ozone,
      unit: "µg/m³",
    },
    {
      pollutant: "SO₂",
      value: current.sulphur_dioxide,
      unit: "µg/m³",
    },
    {
      pollutant: "CO",
      value: current.carbon_monoxide,
      unit: "µg/m³",
    },
  ];

  return definitions.map(
    (pollutant) => ({
      id: getPollutantId(
        pollutant.pollutant,
      ),

      pollutant: pollutant.pollutant,

      value: pollutant.value,

      concentration:
        pollutant.value,

      unit: pollutant.unit,

      description:
        getPollutantDescription(
          pollutant.pollutant,
        ),
    }),
  );
}

function getDominantPollutant(
  pollutants: AirScopePollutant[],
): string {
  if (!pollutants.length) {
    return "Unknown";
  }

  /*
   * Temporary frontend rule.
   *
   * This will be replaced later with a
   * proper contribution calculation.
   */
  const pm25 = pollutants.find(
    (pollutant) =>
      pollutant.pollutant === "PM2.5",
  );

  if (pm25) {
    return pm25.pollutant;
  }

  return pollutants.reduce(
    (highest, pollutant) =>
      pollutant.concentration >
      highest.concentration
        ? pollutant
        : highest,
  ).pollutant;
}

function normalizeCurrentAirQuality(
  airQuality: OpenMeteoAirQualityResponse,
): AirScopeCurrentAirQuality {
  const currentAQI =
    airQuality.current?.us_aqi ?? 0;

  const pollutants =
    getCurrentPollutants(airQuality);

  return {
    aqi: currentAQI,

    status:
      getAirQualityStatus(
        currentAQI,
      ),

    dominantPollutant:
      getDominantPollutant(
        pollutants,
      ),

    pollutants,

    updatedAt:
      airQuality.current?.time ?? "",
  };
}

function normalizeTrend(
  airQuality: OpenMeteoAirQualityResponse,
): AirScopeTrendPoint[] {
  const currentTime =
    airQuality.current?.time;

  if (!currentTime) {
    return [];
  }

  return airQuality.hourly.time
    .map((time, index) => ({
      time,
      aqi:
        airQuality.hourly.us_aqi[
          index
        ] ?? 0,
    }))
    .filter((point) => {
      return (
        point.time <= currentTime &&
        point.aqi > 0
      );
    })
    .slice(-24);
}

function normalizeForecast(
  airQuality: OpenMeteoAirQualityResponse,
): AirScopeForecastPoint[] {
  const currentTime =
    airQuality.current?.time;

  if (!currentTime) {
    return [];
  }

  return airQuality.hourly.time
    .map((time, index) => ({
      time,
      aqi:
        airQuality.hourly.us_aqi[
          index
        ] ?? 0,
    }))
    .filter((point) => {
      return (
        point.time >= currentTime &&
        point.aqi > 0
      );
    })
    .slice(0, 72);
}

export function normalizeOpenMeteo(
  location: OpenMeteoLocation,
  weather: OpenMeteoWeatherResponse,
  airQuality: OpenMeteoAirQualityResponse,
): AirScopeData {
  return {
    location:
      normalizeLocation(location),

    weather:
      normalizeWeather(weather),

    airQuality:
      normalizeCurrentAirQuality(
        airQuality,
      ),

    trend:
      normalizeTrend(airQuality),

    forecast:
      normalizeForecast(
        airQuality,
      ),
  };
}