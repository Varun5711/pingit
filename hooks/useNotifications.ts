/**
 * Hook for notification setup and response handling
 */

import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import {
  handleNotificationResponse,
  setupNotifications,
} from "../lib/notifications";

export function useNotifications(onReminderAcknowledged?: () => void) {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Setup notifications on mount
    setupNotifications();

    // Listen for notification responses (action button taps)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          await handleNotificationResponse(response);
          // Callback to refresh UI
          onReminderAcknowledged?.();
        },
      );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [onReminderAcknowledged]);
}
