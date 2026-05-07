import React from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
  count?: number;
}

interface BrowseByCategoryProps {
  categories?: Category[];
}

export const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({
  categories = [
    { id: '1', name: 'Alam', image: '/assets/category-nature.jpg', count: 45 },
    { id: '2', name: 'Air Terjun', image: '/assets/category-waterfall.jpg', count: 28 },
    { id: '3', name: 'Bendungi', image: '/assets/category-dam.jpg', count: 15 },
    { id: '4', name: 'Kolam', image: '/assets/category-pool.jpg', count: 12 },
  ],
}) => {
  return (
    <section style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.subtitle}>Jelajahi</span>
          <h2 style={styles.title}>Jelajahi sesuai minatmu</h2>
        </div>
        <div style={styles.categoriesGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={styles.categoryCard}
              onClick={() => console.log(`View ${category.name}`)}
            >
              <img src={category.image} alt={category.name} style={styles.categoryImage} />
              <div style={styles.categoryOverlay}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                {category.count && (
                  <p style={styles.categoryCount}>{category.count} destinasi</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '0 56px 56px',
    backgroundColor: 'transparent',
  },
  wrapper: {
    maxWidth: '100%',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '32px',
  },
  subtitle: {
    fontSize: '11px',
    color: 'var(--clay-deep)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontFamily: 'var(--sans)',
    margin: '0',
  },
  title: {
    fontSize: '36px',
    fontWeight: 600,
    color: 'var(--ink)',
    margin: '0',
    fontFamily: 'var(--serif)',
    letterSpacing: '-0.02em',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  categoryCard: {
    position: 'relative',
    height: '200px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '18px',
    background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6) 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '2px',
  },
  categoryName: {
    fontSize: '22px',
    fontWeight: 600,
    margin: '0',
    color: 'white',
    fontFamily: 'var(--serif)',
    letterSpacing: '-0.02em',
  },
  categoryCount: {
    fontSize: '12px',
    margin: '0',
    marginTop: '2px',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'var(--sans)',
  },
};
