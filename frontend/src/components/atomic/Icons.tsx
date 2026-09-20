import React from 'react';
import { 
  Search, 
  Star, 
  Heart, 
  MapPin, 
  Route, 
  Compass, 
  Home, 
  User, 
  Filter, 
  ChevronLeft, 
  ArrowRight,
  Plus,
  X,
  Clock,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Map,
  Save,
  Bell,
  Check,
  Menu,
  BookOpen,
  Grid,
  Info,
  PhoneCall,
  Layers
} from 'lucide-react';


interface IconProps {
  size?: number;
  filled?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export const Icon = {
  Search: ({ size = 18, color = "currentColor", style }: IconProps) => (
    <Search size={size} color={color} strokeWidth={1.6} style={style} />
  ),
  
  Star: ({ size = 14, filled = true, style }: IconProps) => (
    <Star size={size} color="#D4A24C" strokeWidth={1.4} fill={filled ? "#D4A24C" : "none"} style={style} />
  ),
  
  Heart: ({ size = 16, filled = false, style }: IconProps) => (
    <Heart size={size} color={filled ? "#C26B3C" : "currentColor"} strokeWidth={1.5} fill={filled ? "#C26B3C" : "none"} style={style} />
  ),
  
  Pin: ({ size = 14, color = "currentColor", style }: IconProps) => (
    <MapPin size={size} color={color} strokeWidth={1.4} style={style} />
  ),
  
  Location: ({ size = 14, color = "currentColor", style }: IconProps) => (
    <MapPin size={size} color={color} strokeWidth={1.4} style={style} />
  ),

  Check: ({ size = 14, color = "currentColor", style }: IconProps) => (
    <Check size={size} color={color} strokeWidth={2} style={style} />
  ),
  
  Route: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Route size={size} color={color} strokeWidth={1.5} style={style} />
  ),
  
  Compass: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Compass size={size} color={color} strokeWidth={1.5} style={style} />
  ),
  
  Home: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Home size={size} color={color} strokeWidth={1.5} style={style} />
  ),
  
  User: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <User size={size} color={color} strokeWidth={1.5} style={style} />
  ),
  
  Filter: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Filter size={size} color={color} strokeWidth={1.5} style={style} />
  ),
  
  Back: ({ size = 18, color = "currentColor", style }: IconProps) => (
    <ChevronLeft size={size} color={color} strokeWidth={1.6} style={style} />
  ),
  
  ArrowRight: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <ArrowRight size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Plus: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Plus size={size} color={color} strokeWidth={1.8} style={style} />
  ),
  
  Close: ({ size = 14, color = "currentColor", style }: IconProps) => (
    <X size={size} color={color} strokeWidth={1.6} style={style} />
  ),
  
  Clock: ({ size = 14, color = "currentColor", style }: IconProps) => (
    <Clock size={size} color={color} strokeWidth={1.4} style={style} />
  ),

  Mail: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Mail size={size} color={color} strokeWidth={1.4} style={style} />
  ),

  Phone: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Phone size={size} color={color} strokeWidth={1.4} style={style} />
  ),

  Calendar: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Calendar size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Wallet: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Wallet size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Map: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Map size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Save: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Save size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Bell: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Bell size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Instagram: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" style={style}>
      <rect x="2" y="2" width="12" height="12" rx="3" ry="3" /><path d="M8 5a3 3 0 100 6 3 3 0 000-6z" /><path d="M11.5 4.5h.01" />
    </svg>
  ),

  Menu: ({ size = 18, color = "currentColor", style }: IconProps) => (
    <Menu size={size} color={color} strokeWidth={1.7} style={style} />
  ),

  BookOpen: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <BookOpen size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Grid: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Grid size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Info: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Info size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  PhoneCall: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <PhoneCall size={size} color={color} strokeWidth={1.5} style={style} />
  ),

  Layers: ({ size = 16, color = "currentColor", style }: IconProps) => (
    <Layers size={size} color={color} strokeWidth={1.5} style={style} />
  ),
};

export default Icon;
