import { StyleSheet} from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";

import AudioProvider from "./src/context/AudioProvider";
import color from "./src/misc/color";
import AppStack from "./src/screens/AppStack";

import * as Notifications from "expo-notifications";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: color.APP_BG,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
    Custom: require("./assets/fonts/Custom.ttf"),
  });

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // If the existing status is not granted, request permission from the user
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // If permission is still not granted, display an error message
      if (finalStatus !== "granted") {
        console.log("Failed to get  notification Permissions!");
        return;
      } else {
        console.log(
          "FirebaseNotificationInit  notification Permissions Granted!"
        );
      }
    };

    registerForPushNotificationsAsync();
    // FirebaseNotificationInit();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppStack />
      </NavigationContainer>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
