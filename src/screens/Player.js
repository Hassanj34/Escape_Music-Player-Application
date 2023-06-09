import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import * as Font from "expo-font";

import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  changeAudio,
  moveAudio,
  pause,
  selectAudio,
} from "../misc/audioController";
import { convertTime, storeAudioForNextOpening } from "../misc/helper";

const { width } = Dimensions.get("window");

const Player = () => {
  const [currentPostion, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }

    return 0;
  };

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, "next");
  };

  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Lexend-Regular": require("../../assets/fonts/Lexend-Regular.ttf"),
      });
    };

    loadFonts();
    context.loadPreviousAudio();
  }, []);

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  if (!context.currentAudio) return null;

  return (
    <ImageBackground
      source={require("../../assets/player-background.png")}
      resizeMode="cover"
      style={{
        flex: 1,
        opacity: 0.9,
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={styles.playListAudioCountContainer}>
            {context.isPlayListRunning && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontFamily: "Lexend-Regular",
                  }}
                >
                  Playing from :{" "}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  {context.activePlayList.title}
                </Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>
            {context.currentAudioIndex + 1 + " / " + context.totalAudioCount}
          </Text>
        </View>

        <View style={styles.midBannerContainer}>
          <Image
            source={require("../../assets/music.png")}
            resizeMode="cover"
            style={{ height: 250, width: 250 }}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <Text style={{ color: "white", fontFamily: "Lexend-Regular" }}>
              {convertTime(context.currentAudio.duration)}
            </Text>
            <Text style={{ color: "white", fontFamily: "Lexend-Regular" }}>
              {currentPostion ? currentPostion : renderCurrentTime()}
            </Text>
          </View>
          <Slider
            style={{ width: width - 30, height: 40, alignSelf: "center" }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor="white"
            maximumTrackTintColor="white"
            thumbTintColor="white"
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log(
                  "error insisde onSlidingStart callback",
                  error.message
                );
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREVIOUS" onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 15 }}
              iconType={context.isPlaying ? "PAUSE" : "PLAY"}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioPlayerContainer: {
    marginBottom: 5,
  },
  audioCount: {
    textAlign: "right",
    color: "white",
    fontSize: 16,
    paddingTop: 20,
    paddingRight: 10,
    fontFamily: "Lexend-Regular",
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 20,
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
    fontWeight: "600",
    fontFamily: "Lexend-Regular",
  },
  audioControllers: {
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  playListAudioCountContainer: {
    flexDirection: "row",
    paddingTop: 20,
  },
});

export default Player;
