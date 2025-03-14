import React from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAudioStore } from "../scripts/audioStore";
import { MaterialIcons } from "@expo/vector-icons";

const PlaylistDetailScreen = () => {
  const route = useRoute();
  const { playlistName } = route.params as { playlistName: string };
  const { playlists, audioFiles, addTrackToPlaylist, removeTrackFromPlaylist, isTrackInPlaylist } = useAudioStore();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const playlist = playlists.find((p) => p.name === playlistName);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!playlist) return <Text style={styles.errorText}>Playlist introuvable</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>
        {playlist.name} ({playlist.tracks.length} morceaux)
      </Text>

      <FlatList
        data={audioFiles}
        keyExtractor={(track) => track.id}
        renderItem={({ item: track }) => {
          const isInPlaylist = isTrackInPlaylist(playlistName, track.id);
          return (
            <Animated.View style={[styles.trackItem, { opacity: fadeAnim }]}>
              <Text style={styles.trackName}>{track.filename}</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  isInPlaylist
                    ? removeTrackFromPlaylist(playlistName, track.id)
                    : addTrackToPlaylist(playlistName, track)
                }
              >
                <MaterialIcons
                  name={isInPlaylist ? "remove-circle" : "add-circle"}
                  size={24}
                  color={isInPlaylist ? "#ff4444" : "#1e3c72"}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  playlistTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trackName: {
    fontSize: 16,
    color: "#555",
  },
  actionButton: {
    padding: 5,
  },
  separator: {
    height: 10,
  },
  errorText: {
    fontSize: 18,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PlaylistDetailScreen;