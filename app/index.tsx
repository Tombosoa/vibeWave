import AudioListScreen from "@/screens/AudioListScreen";
import PlayerScreen from "@/screens/PlayerScreen";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
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
import { useNavigation, useNavigationState, useRoute } from "@react-navigation/native";
import { StyleSheet, Alert, Button, View } from "react-native";
import * as Notifications from "expo-notifications";

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
        headerStyle: { backgroundColor: "#1e3c72", elevation: 0, shadowOpacity: 0 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Playlists" component={PlaylistsScreen} options={{ title: "Playlists" }} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} options={{ title: "Détails de la Playlist" }} />
    </Stack.Navigator>
  );
}

function App() {
  const { currentAudio, isPlaying } = useAudioStore();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  const isPlayerScreen = route.name === "PlayerScreen" || route.name === "PlaylistDetail";
  const navigationState = useNavigationState((state) => state);
  const currentRoute = navigationState.routes[navigationState.index].name;

  useEffect(() => {
    if (isPlayerScreen) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [route.name, isPlayerScreen]);

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
          categoryIdentifier: "musicControls",
        },
        trigger: null,
      });
    };

    if (isPlaying) {
      configureNotifications();
    }
  }, [isPlaying, currentAudio]);

  return (
    <>
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: "#1e3c72", elevation: 0, shadowOpacity: 0 },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          drawerStyle: { backgroundColor: "#1e3c72", width: 240 },
          drawerLabelStyle: { color: "#fff" },
          drawerActiveBackgroundColor: "rgba(255,255,255,0.1)",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "rgba(255,255,255,0.7)",
          headerLeft: () => (
            <MaterialIcons name="menu" size={28} color="#fff" style={headerLeftStyles.menuIcon} onPress={() => navigation.openDrawer()} />
          ),
        })}
      >
        <Drawer.Screen
          name="Bibliothèque"
          component={MainStack}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="library-music" size={24} color={color} />,
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="Favoris"
          component={FavoritesScreen}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="favorite" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Recherche"
          component={SearchScreen}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Albums"
          component={AlbumsScreen}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="album" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Artistes"
          component={ArtistsScreen}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Playlist"
          component={PlaylistsStack}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="queue-music" size={24} color={color} />,
          }}
        />
      </Drawer.Navigator>

      {/* Bouton de test pour afficher une notification manuellement 
      <View style={styles.testButton}>
        <Button
          title="Test Notification"
          onPress={async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Test Notification 🎵",
                body: "Ceci est une notification test.",
              },
              trigger: null,
            });
          }}
        />
      </View>*/}
    </>
  );
}

const styles = StyleSheet.create({
  testButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#1e3c72",
    borderRadius: 20,
    padding: 10,
  },
});

export default App;
