import type { AppName } from "./types/index";

export const AnalyticsEvents = {
  APP_OPENED: "app.opened",
  SCREEN_VIEWED: "screen.viewed",
  CTA_CLICKED: "cta.clicked",
  FORM_SUBMITTED: "form.submitted",
  ERROR_OCCURRED: "error.occurred",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsEnvironment = "development" | "production";
export type AnalyticsPlatform = "web" | "ios" | "android" | string;

export interface AnalyticsSuperProperties {
  site: `scaffold.${AppName}`;
  environment: AnalyticsEnvironment;
  platform: AnalyticsPlatform;
  app_version?: string;
}

export interface AnalyticsEventProperties {
  [AnalyticsEvents.APP_OPENED]: Record<string, never>;
  [AnalyticsEvents.SCREEN_VIEWED]: {
    screen_name: string;
    previous_screen?: string;
  };
  [AnalyticsEvents.CTA_CLICKED]: {
    cta_name: string;
    location?: string;
  };
  [AnalyticsEvents.FORM_SUBMITTED]: {
    form_name: string;
    success: boolean;
  };
  [AnalyticsEvents.ERROR_OCCURRED]: {
    error_type: string;
    component?: string;
    is_fatal?: boolean;
  };
}

type Props = Record<string, unknown>;

export interface AnalyticsClient {
  capture(event: string, properties?: Props): unknown;
  register(properties: Props): unknown;
  unregister(property: string): unknown;
  identify(distinctId: string, properties?: Props): unknown;
  reset(): unknown;
}

let client: AnalyticsClient | null = null;

export function setAnalyticsClient(nextClient: AnalyticsClient | null): void {
  client = nextClient;
}

export function getAnalyticsClient(): AnalyticsClient | null {
  return client;
}

export function track<EventName extends AnalyticsEvent>(
  event: EventName,
  ...args: AnalyticsEventProperties[EventName] extends Record<string, never>
    ? [properties?: AnalyticsEventProperties[EventName]]
    : [properties: AnalyticsEventProperties[EventName]]
): void {
  try {
    client?.capture(event, args[0]);
  } catch {
    // Analytics must never break the app.
  }
}

export function identify(distinctId: string, properties?: Props): void {
  try {
    client?.identify(distinctId, properties);
  } catch {
    // no-op
  }
}

export function resetAnalytics(): void {
  try {
    client?.reset();
  } catch {
    // no-op
  }
}

export function registerSuperProperties(
  properties: Partial<AnalyticsSuperProperties> & Props,
): void {
  try {
    client?.register(properties);
  } catch {
    // no-op
  }
}

export function unregisterSuperProperty(property: string): void {
  try {
    client?.unregister(property);
  } catch {
    // no-op
  }
}
