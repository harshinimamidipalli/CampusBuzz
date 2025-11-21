import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function ParEventList({ route, navigation }) {
  const { type } = route.params; // 'technical' or 'cultural'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [route.params?.refresh]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching all", type, "events...");

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("✅ Events fetched:", data.length);
      setEvents(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate("ParEventDetail", { event: item })}
    >
      <Image source={{ uri: item.poster_url }} style={styles.poster} />
      <View style={{ flex: 1 }}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.clubName}>{item.club}</Text>
        <Text style={styles.dateText}>
          {item.day_name} • {item.event_date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Events
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="tomato" style={{ marginTop: 40 }} />
      ) : events.length === 0 ? (
        <Text style={{ color: "#555", marginTop: 30 }}>
          No {type} events available right now.
        </Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
      <TouchableOpacity
      style={{ position: "absolute", top: 30, left: 20, zIndex: 10 }}
      onPress={() => navigation.navigate("ParHome")}
     >
      <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
    marginBottom: 20,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: 10,
  },
  poster: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  eventName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "tomato",
  },
  clubName: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#666",
  },
});
