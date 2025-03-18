import React from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Artist {
  name: string;
}

interface ArtistsScreenProps {
  artists: Artist[];
  loading: boolean;
}

const ArtistsScreen: React.FC<ArtistsScreenProps> = ({ artists, loading }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Artistes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ flex: 1, justifyContent: "center" }} />
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(item) => item.name}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
              // onPress={() => navigation.navigate("ArtistSongs", { artist: item })}
            >
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ArtistsScreen;
