import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAudioStore } from "../scripts/audioStore";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../app"; 

type PlaylistsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Playlists">;

const PlaylistsScreen = () => {
  const { playlists, addPlaylist, removePlaylist, renamePlaylist } = useAudioStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const navigation = useNavigation<PlaylistsScreenNavigationProp>();

  const showPlaylistOptions = (playlistName: string) => {
    setSelectedPlaylist(playlistName);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleRename = () => {
    if (selectedPlaylist && newName.trim()) {
      renamePlaylist(selectedPlaylist, newName.trim());
      closeModal();
      setNewName("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nom de la playlist"
          placeholderTextColor="#888"
          value={newPlaylistName}
          onChangeText={setNewPlaylistName}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (newPlaylistName.trim()) {
              addPlaylist(newPlaylistName.trim());
              setNewPlaylistName("");
            }
          }}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.name}
        renderItem={({ item: playlist }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => navigation.navigate("PlaylistDetail", { playlistName: playlist.name })}
          >
            <Text style={styles.playlistName}>
              {playlist.name} ({playlist.tracks.length} morceaux)
            </Text>
            <TouchableOpacity onPress={() => showPlaylistOptions(playlist.name)}>
              <MaterialIcons name="more-vert" size={24} color="#555" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options de Playlist</Text>

            <TextInput
              placeholder="Nouveau nom"
              placeholderTextColor="#888"
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleRename}>
              <Text style={styles.modalButtonText}>Renommer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => {
                if (selectedPlaylist) {
                  removePlaylist(selectedPlaylist);
                  closeModal();
                }
              }}
            >
              <Text style={styles.modalButtonText}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#1e3c72",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#1e3c72",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PlaylistsScreen;