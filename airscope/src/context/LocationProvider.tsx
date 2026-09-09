import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { OpenMeteoLocation } from "../api/types";

type LocationContextValue = {
  location: OpenMeteoLocation;
  setLocation: (location: OpenMeteoLocation) => void;
};

const DEFAULT_LOCATION: OpenMeteoLocation = {
  id: 1277333,
  name: "Bengaluru",
  country: "India",
  country_code: "IN",
  admin1: "Karnataka",
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: "Asia/Kolkata",
};

const LOCATION_STORAGE_KEY = "airscope-selected-location";

const LocationContext = createContext<LocationContextValue | null>(null);

/*
 * Make sure data restored from localStorage actually
 * looks like an OpenMeteoLocation before using it.
 */
function isValidLocation(value: unknown): value is OpenMeteoLocation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const location = value as Partial<OpenMeteoLocation>;

  return (
    typeof location.id === "number" &&
    typeof location.name === "string" &&
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  );
}

/*
 * Restore the previously selected location.
 *
 * We safely fall back to Bengaluru when:
 * - nothing has been saved yet
 * - saved data is malformed
 * - localStorage is unavailable
 */
function getInitialLocation(): OpenMeteoLocation {
  if (typeof window === "undefined") {
    return DEFAULT_LOCATION;
  }

  try {
    const stored = window.localStorage.getItem(LOCATION_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_LOCATION;
    }

    const parsed = JSON.parse(stored);

    if (isValidLocation(parsed)) {
      return parsed;
    }

    window.localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch (error) {
    console.error("AirScope: failed to restore selected location.", error);
  }

  return DEFAULT_LOCATION;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] =
    useState<OpenMeteoLocation>(getInitialLocation);

  /*
   * Update React state and persist the same location
   * so it survives page refreshes.
   */
  const setLocation = useCallback((nextLocation: OpenMeteoLocation) => {
    setLocationState(nextLocation);

    try {
      window.localStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify(nextLocation),
      );
    } catch (error) {
      console.error("AirScope: failed to save selected location.", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      location,
      setLocation,
    }),
    [location, setLocation],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }

  return context;
}
