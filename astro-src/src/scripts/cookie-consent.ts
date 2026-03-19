// Cookie Consent Manager
// Handles GDPR-compliant cookie consent banner functionality

interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    CookieConsentManager?: CookieConsentManager;
  }
}

class CookieConsentManager {
  private banner: HTMLElement | null;
  private settingsBtn: HTMLElement | null;
  private detailsSection: HTMLElement | null;
  private showDetailsBtn: HTMLElement | null;
  private acceptAllBtn: HTMLElement | null;
  private acceptSelectedBtn: HTMLElement | null;
  private rejectAllBtn: HTMLElement | null;
  private functionalCheckbox: HTMLInputElement | null;
  private analyticsCheckbox: HTMLInputElement | null;
  private marketingCheckbox: HTMLInputElement | null;
  private detailsVisible: boolean = false;

  constructor() {
    this.banner = document.getElementById('cookie-consent-banner');
    this.settingsBtn = document.getElementById('cookie-settings-btn');
    this.detailsSection = document.getElementById('cookie-details');
    this.showDetailsBtn = document.getElementById('cookie-show-details');
    this.acceptAllBtn = document.getElementById('cookie-accept-all');
    this.acceptSelectedBtn = document.getElementById('cookie-accept-selected');
    this.rejectAllBtn = document.getElementById('cookie-reject-all');
    this.functionalCheckbox = document.getElementById('cookie-functional') as HTMLInputElement;
    this.analyticsCheckbox = document.getElementById('cookie-analytics') as HTMLInputElement;
    this.marketingCheckbox = document.getElementById('cookie-marketing') as HTMLInputElement;

    this.init();
  }

  private init() {
    const consent = this.getConsent();
    
    if (!consent) {
      this.showBanner();
    } else {
      this.showSettingsButton();
      this.applyConsent(consent);
    }

    this.bindEvents();
  }

  private bindEvents() {
    this.showDetailsBtn?.addEventListener('click', () => this.toggleDetails());

    // Focus trap listener
    this.banner?.addEventListener('keydown', (e) => this.handleTrapFocus(e));

    this.acceptAllBtn?.addEventListener('click', () => {
      this.saveConsent({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
      });
      this.hideBanner();
      this.showSettingsButton();
    });

    this.acceptSelectedBtn?.addEventListener('click', () => {
      this.saveConsent({
        necessary: true,
        functional: this.functionalCheckbox?.checked || false,
        analytics: this.analyticsCheckbox?.checked || false,
        marketing: this.marketingCheckbox?.checked || false,
        timestamp: new Date().toISOString()
      });
      this.hideBanner();
      this.showSettingsButton();
    });

    this.rejectAllBtn?.addEventListener('click', () => {
      this.saveConsent({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
      });
      this.hideBanner();
      this.showSettingsButton();
    });

    this.settingsBtn?.addEventListener('click', () => {
      const consent = this.getConsent();
      if (consent) {
        if (this.functionalCheckbox) this.functionalCheckbox.checked = consent.functional;
        if (this.analyticsCheckbox) this.analyticsCheckbox.checked = consent.analytics;
        if (this.marketingCheckbox) this.marketingCheckbox.checked = consent.marketing;
      }
      this.resetDetailsState();
      this.showBanner();
      this.hideSettingsButton();
    });

    [this.functionalCheckbox, this.analyticsCheckbox, this.marketingCheckbox].forEach(checkbox => {
      checkbox?.addEventListener('change', () => {
        if (this.detailsVisible) {
          this.acceptSelectedBtn?.classList.remove('hidden');
        }
      });
    });
  }

  private toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
    
