// Atomic Icons — SVG components

export const Icon = {
  Search: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.2" /><path d="M13.6 13.6L17 17" />
    </svg>
  ),
  
  Star: ({ size = 14, filled = true }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? "#D4A24C" : "none"} stroke="#D4A24C" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M8 1.5l1.96 4.16 4.54.64-3.3 3.18.8 4.5L8 11.84 3.99 13.98l.8-4.5L1.5 6.3l4.54-.64L8 1.5z" />
    </svg>
  ),
  
  Heart: ({ size = 16, filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill={filled ? "#C26B3C" : "none"} stroke={filled ? "#C26B3C" : "currentColor"} strokeWidth="1.5" strokeLinejoin="round">
      <path d="M9 15.5s-6-3.6-6-8a3.5 3.5 0 016.5-1.8A3.5 3.5 0 0115 7.5c0 4.4-6 8-6 8z" />
    </svg>
  ),
  
  Pin: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M8 14.5s5-4.4 5-8.5a5 5 0 10-10 0c0 4.1 5 8.5 5 8.5z" />
      <circle cx="8" cy="6" r="1.8" />
    </svg>
  ),
  
  Route: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4" cy="4" r="2" /><circle cx="14" cy="14" r="2" />
      <path d="M4 6v3a3 3 0 003 3h4a3 3 0 013 3v-2" />
    </svg>
  ),
  
  Compass: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7" /><path d="M11.6 6.4L10.4 10.4 6.4 11.6 7.6 7.6z" />
    </svg>
  ),
  
  Home: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M2.5 8L9 2.5 15.5 8v7H2.5z" /><path d="M7 15v-4h4v4" />
    </svg>
  ),
  
  User: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="6" r="3" /><path d="M3 15.5c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5" />
    </svg>
  ),
  
  Filter: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2.5 4.5h13M5 9h8M7.5 13.5h3" />
    </svg>
  ),
  
  Back: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 3.5L5.5 9 11 14.5" />
    </svg>
  ),
  
  ArrowRight: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3.5L12.5 9 7 14.5" />
    </svg>
  ),
  
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  
  Close: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 3l8 8M11 3l-8 8" />
    </svg>
  ),
  
  Clock: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.2" /><path d="M8 4.5V8l2.4 1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default Icon;
