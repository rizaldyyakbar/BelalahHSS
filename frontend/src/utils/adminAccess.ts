/**
 * Secret Admin Access Utility (Easter Egg)
 * Allows developers and thesis presenters to auto-authenticate and enter the Filament
 * Admin Dashboard without public visitors knowing and without filling in login credentials.
 */

const RAILWAY_PRODUCTION_DOMAIN = 'belalahhss-production-46b7.up.railway.app';

export function getBackendOrigin(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envUrl) {
    let normalized = envUrl.startsWith('http://') || envUrl.startsWith('https://')
      ? envUrl
      : `https://${envUrl}`;
    return normalized.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }

  // If in browser and NOT localhost, use production backend
  if (
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return `https://${RAILWAY_PRODUCTION_DOMAIN}`;
  }

  return 'http://127.0.0.1:8000';
}

export function getAdminQuickUrl(): string {
  return `${getBackendOrigin()}/quick-admin`;
}

/**
 * Show a brief, non-intrusive notification and launch the Filament admin panel
 */
export function triggerAdminAccess(): void {
  const adminUrl = getAdminQuickUrl();

  // Create or update secret toast
  if (typeof document !== 'undefined') {
    const existing = document.getElementById('secret-admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'secret-admin-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#012D1D';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '99999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.animation = 'fadeIn 0.2s ease';
    toast.innerHTML = '<span>🔓</span> Membuka Dashboard Admin Belalah HSS...';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2800);
  }

  // Open the auto-login URL in a new tab
  window.open(adminUrl, '_blank');
}

/**
 * Creates a click-counter callback that triggers admin access after N quick clicks
 */
export function createSecretClickTracker(targetClicks = 5, windowMs = 3000) {
  let clickTimes: number[] = [];

  return (e?: React.MouseEvent) => {
    const now = Date.now();
    clickTimes = clickTimes.filter((t) => now - t < windowMs);
    clickTimes.push(now);

    if (clickTimes.length >= targetClicks) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      clickTimes = [];
      triggerAdminAccess();
    }
  };
}
