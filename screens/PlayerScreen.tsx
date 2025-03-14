import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AudioPlayer from "../components/AudioPlayer";
import { playerScreenStyles } from "@/styles/style";
import { Audio } from "expo-av";

type PlayerScreenRouteProp = RouteProp<{ Player: { audio: any } }, "Player">;

const PlayerScreen: React.FC = () => {
  const route = useRoute<PlayerScreenRouteProp>();
  const { audio } = route.params || {}; // Sécurisation en cas d'absence de `audio`

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

  if (!audio || !audio.uri) {
    Alert.alert("Erreur", "Aucun fichier audio trouvé !");
    return <View style={playerScreenStyles.container} />;
  }

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
