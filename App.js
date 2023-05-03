import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LogBox } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";

import AppNavigator from "./src/navigation/AppNavigator";
import AudioProvider from "./src/context/AudioProvider";
import color from "./src/misc/color";
import AppStack from "./src/screens/AppStack";

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
  });

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
