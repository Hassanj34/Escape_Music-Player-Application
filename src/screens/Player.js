import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import color from "../misc/color";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  changeAudio,
  moveAudio,
  pause,
  play,
  playNext,
  resume,
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
    <View style={styles.container}>
      <View style={styles.audioCountContainer}>
        <View style={styles.playListAudioCountContainer}>
          {context.isPlayListRunning && (
            <>
              <Text style={{ fontSize: 16 }}>Playing from : </Text>
              <Text
                style={{
                  color: color.ACTIVE_BG,
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
        <MaterialCommunityIcons
          name="music-circle"
          size={300}
          color={context.isPlaying ? color.ACTIVE_BG : color.FONT}
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
            paddingHorizontal: 15,
          }}
        >
          <Text>{convertTime(context.currentAudio.duration)}</Text>
          <Text>{currentPostion ? currentPostion : renderCurrentTime()}</Text>
        </View>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor={color.FONT_MEDIUM}
          maximumTrackTintColor={color.ACTIVE_BG}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  audioCount: {
    textAlign: "right",
    color: color.ACTIVE_BG,
    fontSize: 16,
    paddingTop: 20,
    paddingRight: 10,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
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
