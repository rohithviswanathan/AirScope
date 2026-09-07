export type AQIMapStatus =
  | "good"
  | "moderate"
  | "poor"
  | "unhealthy"
  | "very-unhealthy";

export type AirQualityLocation = {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  status: AQIMapStatus;
  longitude: number;
  latitude: number;
};

export const mockAirQualityLocations: AirQualityLocation[] = [
  {
    id: "koramangala",
    name: "Koramangala",
    aqi: 128,
    pm25: 58,
    status: "poor",
    longitude: 77.6245,
    latitude: 12.9352,
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    aqi: 119,
    pm25: 52,
    status: "poor",
    longitude: 77.6412,
    latitude: 12.9784,
  },
  {
    id: "whitefield",
    name: "Whitefield",
    aqi: 146,
    pm25: 69,
    status: "unhealthy",
    longitude: 77.750,
    latitude: 12.9698,
  },
  {
    id: "hebbal",
    name: "Hebbal",
    aqi: 154,
    pm25: 74,
    status: "unhealthy",
    longitude: 77.5946,
    latitude: 13.0358,
  },
  {
    id: "electronic-city",
    name: "Electronic City",
    aqi: 137,
    pm25: 63,
    status: "poor",
    longitude: 77.6648,
    latitude: 12.8458,
  },
];