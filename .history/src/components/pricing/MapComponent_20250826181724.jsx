import { useEffect, useRef } from 'react';

const MapComponent = ({ pickupLocation, dropoffLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    // Load Leaflet only on client side
    const loadMap = async () => {
      const L = await import('leaflet');
      require('leaflet/dist/leaflet.css');

      // Fix for default markers in Leaflet with Webpack
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13); // NYC coordinates
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);
      }

      return L;
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMap = async () => {
      const L = await import('leaflet');
      
      // Clear previous markers and route
      markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
      markersRef.current = [];
      
      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }

      // Geocode and add markers for pickup and dropoff locations
      if (pickupLocation) {
        // In a real app, you would use a geocoding service here
        // For demo, we'll use a mock function
        const mockGeocode = async (address) => {
          // This would be replaced with actual geocoding API call
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

        // Draw route between points (in real app, use routing service)
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
    };

    updateMap();
  }, [pickupLocation, dropoffLocation]);

  return <div ref={mapRef} className="w-full h-96 rounded-lg" />;
};

export default MapComponent;