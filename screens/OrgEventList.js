import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext"; // ✅ Import theme

export default function OrgEventList({ route, navigation }) {
  const { type } = route.params; // 'technical' or 'cultural'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext); // ✅ Get theme colors

  useEffect(() => {
    fetchEvents();
  }, [route.params?.refresh]); // 👈 triggers refetch when refresh=true

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEvents(data);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.eventCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => navigation.navigate("OrgEventDetail", { event: item })}
    >
      <Text style={[styles.eventName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.eventClub, { color: colors.subText }]}>
        {item.club}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.title, { color: colors.accent }]}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Events
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
      ) : events.length === 0 ? (
        <Text style={{ marginTop: 40, color: colors.subText }}>
          No events posted yet.
        </Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Floating + Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("OrgCreateEvent", { type })}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
      style={{ position: "absolute", top: 30, left: 20, zIndex: 10 }}
      onPress={() => navigation.navigate("OrgHome")}
      >
      <Ionicons name="arrow-back" size={28} color={colors.text} />
      </TouchableOpacity>

    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  eventCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventClub: {
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
});
