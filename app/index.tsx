import AudioListScreen from "@/screens/AudioListScreen";
import PlayerScreen from "@/screens/PlayerScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import FavoritesScreen from "@/screens/FavoritesScreen";
import SearchScreen from "@/screens/SearchScreen";
import AlbumsScreen from "@/screens/AlbumScreen";
import ArtistsScreen from "@/screens/ArtistScreen";
import PlaylistsScreen from "@/screens/PlaylistsScreen";
import { headerLeftStyles } from "@/styles/style";
import { Asset } from "expo-media-library";
import PlaylistDetailScreen from "@/screens/PlaylistDetailsScreen";
import { useAudioStore } from "@/store/audioStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Alert, View } from "react-native";
import * as Notifications from "expo-notifications";
import { fetchAlbums, fetchArtists } from "@/scripts/audioService";
import AlbumSongScreen from "@/screens/AlbumSongScreen";
import { SplashScreen } from "expo-router";

export type RootStackParamList = {
  AudioList: undefined;
  PlayerScreen: { audio: Asset };
  Playlists: { audio: Asset };
  PlaylistDetail: { playlistName: string };
  ArtistSongs: { artist: any };
  AlbumSongs: { album: any };
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1e3c72", elevation: 0, shadowOpacity: 0 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="AudioList" component={AudioListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} options={{ title: "Lecteur", headerTransparent: true }} />
    </Stack.Navigator>
  );
}

function PlaylistsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#060719", elevation: 0, shadowOpacity: 0 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Playlists" component={PlaylistsScreen} options={{ title: "Playlists" }} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} options={{ title: "Détails de la Playlist" }} />
    </Stack.Navigator>
  );
}
import * as MediaLibrary from "expo-media-library";
function App() {
  const { currentAudio, isPlaying } = useAudioStore();
  const route = useRoute();
  const [artists, setArtists] = useState<{ name: string }[]>([]);
  const [albums, setAlbums]=useState<{name: string; songs: MediaLibrary.Asset[]; picture: picture | null}[]>([])
  type picture={
    name:string;
    pictureData: string;
  }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const data = await fetchArtists();
        setArtists(data);
      } catch (error) {
        console.error("Erreur lors du chargement des artistes :", error);
      } finally {
        setLoading(false);
      }
    };
    loadArtists();
  }, []);

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const data = await fetchAlbums();
        setAlbums(data);
      } catch (error) {
        console.error("Erreur lors du chargement des albums :", error);
      } finally {
        setLoading(false);
      }
    };
    loadAlbums();
  }, []);
 const { playNextAudio, playPreviousAudio, playPauseAudio } = useAudioStore();
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const action = response.actionIdentifier;

      console.log("Action reçue :", action);

      if (action === "previous") {
        playPreviousAudio();
      } else if (action === "play_pause" && currentAudio) {
        playPauseAudio(currentAudio);
      } else if (action === "next") {
        playNextAudio();
      }
    });

    return () => subscription.remove();
  }, [playNextAudio, playPreviousAudio, playPauseAudio, currentAudio]);

  useEffect(() => {
    const configureNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Les notifications ne fonctionneront pas.");
        return;
      }
      await Notifications.dismissAllNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lecture en cours 🎵",
          body: currentAudio ? `Titre: ${currentAudio.filename}` : "Aucune musique en cours",
          categoryIdentifier: 'musicControls',
        },
        trigger: null,
      });
      await Notifications.setNotificationCategoryAsync('musicControls', [
        {
          identifier: 'previous',
          buttonTitle: 'Previous',
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: 'play_pause',
          buttonTitle: isPlaying ? 'Pause' : 'Play', 
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: 'next',
          buttonTitle: 'Next', 
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    };

    if (isPlaying) {
      configureNotifications();
    }
  }, [isPlaying, currentAudio]);
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#060719", elevation: 0, shadowOpacity: 0 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        drawerStyle: { backgroundColor: "#060719", width: 240 },
        drawerLabelStyle: { color: "#fff" },
        drawerActiveBackgroundColor: "rgba(255,255,255,0.1)",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "rgba(255,255,255,0.7)",
      })}
    >
      <Drawer.Screen name="Bibliothèque" component={MainStack} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="library-music" size={24} color={color} />, headerShown: true }}
      />
      <Drawer.Screen name="Favoris" component={FavoritesScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="favorite" size={24} color={color} /> }}
      />
      <Drawer.Screen name="Recherche" component={SearchScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} /> }}
      />
      <Drawer.Screen name="Albums"  options={{
        drawerIcon: ({ color }) => <MaterialIcons name="album" size={24} color={color} /> }}
      >
        {() => <AlbumsScreen albums={albums} loading={loading} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Artistes"
        options={{
          drawerIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      >
        {() => <ArtistsScreen artists={artists} loading={loading} />}
      </Drawer.Screen>
      <Drawer.Screen name="Playlist" component={PlaylistsStack} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="queue-music" size={24} color={color} /> }}
      />
    </Drawer.Navigator>
  );
}

export default App;
