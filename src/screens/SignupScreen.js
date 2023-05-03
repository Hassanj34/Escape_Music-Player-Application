import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, setDoc } from "firebase/firestore";

import {
  db,
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "../../firebase";

const SignupScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date());
  const [datePicker, setDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const navigation = useNavigation();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with " + user.email);
      })
      .then(async () => {
        await setDoc(doc(db, "users", email), {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: date.toDateString(),
          gender: gender,
          address: address,
        });
        console.log(
          "Added user doc with first name " +
            firstName +
            " and last name " +
            lastName
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

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

  onDateSelected = (event, value) => {
    setDate(value);
    setDatePicker(false);
  };

  return (
    <LinearGradient
      colors={["#4f4f4f", "#1d1d1d", "#040404"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        behavior="padding"
      >
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require("../../assets/app-logo.png")}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
            }}
            style={styles.input}
          />
          <Text style={styles.labelText}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
            }}
            style={styles.input}
          />
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            style={styles.input}
          />
          <Text style={styles.labelText}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            style={styles.input}
            secureTextEntry
          />
          <Text style={styles.labelText}>Date of Birth</Text>
          <TouchableOpacity>
            <TextInput
              value={date.toDateString()}
              style={styles.input}
              onPressIn={() => setDatePicker(true)}
            />
          </TouchableOpacity>
          {datePicker ? (
            <DateTimePicker
              value={date}
              mode={"date"}
              display={"default"}
              is24Hour={false}
              onChange={onDateSelected}
            />
          ) : null}
          <Text style={styles.labelText}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={(text) => {
              setGender(text);
            }}
            style={styles.input}
          />
          <Text style={styles.labelText}>Address</Text>
          <TextInput
            value={address}
            onChangeText={(text) => {
              setAddress(text);
            }}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={{ width: "100%" }}>
            <LinearGradient
              colors={["#b80a43", "#5d2379", "#312f94"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    paddingBottom: 50,
    fontWeight: "600",
    color: "#0782F9",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "85%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#cdcdcd",
  },
  labelText: {
    fontFamily: "Lexend-Regular",
    color: "white",
    fontSize: 17,
    paddingBottom: 2,
    paddingTop: 7,
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
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Lexend-Regular",
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  image: {
    height: height - 750,
    width: width - 300,
    marginBottom: 10,
  },
});

export default SignupScreen;
