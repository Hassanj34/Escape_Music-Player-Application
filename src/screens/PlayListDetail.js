import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import color from "../misc/color";
import AudioListItem from "../components/AudioListItem";
import { selectAudio } from "../misc/audioController";
import { AudioContext } from "../context/AudioProvider";
import OptionModel from "../components/OptionModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Touchable } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PLayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async (audio) => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };

  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      //stop audio
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const newAudios = audios.filter((audio) => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlaylists = JSON.parse(result);
      const updatedPlayLists = oldPlaylists.filter((item) => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }
        return item;
      });

      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }
    setAudios(newAudios);
    closeModal();
  };

  const removePlayList = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (context.isPlayListRunning && activePlayList.id === playList.id) {
      //stop audio
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlaylists = JSON.parse(result);
      const updatedPlayLists = oldPlaylists.filter(
        (item) => item.id !== playList.id
      );

      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }
    props.navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        {audios.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={audios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <AudioListItem
                  title={item.filename}
                  duration={item.duration}
                  isPlaying={context.isPlaying}
                  activeListItem={item.id === context.currentAudio.id}
                  onAudioPress={() => playAudio(item)}
                  onOptionPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              </View>
            )}
          />
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: color.FONT_LIGHT,
              fontSize: 25,
              paddingTop: 50,
            }}
          >
            No audios in playlist
          </Text>
        )}
      </View>
      <OptionModel
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
      <View style={styles.deleteButton}>
        <TouchableOpacity onPress={removePlayList}>
          <MaterialCommunityIcons name="delete-circle" size={40} color="red" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 23,
    paddingTop: 30,
    paddingBottom: 30,
    fontWeight: "bold",
    color: color.ACTIVE_BG,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    padding: 5,
    color: "red",
  },
});

export default PLayListDetail;
