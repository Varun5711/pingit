export interface Reminder {
  id: string;
  text: string;
  intervalMinutes: number;
  createdAt: number;
  lastAcknowledgedDate?: string;
  notificationIds: string[];
}

export type ReminderCreate = Pick<Reminder, "text" | "intervalMinutes">;

export const INTERVAL_OPTIONS = [
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
  { label: "4 hours", value: 240 },
] as const;

export const STORAGE_KEYS = {
  REMINDERS: "@pingit/reminders",
} as const;
