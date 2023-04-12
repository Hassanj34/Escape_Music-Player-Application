import React, { Component, createContext } from "react";
import { Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert("Permission required", "This app needs to read audio files", [
      {
        text: "Okay",
        onPress: () => this.getPermissions(),
      },
      {
        text: "Cancel",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let mediaFiles = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    mediaFiles = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: mediaFiles.totalCount,
    });
    this.totalAudioCount = mediaFiles.totalCount;

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...mediaFiles.assets,
      ]),
      audioFiles: [...audioFiles, ...mediaFiles.assets],
    });
    // console.log(mediaFiles.assets.length);
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
      console.log(currentAudioIndex);
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermissions = async () => {
    const permissions = await MediaLibrary.getPermissionsAsync();

    if (permissions.granted) {
      //get audio files
      this.getAudioFiles();
    }

    if (!permissions.canAskAgain && !permissions.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permissions.granted && permissions.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      console.log(status);

      if (!permissions.canAskAgain && !permissions.granted) {
        this.setState({ ...this.state, permissionError: true });
      }

      if (status == "denied" && canAskAgain) {
        //user must allow permission
        this.permissionAlert();
      }

      if (status == "granted") {
        //get audio files
        this.getAudioFiles();
      }

      if (status == "denied" && !canAskAgain) {
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  componentDidMount() {
    this.getPermissions();
  }

  updateState = (previousState, newState = {}) => {
    this.setState({ ...previousState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    if (permissionError)
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            It looks like you havent accepted permissions
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "grey",
              paddingHorizontal: 10,
            }}
          >
            Kindly allow permissions from app settings on your phone
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          playbackPosition,
          playbackDuration,
          updateState: this.updateState,
          totalAudioCount: this.totalAudioCount,
          loadPreviousAudio: this.loadPreviousAudio,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
