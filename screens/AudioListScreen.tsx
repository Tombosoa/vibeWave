import React, { useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  SafeAreaView, 
  ActivityIndicator, 
  StyleSheet,
  Dimensions,
  RefreshControl
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp, 
  FadeOutDown,
  Layout
} from 'react-native-reanimated';
import AudioItem from "../components/AudioItem";
import { RootStackParamList } from "../app/index";

const { width } = Dimensions.get('window');

const AudioListScreen: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadAudioFiles = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const media = await MediaLibrary.getAssetsAsync({ 
        mediaType: "audio",
        sortBy: ['creationTime'],
      });
      setAudioFiles(media.assets);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudioFiles();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1e3c72', '#2a5298']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <MaterialIcons name="library-music" size={32} color="#fff" />
        <Text style={styles.header}>Ma Bibliothèque</Text>
        <Text style={styles.subHeader}>{audioFiles.length} morceaux</Text>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1e3c72" />
          <Text style={styles.loadingText}>Chargement de votre bibliothèque...</Text>
        </View>
      ) : (
        <Animated.View 
          style={styles.contentContainer}
          entering={FadeInUp}
          exiting={FadeOutDown}
          layout={Layout.springify()}
        >
          {audioFiles.length > 0 ? (
            <FlatList
              data={audioFiles}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={FadeInUp.delay(index * 100)}
                  layout={Layout.springify()}
                >
                  <AudioItem
                    title={item.filename}
                    duration={item.duration}
                    onPress={() => navigation.navigate("PlayerScreen", { audio: item })}
                  />
                </Animated.View>
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#1e3c72"
                />
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="music-off" size={64} color="#1e3c72" />
              <Text style={styles.emptyMessage}>Aucun fichier audio trouvé</Text>
              <Text style={styles.emptySubMessage}>
                Ajoutez de la musique à votre appareil pour commencer
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e3c72",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e3c72",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubMessage: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    maxWidth: width * 0.8,
  },
});

export default AudioListScreen;