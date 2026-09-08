export type OpenMeteoAirQualityResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units?: {
    time: string;
    interval: string;
    pm2_5: string;
    pm10: string;
    carbon_monoxide: string;
    nitrogen_dioxide: string;
    sulphur_dioxide: string;
    ozone: string;
    us_aqi: string;
  };

  current?: {
    time: string;
    interval: number;
    pm2_5: number;
    pm10: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
    us_aqi: number;
  };

  hourly_units: {
    time: string;
    pm2_5: string;
    pm10: string;
    carbon_monoxide: string;
    nitrogen_dioxide: string;
    sulphur_dioxide: string;
    ozone: string;
    us_aqi: string;
  };

  hourly: {
    time: string[];
    pm2_5: Array<number | null>;
    pm10: Array<number | null>;
    carbon_monoxide: Array<number | null>;
    nitrogen_dioxide: Array<number | null>;
    sulphur_dioxide: Array<number | null>;
    ozone: Array<number | null>;
    us_aqi: Array<number | null>;
  };
};

export type OpenMeteoWeatherResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units?: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
    weather_code: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    visibility: string;
  };

  current?: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    visibility: number;
  };

  hourly_units?: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation_probability: string;
    weather_code: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    visibility: string;
  };

  hourly?: {
    time: string[];
    temperature_2m: Array<number | null>;
    relative_humidity_2m: Array<number | null>;
    apparent_temperature: Array<number | null>;
    precipitation_probability: Array<number | null>;
    weather_code: Array<number | null>;
    wind_speed_10m: Array<number | null>;
    wind_direction_10m: Array<number | null>;
    visibility: Array<number | null>;
  };
};

export type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoLocation[];
};

export type OpenMeteoLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
};

export type AirScopeLocation = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};