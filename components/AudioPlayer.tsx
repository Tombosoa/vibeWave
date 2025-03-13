import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { AudioPlayerProps } from "@/utils";
import { audioPlayerStyles } from "@/styles/style";

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
    <View style={audioPlayerStyles.container}>
      <Text style={audioPlayerStyles.title}>{title}</Text>
      {artist && <Text numberOfLines={1} ellipsizeMode="tail" style={audioPlayerStyles.artist}>{artist}</Text>}

      <TouchableOpacity onPress={togglePlayPause} style={audioPlayerStyles.playPause}>
        <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={70} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
