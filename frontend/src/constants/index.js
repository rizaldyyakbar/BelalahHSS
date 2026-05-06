// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Beranda', href: '/' },
  { id: 'planner', label: 'Perencana Rute', href: '/planner' },
  { id: 'directory', label: 'Direktori Destinasi', href: '/directory' },
  { id: 'about', label: 'Tentang', href: '/about' },
];

// Route planner modes
export const PLANNER_MODES = {
  QUICKEST: 'quickest',
  SHORTEST: 'shortest',
  SCENIC: 'scenic',
};

// Destination categories
export const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: 'compass' },
  { id: 'nature', label: 'Alam', icon: 'compass' },
  { id: 'culture', label: 'Budaya', icon: 'home' },
  { id: 'adventure', label: 'Petualangan', icon: 'route' },
  { id: 'food', label: 'Kuliner', icon: 'fork' },
];

// Facility types
export const FACILITIES = [
  { id: 'accommodation', label: 'Penginapan', icon: 'bed' },
  { id: 'restaurant', label: 'Restoran', icon: 'fork' },
  { id: 'parking', label: 'Parkir', icon: 'park' },
  { id: 'restroom', label: 'Toilet', icon: 'home' },
  { id: 'wifi', label: 'WiFi', icon: 'compass' },
];

export default {
  NAV_ITEMS,
  PLANNER_MODES,
  CATEGORIES,
  FACILITIES,
};
