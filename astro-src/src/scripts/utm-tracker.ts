// =============================================================================
// UTM TRACKER - Traffic Source Attribution
// =============================================================================
// Captures UTM parameters, click IDs, and referrer data for lead attribution.
// Stores in a 30-day cookie for cross-session persistence (first-touch attribution).
// =============================================================================

import { site } from '../config/site';

export interface TrafficSourceData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;      // Google Ads
  fbclid?: string;     // Facebook/Instagram
  msclkid?: string;    // Microsoft/Bing
  referrer?: string;   // Detected referrer domain
}

// Platform detection from referrer
interface PlatformInfo {
  source: string;
  medium: string;
  icon: string;
}

const REFERRER_PLATFORMS: Record<string, PlatformInfo> = {
  'google': { source: 'google', medium: 'organic', icon: '🔍' },
  'facebook': { source: 'facebook', medium: 'social', icon: '📘' },
  'instagram': { source: 'instagram', medium: 'social', icon: '📸' },
  'linkedin': { source: 'linkedin', medium: 'social', icon: '💼' },
  'youtube': { source: 'youtube', medium: 'video', icon: '📺' },
  'bing': { source: 'bing', medium: 'organic', icon: '🔎' },
  'twitter': { source: 'twitter', medium: 'social', icon: '🐦' },
  'x.com': { source: 'twitter', medium: 'social', icon: '🐦' },
  'tiktok': { source: 'tiktok', medium: 'social', icon: '🎵' },
};

const COOKIE_NAME = 'hd_traffic_source';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

// Derive own hostname from config so self-referrals are correctly excluded
const OWN_HOSTNAME = new URL(site.url).hostname;

/**
 * Set a cookie with the given name, value, and max age
 */
function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Extract UTM parameters and click IDs from URL
 */
function extractUrlParams(): Partial<TrafficSourceData> {
  const params = new URLSearchParams(window.location.search);
  const data: Partial<TrafficSourceData> = {};
  
  // UTM parameters
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmContent = params.get('utm_content');
  const utmTerm = params.get('utm_term');
  
  if (utmSource) data.utmSource = utmSource;
  if (utmMedium) data.utmMedium = utmMedium;
  if (utmCampaign) data.utmCampaign = utmCampaign;
  if (utmContent) data.utmContent = utmContent;
  if (utmTerm) data.utmTerm = utmTerm;
  
  // Click IDs
  const gclid = params.get('gclid');
  const fbclid = params.get('fbclid');
  const msclkid = params.get('msclkid');
  
  if (gclid) data.gclid = gclid;
  if (fbclid) data.fbclid = fbclid;
  if (msclkid) data.msclkid = msclkid;
  
  return data;
}

/**
 * Detect platform from referrer URL
 */
function detectReferrerPlatform(): Partial<TrafficSourceData> | null {
  const referrer = document.referrer;
  if (!referrer) return null;
  
  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname.toLowerCase();
    
    // Check against known platforms
    for (const [domain, platform] of Object.entries(REFERRER_PLATFORMS)) {
      if (hostname.includes(domain)) {
        return {
          utmSource: platform.source,
          utmMedium: platform.medium,
          referrer: hostname
        };
      }
    }
    
    // Unknown external referrer (skip self-referrals)
    if (!hostname.includes(OWN_HOSTNAME)) {
      return {
        referrer: hostname
      };
    }
  } catch {
    // Invalid referrer URL
  }
  
  return null;
}

/**
 * Initialize traffic source tracking
 * Called on page load to capture and store attribution data
 */
export function initTrafficSourceTracking(): void {
  // Check if we already have stored data (first-touch attribution)
  const existingData = getCookie(COOKIE_NAME);
  
  // Extract current URL parameters
  const urlParams = extractUrlParams();
  const hasUrlParams = Object.keys(urlParams).length > 0;
  
  // If we have new UTM/click ID params, always update (allows campaign override)
  if (hasUrlParams) {
    // Merge with referrer detection
    const referrerData = detectReferrerPlatform();
    const mergedData = { ...referrerData, ...urlParams };
    
    setCookie(COOKIE_NAME, JSON.stringify(mergedData), COOKIE_MAX_AGE);
    console.log('[UTM Tracker] Stored traffic source from URL params:', mergedData);
    return;
  }
  
  // If no existing data and no URL params, check referrer
  if (!existingData) {
    const referrerData = detectReferrerPlatform();
    if (referrerData) {
      setCookie(COOKIE_NAME, JSON.stringify(referrerData), COOKIE_MAX_AGE);
      console.log('[UTM Tracker] Stored traffic source from referrer:', referrerData);
    } else {
      // Direct visit - store minimal data
      const directData: TrafficSourceData = {
        utmSource: 'direct',
        utmMedium: 'none'
      };
      setCookie(COOKIE_NAME, JSON.stringify(directData), COOKIE_MAX_AGE);
      console.log('[UTM Tracker] Stored traffic source as direct visit');
    }
  }
}

/**
 * Get current traffic source data for form submission
 * Returns the stored attribution data or empty object
 */
export function getTrafficSourceData(): TrafficSourceData {
  const cookieValue = getCookie(COOKIE_NAME);
  
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue) as TrafficSourceData;
    } catch {
      console.warn('[UTM Tracker] Failed to parse stored traffic source data');
    }
  }
  
  return {};
}

/**
 * Get traffic source display name with icon
 * Used for admin dashboard display
 */
export function getTrafficSourceDisplay(data: TrafficSourceData): string {
  const source = data.utmSource?.toLowerCase() || 'unknown';
  
  // Platform icons
  const icons: Record<string, string> = {
    'google': '🔍',
    'facebook': '📘',
    'instagram': '📸',
    'linkedin': '💼',
    'youtube': '📺',
    'bing': '🔎',
    'twitter': '🐦',
    'tiktok': '🎵',
    'direct': '🏠',
    'email': '📧',
    'unknown': '🌐'
  };
  
  const icon = icons[source] || icons['unknown'];
  const medium = data.utmMedium ? ` / ${data.utmMedium}` : '';
  const campaign = data.utmCampaign ? ` / ${data.utmCampaign}` : '';
  
  // Capitalize source
  const capitalizedSource = source.charAt(0).toUpperCase() + source.slice(1);
  
  return `${icon} ${capitalizedSource}${medium}${campaign}`;
}

/**
 * Clear stored traffic source data
 * Useful for testing or privacy compliance
 */
export function clearTrafficSourceData(): void {
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
  console.log('[UTM Tracker] Cleared traffic source data');
}

// Auto-initialize when script loads in browser
if (typeof window !== 'undefined') {
  // Initialize on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrafficSourceTracking);
  } else {
    initTrafficSourceTracking();
  }
}
