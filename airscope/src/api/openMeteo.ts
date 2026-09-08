import type {
  OpenMeteoAirQualityResponse,
  OpenMeteoGeocodingResponse,
  OpenMeteoLocation,
  OpenMeteoWeatherResponse,
} from "./types";

const OPEN_METEO_BASE_URL =
  "https://api.open-meteo.com/v1";

const OPEN_METEO_AIR_QUALITY_URL =
  "https://air-quality-api.open-meteo.com/v1";

const OPEN_METEO_GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1";

type RequestParams = Record<
  string,
  string | number | boolean | undefined
>;

function buildUrl(
  baseUrl: string,
  path: string,
  params: RequestParams,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null
      ) {
        searchParams.set(
          key,
          String(value),
        );
      }
    },
  );

  return `${baseUrl}${path}?${searchParams.toString()}`;
}

async function fetchJson<T>(
  url: string,
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Open-Meteo request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Search for a city/location.
 */
export async function searchLocation(
  query: string,
): Promise<OpenMeteoLocation[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = buildUrl(
    OPEN_METEO_GEOCODING_URL,
    "/search",
    {
      name: trimmedQuery,
      count: 10,
      language: "en",
      format: "json",
    },
  );

  const data =
    await fetchJson<OpenMeteoGeocodingResponse>(
      url,
    );

  return data.results ?? [];
}

/**
 * Get current + hourly weather data.
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  timezone = "auto",
): Promise<OpenMeteoWeatherResponse> {
  const url = buildUrl(
    OPEN_METEO_BASE_URL,
    "/forecast",
    {
      latitude,
      longitude,
      timezone,

      current:
        [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "precipitation",
          "rain",
          "weather_code",
          "wind_speed_10m",
          "wind_direction_10m",
          "visibility",
        ].join(","),

      hourly:
        [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "precipitation_probability",
          "weather_code",
          "wind_speed_10m",
          "wind_direction_10m",
          "visibility",
        ].join(","),

      forecast_days: 3,
    },
  );

  return fetchJson<OpenMeteoWeatherResponse>(
    url,
  );
}

/**
 * Get current + hourly air quality data.
 *
 * AirScope uses the US AQI scale.
 *
 * In addition to the overall US AQI, we request the
 * individual pollutant AQI values so the normalized
 * layer can correctly identify which pollutant is
 * driving the current AQI.
 */
export async function getAirQuality(
  latitude: number,
  longitude: number,
  timezone = "auto",
): Promise<OpenMeteoAirQualityResponse> {
  const url = buildUrl(
    OPEN_METEO_AIR_QUALITY_URL,
    "/air-quality",
    {
      latitude,
      longitude,
      timezone,

      current: [
        "pm2_5",
        "pm10",
        "carbon_monoxide",
        "nitrogen_dioxide",
        "sulphur_dioxide",
        "ozone",

        "us_aqi",
        "us_aqi_pm2_5",
        "us_aqi_pm10",
        "us_aqi_carbon_monoxide",
        "us_aqi_nitrogen_dioxide",
        "us_aqi_sulphur_dioxide",
        "us_aqi_ozone",
      ].join(","),

      hourly: [
        "pm2_5",
        "pm10",
        "carbon_monoxide",
        "nitrogen_dioxide",
        "sulphur_dioxide",
        "ozone",

        "us_aqi",
        "us_aqi_pm2_5",
        "us_aqi_pm10",
        "us_aqi_carbon_monoxide",
        "us_aqi_nitrogen_dioxide",
        "us_aqi_sulphur_dioxide",
        "us_aqi_ozone",
      ].join(","),

      past_hours: 24,
      forecast_hours: 72,
    },
  );

  return fetchJson<OpenMeteoAirQualityResponse>(
    url,
  );
}