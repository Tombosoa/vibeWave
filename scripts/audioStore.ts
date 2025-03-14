import { create } from "zustand";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";

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

      if (!currentAudio || currentAudio.id !== audio.id) {
        if (sound) {
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audio.uri },
          { shouldPlay: true }
        );

        set({ currentAudio: audio, sound: newSound, isPlaying: true });

        newSound.setOnPlaybackStatusUpdate((status) => {
          if ("didJustFinish" in status && status.didJustFinish) {
            get().playNextAudio();
          }
        });
      } else {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
          set({ isPlaying: !isPlaying });
        }
      }
    } catch (error) {
      console.error("Erreur de lecture audio :", error);
    }
  },

  playNextAudio: () => {
    const { audioFiles, currentAudio, playPauseAudio } = get();
    if (!currentAudio) return;

    const currentIndex = audioFiles.findIndex((audio) => audio.id === currentAudio.id);
    const nextIndex = (currentIndex + 1) % audioFiles.length;
    playPauseAudio(audioFiles[nextIndex]);
  },

  playPreviousAudio: () => {
    const { audioFiles, currentAudio, playPauseAudio } = get();
    if (!currentAudio) return;

    const currentIndex = audioFiles.findIndex((audio) => audio.id === currentAudio.id);
    const prevIndex = (currentIndex - 1 + audioFiles.length) % audioFiles.length;
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
    set({
      playlists: get().playlists.map((playlist) =>
        playlist.name === playlistName
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      ),
    });
  },

  removeTrackFromPlaylist: (playlistName, trackId) => {
    set({
      playlists: get().playlists.map((playlist) =>
        playlist.name === playlistName
          ? { ...playlist, tracks: playlist.tracks.filter((t) => t.id !== trackId) }
          : playlist
      ),
    });
  },

  isTrackInPlaylist: (playlistName, trackId) => {
    const playlist = get().playlists.find((p) => p.name === playlistName);
    return playlist ? playlist.tracks.some((t) => t.id === trackId) : false;
  },
}));
