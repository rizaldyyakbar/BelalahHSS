# Belalah HSS — Component Structure Guide

Struktur komponen React yang terorganisir dengan baik untuk project frontend Belalah HSS.

## 📁 Folder Structure

```
src/
├── components/
│   ├── atomic/              # Komponen dasar (atoms)
│   │   ├── Icons.jsx        # SVG icons
│   │   ├── Button.jsx       # Button component
│   │   ├── Chip.jsx         # Badge/tag component
│   │   ├── Stars.jsx        # Star rating
│   │   ├── IconButton.jsx   # Icon button
│   │   ├── RankBadge.jsx    # Rank badge
│   │   └── SearchBar.jsx    # Search input
│   │
│   ├── composite/           # Komponen gabungan (molecules)
│   │   └── DestinationCard.jsx  # Card untuk destination
│   │
│   ├── layout/              # Layout components (organisms)
│   │   ├── Header.jsx       # Navigation header
│   │   └── Footer.jsx       # Footer
│   │
│   └── sections/            # Section components (halaman bagian)
│       ├── HeroSection.jsx  # Hero banner
│       └── RecommendationSection.jsx  # Recommendation grid
│
├── pages/                   # Page components
│   ├── HomePage.jsx         # Home page
│   ├── DirectoryPage.jsx    # Directory/Listing
│   ├── PlannerPage.jsx      # Route planner
│   └── DestailPage.jsx      # Destination detail
│
├── constants/               # Constants & data
│   ├── designTokens.js      # Colors, radius, fonts
│   ├── destinations.js      # Destination data
│   └── index.js             # Navigation & other constants
│
└── styles/                  # Global styles
    └── tokens.css           # CSS variables & tokens
```

## 🎨 Design System

### Color Tokens (`constants/designTokens.js`)
- **Background**: `bg`, `bgSoft`, `bgCard`
- **Text**: `ink`, `ink2`, `ink3`
- **Primary**: `sage`, `sageSoft`, `sageDeep`
- **Accent**: `clay`, `claySoft`, `clayDeep`, `gold`, `water`

### Radius
- `sm`: 8px
- `md`: 14px
- `lg`: 20px
- `xl`: 28px

### Fonts
- **Serif**: Fraunces, Lora, Georgia
- **Sans**: Inter, system-ui

## 🧩 Component Categories

### Atomic Components
Komponen terkecil yang bisa digunakan kembali:
- `Icon` - SVG icon library
- `Button` - Basic button dengan variasi
- `Chip` - Small badge/tag
- `Stars` - Star rating display
- `IconButton` - Icon-only button
- `RankBadge` - Ranking badge
- `SearchBar` - Search input field

### Composite Components
Gabungan dari beberapa atomic components:
- `DestinationCard` - Card untuk menampilkan destinasi

### Layout Components
Container struktur halaman:
- `Header` - Navigation bar
- `Footer` - Footer dengan links

### Section Components
Bagian halaman yang besar:
- `HeroSection` - Hero banner dengan search
- `RecommendationSection` - Grid rekomendasi destinasi

## 💻 Contoh Penggunaan

### Import komponen
```jsx
import { Icon } from './components/atomic/Icons';
import Button from './components/atomic/Button';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
```

### Gunakan komponen
```jsx
import { Button } from './components/atomic/Button';

export default function MyComponent() {
  return (
    <Button 
      variant="sage"
      size="lg"
      onClick={() => console.log('clicked')}
    >
      Klik Saya <Icon.ArrowRight />
    </Button>
  );
}
```

### Props Reference

#### Button
```jsx
<Button 
  variant="primary|sage|secondary|ghost"  // default: 'primary'
  size="sm|md|lg"                        // default: 'md'
  disabled={false}
  onClick={handler}
>
  Content
</Button>
```

#### Chip
```jsx
<Chip 
  variant="default|sage|clay|gold"
  style={{}}
>
  Badge Text
</Chip>
```

