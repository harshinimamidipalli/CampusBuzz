import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, Animated, Easing } from "react-native";

export default function AnimatedSplashScreen({ navigation }) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.7);

  useEffect(() => {
    // Fade + Scale animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(800),
    ]).start(() => {
      // After animation → go to Auth screen
      navigation.replace("Auth");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/CampusBuzz_Logo.jpg")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.appName, { opacity }]}>
        CampusBuzz
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity }]}>
        Connect. Discover. Experience.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "tomato",
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    fontStyle: "italic",
  },
});
