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

    // 1. Add Start point marker (Alun-Alun Kandangan)
    const startCoord: [number, number] = [startPoint.lat || -2.7758, startPoint.lng || 115.2635];
    coordinates.push(startCoord);

    const startMarker = L.marker(startCoord, {
      icon: L.divIcon({
        className: 'custom-map-pin start',
        html: `<div style="background:#C26B3C;color:#fff;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:12px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid #fff;">🚩</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    }).bindPopup(`<b>Titik Awal:</b><br/>${startPoint.name || 'Alun-Alun Antaludin Kandangan'}`);
    layerGroup.addLayer(startMarker);

    // 2. Add Stop markers
    itinerary.forEach((dest, index) => {
      const lat = dest.latitude || -2.77 - index * 0.02;
      const lng = dest.longitude || 115.31 + index * 0.02;
      const coord: [number, number] = [lat, lng];
      coordinates.push(coord);

      const stopMarker = L.marker(coord, {
        icon: L.divIcon({
          className: `custom-map-pin stop-${index + 1}`,
          html: `<div style="background:#012D1D;color:#fff;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:13px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid #fff;">${index + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).bindPopup(`<b>Stop #${index + 1}: ${dest.name}</b><br/>${dest.location || dest.category}`);

      layerGroup.addLayer(stopMarker);
    });

    // 3. Connect path with Polyline
    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates, {
        color: '#012D1D',
        weight: 4,
        opacity: 0.85,
        dashArray: '6, 6',
      });
      layerGroup.addLayer(polyline);

      mapInstanceRef.current.fitBounds(L.latLngBounds(coordinates), {
        padding: [40, 40],
      });
    }
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

      {/* Field Notes & Weather Strip */}
      <div className="map-field-notes">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span>⚠️</span>
          <span>
            <strong>Kondisi Jalur Loksado:</strong> Beraspal &amp; berkelok lereng. Disarankan kendaraan roda 2 / MPV dengan rem prima.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⛅</span>
          <span>
            <strong>Cuaca:</strong> Cerah Berawan 27°C (Kawasan Pegunungan Meratus)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlannerMapSection;
