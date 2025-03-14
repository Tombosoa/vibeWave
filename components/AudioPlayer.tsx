import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { audioPlayerStyles } from "@/styles/style";
import { useAudioStore } from "../scripts/audioStore";

interface AudioPlayerProps {
  title: string;
  artist: string;
  audio: MediaLibrary.Asset;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, audio }) => {
  const { currentAudio, isPlaying, playPauseAudio } = useAudioStore();

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
