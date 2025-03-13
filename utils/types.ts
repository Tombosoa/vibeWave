export interface AudioPlayerProps {
    title: string;
    artist?: string;
    source: string;
  }
  
export interface AudioItemProps {
    title: string;
    duration?: number;
    onPress: () => void;  
    onPressPlay: () => void;  
    isPlaying: boolean
  }