import {
  View,
  Text,
  StyleSheet,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import color from "../misc/color";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const OptionModel = ({
  visible,
  onClose,
  currentItem,
  onPlayPress,
  onPlaylistPress,
  options,
}) => {
  const { filename } = currentItem;
  return (
    <>
      <StatusBar hidden={true} />
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View style={styles.modal}>
          <Text numberOfLines={1} style={styles.title}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            {options.map((optn) => {
              return (
                <TouchableWithoutFeedback
                  key={optn.title}
                  onPress={optn.onPress}
                >
                  <LinearGradient
                    colors={["#b80a43", "#5d2379", "#312f94"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.button}
                  >
                    <Text style={styles.option}>{optn.title}</Text>
                  </LinearGradient>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg}></View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
    borderColor: "black",
    borderTopWidth: 1,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    padding: 20,
    paddingBottom: 0,
    color: "black",
    fontFamily: "Lexend-Regular",
  },
  button: {
    width: "50%",
    padding: 5,
    alignItems: "center",
    borderRadius: 15,
  },
  option: {
    fontSize: 16,
    paddingVertical: 8,
    letterSpacing: 1,
    color: "white",
    fontFamily: "Lexend-Regular"
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default OptionModel;
