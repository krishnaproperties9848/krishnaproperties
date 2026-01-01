"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Analytics event tracking utility
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Specific tracking functions for conversions
export const analytics = {
  trackCall: (location: string) => {
    trackEvent("click", "CTA", `call_${location}`);
  },
  trackWhatsApp: (location: string) => {
    trackEvent("click", "CTA", `whatsapp_${location}`);
  },
  trackEmail: (location: string) => {
    trackEvent("click", "CTA", `email_${location}`);
  },
  trackBrochureDownload: (brochureName: string) => {
    trackEvent("download", "Brochure", brochureName);
  },
  trackBrochureView: (brochureName: string) => {
    trackEvent("view", "Brochure", brochureName);
  },
  trackPageView: (pageName: string) => {
    trackEvent("page_view", "Navigation", pageName);
  },
};

export default GoogleAnalytics;
