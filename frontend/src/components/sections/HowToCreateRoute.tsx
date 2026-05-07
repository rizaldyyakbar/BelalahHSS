import React from 'react';
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
  return (
    <section style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.subtitle}>Panduan Liburan Sesuai</span>
          <h2 style={styles.title}>Cara membuat rute 
            liburanmu</h2>
        </div>
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} style={styles.stepCard}>
              <div style={styles.stepNumber}>{step.number}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
        <Button
          aria-label="Mulai berencana"
          onClick={onStartPlanning || (() => console.log('Start planning'))}
          style={styles.button}
        >
          Mulai rencana <Icon.ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '0 56px 56px',
    backgroundColor: 'transparent',
    margin: '0',
    borderRadius: '0',
    boxShadow: 'none',
  },
  wrapper: {
    maxWidth: '100%',
    margin: '0',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    backgroundColor: 'var(--bg-soft)',
    borderRadius: 'var(--radius-xl)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '36px',
  },
  subtitle: {
    fontSize: '11px',
    color: 'var(--clay-deep)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontFamily: 'var(--sans)',
    margin: '0 0 8px 0',
  },
  title: {
    fontSize: '36px',
    fontWeight: 500,
    color: 'var(--ink)',
    margin: '0',
    fontFamily: 'var(--serif)',
    letterSpacing: '-0.025em',
    maxWidth: '20ch',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  stepCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    padding: '0',
    borderRadius: '0',
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'transparent',
  },
  stepNumber: {
    fontSize: '38px',
    fontWeight: 500,
    color: 'var(--clay)',
    margin: '0',
    lineHeight: '1',
    fontFamily: 'var(--serif)',
    letterSpacing: '-0.04em',
  },
  stepTitle: {
    fontSize: '19px',
    fontWeight: 600,
    color: 'var(--ink)',
    margin: '0',
    marginTop: '6px',
    fontFamily: 'var(--serif)',
    letterSpacing: '-0.02em',
  },
  stepDescription: {
    fontSize: '14px',
    color: 'var(--ink-2)',
    margin: '0',
    lineHeight: '1.55',
    marginTop: '6px',
    fontFamily: 'var(--sans)',
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    lineHeight: '1',
  },
};
