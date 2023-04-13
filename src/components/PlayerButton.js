import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import color from "../misc/color";

const PlayerButton = (props) => {
  const { iconType, size = 40, iconColor = color.FONT, onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PAUSE":
        return "md-play-circle-outline"; //related to play
      case "PLAY":
        return "pause-circle-outline"; //related to pause
      case "NEXT":
        return "play-skip-forward-outline"; //related to next
      case "PREVIOUS":
        return "play-skip-back-outline"; //related to previous
    }
  };

  return (
    <View>
      <Ionicons
        {...props}
        onPress={onPress}
        name={getIconName(iconType)}
        size={size}
        color={iconColor}
      />
    </View>
  );
};

export default PlayerButton;
