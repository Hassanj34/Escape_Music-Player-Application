import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import color from "../misc/color";
import PlayListInputModel from "../components/PlayListInputModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";
import { play } from "../misc/audioController";
import { FlatList } from "react-native";
import PLayListDetail from "../components/PlayListDetail";

let selectedPlayList = {};

const Playlist = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);
  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPLayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, {
        addToPlayList: null,
        playList: updatedList,
      });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPLayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favourites",
        audios: [],
      };
      const newPLayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPLayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPLayList])
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPLayList();
    }
  }, []);

  const handleBannerPress = async (playList) => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");

      let oldList = [];
      let updatedList = [];
      let sameAudio = false;
      if (result !== null) {
        oldList = JSON.parse(result);

        updatedList = oldList.filter((list) => {
          if (list.id === playList.id) {
            //check if same audio already in playlist
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                //alert audio already in playlist
                sameAudio = true;
                return;
              }
            }
            //otherwise update playlist if there is any selected audio
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Duplicate Audio",
          addToPlayList.filename + " is already in this playlist"
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }
      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    //if no audio selected, open playlist
    selectedPlayList = playList;
    // setShowPlayList(true);
    navigation.navigate("PlayListDetail", playList);
  };

  return (
    <>
      {playList.length === 1 ? (
        <Text style={styles.header}>Playlist</Text>
      ) : (
        <Text style={styles.header}>Playlists</Text>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        {playList.length
          ? playList.map((item) => (
              <TouchableOpacity
                key={item.id ? item.id.toString() : null}
                style={styles.playListBanner}
                onPress={() => handleBannerPress(item)}
              >
                <Text>{item.title}</Text>
                <Text style={styles.audioCount}>
                  {item.audios.length === 1
                    ? item.audios.length + " Song"
                    : item.audios.length + " Songs"}
                </Text>
              </TouchableOpacity>
            ))
          : null}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.playListButton}>+ Add New Playlist</Text>
        </TouchableOpacity>
        <PlayListInputModel
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createPLayList}
        />
      </ScrollView>
      <PLayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: "rgba(204, 204, 204, 0.3)",
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
  },

  playListButton: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
  header: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 5,
    color: color.ACTIVE_BG,
  },
});

export default Playlist;
