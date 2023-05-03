import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Snackbar } from "react-native-paper";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getBytes, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, auth, signOut, storage } from "../../firebase";
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

  const [image, setImage] = useState(null);
  const [downloadedImage, setDownloadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [docData, setDocData] = useState({});

  const [isloading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getUserData = async () => {
      const docRef = doc(db, "users", auth.currentUser?.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    setIsLoading(true);
    getUserData().finally(() => setIsLoading(false));
    downloadImage();
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

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

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
      setTimeout(() => {
        setSnackBarVisible(false);
      }, 3000);
    };
    setIsUpdating(true);
    updateUserData().finally(() => setIsUpdating(false));
  };

  const downloadImage = async () => {
    let imagePath = "images/" + auth.currentUser?.email + ".jpg";
    const downloadReference = ref(storage, imagePath);
    getDownloadURL(downloadReference)
      .then((url) => {
        setDownloadedImage(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  };

  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    let imagePath = "images/" + auth.currentUser?.email + ".jpg";
    const imagesRef = ref(storage, imagePath);
    setUploading(true);
    await uploadBytes(imagesRef, blob).finally(() => setUploading(false));
    if (!uploading) {
      downloadImage();
    }
  };

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const selectImagePicker = () => {
    Alert.alert(
      "Upload profile picture",
      "Select image from gallery or take a picture from camera",
      [
        {
          text: "Select image from gallery",
          onPress: showImagePicker,
        },
        {
          text: "Take a photo",
          onPress: openCamera,
        },
      ]
    );
  };

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
          <View style={styles.imageContainer}>
            {downloadImage ? (
              downloadedImage && (
                <TouchableOpacity onPress={selectImagePicker}>
                  <Image
                    source={{ uri: downloadedImage }}
                    resizeMode="cover"
                    style={styles.image}
                  />
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity onPress={selectImagePicker}>
                {image ? (
                  image && (
                    <Image
                      source={{ uri: image }}
                      resizeMode="cover"
                      style={styles.image}
                    />
                  )
                ) : (
                  <Image
                    source={require("../../assets/userProfile.png")}
                    resizeMode="cover"
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
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
    bottom: 10,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  updateButton: {
    backgroundColor: "#0782F9",
    width: "60%",
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
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "30%",
    height: "20%",
    marginBottom: 50,
  },
  image: {
    width: "30%",
    height: "40%",
    borderWidth: 1,
    borderRadius: 200,
    padding: 50,
  },
});

export default ProfileScreen;
