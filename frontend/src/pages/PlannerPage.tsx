import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icon } from '../components/atomic/Icons';
import { DESTINATIONS, Destination } from '../constants/destinations';
import { fetchRecommendations, optimizeRoute } from '../services/api';
import { PlannerMapSection } from '../components/composite/PlannerMapSection';
import { PlannerStickyExportBar } from '../components/composite/PlannerStickyExportBar';

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();

  // Mode on mobile: 'itinerary' | 'map' | 'field'
  // Mode on desktop sidebar: 'map' | 'field'
  const [plannerMode, setPlannerMode] = useState<'itinerary' | 'map' | 'field'>('itinerary');
  const [desktopSidebarTab, setDesktopSidebarTab] = useState<'map' | 'field'>('map');

  const [startPoint] = useState({
    lat: -2.7758,
    lng: 115.2635,
    name: 'Basecamp Kota Kandangan',
  });

  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<Destination[]>(DESTINATIONS);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const hasAutoOptimized = useRef(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      const res = await fetchRecommendations({ lat: -2.7758, lng: 115.2635, limit: 50 });
      const allDests = res.destinations.length > 0 ? res.destinations : DESTINATIONS;
      if (!isMounted) return;
      setAvailableDestinations(allDests);

      // Check localStorage or fallback to Malutu, Rafting, Haratai (matching authentic corridor)
      const saved = localStorage.getItem('belalah_itinerary');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Destination[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItinerary(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Default matching Loksado Corridor (Malutu, Rafting, Haratai)
      const malutu = allDests.find((d) => d.name.toLowerCase().includes('malutu')) || allDests[7];
      const rafting = allDests.find((d) => d.name.toLowerCase().includes('bamboo')) || allDests[1];
      const haratai = allDests.find((d) => d.name.toLowerCase().includes('haratai')) || allDests[0];
      setItinerary([malutu, rafting, haratai].filter(Boolean) as Destination[]);
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveItinerary = (updated: Destination[]) => {
    setItinerary(updated);
    localStorage.setItem('belalah_itinerary', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveDestination = (id: number) => {
    const updated = itinerary.filter((d) => d.id !== id);
    saveItinerary(updated);
    showToast('Destinasi dihapus dari rute.');
  };

  const handleOpenGoogleMaps = () => {
    if (itinerary.length === 0) return;
    const origin = `${startPoint.lat},${startPoint.lng}`;
    const last = itinerary[itinerary.length - 1];
    if (!last) return;

    const formatPoint = (dest: Destination) => {
      const lat = typeof dest.latitude === 'string' ? parseFloat(dest.latitude) : dest.latitude;
      const lng = typeof dest.longitude === 'string' ? parseFloat(dest.longitude) : dest.longitude;
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        return `${lat},${lng}`;
      }
      return encodeURIComponent(`${dest.name}, Hulu Sungai Selatan`);
    };

    const destination = formatPoint(last);
    const waypoints = itinerary
      .slice(0, -1)
      .map(formatPoint)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRecalculateRoute = async () => {
    if (itinerary.length === 0 || isRecalculating) return;

    setIsRecalculating(true);

    try {
      const result = await optimizeRoute(
        startPoint.lat,
        startPoint.lng,
        itinerary.map((destination) => destination.id),
      );
      const destinationsById = new Map(itinerary.map((destination) => [destination.id, destination]));
      const optimizedItinerary = result.route
        .map((routeItem) => destinationsById.get(routeItem.id))
        .filter((destination): destination is Destination => Boolean(destination));

      if (optimizedItinerary.length !== itinerary.length) {
        throw new Error('Hasil optimasi tidak lengkap.');
      }

      saveItinerary(optimizedItinerary);
      showToast('Rute berhasil dioptimalkan dengan Dijkstra');
    } catch {
      showToast('Kalkulasi rute gagal dioptimalkan');
    } finally {
      setIsRecalculating(false);
    }
  };
  useEffect(() => {
    if (itinerary.length === 0) return;
    if (hasAutoOptimized.current) return;

    hasAutoOptimized.current = true; // Prevent infinite loop
    handleRecalculateRoute(); // Auto-optimize on first load if itinerary exists
  }, [itinerary]);

  const handleDownloadRoute = () => {
    if (itinerary.length === 0) {
      showToast('Belum ada destinasi dalam rute untuk diunduh.');
      return;
    }

    const gpxPoints = [
      `    <wpt lat="${startPoint.lat}" lon="${startPoint.lng}">\n      <name>${startPoint.name}</name>\n      <desc>Titik Awal (Basecamp Kandangan)</desc>\n    </wpt>`,
      ...itinerary.map((dest, idx) => {
        const lat = typeof dest.latitude === 'string' ? parseFloat(dest.latitude) : (dest.latitude || -2.77);
        const lng = typeof dest.longitude === 'string' ? parseFloat(dest.longitude) : (dest.longitude || 115.31);
        return `    <wpt lat="${lat}" lon="${lng}">\n      <name>Stop #${idx + 1}: ${dest.name}</name>\n      <desc>${dest.location || dest.category || 'Wisata HSS'}</desc>\n    </wpt>`;
      }),
    ].join('\n');

    const routeTrack = [
      `      <rtept lat="${startPoint.lat}" lon="${startPoint.lng}"><name>${startPoint.name}</name></rtept>`,
      ...itinerary.map((dest, idx) => {
        const lat = typeof dest.latitude === 'string' ? parseFloat(dest.latitude) : (dest.latitude || -2.77);
        const lng = typeof dest.longitude === 'string' ? parseFloat(dest.longitude) : (dest.longitude || 115.31);
        return `      <rtept lat="${lat}" lon="${lng}"><name>Stop #${idx + 1}: ${dest.name}</name></rtept>`;
      }),
    ].join('\n');

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Belalah HSS Route Planner" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Rute Wisata Belalah HSS (${itinerary.length} Destinasi)</name>
    <desc>Rute terpadu wisata Hulu Sungai Selatan hasil optimasi Dijkstra</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
${gpxPoints}
  <rte>
    <name>Rute Terpadu Belalah HSS</name>
${routeTrack}
  </rte>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rute-belalah-hss-${Date.now()}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('File GPS (.GPX) berhasil diunduh!');
  };

  const handleInsertCorridorDestination = (destName: string) => {
    const matched = availableDestinations.find((d) => d.name.toLowerCase().includes(destName.toLowerCase()));
    if (matched && !itinerary.some((d) => d.id === matched.id)) {
      const updated = [...itinerary, matched];
      saveItinerary(updated);
      showToast(`${matched.name} berhasil disisipkan ke koridor rute!`);
    } else {
      showToast(`${destName} sudah ada dalam rute Anda.`);
    }
  };

  const handleResetItinerary = () => {
    const malutu = availableDestinations.find((d) => d.name.toLowerCase().includes('malutu')) || availableDestinations[7];
    const rafting = availableDestinations.find((d) => d.name.toLowerCase().includes('bamboo')) || availableDestinations[1];
    const haratai = availableDestinations.find((d) => d.name.toLowerCase().includes('haratai')) || availableDestinations[0];
    const def = [malutu, rafting, haratai].filter(Boolean) as Destination[];
    saveItinerary(def);
    showToast('Rute dikembalikan ke koridor standar Loksado.');
  };

  // Distance / metric calculations
  const totalKm = (itinerary.length * 15.8 + 8.4).toFixed(1);
  const totalDrivingHours = Math.floor((itinerary.length * 40 + 20) / 60);
  const totalDrivingMins = (itinerary.length * 40 + 20) % 60;
  const totalTourHours = Math.floor((itinerary.length * 110 + 60) / 60);
  const totalTourMins = (itinerary.length * 110 + 60) % 60;

  // Fallback image helper
  const getDestImg = (dest: Destination) => {
    const n = dest.name.toLowerCase();
    if (n.includes('haratai') || n.includes('air')) return '/assets/Air-Terjun-Haratai.jpg';
    if (n.includes('malutu') || n.includes('bendungan')) return '/assets/malutu.jpg';
    if (n.includes('tanuhi') || n.includes('panas')) return '/assets/tanuhi.jpg';
    if (n.includes('langara') || n.includes('bukit')) return '/assets/langara.jpg';
    if (n.includes('museum') || n.includes('budaya') || n.includes('malaris')) return '/assets/museum-rakyat.jpg';
    return '/assets/balanting-paring.jpg';
  };

  // Timeline UI renderer
  const renderTimelineStops = () => (
    <div>
      {/* Node 0: Basecamp Kota Kandangan */}
      <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#012D1D',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              fontSize: 14,
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(1, 45, 29, 0.3)',
            }}
          >
            🚩
          </div>
          <div style={{ width: 2, flex: 1, minHeight: 40, background: '#D2E3D8' }} />
        </div>

        <div style={{ flex: 1, background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 16, padding: '14px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#994700', textTransform: 'uppercase' }}>
              TITIK KEBERANGKATAN
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6E7972' }}>Km 0.0</span>
          </div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700, color: '#012D1D', margin: '0 0 4px' }}>
            Basecamp Kota Kandangan
          </h3>
          <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 8px' }}>
            Pusat kota, persiapan perbekalan kuliner Ketupat &amp; pengecekan kendaraan.
          </p>
          <div style={{ fontSize: 11.5, color: '#012D1D', fontWeight: 600 }}>
            🕒 Mulai Ekspedisi: 07:30 WITA
          </div>
        </div>
      </div>

      {/* Dynamic Itinerary Stops */}
      {itinerary.map((dest, idx) => {
        const stepNum = String(idx + 1).padStart(2, '0');
        const isLast = idx === itinerary.length - 1;
        const distFromPrev = `${(14 + idx * 7.5).toFixed(1)} km`;
        const timeFromPrev = `${25 + idx * 10} mnt`;

        return (
          <div key={dest.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 2, height: 20, background: '#D2E3D8' }} />
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: idx === 1 ? '#FD934C' : '#012D1D',
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  zIndex: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {stepNum}
              </div>
              {!isLast && <div style={{ width: 2, flex: 1, minHeight: 40, background: '#D2E3D8' }} />}
            </div>

            <div style={{ flex: 1, paddingBottom: 16 }}>
              <div
                style={{
                  background: '#EDF5F0',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#012D1D',
                  display: 'inline-block',
                  marginBottom: 8,
                }}
              >
                ▲ {distFromPrev} • {timeFromPrev} berkendara
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ position: 'relative', width: '100%', height: 130, overflow: 'hidden' }}>
                  <img
                    src={getDestImg(dest)}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/balanting-paring.jpg';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 12,
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 6,
                    }}
                  >
                    Perhentian {idx + 1}
                  </div>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6E7972', marginBottom: 4 }}>
                    <span>{dest.location || 'Loksado, Meratus'}</span>
                    <span>Durasi: {dest.hours || '1.5–2 Jam'}</span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700, color: '#012D1D', margin: '0 0 6px' }}>
                    {dest.name}
                  </h4>

                  <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 12px', lineHeight: 1.45 }}>
                    {dest.description || 'Destinasi wisata alam dan budaya unggulan di koridor Loksado Meratus.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F0F4F1' }}>
                    <button
                      onClick={() => navigate(`/destination/${dest.id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FD934C',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Detail Stop ➔
                    </button>

                    <button
                      onClick={() => handleRemoveDestination(dest.id)}
                      style={{
                        background: '#FFF0F0',
                        border: '1px solid #FFE0E0',
                        color: '#C23C3C',
                        fontWeight: 600,
                        fontSize: 11.5,
                        borderRadius: 8,
                        padding: '4px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Button to add more destinations */}
      <div style={{ display: 'flex', gap: 10, marginTop: 10, marginBottom: 28 }}>
        <button
          onClick={() => navigate('/directory')}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: '2px dashed #C1DBC9',
            background: '#F6FBF5',
            color: 'var(--meratus-deep)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.15s ease',
          }}
        >
          <span>+</span>
          <span>Tambah Destinasi dari Katalog</span>
        </button>

        <button
          onClick={handleResetItinerary}
          style={{
            height: 44,
            padding: '0 16px',
            borderRadius: 12,
            border: '1px solid #E2EAE4',
            background: '#ffffff',
            color: '#57534E',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Reset ke rute standar"
        >
          Reset
        </button>
      </div>

      {/* Haversine Suggestions Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#FD934C', letterSpacing: '0.05em' }}>
            ⇲ ALGORITMA HAVERSINE
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#012D1D', margin: '0 0 4px' }}>
          Saran Singgah Terdekat Sepanjang Jalur
        </h3>
        <p style={{ fontSize: 12, color: '#6E7972', margin: '0 0 14px' }}>
          Deviasi jarak kurang dari 2.5 km dari koridor rute aktif Anda
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/assets/langara.jpg" alt="Bukit Langara" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#012D1D' }}>Bukit Langara</div>
                <div style={{ fontSize: 11.5, color: '#FD934C', fontWeight: 600 }}>+1.2 km deviasi • Panorama Karst</div>
              </div>
            </div>
            <button
              onClick={() => handleInsertCorridorDestination('Bukit Langara')}
              style={{ background: '#EDF5F0', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#012D1D', cursor: 'pointer' }}
            >
              + Sisipkan
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/assets/museum-rakyat.jpg" alt="Balai Adat Malaris" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#012D1D' }}>Balai Adat Malaris</div>
                <div style={{ fontSize: 11.5, color: '#FD934C', fontWeight: 600 }}>+0.8 km deviasi • Adat Dayak Meratus</div>
              </div>
            </div>
            <button
              onClick={() => handleInsertCorridorDestination('Balai Adat Malaris')}
              style={{ background: '#EDF5F0', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#012D1D', cursor: 'pointer' }}
            >
              + Sisipkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Field Mode Content renderer
  const renderFieldModeContent = () => (
    <div>
      {/* Field Status & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div
          style={{
            background: '#FFF3EB',
            color: '#994700',
            fontSize: 10.5,
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: 9999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FD934C' }} />
          <span>MODE LAPANGAN SIAGA</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#6E7972' }}>
          Ref #HSS-2025-08A
        </span>
      </div>

      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: 'var(--meratus-deep)', margin: '0 0 6px' }}>
        Panduan Navigasi Lapangan &amp; Kontak Darurat
      </h3>
      <p style={{ fontSize: 12.5, color: '#57534E', margin: '0 0 16px', lineHeight: 1.45 }}>
        Instruksi manuver jalur, kondisi sinyal seluler, batas aman kunjungan, dan kontak tapak resmi di pedalaman Meratus.
      </p>

      {/* Maneuver Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#994700' }}>TITIK AWAL EKSPEDISI</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#012D1D' }}>07:30 WITA</span>
          </div>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#012D1D', margin: '0 0 4px' }}>
            Alun-Alun Kota Kandangan
          </h4>
          <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 8px', lineHeight: 1.45 }}>
            Titik kumpul resmi di sekeliling Lapangan Lambung Mangkurat. Pastikan tangki bensin terisi penuh di SPBU Gambah Luar sebelum memasuki jalan pedalaman Loksado.
          </p>
          <div style={{ background: '#F6FBF5', border: '1px dashed #C1DBC9', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#012D1D', fontWeight: 600 }}>
            🧭 Arahkan kendaraan ke Jl. Jenderal Sudirman ➔ Jl. Loksado
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#994700' }}>PUSAT INFORMASI LOKSADO</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#012D1D' }}>Km 34.2</span>
          </div>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#012D1D', margin: '0 0 4px' }}>
            Posko Pelaksawis &amp; Balai Adat Malaris
          </h4>
          <p style={{ fontSize: 12, color: '#57534E', margin: '0 0 8px', lineHeight: 1.45 }}>
            Parkirkan kendaraan di kantong parkir resmi persis di seberang Balai Adat Malaris. Lapor ke loket posko resmi untuk registrasi rompi pelampung rakit.
          </p>
          <div style={{ background: '#FFF3EB', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#994700' }}>
            📞 Posko Pelaksawis Loksado: (0517) 211xx / 0812-34xx-xxxx
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#C23C3C' }}>BATAS AMAN KUNJUNGAN</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C23C3C' }}>Maks 15:30 WITA</span>
          </div>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: '#012D1D', margin: '0 0 4px' }}>
            Air Terjun Haratai (Batas Akhir Turun)
          </h4>
          <div style={{ background: '#FFF0F0', border: '1px solid #FFE0E0', borderRadius: 8, padding: '8px 10px', fontSize: 11.5, color: '#C23C3C' }}>
            ⚠️ <strong>Perhatian:</strong> Pukul 15:30 WITA wajib bertolak turun menuju Loksado untuk menghindari kabut tebal dan minimnya penerangan jalan perbukitan.
          </div>
        </div>
      </div>

      {/* Emergency Contacts Card */}
      <div style={{ background: '#F8FAF8', border: '1px solid #E2EAE4', borderRadius: 14, padding: '14px', marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, fontWeight: 800, color: '#012D1D', margin: '0 0 8px' }}>
          📞 Kontak Layanan Siaga HSS
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, color: '#57534E' }}>
          <div>🏥 RSUD Brigjend H. Hasan Basry Kandangan: <strong>(0517) 21118</strong></div>
          <div>🚒 Posko BPBD &amp; SAR HSS: <strong>(0517) 21299</strong></div>
          <div>👮 Polsek Loksado: <strong>(0517) 21110</strong></div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--meratus-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#012D1D',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 1100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {notification}
        </div>
      )}

      <main style={{ flex: 1, paddingBottom: 80 }}>
        {/* Mobile Tabs Switcher (Visible ONLY on screens <=960px) */}
        <section className="bh-container mobile-only" style={{ paddingTop: 96, paddingBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              background: '#EAEFEA',
              borderRadius: 12,
              padding: 4,
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => setPlannerMode('itinerary')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 9,
                border: 'none',
                background: plannerMode === 'itinerary' ? '#012D1D' : 'transparent',
                color: plannerMode === 'itinerary' ? '#ffffff' : '#57534E',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Rencana
            </button>
            <button
              onClick={() => setPlannerMode('map')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 9,
                border: 'none',
                background: plannerMode === 'map' ? '#012D1D' : 'transparent',
                color: plannerMode === 'map' ? '#ffffff' : '#57534E',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Peta Jalur
            </button>
            <button
              onClick={() => setPlannerMode('field')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 9,
                border: 'none',
                background: plannerMode === 'field' ? '#012D1D' : 'transparent',
                color: plannerMode === 'field' ? '#ffffff' : '#57534E',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Siaga Lapangan
            </button>
          </div>
        </section>

        {/* ========================================================
            DESKTOP 2-COLUMN WORKSPACE GRID (>960px)
            AND MOBILE CONTAINER (<=960px)
            ======================================================== */}
        <section className="planner-workspace-grid" style={{ marginTop: 96 }}>
          {/* LEFT COLUMN: ITINERARY TIMELINE & METRICS */}
          <div style={{ display: plannerMode === 'itinerary' ? 'block' : undefined }}>
            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FFF3EB',
                  border: '1px solid #FFE0CE',
                  borderRadius: 9999,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#994700',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FD934C' }} />
                <span>DRAFT ITINERARI AKTIF</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => showToast('Rute tersimpan di perangkat.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#ffffff',
                    border: '1px solid #E2EAE4',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#012D1D',
                    cursor: 'pointer',
                  }}
                >
                  <span>🔖</span>
                  <span>Simpan</span>
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(24px, 3.5vw, 34px)',
                fontWeight: 800,
                color: 'var(--meratus-deep)',
                margin: '0 0 4px',
                letterSpacing: '-0.02em',
              }}
            >
              Rute Ekspedisi Meratus
            </h1>
            <p style={{ fontSize: 13, color: '#6E7972', margin: '0 0 20px' }}>
              {itinerary.length} Destinasi Terpilih • Koridor Loksado Hulu Sungai Selatan
            </p>

            {/* 3 Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginBottom: 20,
              }}
            >
              {/* Metric 1: Total Jarak */}
              <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px 12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: '#6E7972', fontWeight: 600, marginBottom: 2 }}>Total Jarak</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#012D1D', lineHeight: 1.1 }}>
                  {totalKm} <span style={{ fontSize: 12, fontWeight: 600 }}>km</span>
                </div>
                <div style={{ fontSize: 10, color: '#9E9E9E', marginTop: 4 }}>Kandangan ➔ Haratai</div>
              </div>

              {/* Metric 2: Durasi Melaju */}
              <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px 12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: '#6E7972', fontWeight: 600, marginBottom: 2 }}>Durasi Melaju</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#012D1D', lineHeight: 1.1 }}>
                  {totalDrivingHours}j {totalDrivingMins}m
                </div>
                <div style={{ fontSize: 10, color: '#9E9E9E', marginTop: 4 }}>Jalan Perbukitan</div>
              </div>

              {/* Metric 3: Total Ekspedisi */}
              <div style={{ background: '#ffffff', border: '1px solid #EBEFEA', borderRadius: 14, padding: '14px 12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: '#6E7972', fontWeight: 600, marginBottom: 2 }}>Total Ekspedisi</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#012D1D', lineHeight: 1.1 }}>
                  {totalTourHours}j {totalTourMins}m
                </div>
                <div style={{ fontSize: 10, color: '#9E9E9E', marginTop: 4 }}>Termasuk Singgah</div>
              </div>
            </div>

            {/* Corridor Map Strip */}
            <div
              style={{
                background: 'linear-gradient(135deg, #E2F0E8 0%, #D5E8DD 100%)',
                border: '1px solid #C1DBC9',
                borderRadius: 16,
                padding: '12px 16px',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    background: '#ffffff',
                    color: '#012D1D',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  📍 Urutan Rute: Kandangan ➔ Loksado
                </span>
                <span style={{ fontSize: 11.5, color: '#012D1D', fontWeight: 600 }}>
                  Optimalisasi Jalur Singkat
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#012D1D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 4,
                }}
              >
                <span>● Kandangan</span>
                {itinerary.map((d) => (
                  <React.Fragment key={d.id}>
                    <span>➔</span>
                    <span>● {d.name.split(' ')[0]}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Road Alert Card */}
            <div
              style={{
                background: '#FFF3EB',
                border: '1px solid #FFE0CE',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 18 }}>ⓘ</span>
              <div>
                <h4 style={{ fontSize: 12.5, fontWeight: 800, color: '#994700', margin: '0 0 2px' }}>
                  Peringatan Akses Loksado &amp; Haratai
                </h4>
                <p style={{ fontSize: 11.5, color: '#73401D', margin: 0, lineHeight: 1.45 }}>
                  Jalur Muara Hatip menuju Haratai curam &amp; licin pasca hujan. Disarankan kendaraan roda dua prima atau menggunakan jasa ojek warga setempat.
                </p>
              </div>
            </div>

            {/* Render Timeline Stops */}
            {renderTimelineStops()}
          </div>

          {/* RIGHT COLUMN: STICKY MAP & OPS COMMAND (On desktop >960px) OR MOBILE TAB VIEWS */}
          <div className="desktop-only" style={{ position: 'sticky', top: 80 }}>
            {/* Desktop Tabs: Toggle between Map & Field ops */}
            <div
              style={{
                display: 'flex',
                background: '#EAEFEA',
                borderRadius: 12,
                padding: 4,
                marginBottom: 16,
              }}
            >
              <button
                onClick={() => setDesktopSidebarTab('map')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: 9,
                  border: 'none',
                  background: desktopSidebarTab === 'map' ? '#012D1D' : 'transparent',
                  color: desktopSidebarTab === 'map' ? '#ffffff' : '#57534E',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🗺️ Peta Jalur &amp; Topografi
              </button>
              <button
                onClick={() => setDesktopSidebarTab('field')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: 9,
                  border: 'none',
                  background: desktopSidebarTab === 'field' ? '#012D1D' : 'transparent',
                  color: desktopSidebarTab === 'field' ? '#ffffff' : '#57534E',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🚨 Panduan Siaga Lapangan
              </button>
            </div>

            {desktopSidebarTab === 'map' ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #EBEFEA',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ height: 320 }}>
                  <PlannerMapSection itinerary={itinerary} startPoint={startPoint} />
                </div>

                <div style={{ marginTop : '40px', padding: '16px 20px', background: '#FAFDFB', borderTop: '1px solid #EBEFEA' }}>
                  <div style={{ fontSize: 12, color: '#57534E', textAlign: 'center' }}>
                    Peta menampilkan elevasi kontur perbukitan Meratus dan penanda titik henti secara presisi.
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #EBEFEA',
                  borderRadius: 18,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                  maxHeight: '75vh',
                  overflowY: 'auto',
                }}
              >
                {renderFieldModeContent()}
              </div>
            )}
          </div>

          {/* MOBILE ONLY: Map Tab View when active */}
          {plannerMode === 'map' && (
            <div className="mobile-only" style={{ width: '100%' }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #EBEFEA',
                  borderRadius: 18,
                  overflow: 'hidden',
                  marginBottom: 20,
                }}
              >
                <div style={{ height: 380 }}>
                  <PlannerMapSection itinerary={itinerary} startPoint={startPoint} />
                </div>
                <div style={{ padding: 14 }}>
                  <button
                    onClick={handleOpenGoogleMaps}
                    style={{
                      width: '100%',
                      height: 44,
                      background: '#012D1D',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Icon.Compass size={16} style={{ color: '#C1ECD4' }} />
                    <span>Buka Rute di Google Maps</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE ONLY: Field Tab View when active */}
          {plannerMode === 'field' && (
            <div className="mobile-only" style={{ width: '100%' }}>
              {renderFieldModeContent()}
            </div>
          )}
        </section>
      </main>

      <PlannerStickyExportBar
        destinationsCount={itinerary.length}
        totalDistanceKm={Number(totalKm)}
        totalTripMinutes={totalTourHours * 60 + totalTourMins}
        onRecalculate={handleRecalculateRoute}
        onDownload={handleDownloadRoute}
        onOpenGoogleMaps={handleOpenGoogleMaps}
        isRecalculating={isRecalculating}
      />

      {/* Floating Bottom Bar with Google Maps CTA (Mobile Only) */}
      <div
        className="mobile-only"
        style={{
          position: 'fixed',
          bottom: 70, // above 62px mobile bottom nav
          left: 0,
          right: 0,
          zIndex: 900,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            background: '#ffffff',
            borderRadius: 18,
            padding: '10px 14px',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.16)',
            border: '1px solid rgba(193, 200, 194, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            pointerEvents: 'auto',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#012D1D' }}>
              ● {itinerary.length} Destinasi Terpilih
            </div>
            <div style={{ fontSize: 11, color: '#6E7972' }}>
              {totalKm} km • ~{totalTourHours}j {totalTourMins}m
            </div>
          </div>

          <button
            onClick={handleOpenGoogleMaps}
            style={{
              background: '#012D1D',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(1, 45, 29, 0.25)',
            }}
          >
            <Icon.Compass size={14} style={{ color: '#C1ECD4' }} />
            <span>Google Maps</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlannerPage;
