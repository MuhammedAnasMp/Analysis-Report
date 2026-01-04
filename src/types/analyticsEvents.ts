// analyticsEvents.ts
export const AnalyticsEvent = {
  CARD_SELECT: "CARD_SELECT",
  TABLE_VIEW: "TABLE_VIEW",
  CHART_VIEW: "CHART_VIEW",
  CHART_FULLSCREEN_OPEN: "CHART_FULLSCREEN_OPEN",
  CHART_FULLSCREEN_CLOSE: "CHART_FULLSCREEN_CLOSE",
} as const;

export type AnalyticsEventType =
  typeof AnalyticsEvent[keyof typeof AnalyticsEvent];
