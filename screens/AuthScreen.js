import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import { ThemeContext } from "./ThemeContext"; // ✅ import context

export default function AuthScreen({ navigation }) {
  const { isDarkMode, colors } = useContext(ThemeContext); // ✅ access theme
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const userId = data?.user?.id;
        if (!userId) throw new Error("Login failed, please try again.");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (profileError && profileError.code !== "PGRST116") throw profileError;

        if (!profile) {
          navigation.replace("RoleGate");
        } else if (profile.role === "organizer") {
          navigation.replace("OrgHome");
        } else {
          navigation.replace("ParHome");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        Alert.alert("Success", "Account created! Redirecting...");
        navigation.replace("RoleGate");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "organizer") {
          navigation.replace("OrgHome");
        } else if (profile?.role === "participant") {
          navigation.replace("ParHome");
        } else {
          navigation.replace("RoleGate");
        }
      }
    };

    checkSession();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 70 },
      ]}
    >
      <Text style={[styles.title, { color: colors.accent }]}>CampusBuzz</Text>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.inputBackground,
            borderColor: colors.accent,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.inputBackground,
            borderColor: colors.accent,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={handleAuth}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          {isLogin ? "Login" : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={[styles.switchText, { color: colors.accent }]}>
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    padding: 12,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 10,
  },
});
