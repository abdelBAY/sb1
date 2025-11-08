import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationMapProps {
  location: string;
  height?: string;
}

// Component to update map view when location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  return null;
}

export default function LocationMap({ location, height = '300px' }: LocationMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeLocation = async () => {
      if (!location) {
        setError('No location provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use proxy in development to avoid CORS issues, direct API in production
        const isDevelopment = import.meta.env.DEV;
        const apiUrl = isDevelopment
          ? `/api/nominatim/search?format=json&q=${encodeURIComponent(location)}&limit=1`
          : `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

        // Headers for Nominatim API (required for production)
        const headers: HeadersInit = isDevelopment
          ? {} // Proxy handles headers in development
          : {
              'User-Agent': 'Givea-Donation-App/1.0 (https://givea.app)',
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
            };

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
          throw new Error('Geocoding failed');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        } else {
          setError('Location not found');
        }
      } catch (err) {
        console.error('Error geocoding location:', err);
        // Provide more helpful error message
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError('Unable to connect to map service. Please check your connection.');
        } else {
          setError('Failed to load map. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    geocodeLocation();
  }, [location]);

  if (loading) {
    return (
      <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center space-y-2 text-center p-4">
          <MapPin className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{error || 'Unable to display map'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{location}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-lg" style={{ height }}>
      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{location}</p>
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={coordinates} />
      </MapContainer>
    </div>
  );
}

