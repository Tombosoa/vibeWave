import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";
import * as MediaLibrary from "expo-media-library";

type AlbumSongsScreenNavigationProp = StackNavigationProp<RootStackParamList, "AlbumSongs">;

type AlbumsScreenProps = {
  albums: { name: string; songs: MediaLibrary.Asset[]; picture: picture | null }[];
  loading: boolean;
};

type picture={
  name:string;
  pictureData: string;
}

type album ={
  album: { name: string; songs: MediaLibrary.Asset[]; picture: picture | null };
  loading: boolean;
}

const AlbumsScreen: React.FC<AlbumsScreenProps> = ({ albums, loading }) => {
  const navigation = useNavigation<AlbumSongsScreenNavigationProp>();
  const [selectedAlbum, setSelectedAlbum] = useState<album["album"]>();
  const handleAlbumPress = (album: album["album"]) => {
    setSelectedAlbum(album);

    const scaleAnim = new Animated.Value(1);
    
    Animated.timing(scaleAnim, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Albums</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={albums}
          numColumns={2}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.albumContainer}
              onPress={() => handleAlbumPress(item)}
            >
              <View style={[styles.albumArt, styles.placeholderArt]}>
               {/* <Text style={styles.placeholderText}>
                  {item.picture ? item.picture.pictureData : "Pas de pochette"}
                </Text>*/}
                <>
                {
                  item.picture?.pictureData ? (
                    <View>
                      {item.picture?.pictureData ? (
                  <Image
                    source={{ uri: item.picture.pictureData }}
                    style={styles.albumImage}
                  />
                ) : (
                  <View style={[styles.albumArt, styles.placeholderArt]}>
                    <Text style={styles.placeholderText}>Pas de pochette</Text>
                  </View>
                )}
                    </View>
                  ):(
                    <Text style={styles.placeholderText}>
                  Pas de pochette
                </Text>
                  )
                }
                </>
              </View>
              <Text style={styles.albumName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  albumImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
