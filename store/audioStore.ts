import { create } from "zustand";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";

interface Playlist {
  name: string;
  tracks: MediaLibrary.Asset[];
}

interface AudioState {
  currentAudio: MediaLibrary.Asset | null;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  audioFiles: MediaLibrary.Asset[];
  playlists: Playlist[];

  setAudioFiles: (files: MediaLibrary.Asset[]) => void;
  playPauseAudio: (audio: MediaLibrary.Asset) => Promise<void>;
  playNextAudio: () => void;
  playPreviousAudio: () => void;

  addPlaylist: (name: string) => void;
  removePlaylist: (name: string) => void;
  renamePlaylist: (oldName: string, newName: string) => void;
  openPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistName: string, track: MediaLibrary.Asset) => void;
  removeTrackFromPlaylist: (playlistName: string, trackId: string) => void;
  isTrackInPlaylist: (playlistName: string, trackId: string) => boolean;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  sound: null,
  isPlaying: false,
  audioFiles: [],
  playlists: [],

  setAudioFiles: (files) => set({ audioFiles: files }),

  playPauseAudio: async (audio) => {
    try {
      const { currentAudio, sound, isPlaying } = get();
  
      if (!audio.uri) {
        console.error("URI du fichier audio invalide");
        return;
      }
  
      console.log("Tentative de lecture du fichier :", audio.uri);
      
      const fixedUri = decodeURIComponent(audio.uri);
  
      if (!currentAudio || currentAudio.id !== audio.id) {
        if (sound) {
          await sound.unloadAsync();
        }
  
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          allowsRecordingIOS: false,
        });
  
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: fixedUri },
          { shouldPlay: true }
        );
  
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            get().playNextAudio();
          }
        });
  
        set({ currentAudio: audio, sound: newSound, isPlaying: true });
      } else {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
            set({ isPlaying: false });
          } else {
            await sound.playAsync();
            set({ isPlaying: true });
          }
        }
      }
    } catch (error) {
      console.error("Erreur de lecture audio :", error);
    }
  }
,  

  playNextAudio: () => {
    const { audioFiles, currentAudio, playPauseAudio } = get();
    if (!currentAudio || audioFiles.length === 0) return;

    const currentIndex = audioFiles.findIndex(
      (audio) => audio.id === currentAudio.id
    );
    const nextIndex = (currentIndex + 1) % audioFiles.length;
    playPauseAudio(audioFiles[nextIndex]);
  },

  playPreviousAudio: () => {
    const { audioFiles, currentAudio, playPauseAudio } = get();
    if (!currentAudio || audioFiles.length === 0) return;

    const currentIndex = audioFiles.findIndex(
      (audio) => audio.id === currentAudio.id
    );
    const prevIndex =
      (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    playPauseAudio(audioFiles[prevIndex]);
  },

  addPlaylist: (name) => {
    const { playlists } = get();
    if (!playlists.find((p) => p.name === name)) {
      set({ playlists: [...playlists, { name, tracks: [] }] });
    }
  },

  removePlaylist: (name) => {
    set({ playlists: get().playlists.filter((p) => p.name !== name) });
  },

  renamePlaylist: (oldName: string, newName: string) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.name === oldName ? { ...playlist, name: newName } : playlist
      ),
    }));
  },

  openPlaylist: (name) => {
    console.log("Ouvrir la playlist :", name);
  },

  addTrackToPlaylist: (playlistName, track) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.name === playlistName
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      );
      return { playlists: updatedPlaylists };
    });
  },

  removeTrackFromPlaylist: (playlistName, trackId) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.name === playlistName
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((t) => t.id !== trackId),
            }
          : playlist
      );
      return { playlists: updatedPlaylists };
    });
  },

  isTrackInPlaylist: (playlistName, trackId) => {
    const playlist = get().playlists.find((p) => p.name === playlistName);
    return playlist ? playlist.tracks.some((t) => t.id === trackId) : false;
  },
}));
