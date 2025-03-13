import React from "react";
import { View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AudioPlayer from "../components/AudioPlayer";
import { playerScreenStyles } from "@/styles/style";
type PlayerScreenRouteProp = RouteProp<{ Player: { audio: any } }, "Player">;

const PlayerScreen: React.FC = () => {
  const route = useRoute<PlayerScreenRouteProp>();
  const { audio } = route.params;

  return (
    <View style={playerScreenStyles.container}>
      <AudioPlayer
        title={audio.filename || "Audio"}
        artist="Inconnu"
        source={audio.uri}
      />
    </View>
  );
};

export default PlayerScreen;
