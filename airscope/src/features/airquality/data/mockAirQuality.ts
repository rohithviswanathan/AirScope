import type { AQIHeroData } from "../types";

export const mockAQIHero: AQIHeroData = {
  city: "Bengaluru",
  country: "India",
  aqi: 142,
  status: "unhealthy-sensitive",
  dominantPollutant: "PM2.5",
  guidance:
    "Sensitive individuals may want to reduce prolonged outdoor activity at the moment.",
  updatedAt: "Just now",
};