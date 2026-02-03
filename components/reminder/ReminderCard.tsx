/**
 * Reminder Card Component
 */

import { isAcknowledgedToday } from "@/lib/notifications";
import { Reminder } from "@/lib/types";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
}

export function ReminderCard({ reminder, onDelete }: ReminderCardProps) {
  const isAcknowledged = isAcknowledgedToday(reminder);

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(reminder.id);
  };

  const formatInterval = (minutes: number): string => {
    if (minutes < 60) return `Every ${minutes} min`;
    const hours = minutes / 60;
    return `Every ${hours} ${hours === 1 ? "hour" : "hours"}`;
  };

  return (
    <View style={[styles.card, isAcknowledged && styles.cardAcknowledged]}>
      <View style={styles.content}>
        <Text style={styles.text} numberOfLines={2}>
          {reminder.text}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.interval}>
            {formatInterval(reminder.intervalMinutes)}
          </Text>
          <View
            style={[
              styles.badge,
              isAcknowledged ? styles.badgeAcknowledged : styles.badgeActive,
            ]}
          >
            <Text style={styles.badgeText}>
              {isAcknowledged ? "✓ Done today" : "🔔 Active"}
            </Text>
          </View>
        </View>
      </View>
      <Pressable onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardAcknowledged: {
    opacity: 0.6,
    borderColor: "#3A3A3C",
  },
  content: {
    flex: 1,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  interval: {
    color: "#8E8E93",
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: "rgba(48, 209, 88, 0.2)",
  },
  badgeAcknowledged: {
    backgroundColor: "rgba(142, 142, 147, 0.2)",
  },
  badgeText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 69, 58, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  deleteText: {
    color: "#FF453A",
    fontSize: 16,
    fontWeight: "600",
  },
});
