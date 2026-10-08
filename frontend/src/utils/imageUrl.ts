/**
 * Image URL resolver for Belalah HSS frontend.
 * Resolves local assets, uploaded storage media, and external URLs dynamically.
 */

const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api';
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

export const STORAGE_BASE_URL: string =
  import.meta.env.VITE_STORAGE_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, '');

export function getImageUrl(img?: string | null): string {
  if (!img) return '/assets/balanting-paring.jpg';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/storage/')) return `${STORAGE_BASE_URL}${img}`;
  if (img.startsWith('storage/')) return `${STORAGE_BASE_URL}/${img}`;
  if (img.startsWith('/assets/')) return img;
  if (img.includes('.')) return `/assets/${img}`;
  return `/assets/${img}.jpg`;
}
