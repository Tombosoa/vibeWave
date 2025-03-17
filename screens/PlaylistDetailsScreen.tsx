import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useAudioStore } from "@/store/audioStore";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const PlaylistDetailsScreen = () => {
  const route = useRoute();
  const { playlistName } = route.params as { playlistName: string };
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist, isTrackInPlaylist } =
    useAudioStore();
  const [loading, setLoading] = useState(true);
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const playlist = playlists.find((p) => p.name === playlistName);

  useEffect(() => {
    const loadAudioFiles = async () => {
      try {
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });
        setAudioFiles(assets);
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers audio :", error);
      } finally {
        setLoading(false);
      }
    };

    loadAudioFiles();
  }, []);

  const handleAddRemoveTrack = (track: MediaLibrary.Asset) => {
    if (isTrackInPlaylist(playlistName, track.id)) {
      removeTrackFromPlaylist(playlistName, track.id);
    } else {
      addTrackToPlaylist(playlistName, track);
    }
  };

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Playlist introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>{playlistName}</Text>
      <Text style={styles.trackCount}>{playlist.tracks.length} morceaux</Text>

      <FlatList
        data={playlist.tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackItem}>
            <Text style={styles.trackName}>{item.filename}</Text>
            <TouchableOpacity
              onPress={() => handleAddRemoveTrack(item)}
              style={styles.removeButton}
            >
              <MaterialIcons name="remove" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={["#1e3c72", "#2a5298"]}
          style={styles.gradient}
        >
          <Text style={styles.addButtonText}>Ajouter des chansons</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chansons disponibles</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#1e3c72" />
            ) : (
              <FlatList
                data={audioFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.trackItem}>
                    <Text style={styles.trackName}>{item.filename}</Text>
                    <TouchableOpacity
                      onPress={() => handleAddRemoveTrack(item)}
                      style={styles.addRemoveButton}
                    >
                      <MaterialIcons
                        name={isTrackInPlaylist(playlistName, item.id) ? "remove" : "add"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3c72",
    marginBottom: 10,
    textAlign: "center",
  },
  trackCount: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 7
  },
  removeButton: {
    backgroundColor: "teal",
    padding: 4,
    borderRadius: '50%',
  },
  addButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginInline: 5
  },
  gradient: {
    padding: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    height: 500,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3c72",
    marginBottom: 20,
    textAlign: "center",
  },
  addRemoveButton: {
    backgroundColor: "#1e3c72",
    padding: 8,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: "#1e3c72",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "#ff4444",
    textAlign: "center",
  },
});

export default PlaylistDetailsScreen;