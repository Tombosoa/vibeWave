import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useAudioStore } from "@/store/audioStore";
import * as MediaLibrary from "expo-media-library";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PlayerProps {
  current: MediaLibrary.Asset;
  onPress: () => void;
  audio: MediaLibrary.Asset;
}

const Player: React.FC<PlayerProps> = ({ current, onPress, audio }) => {
  const insets = useSafeAreaInsets();
  const {
    isPlaying,
    playPauseAudio,
    playNextAudio,
    playPreviousAudio,
    sound,
  } = useAudioStore();
  
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = useCallback((millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const handleSliderValueChange = useCallback((value: number) => {
    setPosition(value);
  }, []);

  const handleSliderComplete = useCallback((value: number) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          setPosition(status.positionMillis || 0);
        }
      });

      const interval = setInterval(() => {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
          }
        });
      }, 1000); 

      return () => clearInterval(interval); 
    }
  }, [sound]);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (

      <Animated.View
        style={[
          styles.footerContainer,
          animatedStyle,
          { paddingBottom: insets.bottom },
        ]}
      >
        <LinearGradient
          colors={["#1e3c72", "#2a5298"]}
          style={styles.footerGradient}
        >
          <Text numberOfLines={1} style={styles.currentAudioTitle}>
            {current.filename}
          </Text>
          
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderValueChange}
            onSlidingComplete={handleSliderComplete}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#fff"
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={playPreviousAudio}
              style={styles.controlButton}
            >
              <SkipBack color="#fff" size={28} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => playPauseAudio(current)}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause color="#fff" size={40} />
              ) : (
                <Play color="#fff" size={40} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playNextAudio}
              style={styles.controlButton}
            >
              <SkipForward color="#fff" size={28} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.select({ ios: 20, android: 20, default: 20 }),
    marginBottom: 10,
    zIndex: 1
  },
  img: {
    width: 100
  },
  footerGradient: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
      },
    }),
  },
  currentAudioTitle: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
    maxWidth: "90%",
  },
  slider: {
    width: "90%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    padding: 10,
    transform: [{ scale: 1.2 }],
  },
});

export default Player;