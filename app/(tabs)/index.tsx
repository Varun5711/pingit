/**
 * PingIt - Main Home Screen
 */

import { CreateReminderForm, ReminderCard } from "@/components/reminder";
import { useNotifications } from "@/hooks/useNotifications";
import { useReminders } from "@/hooks/useReminders";
import { ReminderCreate } from "@/lib/types";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    reminders,
    activeReminders,
    acknowledgedReminders,
    isLoading,
    createReminder,
    removeReminder,
    refresh,
  } = useReminders();

  // Set up notifications and handle Yes/No responses
  useNotifications(refresh);

  const handleCreateReminder = async (data: ReminderCreate) => {
    await createReminder(data);
    setModalVisible(false);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const openCreateModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PingIt</Text>
          <Text style={styles.subtitle}>
            {reminders.length === 0
              ? "No reminders yet"
              : `${activeReminders.length} active, ${acknowledgedReminders.length} done today`}
          </Text>
        </View>
        <Pressable onPress={openCreateModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Reminder List */}
      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No reminders yet</Text>
          <Text style={styles.emptyText}>
            {`Tap the + button to create your first reminder.\nIt'll ping you until you say "Yes"!`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReminderCard reminder={item} onDelete={removeReminder} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0A84FF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Reminder Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <CreateReminderForm
          onSubmit={handleCreateReminder}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
