/**
 * Create Reminder Form Modal
 */

import { INTERVAL_OPTIONS, ReminderCreate } from "@/lib/types";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface CreateReminderFormProps {
  onSubmit: (data: ReminderCreate) => void;
  onCancel: () => void;
}

export function CreateReminderForm({
  onSubmit,
  onCancel,
}: CreateReminderFormProps) {
  const [text, setText] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(180); // Default 3 hours

  const handleSubmit = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit({ text: text.trim(), intervalMinutes });
  };

  const isValid = text.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New Reminder</Text>
        <Pressable
          onPress={handleSubmit}
          style={[styles.headerButton, !isValid && styles.headerButtonDisabled]}
          disabled={!isValid}
        >
          <Text style={[styles.saveText, !isValid && styles.saveTextDisabled]}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>What do you need to remember?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Take medication, Drink water..."
          placeholderTextColor="#8E8E93"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={100}
          autoFocus
        />

        <Text style={styles.label}>Ping me every...</Text>
        <View style={styles.intervalGrid}>
          {INTERVAL_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.intervalOption,
                intervalMinutes === option.value &&
                  styles.intervalOptionSelected,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setIntervalMinutes(option.value);
              }}
            >
              <Text
                style={[
                  styles.intervalText,
                  intervalMinutes === option.value &&
                    styles.intervalTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.info}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            {`Notifications will repeat until you tap "Yes" or delete the reminder. Tapping "Yes" stops notifications for today only — it'll come back tomorrow!`}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  cancelText: {
    color: "#FF453A",
    fontSize: 17,
  },
  saveText: {
    color: "#0A84FF",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "right",
  },
  saveTextDisabled: {
    color: "#3A3A3C",
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 17,
    minHeight: 80,
    textAlignVertical: "top",
  },
  intervalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  intervalOption: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  intervalOptionSelected: {
    borderColor: "#0A84FF",
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  intervalText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  intervalTextSelected: {
    color: "#0A84FF",
    fontWeight: "600",
  },
  info: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    color: "#8E8E93",
    fontSize: 13,
    lineHeight: 18,
  },
});
