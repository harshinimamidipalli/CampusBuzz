import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function OrgEventDetail({ route, navigation }) {
  const { event } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>No event data available.</Text>
      </View>
    );
  }

  // ✅ Delete event
  const handleDelete = async () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            const { error } = await supabase
              .from("events")
              .delete()
              .eq("id", event.id);

            if (error) throw error;

            Alert.alert("Deleted", "Event deleted successfully!");
            navigation.navigate("OrgEventList", {
              type: event.type,
              refresh: true,
            });
          } catch (err) {
            console.error("Delete Error:", err.message);
            Alert.alert("Error", "Failed to delete event.");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  // ✅ Edit event
  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate("OrgCreateEvent", {
      type: event.type,
      existingEvent: event,
    });
  };

  // ✅ Navigate to Registrations page
  const handleViewRegistrations = () => {
    setMenuVisible(false);
    navigation.navigate("OrgViewRegistrations", { event });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: event.poster_url }} style={styles.poster} />

        <View style={styles.card}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.club}>Conducted by: {event.club}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="tomato" />
            <Text style={styles.detailText}>
              {event.day_name} • {event.event_date}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="tomato" />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* All Tomato Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewRegistrations}
          >
            <Ionicons name="people-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>View Registrations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="settings-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Manage Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ⚙️ Manage Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Edit Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Ionicons name="trash-outline" size={20} color="tomato" />
              <Text style={[styles.menuText, { color: "tomato" }]}>
                {deleting ? "Deleting..." : "Delete Event"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close-outline" size={20} color="gray" />
              <Text style={styles.menuText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 70,
  },
  scroll: {
    padding: 20,
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  eventName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "tomato",
    marginBottom: 6,
    textAlign: "center",
  },
  club: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "tomato",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "justify",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 25,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "tomato",
    padding: 14,
    borderRadius: 30,
    width: "80%",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "tomato",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  menuText: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
