export type AirQualityStatus =
  | "good"
  | "moderate"
  | "unhealthy-sensitive"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export type AQIHeroData = {
  city: string;
  country: string;
  aqi: number;
  status: AirQualityStatus;
  dominantPollutant: string;
  updatedAt: string;
};