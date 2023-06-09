import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import color from "../misc/color";
import PlayListInputModel from "../components/PlayListInputModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";
import { LinearGradient } from "expo-linear-gradient";
import PLayListDetail from "../components/PlayListDetail";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Font from "expo-font";
import NotificationCall from "../components/NotificationCall";

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
    const loadFonts = async () => {
      await Font.loadAsync({
        "Lexend-Regular": require("../../assets/fonts/Lexend-Regular.ttf"),
      });
    };

    loadFonts();
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
      
      NotificationCall(addToPlayList.filename, playList.title);
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    //if no audio selected, open playlist
    selectedPlayList = playList;
    navigation.navigate("PlayListDetail", playList);
  };

  return (
    <>
      {playList.length === 1 ? (
        <Text style={styles.header}>My Playlist</Text>
      ) : (
        <Text style={styles.header}>My Playlists</Text>
      )}
      {playList.length === 0 ? (
        <Text style={styles.noPlaylist}>No playlists</Text>
      ) : null}
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {playList.length
            ? playList.map((item) => (
                <TouchableOpacity
                  key={item.id ? item.id.toString() : null}
                  style={styles.playListBanner}
                  onPress={() => handleBannerPress(item)}
                >
                  <View style={{ flexDirection: "row" }}>
                    <LinearGradient
                      colors={["#b80a43", "#5d2379", "#312f94"]}
                      start={{ x: 0.5, y: 0.1 }}
                      end={{ x: 0.4, y: 1 }}
                      style={[styles.thumbnail]}
                    >
                      <Image
                        source={require("../../assets/Audacity2.png")}
                        resizeMode="contain"
                        style={{ width: 40, height: 40 }}
                      />
                    </LinearGradient>
                    <View style={{ marginTop: 5 }}>
                      <Text
                        style={{ color: "white", fontFamily: "Lexend-Regular" }}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.audioCount}>
                        {item.audios.length === 1
                          ? item.audios.length + " Song"
                          : item.audios.length + " Songs"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : null}

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginTop: 15 }}
          >
            <MaskedView
              style={{ height: 45 }}
              maskElement={
                <Text style={styles.playListButton}>+ Add new playlist</Text>
              }
            >
              <LinearGradient
                colors={["#b80a43", "#5d2379", "#312f94"]}
                start={{ x: 0, y: 0.8 }}
                end={{ x: 0.3, y: 0.5 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "black",
  },
  playListBanner: {
    padding: 5,
    backgroundColor: "black",
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    fontSize: 14,
    color: "white",
    fontFamily: "Lexend-Regular",
  },

  playListButton: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 18,
    padding: 5,
  },
  header: {
    textAlign: "center",
    fontSize: 26,
    paddingTop: 30,
    paddingBottom: 5,
    color: "white",
    backgroundColor: "black",
    fontFamily: "Lexend-Regular",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    marginRight: 20,
  },
  noPlaylist: {
    textAlign: "center",
    fontSize: 25,
    paddingTop: 30,
    paddingBottom: 5,
    color: color.FONT_LIGHT,
    backgroundColor: "black",
    fontFamily: "Lexend-Regular",
  },
});

export default Playlist;
