import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

const SplashScreen = () => {
  const navigation = useNavigation();

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
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={require("../../assets/app-logo.png")}
      />
      <Text style={styles.text}>Escape</Text>
    </View>
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
