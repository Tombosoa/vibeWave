import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { audioPlayerStyles } from "@/styles/style";
import { useAudioStore } from "../scripts/audioStore";
import { Audio } from "expo-av";

interface AudioPlayerProps {
  title: string;
  artist: string;
  audio: MediaLibrary.Asset;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, audio }) => {
  const { currentAudio, isPlaying, playPauseAudio, playNextAudio, playPreviousAudio, stopAudio } = useAudioStore();

  useEffect(() => {
    // Assurer que l'audio continue en arrière-plan
    const setAudioBackgroundMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });
    };

    setAudioBackgroundMode();

    return () => {
      // Libération des ressources audio lorsque le composant est démonté
      if (currentAudio) {
        stopAudio();
      }
    };
  }, [currentAudio, stopAudio]); // Dépendances pour arrêter l'audio quand currentAudio change

  // Fonction pour envoyer une notification avec des actions
  const sendNotification = async () => {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: currentAudio ? `Lecture de : ${currentAudio.filename}` : "Pas d'audio",
        body: isPlaying ? "Lecture en cours..." : "Lecture en pause.",
        buttons: [
          {
            text: isPlaying ? "Pause" : "Jouer",
            onPress: () => playPauseAudio(audio),
          },
          {
            text: "Suivant",
            onPress: playNextAudio,
          },
          {
            text: "Précédent",
            onPress: playPreviousAudio,
          },
        ],
      },
      trigger: null, // Notifie immédiatement
    });
  };

  useEffect(() => {
    // Envoyer une notification chaque fois que l'audio change
    sendNotification();
  }, [currentAudio, isPlaying]);

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
