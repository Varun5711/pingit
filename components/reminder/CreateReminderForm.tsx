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
  const [intervalMinutes, setIntervalMinutes] = useState(30); // Default 30 mins

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
        <Text style={styles.title}>New Ping</Text>
        <Pressable
          onPress={handleSubmit}
          style={[styles.headerButton, !isValid && styles.headerButtonDisabled]}
          disabled={!isValid}
        >
          <Text style={[styles.saveText, !isValid && styles.saveTextDisabled]}>
            Start
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Remind me to..."
            placeholderTextColor="#636366"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={100}
            autoFocus
          />
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>{text.length}/100</Text>
          </View>
        </View>

        <Text style={styles.label}>PING EVERY</Text>
        <View style={styles.intervalGrid}>
          {INTERVAL_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.intervalOption,
                intervalMinutes === option.value &&
                  styles.intervalOptionSelected,
                pressed && { opacity: 0.8 },
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
          <Text style={styles.infoIcon}>⏱️</Text>
          <Text style={styles.infoText}>
            Notifications repeat until you mark them as "Done". Check in
            anytime!
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
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  headerButton: {
    minWidth: 60,
    paddingVertical: 8,
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
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 32,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  input: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "500",
    textAlignVertical: "top",
    flex: 1,
  },
  characterCount: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  characterCountText: {
    color: "#636366",
    fontSize: 12,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  intervalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  intervalOption: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20, // Pill shape
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  intervalOptionSelected: {
    backgroundColor: "#0A84FF",
    borderColor: "#0A84FF",
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  intervalText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  intervalTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  info: {
    flexDirection: "row",
    backgroundColor: "rgba(142, 142, 147, 0.12)",
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    gap: 12,
    alignItems: "center",
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
