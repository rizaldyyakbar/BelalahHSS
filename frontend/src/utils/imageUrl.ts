/**
 * Image URL resolver for Belalah HSS frontend.
 * Resolves local assets, uploaded storage media, and external URLs dynamically.
 */

// Fallback to production Railway backend if running on cloud or if env var is missing/malformed
const RAILWAY_PRODUCTION_DOMAIN = 'belalahhss-production-46b7.up.railway.app';
const LOCAL_API_BASE = 'http://127.0.0.1:8000/api';

function resolveApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envUrl) {
    let normalized = envUrl.startsWith('http://') || envUrl.startsWith('https://')
      ? envUrl
      : `https://${envUrl}`;
    normalized = normalized.replace(/\/+$/, '');
    if (!normalized.endsWith('/api')) {
      normalized = `${normalized}/api`;
    }
    return normalized;
  }

  // If in browser and NOT localhost, automatically use live Railway backend
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return `https://${RAILWAY_PRODUCTION_DOMAIN}/api`;
  }

  return LOCAL_API_BASE;
}

function resolveStorageBaseUrl(apiBase: string): string {
  const envUrl = (import.meta.env.VITE_STORAGE_BASE_URL || '').trim();
  if (envUrl) {
    let normalized = envUrl.startsWith('http://') || envUrl.startsWith('https://')
      ? envUrl
      : `https://${envUrl}`;
    normalized = normalized.replace(/\/+$/, '');
    if (normalized.endsWith('/api')) {
      normalized = normalized.replace(/\/api$/, '');
    }
    return normalized;
  }

  return apiBase.replace(/\/api\/?$/, '');
}

export const API_BASE_URL: string = resolveApiBaseUrl();
export const STORAGE_BASE_URL: string = resolveStorageBaseUrl(API_BASE_URL);

export function getImageUrl(img?: string | null): string {
  if (!img) return '/assets/balanting-paring.jpg';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/storage/')) return `${STORAGE_BASE_URL}${img}`;
  if (img.startsWith('storage/')) return `${STORAGE_BASE_URL}/${img}`;
  if (img.startsWith('/assets/')) return img;
  if (img.includes('.')) return `/assets/${img}`;
  return `/assets/${img}.jpg`;
}