#### Stars
```jsx
<Stars 
  rating={4.5}        // 0-5
  reviews={324}       // optional
  size={14}           // icon size
/>
```

#### DestinationCard
```jsx
<DestinationCard
  destination={{
    id: 1,
    name: 'Loksado',
    category: 'Alam',
    rating: 4.8,
    // ... other fields
  }}
  featured={false}            // true untuk card besar
  onHeartClick={handler}
  onViewDetail={handler}
  imageClass="forest"         // background image class
/>
```

#### Header
```jsx
<Header 
  active="home"               // active page
  logo={{ text: 'Belalah', sub: 'HSS' }}
  onNavClick={handler}
  solid={false}               // solid background
/>
```

#### HeroSection
```jsx
<HeroSection
  location="Hulu Sungai Selatan · Kalimantan Selatan"
  title="Belalah ke"
  titleHighlight="Bumi Antaludin"
  description="..."
  onSearch={handler}
/>
```

#### RecommendationSection
```jsx
<RecommendationSection
  destinations={DESTINATIONS}     // array of destination objects
  title="Destinasi paling cocok untukmu"
  subtitle="Rekomendasi sistem · SAW"
  onViewAll={handler}
  onCardClick={handler}           // handle card click
  onHeartClick={handler}          // handle heart click
/>
```

## 🚀 Best Practices

### 1. Import Organization
```jsx
// Imports dari React
import React, { useState } from 'react';

// Imports dari components
import Header from './components/layout/Header';
import { Icon } from './components/atomic/Icons';

// Imports dari constants
import { DESTINATIONS } from './constants/destinations';
import { COLORS } from './constants/designTokens';
```

### 2. Props Validation
Berikan default props yang masuk akal:
```jsx
export const MyComponent = ({
  title = 'Default Title',
  onClick = () => {},
  disabled = false,
}) => { ... }
```

### 3. CSS Classes
Gunakan CSS classes dari styles.css untuk konsistensi:
```jsx
<div className="bh-card">
<button className="bh-btn sage">
<div className="bh-photo forest">
```

### 4. Inline Styles untuk Dynamic Values
```jsx
<div style={{
  backgroundColor: selected ? COLORS.sage : COLORS.bg,
  padding: spacing,
  ...customStyle,
}}>
```

### 5. Component Composition
Gunakan komponen kecil untuk membangun komponen besar:
```jsx
export const ComplexCard = () => {
  return (
    <div className="bh-card">
      <Stars rating={4.5} />
      <Button variant="primary">Action</Button>
    </div>
  );
};
```

## 📝 CSS Classes

Global classes yang sudah didefinisikan di `styles.css`:
- `.bh-screen` - Main container
- `.bh-webnav` - Navigation bar
- `.bh-logo` - Logo styling
- `.bh-card` - Card component
- `.bh-btn` - Button styling
- `.bh-chip` - Chip/badge styling
- `.bh-photo` - Photo/image container
- `.bh-serif` - Serif font styling
- `.bh-iconbtn` - Icon button styling

## 🔄 State Management

Untuk app yang lebih kompleks, pertimbangkan:
- Context API untuk shared state
- Redux jika data flow rumit
- Zustand untuk state management yang sederhana

## 📦 Adding New Components

Langkah menambah komponen baru:

1. **Tentukan level**: Atomic, Composite, Layout, atau Section?
2. **Buat file** di folder yang sesuai
3. **Export** komponen dengan named atau default export
4. **Buat dokumentasi** props di JSDoc
5. **Import** dan gunakan di tempat lain

Contoh komponen baru:
```jsx
/**
 * MyNewComponent — Deskripsi singkat
 * @param {string} title - Judul
 * @param {function} onClick - Click handler
 */
export const MyNewComponent = ({ title, onClick }) => {
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={onClick}>Action</button>
    </div>
  );
};
```

---

**Happy coding! 🎉**
