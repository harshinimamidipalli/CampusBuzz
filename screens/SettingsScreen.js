import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Updates from "expo-updates";
import { useTheme } from "../screens/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [checking, setChecking] = useState(false);
  const isDark = theme === "dark";

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  // ✅ Check for updates
  const handleCheckForUpdates = async () => {
    try {
      setChecking(true);
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        alert("New update downloaded! Restarting app...");
        await Updates.reloadAsync();
      } else {
        alert("You’re already using the latest version ✅");
      }
    } catch (e) {
      alert("Error checking for updates: " + e.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.header, { color: "tomato" }]}>⚙️ Settings</Text>

      {/* Theme Toggle */}
      <View style={styles.option}>
        <Text style={[styles.optionText, { color: isDark ? "#fff" : "#000" }]}>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={toggleTheme} thumbColor="tomato" />
      </View>

      {/* Check for Updates */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleCheckForUpdates}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateText}>🔄 Check for Updates</Text>
        )}
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 70,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  optionText: {
    fontSize: 18,
  },
  updateButton: {
    backgroundColor: "tomato",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  updateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#555",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
