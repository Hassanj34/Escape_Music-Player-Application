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
import { Snackbar } from "react-native-paper";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db, auth, signOut } from "../../firebase";
import { ActivityIndicator } from "react-native";
import color from "../misc/color";

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [datePicker, setDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [docData, setDocData] = useState({});

  const [isloading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const navigation = useNavigation();

  const handleSingOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleUpdate = () => {
    const userData = {
      firstName,
      lastName,
      dateOfBirth: date.toDateString(),
      gender,
      address,
    };
    const updateUserData = async () => {
      const docRef = doc(db, "users", auth.currentUser?.email);

      setSnackBarVisible(true);
      await updateDoc(docRef, userData);
      console.log("Updated user data successfully");

      // Hide the snack bar after 3 seconds
      setTimeout(() => {
        setSnackBarVisible(false);
      }, 3000);
    };
    setIsUpdating(true);
    updateUserData().finally(() => setIsUpdating(false));
  };

  useEffect(() => {
    const getUserData = async () => {
      const docRef = doc(db, "users", auth.currentUser?.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    setIsLoading(true);
    getUserData().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (docData) {
      setFirstName(docData.firstName);
      setLastName(docData.lastName);
      setGender(docData.gender);
      setAddress(docData.address);
      const dateObject = new Date(Date.parse(docData.dateOfBirth));
      setDate(dateObject);
      setEmail(auth.currentUser?.email);
    }
  }, [docData]);

  onDateSelected = (event, value) => {
    setDate(value);
    setDatePicker(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Profile</Text>
      {isloading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
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
            style={styles.input}
            editable={false}
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
      )}
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
      >
        Profile updated
      </Snackbar>

      <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
          Update
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSingOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      <Snackbar
        style={{ backgroundColor: color.ACTIVE_BG, color: "white" }}
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
      >
        {isUpdating ? "Updating profile..." : "Profile updated"}
      </Snackbar>
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
    color: "black",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "white",
    width: "60%",
    position: "absolute",
    bottom: 30,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  updateButton: {
    backgroundColor: "#0782F9",
    width: "60%",
    marginTop: 30,
    padding: 16,
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
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProfileScreen;
