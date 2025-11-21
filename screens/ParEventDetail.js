import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function ParEventDetail({ route, navigation }) {
  const { event } = route.params;
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantId, setParticipantId] = useState(null);

  useEffect(() => {
    checkRegistration();
  }, []);

  // 🔍 Check if user is already registered
  const checkRegistration = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setParticipantId(user.id);

    const { data } = await supabase
      .from("registrations")
      .select("id")
      .eq("event_id", event.id)
      .eq("participant_id", user.id)
      .maybeSingle();

    setIsRegistered(!!data);
  };

  // 📝 Register → Navigate to form
  const handleRegister = () => {
    navigation.navigate("ParRegisterScreen", {
      event,
      onRegistered: () => setIsRegistered(true),
    });
  };

  // ❌ Unregister logic
  const handleUnregister = async () => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("event_id", event.id)
      .eq("participant_id", participantId);

    if (error) {
      Alert.alert("Error", "Unable to unregister.");
      return;
    }

    Alert.alert("Unregistered", "You unregistered from this event.");
    setIsRegistered(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: event.poster_url }} style={styles.poster} />

        <View style={styles.card}>
          <Text style={styles.name}>{event.name}</Text>
          <Text style={styles.club}>Conducted by: {event.club}</Text>
          <Text style={styles.date}>
            {event.day_name} • {event.event_date}
          </Text>
          <Text style={styles.venue}>Venue: {event.venue}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* REGISTER / UNREGISTER BUTTON */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            isRegistered && { backgroundColor: "gray" },
          ]}
          onPress={isRegistered ? handleUnregister : handleRegister}
        >
          <Text style={styles.registerText}>
            {isRegistered ? "Unregister" : "Register"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
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
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
    marginBottom: 8,
  },
  club: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  date: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  venue: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
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
  registerButton: {
    backgroundColor: "tomato",
    padding: 14,
    borderRadius: 12,
    width: "80%",
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
