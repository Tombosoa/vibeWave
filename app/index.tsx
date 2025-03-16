import AudioListScreen from "@/screens/AudioListScreen";
import PlayerScreen from "@/screens/PlayerScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import FavoritesScreen from "@/screens/FavoritesScreen";
import SearchScreen from "@/screens/SearchScreen";
import AlbumsScreen from "@/screens/AlbumScreen";
import ArtistsScreen from "@/screens/ArtistScreen";
import PlaylistsScreen from "@/screens/PlaylistsScreen";
import { headerLeftStyles } from "@/styles/style";

export type RootStackParamList = {
  AudioList: undefined;
  PlayerScreen: { audio: any };
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e3c72',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AudioList" 
        component={AudioListScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PlayerScreen" 
        component={PlayerScreen}
        options={{
          title: "Lecteur",
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#1e3c72',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#1e3c72',
          width: 240,
        },
        drawerLabelStyle: {
          color: '#fff',
        },
        drawerActiveBackgroundColor: 'rgba(255,255,255,0.1)',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: 'rgba(255,255,255,0.7)',
        headerLeft: () => (
          <MaterialIcons 
            name="menu" 
            size={28} 
            color="#fff"
            style={headerLeftStyles.menuIcon}
            onPress={() => navigation.openDrawer()} 
          />
        )
      })}
    >
      <Drawer.Screen 
        name="Bibliothèque" 
        component={MainStack}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="library-music" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Favoris" 
        component={FavoritesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Recherche" 
        component={SearchScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Albums" 
        component={AlbumsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="album" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Artistes" 
        component={ArtistsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Playlists" 
        component={PlaylistsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="queue-music" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default App;