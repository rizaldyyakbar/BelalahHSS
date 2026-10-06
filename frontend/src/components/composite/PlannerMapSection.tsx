import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Destination } from '../../constants/destinations';

interface PlannerMapSectionProps {
  itinerary: Destination[];
  startPoint: { lat: number; lng: number; name?: string };
}

type MapMode = 'topografi' | 'satelit' | 'jalur-riam';

export const PlannerMapSection: React.FC<PlannerMapSectionProps> = ({
  itinerary,
  startPoint,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('topografi');

  // Tile layer URLs
  const getTileUrl = (mode: MapMode) => {
    switch (mode) {
      case 'satelit':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topografi':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'jalur-riam':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [startPoint.lat || -2.7758, startPoint.lng || 115.2635],
        zoom: 11,
        zoomControl: true,
      });

      const tileLayer = L.tileLayer(getTileUrl(mapMode), {
        attribution: '&copy; OpenStreetMap &amp; Meratus GIS',
        maxZoom: 18,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;

      (map as any)._customTileLayer = tileLayer;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if ((map as any)._customTileLayer) {
      map.removeLayer((map as any)._customTileLayer);
    }
    const newTile = L.tileLayer(getTileUrl(mapMode), {
      attribution: '&copy; Meratus Topography Engine',
      maxZoom: 18,
    }).addTo(map);
    (map as any)._customTileLayer = newTile;
  }, [mapMode]);

  // Update markers & polylines when itinerary or startPoint changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const coordinates: [number, number][] = [];

    // 1. Add Start point marker (Basecamp Kandangan)
    const startLat = typeof startPoint.lat === 'string' ? parseFloat(startPoint.lat) : (startPoint.lat || -2.7758);
    const startLng = typeof startPoint.lng === 'string' ? parseFloat(startPoint.lng) : (startPoint.lng || 115.2635);
    const startCoord: [number, number] = [startLat, startLng];
    coordinates.push(startCoord);

    const startMarker = L.marker(startCoord, {
      icon: L.divIcon({
        className: 'custom-map-pin start',
        html: `<div style="background:#C26B3C;color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:13px;box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid #fff;">🚩</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    }).bindPopup(`
      <div style="font-family: inherit; font-size: 13px; min-width: 170px;">
        <div style="font-size: 10.5px; font-weight: 700; color: #C26B3C; text-transform: uppercase; margin-bottom: 2px;">Titik Awal (Basecamp)</div>
        <div style="font-weight: 800; color: #012D1D; font-size: 14px; margin-bottom: 4px;">${startPoint.name || 'Alun-Alun Antaludin Kandangan'}</div>
        <div style="color: #666; font-size: 11.5px;">KM 0.0 • Pusat Keberangkatan Rute</div>
      </div>
    `);
    layerGroup.addLayer(startMarker);

    // 2. Add Stop markers with sequence numbers
    itinerary.forEach((dest, index) => {
      const rawLat = typeof dest.latitude === 'string' ? parseFloat(dest.latitude) : dest.latitude;
      const rawLng = typeof dest.longitude === 'string' ? parseFloat(dest.longitude) : dest.longitude;
      const validLat = rawLat && !isNaN(rawLat) ? rawLat : -2.77 - index * 0.02;
      const validLng = rawLng && !isNaN(rawLng) ? rawLng : 115.31 + index * 0.02;
      const coord: [number, number] = [validLat, validLng];
      coordinates.push(coord);

      const stopMarker = L.marker(coord, {
        icon: L.divIcon({
          className: `custom-map-pin stop-${index + 1}`,
          html: `<div style="background:#012D1D;color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:13px;box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid #fff;">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).bindPopup(`
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size: 10.5px; font-weight: 700; background: #012D1D; color: #fff; padding: 2px 7px; border-radius: 4px;">STOP #${index + 1}</span>
            <span style="font-size: 11px; color: #777;">${dest.category || 'Wisata'}</span>
          </div>
          <div style="font-weight: 800; color: #012D1D; font-size: 14px; margin-bottom: 4px;">${dest.name}</div>
          <div style="color: #666; font-size: 11.5px; margin-bottom: 6px;">${dest.location || 'Hulu Sungai Selatan'}</div>
          ${dest.distance ? `<div style="font-size: 11px; color: #C26B3C; font-weight: 600;">📍 ${dest.distance}</div>` : ''}
        </div>
      `);

      layerGroup.addLayer(stopMarker);
    });

    // 3. Connect path with Dual-layered Polyline (Outer halo + inner directional line)
    if (coordinates.length > 1) {
      // Background halo line for contrast
      const haloLine = L.polyline(coordinates, {
        color: '#ffffff',
        weight: 6,
        opacity: 0.9,
      });
      layerGroup.addLayer(haloLine);

      // Main route polyline
      const mainPolyline = L.polyline(coordinates, {
        color: '#012D1D',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '8, 6',
      });
      layerGroup.addLayer(mainPolyline);

      mapInstanceRef.current.fitBounds(L.latLngBounds(coordinates), {
        padding: [50, 50],
      });
    }

    // Ensure map tiles re-render properly on layout adjustments
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  }, [itinerary, startPoint]);

  return (
    <div className="planner-map-container">
      {/* Switcher Mode */}
      <div className="map-view-switcher">
        <button
          className={`map-switcher-btn ${mapMode === 'topografi' ? 'active' : ''}`}
          onClick={() => setMapMode('topografi')}
        >
          Topografi Meratus
        </button>

        <button
          className={`map-switcher-btn ${mapMode === 'satelit' ? 'active' : ''}`}
          onClick={() => setMapMode('satelit')}
        >
          Satelit
        </button>

        <button
          className={`map-switcher-btn ${mapMode === 'jalur-riam' ? 'active' : ''}`}
          onClick={() => setMapMode('jalur-riam')}
        >
          Jalur Riam
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="planner-leaflet-wrapper" />
    </div>
  );
};

export default PlannerMapSection;
