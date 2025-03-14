import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { audioPlayerStyles } from "@/styles/style";
import { useAudioStore } from "../scripts/audioStore";
import { Audio } from "expo-av"; // Importation de Audio pour gérer l'audio en arrière-plan

interface AudioPlayerProps {
  title: string;
  artist: string;
  audio: MediaLibrary.Asset;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, audio }) => {
  const { currentAudio, isPlaying, playPauseAudio } = useAudioStore();

  useEffect(() => {
    // Assurer que l'audio continue en arrière-plan
    const setAudioBackgroundMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: 1, // Valeur numérique pour DUCK_OTHERS
        interruptionModeAndroid: 1, // Valeur numérique pour DUCK_OTHERS
      });
    };

    setAudioBackgroundMode();

    return () => {
      // Optionnel: tu peux aussi gérer la suppression de l'audio si nécessaire
    };
  }, []);

  return (
    <View style={audioPlayerStyles.container}>
      <Text style={audioPlayerStyles.title}>{title}</Text>
      {artist && (
        <Text numberOfLines={1} ellipsizeMode="tail" style={audioPlayerStyles.artist}>
          {artist}
        </Text>
      )}

      <TouchableOpacity 
        onPress={() => playPauseAudio(audio)} 
        style={audioPlayerStyles.playPause}
        disabled={!audio?.uri}
      >
        <Ionicons
          name={currentAudio?.id === audio.id && isPlaying ? "pause-circle" : "play-circle"}
          size={70}
          color="#1E90FF"
        />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
