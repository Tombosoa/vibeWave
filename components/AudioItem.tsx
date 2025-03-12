import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AudioItemProps {
  title: string;
  duration?: number;
  onPress: () => void;
}

const AudioItem: React.FC<AudioItemProps> = ({ title, duration, onPress }) => {
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
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="music-note" size={24} color="#1e3c72" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{formatTitle(title)}</Text>
          <Text style={styles.duration}>{formatDuration(duration)}</Text>
        </View>
        <MaterialIcons name="play-circle-outline" size={28} color="#1e3c72" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 60, 114, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#636e72',
  },
});

export default AudioItem;