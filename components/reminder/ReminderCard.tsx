import { isAcknowledgedToday } from "@/lib/notifications";
import { Reminder } from "@/lib/types";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReminderCard({ reminder, onDelete, index }: ReminderCardProps) {
  const isAcknowledged = isAcknowledgedToday(reminder);
  const scale = useSharedValue(1);

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(reminder.id);
  };

  const formatInterval = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = minutes / 60;
    return `${hours}${hours === 1 ? "h" : "h"}`;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOut}
      layout={LinearTransition}
      style={styles.container}
    >
      <AnimatedPressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.card,
          animatedStyle,
          isAcknowledged && styles.cardAcknowledged,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.text, isAcknowledged && styles.textAcknowledged]}
              numberOfLines={2}
            >
              {reminder.text}
            </Text>
            {isAcknowledged && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.timeTag}>
              <Text style={styles.timeIcon}>↻</Text>
              <Text style={styles.interval}>
                {formatInterval(reminder.intervalMinutes)}
              </Text>
            </View>
            <View style={styles.statusDotContainer}>
              <View
                style={[
                  styles.statusDot,
                  isAcknowledged ? styles.dotInactive : styles.dotActive,
                ]}
              />
              <Text style={styles.statusText}>
                {isAcknowledged ? "Done" : "Active"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          hitSlop={10}
        >
          <Text style={styles.deleteText}>×</Text>
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderCurve: "continuous", // iOS 13+ sleek corners
    // Subtle border for definition
    borderWidth: 1,
    borderColor: "#2C2C2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardAcknowledged: {
    backgroundColor: "#151516",
    borderColor: "#1C1C1E",
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    flexShrink: 1,
    marginRight: 8,
  },
  textAcknowledged: {
    color: "#636366",
    textDecorationLine: "line-through",
  },
  checkBadge: {
    backgroundColor: "#32D74B",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    color: "#000",
    fontSize: 12,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timeIcon: {
    color: "#8E8E93",
    fontSize: 12,
  },
  interval: {
    color: "#EBEBF5",
    fontSize: 13,
    fontWeight: "500",
  },
  statusDotContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: "#0A84FF",
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  dotInactive: {
    backgroundColor: "#636366",
  },
  statusText: {
    fontSize: 12,
    color: "#636366",
    fontWeight: "500",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(60, 60, 67, 0.3)", // Transparent dark gray
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonPressed: {
    backgroundColor: "rgba(255, 69, 58, 0.2)",
  },
  deleteText: {
    color: "#8E8E93",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: -2, // Visual optical adjustment
  },
});