    if (this.detailsVisible) {
      this.detailsSection?.classList.remove('hidden');
      this.detailsSection?.classList.add('cookie-details-visible');
      this.showDetailsBtn?.classList.add('active');
      this.acceptSelectedBtn?.classList.remove('hidden');
      this.banner?.classList.add('expanded');
      
      const btnText = this.showDetailsBtn?.querySelector('span');
      if (btnText) {
        btnText.textContent = this.showDetailsBtn?.getAttribute('data-hide-text') || 'Hide details';
      }
    } else {
      this.detailsSection?.classList.add('hidden');
      this.detailsSection?.classList.remove('cookie-details-visible');
      this.showDetailsBtn?.classList.remove('active');
      this.acceptSelectedBtn?.classList.add('hidden');
      this.banner?.classList.remove('expanded');
      
      const btnText = this.showDetailsBtn?.querySelector('span');
      if (btnText) {
        btnText.textContent = this.showDetailsBtn?.getAttribute('data-show-text') || 'Customize';
      }
    }
  }

  private showBanner() {
    this.banner?.classList.remove('hidden');
    this.banner?.classList.add('cookie-banner-visible');
    
    // Accessibility: Manage focus
    setTimeout(() => {
      const focusable = this.getFocusableElements();
      if (focusable.length > 0) focusable[0].focus();
    }, 100);
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.banner) return [];
    return Array.from(this.banner.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
  }

  private handleTrapFocus(e: KeyboardEvent) {
    if (!this.banner || this.banner.classList.contains('hidden')) return;

    const focusableElements = this.getFocusableElements();
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      if (e.key === 'Escape') this.hideBanner();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  private hideBanner() {
    this.banner?.classList.add('hidden');
    this.banner?.classList.remove('cookie-banner-visible');
    this.resetDetailsState();
    
    // Accessibility: Return focus to trigger or body
    this.settingsBtn?.focus();
  }
  
  private resetDetailsState() {
    this.detailsVisible = false;
    this.detailsSection?.classList.add('hidden');
    this.detailsSection?.classList.remove('cookie-details-visible');
    this.showDetailsBtn?.classList.remove('active');
    this.acceptSelectedBtn?.classList.add('hidden');
    this.banner?.classList.remove('expanded');
    
    const btnText = this.showDetailsBtn?.querySelector('span');
    if (btnText) {
      btnText.textContent = this.showDetailsBtn?.getAttribute('data-show-text') || 'Customize';
    }
  }

  private showSettingsButton() {
    this.settingsBtn?.classList.remove('hidden');
    this.settingsBtn?.classList.add('cookie-settings-visible');
  }

  private hideSettingsButton() {
    this.settingsBtn?.classList.add('hidden');
    this.settingsBtn?.classList.remove('cookie-settings-visible');
  }

  private saveConsent(consent: CookieConsent) {
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    this.applyConsent(consent);
    
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  private getConsent(): CookieConsent | null {
    const stored = localStorage.getItem('cookie_consent');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  private applyConsent(consent: CookieConsent) {
    if (consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    if (consent.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    if (consent.functional) {
      this.enableFunctional();
    } else {
      this.disableFunctional();
    }
  }

  private enableAnalytics() {
    document.querySelectorAll('script[data-cookiecategory="analytics"]').forEach(script => {
      if (script.getAttribute('type') === 'text/plain') {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        if (script.getAttribute('src')) {
          newScript.src = script.getAttribute('src') || '';
        }
        newScript.setAttribute('data-cookiecategory', 'analytics');
        script.parentNode?.replaceChild(newScript, script);
      }
    });

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  private disableAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    this.deleteCookiesByPattern(['_ga', '_gid', '_gat']);
  }

  private enableMarketing() {
    document.querySelectorAll('script[data-cookiecategory="marketing"]').forEach(script => {
      if (script.getAttribute('type') === 'text/plain') {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        if (script.getAttribute('src')) {
          newScript.src = script.getAttribute('src') || '';
        }
        newScript.setAttribute('data-cookiecategory', 'marketing');
        script.parentNode?.replaceChild(newScript, script);
      }
    });

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  }

  private disableMarketing() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    this.deleteCookiesByPattern(['_fbp', '_fbc', 'fr']);
  }

  private enableFunctional() {
    document.querySelectorAll('script[data-cookiecategory="functional"]').forEach(script => {
      if (script.getAttribute('type') === 'text/plain') {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        if (script.getAttribute('src')) {
          newScript.src = script.getAttribute('src') || '';
        }
        newScript.setAttribute('data-cookiecategory', 'functional');
        script.parentNode?.replaceChild(newScript, script);
      }
    });

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'functionality_storage': 'granted',
        'personalization_storage': 'granted'
      });
    }
  }

  private disableFunctional() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'functionality_storage': 'denied',
        'personalization_storage': 'denied'
      });
    }
  }

  private deleteCookiesByPattern(patterns: string[]) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const cookieName = cookie.split('=')[0].trim();
      for (const pattern of patterns) {
        if (cookieName.startsWith(pattern)) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        }
      }
    }
  }
}

// Helper function to check if a category has consent
(window as any).hasCookieConsent = function(category: 'necessary' | 'functional' | 'analytics' | 'marketing'): boolean {
  const stored = localStorage.getItem('cookie_consent');
  if (stored) {
    try {
      const consent = JSON.parse(stored);
      return consent[category] === true;
    } catch {
      return false;
    }
  }
  return false;
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.CookieConsentManager = new CookieConsentManager();
});

