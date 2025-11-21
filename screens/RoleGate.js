import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import { ThemeContext } from "./ThemeContext";

export default function RoleGate({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { colors } = useContext(ThemeContext);

  const handleSaveProfile = async () => {
    if (!fullName || !year || !role) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("No active session. Please log in again.");
      }

      const user = sessionData.session.user;

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        year: parseInt(year),
        role: role,
      });

      if (error) throw error;

      Alert.alert("Profile Saved", "Redirecting...");
      if (role === "organizer") {
        navigation.replace("OrgHome");
      } else {
        navigation.replace("ParHome");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 70 },
      ]}
    >
      <Text style={[styles.title, { color: colors.accent }]}>
        Complete Your Profile
      </Text>

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Full Name"
        placeholderTextColor={colors.placeholder}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Year (1-4)"
        placeholderTextColor={colors.placeholder}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            { borderColor: colors.accent },
            role === "organizer" && { backgroundColor: colors.accent },
          ]}
          onPress={() => setRole("organizer")}
        >
          <Text
            style={[
              styles.roleText,
              {
                color:
                  role === "organizer" ? colors.buttonText : colors.accent,
              },
            ]}
          >
            Organizer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            { borderColor: colors.accent },
            role === "participant" && { backgroundColor: colors.accent },
          ]}
          onPress={() => setRole("participant")}
        >
          <Text
            style={[
              styles.roleText,
              {
                color:
                  role === "participant" ? colors.buttonText : colors.accent,
              },
            ]}
          >
            Participant
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        onPress={handleSaveProfile}
        disabled={loading}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>
          {loading ? "Saving..." : "Save & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  roleButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  roleText: {
    fontWeight: "bold",
  },
  saveButton: {
    padding: 12,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
  },
});
