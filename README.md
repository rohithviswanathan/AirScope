# AirScope

AirScope is a React and TypeScript web application for exploring local air quality and weather conditions. It combines live Open-Meteo data with a focused dashboard experience so users can search for a location, inspect its current US AQI, understand the pollutants contributing to that score, review recent trends, and look ahead at the short-term outlook.

The project is designed as a client-side single-page application. It uses Vite for development and production builds, React Router for navigation, TanStack Query for request caching and lifecycle management, ECharts for data visualization, MapLibre GL for map-based location views, Motion for interface animation, and Hugeicons for UI icons.

## What The Application Provides

- **Overview**: A location-aware dashboard with the current AQI, air-quality status, dominant pollutant, pollutant readings, weather context, and loading/error states.
- **Analytics**: A dedicated view for inspecting AQI history and trends.
- **Forecast**: A short-term air-quality outlook based on hourly forecast data.
- **Locations**: A map-oriented view for exploring and selecting locations.
- **Location search**: City and location search powered by the Open-Meteo geocoding API.
- **Weather context**: Current temperature, apparent temperature, humidity, wind, visibility, and weather code data are available alongside air-quality readings.
- **Responsive shell**: Shared desktop and mobile navigation components provide a consistent application layout across screen sizes.

## Data Sources

AirScope currently uses the public Open-Meteo APIs directly from the browser:

1. The geocoding API searches for a user-entered city or place name.
2. The weather API returns current and hourly weather data for the selected coordinates.
3. The air-quality API returns current readings plus the previous 24 hours and next 72 hours of hourly air-quality data.
4. The normalization layer converts provider responses into the smaller, stable data model used by the UI.

The application requests AQI values using the US AQI scale. It also requests pollutant-specific AQI values so the normalized data can identify the pollutant that is currently contributing most strongly to the overall score.

## Technical Architecture

The source tree is organized by responsibility and feature:

```text
src/
  api/                 Open-Meteo clients, provider types, normalization, query hook
  components/
    layout/            Application shell, top bar, sidebar, and mobile header
    theme/             Theme provider
  context/             Shared selected-location state
  features/
    airquality/        AQI hero and pollutant-focused components
    analytics/         Trend visualization and analytics page
    api-test/          API testing page and related experiments
    dashboard/         Main overview experience
    forecast/          Air-quality forecast page and components
    map/               Location and map views
  lib/                 Navigation and query-client configuration
```

### Request Lifecycle

The main data hook is `useAirScopeData`. It accepts the selected Open-Meteo location and uses a query key containing the location identity and coordinates. When a location is available, weather and air-quality requests run in parallel. The response is then passed through `normalizeOpenMeteo` before being returned to feature components.

Query behavior is intentionally conservative for a live dashboard:

- Data is considered fresh for 60 seconds.
- Cached data is retained for 5 minutes after it becomes unused.
- Failed requests are retried once.
- Data can refresh when the browser window regains focus.

## Routes

The application currently exposes these routes:

| Route | View |
| --- | --- |
| `/overview` | Main dashboard |
| `/analytics` | AQI trend analytics |
| `/forecast` | Air-quality outlook |
| `/locations` | Location and map view |
| `/` | Redirects to `/overview` |
| Any unknown route | Redirects to `/overview` |

## Getting Started

### Requirements

- Node.js with npm
- Internet access for Open-Meteo requests during development and runtime

No API key or local database is required by the current implementation.

### Installation

From the project root:

```bash
npm install
```

### Start The Development Server

```bash
npm run dev
```

Vite will print the local URL in the terminal. Open that URL in a browser to use the application.

### Production Build

```bash
npm run build
```

The build runs TypeScript project compilation before producing the Vite bundle.

### Preview A Production Build

```bash
npm run preview
```

### Lint The Project

```bash
npm run lint
```

## Useful Development Conventions

- Keep provider-specific response shapes in `src/api/types.ts`.
- Keep application-facing models in `src/api/airScopeTypes.ts`.
- Put provider-to-application conversion logic in `src/api/normalizeOpenMeteo.ts` rather than spreading it through UI components.
- Use `useAirScopeData` for location-based weather and air-quality requests so caching and query invalidation remain consistent.
- Keep location selection in `LocationProvider` so the shell and individual feature pages share the same active location.
- Add page-level routes in `src/App.tsx` and navigation entries in `src/lib/navigation.ts` together.
- Reuse the existing layout and theme components when adding new feature pages.

## Current Scope And Future Extensions

AirScope is currently a frontend application that reads public environmental data. Natural next steps include adding automated tests for normalization and AQI status mapping, improving explicit API error messaging, adding saved locations, allowing users to switch AQI standards, and introducing a server-side proxy if request governance or additional data providers become necessary.

## License

No license has been declared in the project metadata yet.