import { View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const PlayerButton = (props) => {
  let size = 0;
  if (props.iconType == "PLAY" || props.iconType == "PAUSE") {
    size = 60;
  } else {
    size = 35;
  }
  const { iconType, iconColor = "white", onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "play-circle"; //related to play
      case "PAUSE":
        return "md-pause-circle"; //related to pause
      case "NEXT":
        return "play-skip-forward"; //related to next
      case "PREVIOUS":
        return "play-skip-back"; //related to previous
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
