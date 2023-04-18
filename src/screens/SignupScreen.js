import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Create Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="Last name"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity>
          <TextInput
            placeholder="Date of Birth"
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
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={(text) => {
            setGender(text);
          }}
          style={styles.input}
        />
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
          }}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Create</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

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
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
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
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default SignupScreen;
