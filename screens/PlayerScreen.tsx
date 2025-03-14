import React, { useEffect } from "react";
import { View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import AudioPlayer from "../components/AudioPlayer";
import { playerScreenStyles } from "@/styles/style";
import { Audio } from "expo-av"; // Importation de Audio pour gérer la lecture en arrière-plan

type PlayerScreenRouteProp = RouteProp<{ Player: { audio: MediaLibrary.Asset } }, "Player">;

const PlayerScreen: React.FC = () => {
  const route = useRoute<PlayerScreenRouteProp>();
  const { audio } = route.params;

  useEffect(() => {
    const setupAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeIOS: 1, // Valeur numérique pour DUCK_OTHERS
          interruptionModeAndroid: 1, // Valeur numérique pour DUCK_OTHERS
        });
      } catch (error) {
        console.error("Erreur lors de la configuration audio :", error);
      }
    };

    setupAudioMode();
  }, []);


  return (
    <View style={playerScreenStyles.container}>
      <AudioPlayer 
        title={audio.filename || "Audio"} 
        artist="Inconnu" 
        audio={audio} 
      />
    </View>
  );

};

export default PlayerScreen;
