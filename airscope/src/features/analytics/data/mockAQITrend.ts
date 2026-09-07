export type AQITrendPoint = {
  time: string;
  aqi: number;
};

export const mockAQITrend: AQITrendPoint[] = [
  { time: "12 AM", aqi: 118 },
  { time: "1 AM", aqi: 116 },
  { time: "2 AM", aqi: 114 },
  { time: "3 AM", aqi: 112 },
  { time: "4 AM", aqi: 110 },
  { time: "5 AM", aqi: 113 },
  { time: "6 AM", aqi: 119 },
  { time: "7 AM", aqi: 128 },
  { time: "8 AM", aqi: 136 },
  { time: "9 AM", aqi: 141 },
  { time: "10 AM", aqi: 146 },
  { time: "11 AM", aqi: 149 },
  { time: "12 PM", aqi: 152 },
  { time: "1 PM", aqi: 155 },
  { time: "2 PM", aqi: 153 },
  { time: "3 PM", aqi: 150 },
  { time: "4 PM", aqi: 147 },
  { time: "5 PM", aqi: 145 },
  { time: "6 PM", aqi: 142 },
  { time: "7 PM", aqi: 140 },
  { time: "8 PM", aqi: 137 },
  { time: "9 PM", aqi: 134 },
  { time: "10 PM", aqi: 130 },
  { time: "11 PM", aqi: 126 },
];