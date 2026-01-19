// useAnalyticsLogger.ts
import { useSelector } from "react-redux";
import type { RootState } from "../redux/app/rootReducer";
import type { AnalyticsEventType } from "./analyticsEvents";
type AnalyticsPayload = {
    eventName: AnalyticsEventType;
    component: string;
    cardId?: string;
    chartId?: string;
    durationMs?: number;
    metadata?: Record<string, any>;
};
export const useAnalyticsLogger = () => {
  const { userDetails } = useSelector((state: RootState) => state.store);
  const logUIEvent = async (payload: AnalyticsPayload) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/log?userId=${userDetails?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          sessionId: userDetails?.id,
        }),
      });
    } catch (err) {
      console.error("Analytics log failed", err);
    }
  };

  return { logUIEvent };
};
