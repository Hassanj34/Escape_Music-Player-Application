import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BackHandler } from "react-native";
import * as Font from "expo-font";

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "../../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("AppNavigator", { screen: "AudioList" });
      }
    });
    return unsubscribe;
  }, []);

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with " + user.email);
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <LinearGradient
      colors={["#4f4f4f", "#1d1d1d", "#040404"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={require("../../assets/app-logo.png")}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text
            style={{
              fontFamily: "Lexend-Regular",
              color: "white",
              fontSize: 17,
              paddingBottom: 5,
            }}
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            style={styles.input}
          />
          <Text
            style={{
              fontFamily: "Lexend-Regular",
              color: "white",
              fontSize: 17,
              paddingBottom: 5,
              paddingTop: 10,
            }}
          >
            Password
          </Text>
        </View>
        <View style={styles.passwordInputContainer}>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            style={styles.passwordInput}
            secureTextEntry={passwordVisibility}
          />
          <Pressable
            style={{ marginLeft: 15 }}
            onPress={handlePasswordVisibility}
          >
            <MaterialCommunityIcons name={rightIcon} size={22} color="grey" />
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={{ width: "100%" }}>
            <LinearGradient
              colors={["#b80a43", "#5d2379", "#312f94"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <LinearGradient
              colors={["#b80a43", "#5d2379", "#312f94"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonOutline}
            >
              <View style={styles.circleGradient}>
                <Text style={styles.buttonOutlineText}>Sign up</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  header1: {
    fontSize: 30,
    paddingBottom: 50,
    fontWeight: "600",
    color: "#0782F9",
  },
  header2: {
    fontSize: 30,
    paddingBottom: 50,
    fontWeight: "600",
    color: "grey",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    width: "85%",
  },
  passwordInputContainer: {
    width: "85%",
    flexDirection: "row",
    backgroundColor: "#cdcdcd",
    alignItems: "center",
    borderRadius: 5,
  },
  passwordInput: {
    paddingLeft: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#cdcdcd",
    width: "85%",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#cdcdcd",
  },
  buttonContainer: {
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderRadius: 30,
  },
  buttonOutline: {
    width: "100%",
    padding: 2,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Lexend-Regular",
  },
  buttonOutlineText: {
    margin: 4,
    marginHorizontal: 9,
    paddingHorizontal: 100,
    textAlign: "center",
    color: "#008f68",
    fontSize: 16,
    color: "white",
    fontFamily: "Lexend-Regular",
  },
  circleGradient: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 12,
    width: "100%",
    borderRadius: 30,
  },
  image: {
    height: height - 700,
    width: width - 300,
    marginBottom: 50,
  },
});

export default LoginScreen;
