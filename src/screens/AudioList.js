import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import { Audio } from "expo-av";

import AudioListItem from "../components/AudioListItem";
import OptionModel from "../components/OptionModel";
import { AudioContext } from "../context/AudioProvider";
import {
  pause,
  play,
  playNext,
  resume,
  selectAudio,
} from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";
import color from "../misc/color";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModelVisible: false,
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
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        duration={item.duration}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModelVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState.bind(this.context)({
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("Playlist");
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <View style={{ flex: 1, marginBottom: 20, marginTop: 20 }}>
              <Text style={styles.header}>Device Audios</Text>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              ></RecyclerListView>
              <OptionModel
                options={[
                  {
                    title: "Add to playlist",
                    onPress: this.navigateToPlaylist,
                  },
                ]}
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
  header: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 30,
    color: color.ACTIVE_BG,
  },
});

export default AudioList;
