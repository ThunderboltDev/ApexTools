"use client";

export const ANALYTICS_EVENTS = {
  AUTH: {
    SIGNUP_ATTEMPT: "signup_attempt",
    LOGIN_ATTEMPT: "login_attempt",
    SUCCESS: "auth_success",
    FAILED: "auth_failed",
    EMAIL_VERIFICATION_RETRY: "email_verification_retry",
  },
  ONBOARDING: {
    ORG_CREATED: "organization_created",
    COMPLETED: "onboarding_completed",
  },
  BILLING: {
    CHECKOUT_STARTED: "checkout_started",
    CHECKOUT_COMPLETED: "checkout_completed",
    CHECKOUT_CANCELLED: "checkout_cancelled",
    CYCLE_TOGGLED: "billing_cycle_toggled",
    UPGRADE_CLICKED: "upgrade_clicked",
    DOWNGRADE_CLICKED: "downgrade_clicked",
    CANCEL_CLICKED: "cancel_clicked",
  },
  WIDGET: {
    LOADED: "widget_loaded",
    OPENED: "widget_opened",
    CLOSED: "widget_closed",
    SETTINGS_UPDATED: "widget_settings_updated",
  },
  PRODUCT: {
    CONVERSATION_STARTED: "conversation_started",
    MESSAGE_SENT: "message_sent",
    AI_RESPONSE_RENDERED: "ai_response_rendered",
    SUGGESTION_CLICKED: "suggestion_clicked",
    INBOX_VIEWED: "inbox_viewed",
  },
  NAVIGATION: {
    CTA_CLICKED: "cta_clicked",
  },
} as const;

type EventName =
  | (typeof ANALYTICS_EVENTS.AUTH)[keyof typeof ANALYTICS_EVENTS.AUTH]
  | (typeof ANALYTICS_EVENTS.ONBOARDING)[keyof typeof ANALYTICS_EVENTS.ONBOARDING]
  | (typeof ANALYTICS_EVENTS.BILLING)[keyof typeof ANALYTICS_EVENTS.BILLING]
  | (typeof ANALYTICS_EVENTS.WIDGET)[keyof typeof ANALYTICS_EVENTS.WIDGET]
  | (typeof ANALYTICS_EVENTS.PRODUCT)[keyof typeof ANALYTICS_EVENTS.PRODUCT]
  | (typeof ANALYTICS_EVENTS.NAVIGATION)[keyof typeof ANALYTICS_EVENTS.NAVIGATION];

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const STORAGE_KEY = "resound_utms";

export const captureUtms = () => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  let hasUtms = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      utms[key] = value;
      hasUtms = true;
    }
  }

  if (hasUtms) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
  }
};

const getPersistedUtms = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const trackEvent = (name: EventName, properties?: EventProperties) => {
  if (typeof window !== "undefined" && window.umami) {
    const utms = getPersistedUtms();
    const eventData = { ...utms, ...properties };
    window.umami.track(name, eventData);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Umami Event]: ${name}`, {
        ...getPersistedUtms(),
        ...properties,
      });
    }
  }
};

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: EventProperties) => void;
    };
  }
}
