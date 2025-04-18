import React, { useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  SafeAreaView, 
  ActivityIndicator, 
  RefreshControl, 
  Dimensions,
  StyleSheet
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAudioStore } from "@/store/audioStore";
import { fetchAudioFiles } from "../scripts/audioService";
import AudioItem from "../components/AudioItem";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  Layout
} from 'react-native-reanimated';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";
import Player from "@/components/Player";
import { fetchMetadata } from "../scripts/audioService";

const { width } = Dimensions.get('window');

type AudioListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlayerScreen'>;

const AudioListScreen = () => {
  const navigation = useNavigation<AudioListScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { 
    currentAudio, 
    isPlaying, 
    playPauseAudio, 
    playNextAudio, 
    playPreviousAudio, 
    audioFiles, 
    setAudioFiles 
  } = useAudioStore();

  useEffect(() => {
    loadAudioFiles();
    
  }, []);

  const loadAudioFiles = async () => {
    try {
      setLoading(true);
      const files = await fetchAudioFiles();
      setAudioFiles(files);
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers audio :", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () =>{
    if(!currentAudio) return null;

    return <Player current={currentAudio} onPress={function (): void {
      throw new Error("Function not implemented.");
    } } audio={currentAudio}/>
  }

  useEffect(() => {
    const fetchAndLogMetadata = async () => {
//      const urii = "file:///storage/emulated/0/Download/Bruno_Mars_-_When_I_Was_Your_Man_Naijamusics.com.mp3";
      try {
        if(currentAudio?.uri){
          const metadata = await fetchMetadata(currentAudio?.uri);
        console.log('Metadata:', metadata);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchAndLogMetadata();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudioFiles();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#060719', '#0f113a']}
      style={styles.headerGradient}
    >
      <Animated.View 
        entering={FadeInDown.duration(1000)}
        style={styles.headerContent}
      >
        <MaterialIcons name="library-music" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Ma Bibliothèque</Text>
        <Text style={styles.headerSubtitle}>{audioFiles.length} morceaux</Text>
      </Animated.View>
    </LinearGradient>
  );

  const renderEmptyList = () => (
    <Animated.View 
      entering={FadeIn}
      style={styles.emptyContainer}
    >
      <MaterialIcons name="music-off" size={64} color="#1e3c72" />
      <Text style={styles.emptyTitle}>Aucun fichier audio trouvé</Text>
      <Text style={styles.emptySubTitle}>
        Ajoutez de la musique à votre appareil pour commencer
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1e3c72" />
          <Text style={styles.loadingText}>
            Chargement de votre bibliothèque...
          </Text>
        </View>
      ) : (
        <Animated.View 
          entering={FadeInUp}
          style={styles.content}
        >
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
                  onPressPlay={() => playPauseAudio(item)}
                  onPress={() => navigation.navigate("PlayerScreen", { audio: item })}
                  isPlaying={currentAudio?.id === item.id && isPlaying}
                  audio={item}
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
                colors={['#1e3c72', '#2a5298']}
              />
            }
            ListEmptyComponent={renderEmptyList()}
          />
          {currentAudio && renderFooter()}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", 
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)", 
    marginTop: 5,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  footerGradient: {
    flexDirection: 'column',
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#ffffff', 
  },
  currentAudioTitle: {
    fontSize: 16,
    color: "#333", 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    paddingHorizontal: 10,
    maxWidth: "90%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    padding: 10,
    transform: [{ scale: 1.2 }],
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
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
    color: "#4a5568", // Gris foncé pour le texte de chargement
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
    color: "#4a5568", // Gris foncé pour le texte
    marginTop: 20,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4a5568", 
    marginTop: 20,
    textAlign: "center",
  },
  emptySubTitle: {
    fontSize: 16,
    color: "#718096", 
    marginTop: 10,
    textAlign: "center",
  },
  emptySubMessage: {
    fontSize: 16,
    color: "#718096", 
    marginTop: 10,
    textAlign: "center",
    maxWidth: width * 0.8,
  },
});
export default AudioListScreen;
