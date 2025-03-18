import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchArtists } from "../scripts/audioService";

const ArtistsScreen = () => {
  const [artists, setArtists] = useState([]) as any;
  const navigation = useNavigation();

  useEffect(() => {
    const loadArtists = async () => {
      const data = await fetchArtists();
      setArtists(data);
    };
    loadArtists();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Artistes</Text>
      <FlatList
        data={artists}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
            /*onPress={() => navigation.navigate("ArtistSongs", { artist: item })}*/
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ArtistsScreen;