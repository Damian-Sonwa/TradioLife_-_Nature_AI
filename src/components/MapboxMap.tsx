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

    // Add new markers for each report with enhanced styling
    reports.forEach((report) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#ef4444" opacity="0.3"/>
          <circle cx="20" cy="20" r="12" fill="#ef4444" opacity="0.7"/>
          <path d="M20 8 L26 16 L20 14 L14 16 Z" fill="white"/>
          <circle cx="20" cy="20" r="6" fill="#dc2626"/>
        </svg>
      `;
      el.style.cursor = 'pointer';
      el.style.width = '40px';
      el.style.height = '40px';
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.transition = 'transform 0.2s ease';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '300px'
      }).setHTML(
        `
          <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3 style="font-weight: 600; margin: 0; color: #1a1a1a; font-size: 16px;">${report.species.name}</h3>
            </div>
            <div style="background: #fef2f2; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
              <p style="font-size: 11px; color: #991b1b; margin: 0; text-transform: uppercase; font-weight: 600;">
                ⚠️ Invasive Species Alert
              </p>
            </div>
            <p style="font-size: 13px; color: #666; margin: 0 0 6px 0; display: flex; align-items: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${new Date(report.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
            ${report.notes ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #4b5563; margin: 0; line-height: 1.4;">
                  ${report.notes}
                </p>
              </div>
            ` : ''}
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
