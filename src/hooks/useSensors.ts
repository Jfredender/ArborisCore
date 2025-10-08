// src/hooks/useSensors.ts
import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export const useSensors = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [illumination, setIllumination] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- Geolocalização ---
    const geoWatcher = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
        });
      },
      (err) => {
        console.warn(`GEO ERROR(${err.code}): ${err.message}`);
        setError("Geolocalização indisponível.");
      },
      { enableHighAccuracy: true }
    );

    // --- Sensor de Luz Ambiente ---
    try {
      if ('AmbientLightSensor' in window) {
        const sensor = new (window as any).AmbientLightSensor({ frequency: 1 });
        sensor.onreading = () => setIllumination(sensor.illuminance);
        sensor.onerror = (event: any) => console.error(event.error.name, event.error.message);
        sensor.start();
      }
    } catch (err) {
      console.warn("Sensor de luz ambiente não suportado.");
    }
    
    // --- Função de Limpeza ---
    return () => {
      navigator.geolocation.clearWatch(geoWatcher);
    };
  }, []);

  return { location, illumination, error };
};