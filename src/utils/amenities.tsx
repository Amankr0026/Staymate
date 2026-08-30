import React from 'react';
import {
  Wifi,
  Wind,
  Utensils,
  Tv,
  Refrigerator,
  Zap,
  Car,
  ShieldCheck,
  Sparkles,
  Shirt,
  BookOpen,
  Bath,
  Flame,
  Coffee,
  Waves,
  Lock,
  type LucideIcon,
} from 'lucide-react';

export interface AmenityConfig {
  name: string;
  icon: LucideIcon;
  category: 'essential' | 'comfort' | 'safety' | 'food';
  color: string;
}

export const ALL_AMENITIES: AmenityConfig[] = [
  { name: 'Wi-Fi', icon: Wifi, category: 'essential', color: 'text-indigo-600' },
  { name: 'AC', icon: Wind, category: 'comfort', color: 'text-sky-600' },
  { name: 'Food', icon: Utensils, category: 'food', color: 'text-emerald-600' },
  { name: 'Washing Machine', icon: Waves, category: 'essential', color: 'text-blue-600' },
  { name: 'TV', icon: Tv, category: 'comfort', color: 'text-purple-600' },
  { name: 'Refrigerator', icon: Refrigerator, category: 'comfort', color: 'text-teal-600' },
  { name: 'Power Backup', icon: Zap, category: 'essential', color: 'text-amber-600' },
  { name: 'Parking', icon: Car, category: 'convenience' as any, color: 'text-slate-600' },
  { name: 'CCTV', icon: ShieldCheck, category: 'safety', color: 'text-rose-600' },
  { name: 'Housekeeping', icon: Sparkles, category: 'comfort', color: 'text-violet-600' },
  { name: 'Laundry', icon: Shirt, category: 'essential', color: 'text-cyan-600' },
  { name: 'Study Table', icon: BookOpen, category: 'essential', color: 'text-amber-700' },
  { name: 'Attached Bathroom', icon: Bath, category: 'comfort', color: 'text-emerald-700' },
  { name: 'Hot Water', icon: Flame, category: 'comfort', color: 'text-orange-600' },
];

export const getAmenityIcon = (name: string): LucideIcon => {
  const matched = ALL_AMENITIES.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );
  return matched ? matched.icon : Sparkles;
};

export const renderAmenityIcon = (name: string, className = 'w-4 h-4') => {
  const IconComponent = getAmenityIcon(name);
  return <IconComponent className={className} />;
};
