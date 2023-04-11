import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import { Audio } from "expo-av";

import AudioListItem from "../components/AudioListItem";
import OptionModel from "../components/OptionModel";
import { AudioContext } from "../context/AudioProvider";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModelVisible: false,
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      dim.width = Dimensions.get("window").width;
      dim.height = 70;
    }
  );

  handleAudioPress = async (audio) => {
    //playing audio for first time
    if (this.state.soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );
      return this.setState({
        ...this.state,
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
      });
    }

    //pause audio
    if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
      const status = await this.state.playbackObj.setStatusAsync({
        shouldPlay: false,
      });
      return this.setState({
        ...this.state,
        soundObj: status,
      });
    }

    //resume audio
    if (
      this.state.soundObj.isLoaded &&
      !this.state.soundObj.isPlaying &&
      this.state.currentAudio.id === audio.id
    ) {
      const status = await this.state.playbackObj.playAsync();
      return this.setState({
        ...this.state,
        soundObj: status,
      });
    }
  };

  rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModelVisible: true });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              ></RecyclerListView>
              <OptionModel
                onPlayPress={() => console.log("playing audio")}
                onPlaylistPress={() => console.log("adding to playlist")}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModelVisible: false })
                }
                visible={this.state.optionModelVisible}
              ></OptionModel>
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioList;
