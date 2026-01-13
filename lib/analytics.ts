"use client";

export const ANALYTICS_EVENTS = {
  AUTH: {
    SIGNUP_ATTEMPT: "signup_attempt",
    LOGIN_ATTEMPT: "login_attempt",
    SUCCESS: "auth_success",
    FAILED: "auth_failed",
    EMAIL_VERIFICATION_RETRY: "email_verification_retry",
  },
  DIRECTORY: {
    TOOL_CARD_CLICK: "tool_card_click",
    OUTBOUND_CLICK: "outbound_click",
    SEARCH_USED: "search_used",
    FILTER_APPLIED: "filter_applied",
    CATEGORY_SELECTED: "category_selected",
  },
} as const;

type EventName =
  | (typeof ANALYTICS_EVENTS.AUTH)[keyof typeof ANALYTICS_EVENTS.AUTH]
  | (typeof ANALYTICS_EVENTS.DIRECTORY)[keyof typeof ANALYTICS_EVENTS.DIRECTORY];

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

export const trackToolCardClick = (toolSlug: string, toolName: string) => {
  trackEvent(ANALYTICS_EVENTS.DIRECTORY.TOOL_CARD_CLICK, {
    tool_slug: toolSlug,
    tool_name: toolName,
  });
};

export const trackOutboundClick = (toolSlug: string, url: string) => {
  trackEvent(ANALYTICS_EVENTS.DIRECTORY.OUTBOUND_CLICK, {
    tool_slug: toolSlug,
    destination_url: url,
  });
};

export const trackSearch = (query: string, resultCount?: number) => {
  trackEvent(ANALYTICS_EVENTS.DIRECTORY.SEARCH_USED, {
    search_query: query,
    result_count: resultCount,
  });
};

export const trackFilterApplied = (
  filterType: "pricing" | "category" | "sort",
  value: string
) => {
  trackEvent(ANALYTICS_EVENTS.DIRECTORY.FILTER_APPLIED, {
    filter_type: filterType,
    filter_value: value,
  });
};

export const trackCategorySelected = (category: string) => {
  trackEvent(ANALYTICS_EVENTS.DIRECTORY.CATEGORY_SELECTED, {
    category,
  });
};

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: EventProperties) => void;
    };
  }
}
