import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import color from "../misc/color";

const PlayListInputModel = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPLayListName] = useState("");

  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPLayListName("");
      onClose();
    }
  };
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBG}>
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                marginBottom: 50,
                fontFamily: "Lexend-Regular",
              }}
            >
              Create New Playlist
            </Text>
            <TextInput
              value={playListName}
              onChangeText={(text) => setPLayListName(text)}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={handleOnSubmit}
              style={{
                width: "50%",
                alignContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <LinearGradient
                colors={["#b80a43", "#5d2379", "#312f94"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <Text style={styles.submitButton}>Create</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 1,
    padding: 8,
  },
  button: {
    width: "70%",
    padding: 5,
    alignItems: "center",
    borderRadius: 15,
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontSize: 18,
    paddingVertical: 5,
    fontFamily: "Lexend-Regular",
    color: "white",
  },
  submitButton: {
    padding: 5,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    color: "white",
  },
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayListInputModel;
