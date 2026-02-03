/**
 * AsyncStorage wrapper for reminder persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder, STORAGE_KEYS } from "./types";

export async function getReminders(): Promise<Reminder[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get reminders:", error);
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.REMINDERS,
      JSON.stringify(reminders),
    );
  } catch (error) {
    console.error("Failed to save reminders:", error);
  }
}

export async function getReminder(id: string): Promise<Reminder | undefined> {
  const reminders = await getReminders();
  return reminders.find((r) => r.id === id);
}

export async function addReminder(reminder: Reminder): Promise<void> {
  const reminders = await getReminders();
  reminders.push(reminder);
  await saveReminders(reminders);
}

export async function updateReminder(updated: Reminder): Promise<void> {
  const reminders = await getReminders();
  const index = reminders.findIndex((r) => r.id === updated.id);
  if (index !== -1) {
    reminders[index] = updated;
    await saveReminders(reminders);
  }
}

export async function deleteReminder(id: string): Promise<void> {
  const reminders = await getReminders();
  const filtered = reminders.filter((r) => r.id !== id);
  await saveReminders(filtered);
}
