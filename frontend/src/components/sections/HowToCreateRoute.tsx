import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../atomic/Button';
import { Icon } from '../atomic/Icons';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowToCreateRouteProps {
  steps?: Step[];
  onStartPlanning?: () => void;
}

/**
 * HowToCreateRoute — Steps with animated SVG travel path
 */
export const HowToCreateRoute: React.FC<HowToCreateRouteProps> = ({
  steps = [
    {
      number: '01',
      title: 'Pilih titik mulai',
      description: 'Jelajahi berbagai destinasi wisata pilihan kami',
    },
    {
      number: '02',
      title: 'Tentukan destinasi',
      description: 'Atur urutan kunjungan sesuai preferensi Anda',
    },
    {
      number: '03',
      title: 'Dapatkan rekomendasi',
      description: 'Terima saran aktivitas dan restoran terbaik',
    },
  ],
  onStartPlanning,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ padding: '56px 56px 0' }}>
      <div ref={sectionRef} className="bh-howto">
        {/* SVG Travel Path */}
        <svg className={`bh-travel-path ${isVisible ? 'visible' : ''}`} viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M 80 140 C 200 60, 300 60, 420 120 S 650 180, 750 100 S 850 50, 920 110" />
          <circle cx="80" cy="140" r="5" />
          <circle cx="420" cy="120" r="5" />
          <circle cx="920" cy="110" r="5" />
        </svg>

        {/* Header */}
        <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`} style={{ marginBottom: 36 }}>
          <span className="bh-section-h">
            <div>
              <div className="eyebrow">Panduan Liburan Sesuai</div>
              <h2 className="bh-serif" style={{ maxWidth: '20ch' }}>
                Cara membuat rute liburanmu
              </h2>
            </div>
          </span>
        </div>

        {/* Steps */}
        <div className="bh-howto__steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.2 + index * 0.15}s`, position: 'relative', zIndex: 1 }}
            >
              <div className="bh-howto__step-number">{step.number}</div>
              <h3 className="bh-howto__step-title">{step.title}</h3>
              <p className="bh-howto__step-desc">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.6s', marginTop: 36 }}
        >
          <Button
            aria-label="Mulai berencana"
            onClick={onStartPlanning || (() => console.log('Start planning'))}
            variant="sage"
            size="lg"
          >
            Mulai rencana <Icon.ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};
