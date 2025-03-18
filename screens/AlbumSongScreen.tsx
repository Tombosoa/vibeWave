import { RootStackParamList } from "@/app";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as MediaLibrary from "expo-media-library";

type AlbumSongsScreenNavigationProp = StackNavigationProp<RootStackParamList, "AlbumSongs">;

type AlbumsScreenProps = {
  albums: { name: string; songs: MediaLibrary.Asset[]; picture: picture | null };
  loading: boolean;
};

type picture={
  name:string;
  pictureData: string;
}

const AlbumSongScreen: React.FC<AlbumsScreenProps> = ({albums}) =>{
    return(
        <View style={styles.container}>
      <Text style={styles.title}>Chansons de l'album: {albums.name}</Text>
      <FlatList
        data={albums.songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.song}>{item.filename}</Text>}
      />
    </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    song: {
      fontSize: 16,
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
  });

export default AlbumSongScreen;