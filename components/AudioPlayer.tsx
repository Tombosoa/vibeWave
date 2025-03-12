import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

interface AudioPlayerProps {
  title: string;
  artist?: string;
  source: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, source }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: source });
        setSound(sound);
      } catch (error) {
        console.error("Erreur de chargement de l'audio :", error);
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [source]);

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {artist && <Text style={styles.artist}>{artist}</Text>}

      <TouchableOpacity onPress={togglePlayPause} style={styles.playPause}>
        <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={70} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A1F44" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", textAlign: "center" },
  artist: { fontSize: 18, color: "#87CEFA", textAlign: "center", marginBottom: 20 },
  playPause: { marginTop: 20 },
});

export default AudioPlayer;
