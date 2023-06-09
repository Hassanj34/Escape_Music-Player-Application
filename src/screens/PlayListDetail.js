import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AudioListItem from "../components/AudioListItem";
import { selectAudio } from "../misc/audioController";
import { AudioContext } from "../context/AudioProvider";
import OptionModel from "../components/OptionModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import Icons from "../components/Icons";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons } from "@expo/vector-icons";

const PLayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Custom: require("../../assets/fonts/Custom.ttf"),
      });
    };

    loadFonts();
  }, []);

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
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={{position: "absolute", left: 5, padding: 15}}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{playList.title}</Text>
        </View>

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
          <MaskedView
            style={{ height: 50, marginTop: 50 }}
            maskElement={
              <Text
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: "Lexend-Regular",
                }}
              >
                No audios in playlist
              </Text>
            }
          >
            <LinearGradient
              colors={["#312f94", "#5d2379", "#b80a43"]}
              start={{ x: 0.7, y: 0.8 }}
              end={{ x: 0.3, y: 0.5 }}
              style={{ flex: 1 }}
            />
          </MaskedView>
        )}
        <LinearGradient
          colors={["#b80a43", "#5d2379", "#312f94"]}
          start={{ x: 0.5, y: 0.1 }}
          end={{ x: 0.4, y: 1 }}
          style={[styles.thumbnail]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={removePlayList}
          >
            <Icons name="icon-icons8-delete-96" size={30} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <OptionModel
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    paddingTop: 25,
    paddingBottom: 30,
    color: "white",
    fontFamily: "Lexend-Regular",
  },
  thumbnail: {
    height: 50,
    width: 50,
    flexBasis: 50,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 1,
    borderRadius: 25,
    marginBottom: 30,
  },
  deleteButton: {
    alignSelf: "center",
    color: "red",
  },
});

export default PLayListDetail;
