import React from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AudioPlayer from "../components/AudioPlayer";

type PlayerScreenRouteProp = RouteProp<{ Player: { audio: any } }, "Player">;

const PlayerScreen: React.FC = () => {
  const route = useRoute<PlayerScreenRouteProp>();
  const { audio } = route.params;

  return (
    <View style={styles.container}>
      <AudioPlayer
        title={audio.filename || "Audio"}
        artist="Inconnu"
        source={audio.uri}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A1F44",
  },
});

export default PlayerScreen;
