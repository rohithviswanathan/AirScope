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
     * AirScope displays kilometres.
     */
    visibility:
      (current?.visibility ?? 0) / 1000,

    weatherCode:
      current?.weather_code ?? 0,
  };
}

/*
 * Normalize current pollutant concentrations together
 * with their individual US AQI values.
 *
 * The AQI values are what we use to determine the
 * dominant pollutant. Concentrations are only used
 * for the visual concentration profile.
 */
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
      concentration:
        current.pm2_5,
      aqi:
        current.us_aqi_pm2_5,
      unit: "µg/m³",
    },

    {
      pollutant: "PM10",
      concentration:
        current.pm10,
      aqi:
        current.us_aqi_pm10,
      unit: "µg/m³",
    },

    {
      pollutant: "NO₂",
      concentration:
        current.nitrogen_dioxide,
      aqi:
        current.us_aqi_nitrogen_dioxide,
      unit: "µg/m³",
    },

    {
      pollutant: "O₃",
      concentration:
        current.ozone,
      aqi:
        current.us_aqi_ozone,
      unit: "µg/m³",
    },

    {
      pollutant: "SO₂",
      concentration:
        current.sulphur_dioxide,
      aqi:
        current.us_aqi_sulphur_dioxide,
      unit: "µg/m³",
    },

    {
      pollutant: "CO",
      concentration:
        current.carbon_monoxide,
      aqi:
        current.us_aqi_carbon_monoxide,
      unit: "µg/m³",
    },
  ];

  return definitions.map(
    (pollutant) => ({
      id: getPollutantId(
        pollutant.pollutant,
      ),

      pollutant:
        pollutant.pollutant,

      /*
       * Preserve concentration as the main value
       * used by the pollutant profile UI.
       */
      value:
        pollutant.concentration,

      concentration:
        pollutant.concentration,

      unit:
        pollutant.unit,

      description:
        getPollutantDescription(
          pollutant.pollutant,
        ),

      /*
       * Individual US AQI contribution.
       */
      aqi:
        pollutant.aqi,
    }),
  );
}

/*
 * Determine the actual AQI driver.
 *
 * IMPORTANT:
 * We compare pollutant AQI values, NOT raw concentrations.
 *
 * For example:
 *
 * CO = 500 µg/m³
 * PM2.5 = 15 µg/m³
 *
 * does NOT mean CO is the AQI driver simply because
 * 500 is numerically larger than 15.
 */
function getDominantPollutant(
  pollutants: AirScopePollutant[],
): string {
  if (!pollutants.length) {
    return "Unknown";
  }

  const dominant =
    pollutants.reduce(
      (highest, pollutant) =>
        pollutant.aqi >
        highest.aqi
          ? pollutant
          : highest,
    );

  return dominant.pollutant;
}

function normalizeCurrentAirQuality(
  airQuality: OpenMeteoAirQualityResponse,
): AirScopeCurrentAirQuality {
  const currentAQI =
    airQuality.current?.us_aqi ?? 0;

  const pollutants =
    getCurrentPollutants(
      airQuality,
    );

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
      normalizeTrend(
        airQuality,
      ),

    forecast:
      normalizeForecast(
        airQuality,
      ),
  };
}