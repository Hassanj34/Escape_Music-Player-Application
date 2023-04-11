import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Playlist = () => {
  return (
    <View style={styles.container}>
      <Text>Playlist</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Playlist;
