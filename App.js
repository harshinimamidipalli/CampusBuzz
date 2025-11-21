import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Buffer } from "buffer";
import * as Updates from "expo-updates";
import { ThemeProvider } from "./screens/ThemeContext";

// Required for Supabase uploads
global.Buffer = Buffer;

// Import screens
import AuthScreen from "./screens/AuthScreen";
import RoleGate from "./screens/RoleGate";
import OrgHome from "./screens/OrgHome";
import ParHome from "./screens/ParHome";
import OrgEventList from "./screens/OrgEventList";
import OrgCreateEvent from "./screens/OrgCreateEvent";
import OrgEventDetail from "./screens/OrgEventDetail";
import ParEventList from "./screens/ParEventList";
import ParEventDetail from "./screens/ParEventDetail";
import ParRegisterScreen from "./screens/ParRegisterScreen";
import OrgViewRegistrations from "./screens/OrgViewRegistrations";
import AnimatedSplashScreen from "./screens/AnimatedSplashScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // ✅ Automatically check for updates when app opens
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log("Update check failed:", e.message);
      }
    };
    checkForUpdates();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={AnimatedSplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="RoleGate" component={RoleGate} />
          <Stack.Screen name="OrgHome" component={OrgHome} />
          <Stack.Screen name="OrgEventList" component={OrgEventList} />
          <Stack.Screen name="OrgCreateEvent" component={OrgCreateEvent} />
          <Stack.Screen name="OrgEventDetail" component={OrgEventDetail} />
          <Stack.Screen name="ParHome" component={ParHome} />
          <Stack.Screen name="ParEventList" component={ParEventList} />
          <Stack.Screen name="ParEventDetail" component={ParEventDetail} />
          <Stack.Screen name="ParRegisterScreen" component={ParRegisterScreen} />
          <Stack.Screen name="OrgViewRegistrations" component={OrgViewRegistrations} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
