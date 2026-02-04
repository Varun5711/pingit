import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import {
  handleNotificationResponse,
  setupNotifications,
} from "../lib/notifications";

export function useNotifications(onReminderAcknowledged?: () => void) {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    setupNotifications();

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          await handleNotificationResponse(response);
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
