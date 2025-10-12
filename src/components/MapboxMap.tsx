import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  notes: string;
  created_at: string;
  species: {
    name: string;
    plant_type: string;
  };
}

interface MapboxMapProps {
  reports: Report[];
  mapboxToken: string;
}

const MapboxMap = ({ reports, mapboxToken }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-98, 38.88], // Center of USA
      zoom: 3,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when reports change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each report
    reports.forEach((report) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px; color: #1a1a1a;">${report.species.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">
              ${new Date(report.created_at).toLocaleDateString()}
            </p>
            ${report.notes ? `<p style="font-size: 12px; color: #333;">${report.notes}</p>` : ''}
          </div>
        `
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are any
    if (reports.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      reports.forEach(report => {
        bounds.extend([report.longitude, report.latitude]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 10,
      });
    }
  }, [reports]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapboxMap;
