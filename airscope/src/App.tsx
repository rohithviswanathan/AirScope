import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";

import { Dashboard } from "./features/dashboard/Dashboard";
import { AnalyticsPage } from "./features/analytics/pages/AnalyticsPage";
import { ForecastPage } from "./features/forecast/pages/ForecastPage";
import { LocationsPage } from "./features/map/pages/LocationsPage";
import { ApiTestPage } from "./features/api-test/pages/ApiTestPage";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Overview */}
          <Route
            path="/overview"
            element={<Dashboard />}
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={<AnalyticsPage />}
          />

          {/* Forecast */}
          <Route
            path="/forecast"
            element={<ForecastPage />}
          />

          {/* Locations */}
          <Route
            path="/locations"
            element={<LocationsPage />}
          />

          <Route
            path="/api-test"
            element={<ApiTestPage />}
          />

          {/* Default */}
          <Route
            path="/"
            element={
              <Navigate
                to="/overview"
                replace
              />
            }
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={
              <Navigate
                to="/overview"
                replace
              />
            }
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;