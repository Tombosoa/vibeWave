import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View ,StyleSheet} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { audioItemStyles } from "@/styles/style";
import * as MediaLibrary from "expo-media-library";

import { useAudioStore } from "@/store/audioStore";

interface AudioItemProps {
  title: string;
  duration?: number;
  onPress: () => void;
  onPressPlay: () => void;
  isPlaying: boolean;
  audio: MediaLibrary.Asset;
}
const AudioItem: React.FC<AudioItemProps> = ({
  title,
  duration,
  onPress,
  audio,
}) => {
  const { currentAudio, isPlaying, playPauseAudio } = useAudioStore();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTitle = (title: string) => {
    return (
      title
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .slice(0, 40) + (title.length > 40 ? "..." : "")
    );
  };

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity style={audioItemStyles.container} onPress={onPress}>
        <View style={audioItemStyles.iconContainer}>
          <MaterialIcons name="music-note" size={24} color="#8ebbff" />
        </View>
        <View style={audioItemStyles.textContainer}>
          <Text style={audioItemStyles.title}>{formatTitle(title)}</Text>
          <Text style={audioItemStyles.duration}>
            {formatDuration(duration)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => playPauseAudio(audio)}>
          <Ionicons
            name={
              currentAudio?.id === audio.id && isPlaying
                ? "pause-circle"
                : "play-circle"
            }
            size={40}
            color="#8ebbff"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: 'flex-end',
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cover: {
    width: 150, 
    height: 150, 
    borderRadius: 10, 
    marginBottom: 10
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3c72",
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  slider: {
    width: 'auto',
    height: 40,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: "#1e3c72",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    padding: 10,
    transform: [{ scale: 1.2 }],
  },
});
export default AudioItem;
