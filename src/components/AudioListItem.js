import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import { Dimensions } from "react-native";
import { TouchableWithoutFeedback, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

const getThumbnailText = (filename) => filename[0].toUpperCase();

const convertTime = (minutes) => {
  if (minutes) {
    const hours = minutes / 60;
    const minute = hours.toString().split(".")[0];
    const percent = parseInt(hours.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return "0" + minute + ":" + "0" + sec;
    }
    if (parseInt(minute) < 10) {
      return "0" + minute + ":" + sec;
    }
    if (sec < 10) {
      return minute + ":" + "0" + sec;
    }

    return minute + ":" + sec;
  }
};

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />;
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Lexend-Regular": require("../../assets/fonts/Lexend-Regular.ttf"),
      });
    };

    loadFonts();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <LinearGradient
              colors={["#b80a43", "#5d2379", "#312f94"]}
              start={{ x: 0.5, y: 0.1 }}
              end={{ x: 0.4, y: 1 }}
              style={[styles.thumbnail]}
            >
              <View>
                {activeListItem ? (
                  renderPlayPauseIcon(isPlaying)
                ) : (
                  <Image
                    source={require("../../assets/Audacity.png")}
                    resizeMode="contain"
                    style={{ width: 40, height: 40 }}
                  />
                )}
              </View>
            </LinearGradient>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color="white"
            onPress={onOptionPress}
            style={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={styles.seperator}></View>
    </>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 30,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    // marginTop: 60,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: "white",
    fontFamily: "Lexend-Regular"
  },
  seperator: {
    width: width - 80,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Lexend-Regular",
  },
});

export default AudioListItem;
