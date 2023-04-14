import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import color from "../misc/color";

const Playlist = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.playListBanner}>
        <Text>My Favourites</Text>
        <Text style={styles.audioCount}>0 Songs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log("adding to playlist")}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.playListButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
    </ScrollView>
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
});

export default Playlist;
