import type { BuyerLocation } from '@/types/store';

export function requestBuyerLocation(): Promise<BuyerLocation> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      resolve({ status: 'error' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        resolve({
          status: 'granted',
          lat,
          lng,
          mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({ status: 'denied' });
          return;
        }

        resolve({ status: 'error' });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}
