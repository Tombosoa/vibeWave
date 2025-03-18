import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated, Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useAudioStore } from "@/store/audioStore";
import Slider from "@react-native-community/slider";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { fetchMetadata } from "@/scripts/audioService";

interface AudioPlayerProps {
  title: string;
  artist: string;
  audio: MediaLibrary.Asset;
}

type Metadata = {
  title?: string,
  artist: string,
  album?: string,
  genre?: string,
  picture: picture, 
}

type picture = {
  description: string,
  pictureData: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, artist, audio }) => {
  const {
    currentAudio,
    isPlaying,
    playPauseAudio,
    playNextAudio,
    playPreviousAudio,
    sound,
  } = useAudioStore();

  const [position, setPosition] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const [displayTitle, setDisplayTitle] = useState(title); 
  const [displayArtist, setDisplayArtist] = useState(artist); 

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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

  useEffect(() => {
    if (currentAudio) {
      setDisplayTitle(currentAudio.filename);
      setDisplayArtist(artist || "");
    }
  }, [currentAudio]);

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

  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: { nativeEvent: { oldState?: any; translationX?: any; }; }) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        playPreviousAudio();
      } else if (translationX < -50) {
        playNextAudio();
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

   const handleSliderValueChange = useCallback((value: number) => {
      setPosition(value);
    }, []);
  
    const handleSliderComplete = useCallback((value: number) => {
      if (sound) {
        sound.setPositionAsync(value);
      }
    }, [sound]);

    const [metadata, setMetadata] = useState<Metadata>();
  
    useEffect(() => {
      const loadMetadata = async () => {
        try{
          const data = await fetchMetadata(audio.uri);
          setMetadata(data);  
        }catch(error){
          console.error(error)
        }
        
      };
  
      loadMetadata();
    }, [audio]);

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={styles.container}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateX }]
            },
          ]}
        >
          {metadata?.picture ? (
        <Image source={{ uri: metadata.picture.pictureData }} style={styles.cover} />
      ) : (
        <MaterialIcons name="music-note" size={100} color="#1e3c72" />
      )}

        </Animated.View>

        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <Text style={styles.title}>{displayTitle}</Text>
          {displayArtist && (
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.artist}>
              {displayArtist}
            </Text>
          )}
        </Animated.View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={handleSliderValueChange}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#1e3c72"
          maximumTrackTintColor="#888"
          thumbTintColor="#1e3c72"
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
            <MaterialIcons name="skip-previous" size={32} color="#1e3c72" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => playPauseAudio(audio)}
            style={styles.playButton}
          >
            <MaterialIcons
              name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
              size={48}
              color="#1e3c72"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNextAudio} style={styles.controlButton}>
            <MaterialIcons name="skip-next" size={32} color="#1e3c72" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
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

export default AudioPlayer;