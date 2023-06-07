import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createIconSet } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";

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
    "Custom": require("./assets/fonts/Custom.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // const requestPermissions = () => {
  //   PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //   );
  // };

  // useEffect(() => {
  //   if (requestPermissions()) {
  //     messaging()
  //       .getToken()
  //       .then((token) => {
  //         console.log(token);
  //       });
  //   } else {
  //     console.log("Failed token status");
  //   }

  //   //Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(async (remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open from quit state",
  //           remoteMessage.notification
  //         );
  //       }
  //     });

  //   //When the app is running, but in background
  //   //Assume a message-notification contains a "type" property in the data payload of the screen to open

  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     console.log(
  //       "Notification casused app to open from background state: ",
  //       remoteMessage.notification
  //     );
  //   });

  //   // Register background handler
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log("Message handled in the background!", remoteMessage);
  //   });

  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // });

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
