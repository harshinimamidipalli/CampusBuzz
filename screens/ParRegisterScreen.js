import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";

export default function ParRegisterScreen({ route, navigation }) {
  const { event, onRegistered } = route.params;
  const [fullName, setFullName] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState(""); // dropdown value
  const [expectations, setExpectations] = useState("");
  const [loading, setLoading] = useState(false);
  const [participantId, setParticipantId] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, year")
      .eq("id", user.id)
      .single();

    if (!profile) return;

    setParticipantId(profile.id);
    setFullName(profile.full_name || "");
    setYear(profile.year?.toString() || "");
  };

  const handleRegister = async () => {
    if (!fullName || !year || !branch) {
      Alert.alert("Missing Info", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("registrations").insert([
        {
          event_id: event.id,
          participant_id: participantId,
          year: parseInt(year),
          branch,
          expectations,
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "You have successfully registered!", [
        {
          text: "OK",
          onPress: () => {
            if (onRegistered) onRegistered();
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register for {event.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Year (1-4)"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />

      {/* ⭐ Branch Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={branch}
          onValueChange={(value) => setBranch(value)}
          style={styles.dropdown}
        >
          <Picker.Item label="Select Branch" value="" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="ECE" value="ECE" />
          <Picker.Item label="ISE" value="ISE" />
          <Picker.Item label="AIML" value="AIML" />
          <Picker.Item label="AIDS" value="AIDS" />
          <Picker.Item label="CSML" value="CSML" />
          <Picker.Item label="CSDS" value="CSDS" />
        </Picker>
      </View>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="What do you expect from this event? (Optional)"
        value={expectations}
        onChangeText={setExpectations}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Submit Registration"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "tomato",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  dropdownWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
  },
  dropdown: {
    width: "100%",
    height: 60,
  },
  button: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
