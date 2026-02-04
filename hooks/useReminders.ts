import { useCallback, useEffect, useState } from "react";
import {
  cancelNotificationsForReminder,
  isAcknowledgedToday,
  reconcileReminders,
  scheduleNotificationsForReminder,
} from "../lib/notifications";
import {
  addReminder as addReminderToStorage,
  deleteReminder as deleteReminderFromStorage,
  getReminders,
  saveReminders,
} from "../lib/storage";
import { Reminder, ReminderCreate } from "../lib/types";

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReminders = async () => {
      setIsLoading(true);
      try {
        const stored = await getReminders();
        const reconciled = await reconcileReminders(stored);
        await saveReminders(reconciled);
        setReminders(reconciled);
      } catch (error) {
        console.error("Failed to load reminders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReminders();
  }, []);

  const createReminder = useCallback(async (data: ReminderCreate) => {
    const reminder: Reminder = {
      id: generateId(),
      text: data.text,
      intervalMinutes: data.intervalMinutes,
      createdAt: Date.now(),
      notificationIds: [],
    };

    const notificationIds = await scheduleNotificationsForReminder(reminder);
    reminder.notificationIds = notificationIds;

    await addReminderToStorage(reminder);
    setReminders((prev) => [...prev, reminder]);

    return reminder;
  }, []);

  const removeReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder) {
        await cancelNotificationsForReminder(reminder.notificationIds);
        await deleteReminderFromStorage(id);
        setReminders((prev) => prev.filter((r) => r.id !== id));
      }
    },
    [reminders],
  );

  const refresh = useCallback(async () => {
    const stored = await getReminders();
    setReminders(stored);
  }, []);

  const activeReminders = reminders.filter((r) => !isAcknowledgedToday(r));
  const acknowledgedReminders = reminders.filter((r) => isAcknowledgedToday(r));

  return {
    reminders,
    activeReminders,
    acknowledgedReminders,
    isLoading,
    createReminder,
    removeReminder,
    refresh,
  };
}
