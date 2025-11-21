import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "./ThemeContext"; // ✅ import theme context

export default function ParHome({ navigation }) {
  const { colors } = useContext(ThemeContext); // ✅ use theme

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.title, { color: colors.accent }]}>EVENTS</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("ParEventList", { type: "technical" })}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Technical Events
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("ParEventList", { type: "cultural" })}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Cultural Events
        </Text>
      </TouchableOpacity>

      {/* ⚙️ Settings Button */}
      {/* <TouchableOpacity
        style={[
          styles.settingsButton,
          { backgroundColor: colors.accent, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={[styles.settingsText, { color: colors.buttonText }]}>
          ⚙️ Settings
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 50,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 50,
    marginVertical: 15,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  settingsText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
