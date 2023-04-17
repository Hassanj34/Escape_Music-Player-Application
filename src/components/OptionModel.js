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
                  <Text style={styles.option}>{optn.title}</Text>
                </TouchableWithoutFeedback>
              );
            })}
            {/* <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlaylistPress}>
              <Text style={styles.option}>Add to playlist</Text>
            </TouchableWithoutFeedback> */}
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
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});

export default OptionModel;
