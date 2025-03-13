import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { audioItemStyles } from '@/styles/style';
import { AudioItemProps } from '@/utils';

const AudioItem: React.FC<AudioItemProps> = ({ title, duration, onPress, onPressPlay, isPlaying }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTitle = (title: string) => {
    return title
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ')
      .slice(0, 40) + (title.length > 40 ? '...' : '');
  };

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity style={audioItemStyles.container} onPress={onPress}>
        <View style={audioItemStyles.iconContainer}>
          <MaterialIcons name="music-note" size={24} color="#1e3c72" />
        </View>
        <View style={audioItemStyles.textContainer}>
          <Text style={audioItemStyles.title}>{formatTitle(title)}</Text>
          <Text style={audioItemStyles.duration}>{formatDuration(duration)}</Text>
        </View>
        <TouchableOpacity onPress={onPressPlay}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={28} color="#1e3c72" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AudioItem;
