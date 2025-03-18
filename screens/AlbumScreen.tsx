import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchAlbums } from "../scripts/audioService";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";
import * as MediaLibrary from "expo-media-library";
type AlbumSongsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AlbumSongs'>;

const AlbumsScreen = () => {
  const [albums, setAlbums] = useState<{ name: string; songs: MediaLibrary.Asset[]; picture: string | null }[]>([]);
  const navigation = useNavigation<AlbumSongsScreenNavigationProp>();

  useEffect(() => {
    const loadAlbums = async () => {
      const data = await fetchAlbums();
      setAlbums(data);
    };
    loadAlbums();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Albums</Text>
      <FlatList
        data={albums}
        numColumns={2}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.albumContainer}
            onPress={() => navigation.navigate("AlbumSongs", { album: item })}
          >
            {item.picture ? (
              <Image source={{ uri: item.picture }} style={styles.albumArt} />
            ) : (
              <View style={[styles.albumArt, styles.placeholderArt]}>
                <Text style={styles.placeholderText}>Pas de pochette</Text>
              </View>
            )}
            <Text style={styles.albumName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  albumContainer: {
    flex: 1,
    margin: 8,
    alignItems: "center",
  },
  albumArt: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  placeholderArt: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
  },
  albumName: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

export default AlbumsScreen;