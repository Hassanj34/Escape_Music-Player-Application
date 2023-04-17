import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

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
              <AntDesign name="closecircle" size={24} color={color.ACTIVE_BG} />
            </TouchableOpacity>
            <Text style={{ color: color.ACTIVE_BG, fontSize: 18, padding: 20 }}>
              Create New Playlist
            </Text>
            <TextInput
              value={playListName}
              onChangeText={(text) => setPLayListName(text)}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleOnSubmit}>
              <Text style={styles.submitButton}>Create</Text>
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
    right: 10,
    padding: 8,
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
  },
  submitButton: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 10,
    marginTop: 15,
    color: color.ACTIVE_FONT,
    fontSize: 18,
    width: 100,
    textAlign: "center",
  },
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayListInputModel;
