import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, 2500); // delay for 3 seconds
  }, []);

  return (
    <LinearGradient
      colors={["#54c5f8", "#87e36f", "#fdd977"]}
      style={styles.container}
    >
      <Image
        style={styles.image}
        resizeMode="cover"
        source={require("../../assets/icons8-headphones-64.png")}
      />
      <Text style={styles.text}>Music Player</Text>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 34,
    color: "#19829A",
    marginBottom: 20,
    paddingTop: 200,
  },
  image: {
    height: height - 700,
    width: width - 250,
  },
});

export default SplashScreen;
