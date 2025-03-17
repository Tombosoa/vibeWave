declare module 'react-native-music-metadata' {
    export interface Metadata {
      title?: string;
      artist?: string;
      album?: string;
      artwork?: string;
      duration?: number;
    }
  
    export function getMetadata(uri: string): Promise<Metadata>;


  }