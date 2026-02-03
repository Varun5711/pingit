import * as Notifications from "expo-notifications";
import { getReminder, updateReminder } from "./storage";
import { Reminder } from "./types";

export const NOTIFICATION_CATEGORY = "PINGIT_REMINDER";

export async function setupNotifications(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    return false;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  await Notifications.setNotificationCategoryAsync(NOTIFICATION_CATEGORY, [
    {
      identifier: "YES",
      buttonTitle: "✓ Yes",
      options: {
        opensAppToForeground: false,
      },
    },
    {
      identifier: "NO",
      buttonTitle: "✗ No",
      options: {
        opensAppToForeground: false,
      },
    },
  ]);

  return true;
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Check if a reminder was acknowledged today
 */
export function isAcknowledgedToday(reminder: Reminder): boolean {
  return reminder.lastAcknowledgedDate === getTodayString();
}

/**
 * Get end of today (11:59:59 PM)
 */
function getEndOfToday(): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Schedule all notifications for a reminder until midnight
 */
export async function scheduleNotificationsForReminder(
  reminder: Reminder,
): Promise<string[]> {
  const notificationIds: string[] = [];
  const intervalMs = reminder.intervalMinutes * 60 * 1000;
  const endOfDay = getEndOfToday().getTime();

  // Start from now (or next interval slot)
  let nextTime = Date.now() + intervalMs;

  while (nextTime <= endOfDay) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 PingIt",
          body: reminder.text,
          data: { reminderId: reminder.id },
          categoryIdentifier: NOTIFICATION_CATEGORY,
          sound: true,
        },
        trigger: {
          date: new Date(nextTime),
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      });
      notificationIds.push(id);
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }

    nextTime += intervalMs;
  }

  return notificationIds;
}

/**
 * Cancel all scheduled notifications for a reminder
 */
export async function cancelNotificationsForReminder(
  notificationIds: string[],
): Promise<void> {
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      // Notification may have already fired
    }
  }
}

/**
 * Handle notification action (Yes/No button tap)
 */
export async function handleNotificationResponse(
  response: Notifications.NotificationResponse,
): Promise<void> {
  const { actionIdentifier } = response;
  const reminderId = response.notification.request.content.data
    ?.reminderId as string;

  if (!reminderId) return;

  if (actionIdentifier === "YES") {
    // Acknowledge for today - cancel remaining notifications
    const reminder = await getReminder(reminderId);
    if (reminder) {
      await cancelNotificationsForReminder(reminder.notificationIds);
      reminder.lastAcknowledgedDate = getTodayString();
      reminder.notificationIds = [];
      await updateReminder(reminder);
    }
  }
  // "NO" action - do nothing, notifications continue
}

/**
 * Reconcile reminders on app open - reschedule any that need it
 */
export async function reconcileReminders(
  reminders: Reminder[],
): Promise<Reminder[]> {
  const today = getTodayString();
  const updatedReminders: Reminder[] = [];

  for (const reminder of reminders) {
    // Skip if already acknowledged today
    if (reminder.lastAcknowledgedDate === today) {
      updatedReminders.push(reminder);
      continue;
    }

    // If acknowledged on a previous day, clear the flag
    if (
      reminder.lastAcknowledgedDate &&
      reminder.lastAcknowledgedDate !== today
    ) {
      reminder.lastAcknowledgedDate = undefined;
    }

    // Check if needs scheduling
    if (reminder.notificationIds.length === 0) {
      const newIds = await scheduleNotificationsForReminder(reminder);
      reminder.notificationIds = newIds;
    }

    updatedReminders.push(reminder);
  }

  return updatedReminders;
}
