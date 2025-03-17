import * as MediaLibrary from "expo-media-library";

export interface AudioPlayerProps {
  title: string;
  artist?: string;
  audio: MediaLibrary.Asset;
}

export interface AudioItemProps {
  title: string;
  duration?: number;
  onPress: () => void;
  onPressPlay: () => void;
  isPlaying: boolean;
  audio: void;
}
