import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import uuid from "react-native-uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "./ThemeContext";

export default function OrgCreateEvent({ route, navigation }) {
  const { type, existingEvent } = route.params || {};
  const { isDarkMode, colors } = useContext(ThemeContext);

  // Pre-fill fields if editing
  const [name, setName] = useState(existingEvent?.name || "");
  const [club, setClub] = useState(existingEvent?.club || "");
  const [date, setDate] = useState(existingEvent?.event_date || "");
  const [day, setDay] = useState(existingEvent?.day_name || "");
  const [venue, setVenue] = useState(existingEvent?.venue || "");
  const [description, setDescription] = useState(existingEvent?.description || "");
  const [poster, setPoster] = useState(existingEvent?.poster_url || null);
  const [uploading, setUploading] = useState(false);

  // Date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    existingEvent?.event_date ? new Date(existingEvent.event_date) : new Date()
  );

  // Pick image
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Gallery access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPoster(result.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not pick image.");
    }
  };

  // Create OR Update event
  const handleCreateOrUpdate = async () => {
    if (!name || !club || !date || !day || !venue || !description) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in.");

      let posterUrl = existingEvent?.poster_url || null;

      // Only upload if new image picked
      if (poster && !poster.startsWith("https")) {
        const base64 = await FileSystem.readAsStringAsync(poster, { encoding: "base64" });
        const arrayBuffer = decode(base64);
        const fileName = `${uuid.v4()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("event-posters")
          .upload(fileName, arrayBuffer, {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const { data: publicURL } = supabase.storage
          .from("event-posters")
          .getPublicUrl(fileName);

        posterUrl = publicURL.publicUrl;
      }

      // ------------------------ UPDATE EVENT ------------------------
      if (existingEvent) {
        const { error: updateError } = await supabase
          .from("events")
          .update({
            name,
            club,
            event_date: date,
            day_name: day,
            venue,
            description,
            poster_url: posterUrl,
          })
          .eq("id", existingEvent.id);

        if (updateError) throw updateError;

        Alert.alert("Success", "Event updated successfully!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OrgEventList", {
                type: existingEvent.type, // ← Correct category
                refresh: Date.now(),
              }),
          },
        ]);

        return;
      }

      // ------------------------ CREATE EVENT ------------------------
      const { error } = await supabase.from("events").insert([
        {
          organizer_id: user.id,
          type,
          name,
          club,
          event_date: date,
          day_name: day,
          venue,
          description,
          poster_url: posterUrl,
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Event posted successfully!", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("OrgEventList", {
              type: type, // ← Correct category
              refresh: Date.now(),
            }),
        },
      ]);
    } catch (err) {
      console.error("Upload Error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 70 }]}>
        <Text style={[styles.title, { color: colors.accent }]}>
          {existingEvent ? "Edit Event" : "Add New Event"}
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
          placeholder="Event Name"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
          placeholder="Club Name"
          placeholderTextColor={colors.placeholder}
          value={club}
          onChangeText={setClub}
        />

        {/* Date Picker */}
        <TouchableOpacity
          style={[styles.input, { backgroundColor: colors.inputBackground }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: date ? colors.text : colors.placeholder }}>
            {date ? `📅 ${date}` : "Select Event Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            onChange={(event, chosenDate) => {
              setShowDatePicker(false);
              if (chosenDate) {
                const formatted = chosenDate.toISOString().split("T")[0];
                const dayName = chosenDate.toLocaleDateString("en-US", { weekday: "long" });
                setDate(formatted);
                setDay(dayName);
                setSelectedDate(chosenDate);
              }
            }}
          />
        )}

        <View style={[styles.input, { backgroundColor: colors.inputBackground }]}>
          <Text style={{ color: day ? colors.text : colors.placeholder }}>
            {day ? `🗓️ ${day}` : "Day will appear automatically"}
          </Text>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
          placeholder="Venue"
          placeholderTextColor={colors.placeholder}
          value={venue}
          onChangeText={setVenue}
        />

        <TextInput
          style={[
            styles.input,
            { height: 100, backgroundColor: colors.inputBackground, color: colors.text },
          ]}
          placeholder="Event Description"
          placeholderTextColor={colors.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={[styles.imagePicker, { backgroundColor: colors.accent }]} onPress={pickImage}>
          <Text style={styles.imagePickerText}>{poster ? "Change Poster" : "Upload Poster"}</Text>
        </TouchableOpacity>

        {poster && <Image source={{ uri: poster }} style={styles.posterPreview} />}

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.accent }, uploading && { opacity: 0.7 }]}
          onPress={handleCreateOrUpdate}
          disabled={uploading}
        >
          <Text style={styles.submitText}>
            {uploading ? (existingEvent ? "Updating..." : "Posting...") : existingEvent ? "Save Changes" : "Post Event"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: "#888",
  },
  imagePicker: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  imagePickerText: {
    color: "white",
    fontWeight: "bold",
  },
  posterPreview: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginVertical: 10,
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});
