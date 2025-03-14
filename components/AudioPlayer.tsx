import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { AudioPlayerProps } from "@/utils";
import { audioPlayerStyles } from "@/styles/style";

// Configurer les notifications pour s'afficher correctement
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, source }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  // Demander les permissions pour les notifications
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Les permissions pour les notifications ne sont pas accordées.");
      }
    };
    requestPermissions();
  }, []);

  // Envoyer une notification (lecture/pause)
  const sendNowPlayingNotification = async (playing: boolean) => {
    try {
      // Annuler l'ancienne notification si elle existe
      if (notificationId) {
        await Notifications.dismissNotificationAsync(notificationId);
      }

      const newNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎵 ${title} - ${artist}`,
          body: playing ? "Lecture en cours" : "En pause",
          sound: playing ? "default" : undefined, // Son uniquement en lecture
        },
        trigger: null, // Notification immédiate
      });

      setNotificationId(newNotificationId); // Sauvegarde du nouvel ID
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification :", error);
    }
  };

  // Gestion de la lecture audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync({ uri: source });
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.isPlaying !== isPlaying) {
            setIsPlaying(status.isPlaying);
          }
        });
      } catch (error) {
        console.error("Erreur lors du chargement de l'audio :", error);
      }
    };

    setupAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [source]);

  // Envoyer une notification uniquement quand `isPlaying` change
  useEffect(() => {
    sendNowPlayingNotification(isPlaying);
  }, [isPlaying]);

  // Fonction pour jouer/pause
  const togglePlayPause = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Erreur lors du changement d'état de lecture :", error);
    }
  };

  return (
    <View style={audioPlayerStyles.container}>
      <Text style={audioPlayerStyles.title}>{title}</Text>
      {artist && <Text style={audioPlayerStyles.artist}>{artist}</Text>}

      <TouchableOpacity onPress={togglePlayPause} style={audioPlayerStyles.playPause}>
        <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={70} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
