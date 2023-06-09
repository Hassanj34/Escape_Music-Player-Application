import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";

const FirebaseNotificationInit = () => {

  messaging()
    .getToken()
    .then(async (token) => {
      console.log("Device Token : ", token);
    });
  messaging().onTokenRefresh((token) => {
    console.log("Device Token Updated: " + token);
  });
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
    // navigation.navigate("TakePicture");
  });
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
      }
    });
  messaging().onMessage(async (remoteMessage) => {
    return Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      [
        { text: "Okay", onPress: () => {} },
      ]
    );
  });

  return <View></View>;
};
export default FirebaseNotificationInit;
