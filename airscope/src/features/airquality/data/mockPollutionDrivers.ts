export type PollutionDriver = {
  id: string;
  pollutant: string;
  value: number;
  concentration: number;
  unit: string;
  description: string;
};

export const mockPollutionDrivers: PollutionDriver[] = [
  {
    id: "pm25",
    pollutant: "PM2.5",
    value: 61,
    concentration: 67,
    unit: "µg/m³",
    description: "Primary contributor to the current air quality level.",
  },
  {
    id: "no2",
    pollutant: "NO₂",
    value: 24,
    concentration: 42,
    unit: "µg/m³",
    description: "Elevated levels are contributing to overall pollution.",
  },
  {
    id: "o3",
    pollutant: "O₃",
    value: 9,
    concentration: 31,
    unit: "µg/m³",
    description: "Moderate contribution to the current pollution profile.",
  },
  {
    id: "other",
    pollutant: "Other pollutants",
    value: 6,
    concentration: 0,
    unit: "",
    description: "Combined contribution from other measured pollutants.",
  },
];