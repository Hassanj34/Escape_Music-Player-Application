import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import FirebaseNotificationInit from "../components/FireBaseNotification";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Lexend-Regular": require("../../assets/fonts/Lexend-Regular.ttf"),
      });
    };

    loadFonts();

    setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, 2500); // delay for 3 seconds
  }, []);

  return (
    <>
      <FirebaseNotificationInit navigation={navigation} />
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("../../assets/app-logo.png")}
        />
        <Text style={styles.text}>Escape</Text>
      </View>
    </>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  text: {
    fontSize: 34,
    color: "white",
    position: "absolute",
    bottom: 50,
    fontFamily: "Lexend-Regular",
  },
  image: {
    height: height - 600,
    width: width - 150,
  },
});

export default SplashScreen;
