import { useEffect, useRef, useState } from 'react';
interface MapComponentProps {
  pickupLocation: string;
  dropoffLocation: string;
}
const MapComponent = ({ pickupLocation, dropoffLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers in Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mapInstanceRef.current && mapRef.current) {
          // Initialize map
          mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);
        }

        return L;
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !mapInstanceRef.current) return;

    const updateMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Clear previous markers and route
        markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
        markersRef.current = [];
        
        if (routeLayerRef.current) {
          mapInstanceRef.current.removeLayer(routeLayerRef.current);
        }

        // Geocode and add markers for pickup and dropoff locations
        if (pickupLocation) {
          const mockGeocode = async (address) => {
            // Mock geocoding - replace with actual API in production
            return { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 };
          };

          const pickupCoords = await mockGeocode(pickupLocation);
          const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`Pickup: ${pickupLocation}`);
          markersRef.current.push(pickupMarker);

          mapInstanceRef.current.setView([pickupCoords.lat, pickupCoords.lng], 13);
        }

        if (dropoffLocation) {
          const mockGeocode = async (address) => {
            return { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 };
          };

          const dropoffCoords = await mockGeocode(dropoffLocation);
          const dropoffMarker = L.marker([dropoffCoords.lat, dropoffCoords.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`Dropoff: ${dropoffLocation}`);
          markersRef.current.push(dropoffMarker);

          // Draw route between points
          if (pickupLocation) {
            const pickupCoords = await mockGeocode(pickupLocation);
            const polyline = L.polyline([
              [pickupCoords.lat, pickupCoords.lng],
              [dropoffCoords.lat, dropoffCoords.lng]
            ], { color: 'green' }).addTo(mapInstanceRef.current);
            routeLayerRef.current = polyline;

            // Adjust map view to show both points
            const bounds = L.latLngBounds([pickupCoords.lat, pickupCoords.lng], [dropoffCoords.lat, dropoffCoords.lng]);
            mapInstanceRef.current.fitBounds(bounds);
          }
        }
      } catch (error) {
        console.error('Failed to update map:', error);
      }
    };

    updateMap();
  }, [pickupLocation, dropoffLocation, isClient]);

  if (!isClient) {
    return <div className="w-full h-96 rounded-lg bg-gray-800 flex items-center justify-center">Loading map...</div>;
  }

  return <div ref={mapRef} className="w-full h-96 rounded-lg" />;
};

export default MapComponent;