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
  stopAudio: () => Promise<void>;

  addPlaylist: (name: string) => void;
  removePlaylist: (name: string) => void;
  renamePlaylist: (oldName: string, newName: string) => void;
  openPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistName: string, track: MediaLibrary.Asset) => void;
  removeTrackFromPlaylist: (playlistName: string, trackId: string) => void;
  isTrackInPlaylist: (playlistName: string, trackId: string) => boolean;

  // Nouveau champ pour les notifications
  sendNotification: () => void;
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

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
        });

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

        // Envoyer une notification pour le Play/Pause
        get().sendNotification();
      } else {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
          set({ isPlaying: !isPlaying });

          // Envoyer une notification pour le Play/Pause
          get().sendNotification();
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

    // Envoyer une notification pour le prochain audio
    get().sendNotification();
  },

  playPreviousAudio: () => {
    const { audioFiles, currentAudio, playPauseAudio } = get();
    if (!currentAudio) return;

    const currentIndex = audioFiles.findIndex((audio) => audio.id === currentAudio.id);
    const prevIndex = (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    playPauseAudio(audioFiles[prevIndex]);

    // Envoyer une notification pour l'audio précédent
    get().sendNotification();
  },

  stopAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({ sound: null, currentAudio: null, isPlaying: false });

      // Envoyer une notification pour arrêter l'audio
      get().sendNotification();
    }
  },

  sendNotification: async () => {
    const { currentAudio, isPlaying } = get();

    // Crée une notification avec des boutons d'action
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: currentAudio ? `Lecture de : ${currentAudio.filename}` : "Pas d'audio",
        body: isPlaying ? "Lecture en cours..." : "Lecture en pause.",
        buttons: [
          {
            text: isPlaying ? "Pause" : "Jouer",
            onPress: () => get().playPauseAudio(currentAudio),
          },
          {
            text: "Suivant",
            onPress: () => get().playNextAudio(),
          },
          {
            text: "Précédent",
            onPress: () => get().playPreviousAudio(),
          },
        ],
      },
      trigger: null, // Notifie immédiatement
    });
  },

  // Autres actions de playlist ici...
}));
