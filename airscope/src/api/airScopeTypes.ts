export type AirQualityStatus =
  | "good"
  | "moderate"
  | "unhealthy-sensitive"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export type AirScopeLocation = {
  id: number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type AirScopeCurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  visibility: number;
  weatherCode: number;
};

export type AirScopePollutant = {
  id: string;
  pollutant: string;
  value: number;
  concentration: number;
  unit: string;
  description: string;
};

export type AirScopeCurrentAirQuality = {
  aqi: number;
  status: AirQualityStatus;
  dominantPollutant: string;
  pollutants: AirScopePollutant[];
  updatedAt: string;
};

export type AirScopeTrendPoint = {
  time: string;
  aqi: number;
};

export type AirScopeForecastPoint = {
  time: string;
  aqi: number;
};

export type AirScopeData = {
  location: AirScopeLocation;
  weather: AirScopeCurrentWeather;
  airQuality: AirScopeCurrentAirQuality;
  trend: AirScopeTrendPoint[];
  forecast: AirScopeForecastPoint[];
};