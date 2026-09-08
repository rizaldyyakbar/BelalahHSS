import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPoint {
  lat: number;
  lng: number;
}

interface MapPickerModalProps {
  initialPoint: MapPoint;
  onClose: () => void;
  onConfirm: (point: MapPoint) => void;
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ initialPoint, onClose, onConfirm }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState(initialPoint);

  useEffect(() => {
    if (!mapElement.current) return;

    const map = L.map(mapElement.current).setView([initialPoint.lat, initialPoint.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([initialPoint.lat, initialPoint.lng], {
      draggable: true,
      icon: L.divIcon({
        className: 'map-picker-marker',
        html: '<span></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    }).addTo(map);

    const updatePoint = (event: L.LeafletMouseEvent | L.LeafletEvent) => {
      const point = 'latlng' in event ? event.latlng : marker.getLatLng();
      setSelectedPoint({ lat: point.lat, lng: point.lng });
      marker.setLatLng(point);
    };

    map.on('click', updatePoint);
    marker.on('dragend', updatePoint);

    return () => {
      map.remove();
    };
  }, [initialPoint.lat, initialPoint.lng]);

  return createPortal((
    <div className="map-picker-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="map-picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-picker-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="map-picker-header">
          <div>
            <h2 id="map-picker-title">Pilih Titik Awal</h2>
            <p>Klik peta atau geser marker ke lokasi keberangkatan.</p>
          </div>
          <button type="button" className="map-picker-close" onClick={onClose} aria-label="Tutup peta">
            &times;
          </button>
        </div>

        <div ref={mapElement} className="map-picker-canvas" />

        <div className="map-picker-footer">
          <span>{selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}</span>
          <div>
            <button type="button" className="map-picker-cancel" onClick={onClose}>Batal</button>
            <button type="button" className="map-picker-confirm" onClick={() => onConfirm(selectedPoint)}>
              Gunakan titik ini
            </button>
          </div>
        </div>
      </section>
    </div>
  ), document.body);
};

export default MapPickerModal;
