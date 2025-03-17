import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { useAudioStore } from "@/store/audioStore";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../app";

type PlaylistsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Playlists"
>;

const PlaylistsScreen = () => {
  const { playlists, addPlaylist, removePlaylist, renamePlaylist, playPauseAudio } =
    useAudioStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const navigation = useNavigation<PlaylistsScreenNavigationProp>();

  useEffect(() => {
    if (playlists.length === 0) {
      addPlaylist("Default Playlist");
    }
  }, [playlists]);

  const showPlaylistOptions = (playlistName: string) => {
    setSelectedPlaylist(playlistName);
    setModalVisible(true);
  };

  const handleRename = () => {
    if (selectedPlaylist && newName.trim()) {
      renamePlaylist(selectedPlaylist, newName.trim());
      closePopup();
      setNewName("");
    }
  };

  const closePopup = () => setModalVisible(false);

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
            onPress={() =>
              navigation.navigate("PlaylistDetail", {
                playlistName: playlist.name,
              })
            }
          >
            <Text style={styles.playlistName}>
              {playlist.name} ({playlist.tracks.length} morceaux)
            </Text>
            <TouchableOpacity
              onPress={() => showPlaylistOptions(playlist.name)}
            >
              <MaterialIcons name="more-vert" size={24} color="#555" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

<Modal
  isVisible={modalVisible}
  onBackdropPress={closePopup}
  style={styles.modal}
>
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
      style={[styles.modalButton, styles.playButton]}
      onPress={() => {
        if (selectedPlaylist) {
          const playlist = playlists.find((p) => p.name === selectedPlaylist);
          if (playlist && playlist.tracks.length > 0) {
            /**this play only the first song on the playlist -> update that */
            playPauseAudio(playlist.tracks[0]); 
            console.log(playlist)
            closePopup();
          }
        }
      }}
    >
      <Text style={styles.modalButtonText}>Lire la playlist</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.modalButton, styles.deleteButton]}
      onPress={() => {
        if (selectedPlaylist) {
          removePlaylist(selectedPlaylist);
          closePopup();
        }
      }}
    >
      <Text style={styles.modalButtonText}>Supprimer</Text>
    </TouchableOpacity>
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
  playButton: {},
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
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    alignItems: "center",
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
    fontSize: 16,
    color: "#333",
    width: "100%",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#1e3c72",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
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
