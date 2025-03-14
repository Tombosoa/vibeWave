import React, { useEffect, useState } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  SafeAreaView, 
  ActivityIndicator, 
  RefreshControl
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';
import { Audio } from "expo-av";
import AudioItem from "../components/AudioItem";
import { RootStackParamList } from "../app/index";
import { audioListStyles } from "@/styles/style";
import { fetchAudioFiles } from "@/scripts/audioService";

const AudioListScreen: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<MediaLibrary.Asset | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudioFiles();
    setRefreshing(false);
  };

  const handlePlayPauseAudio = async (audio: MediaLibrary.Asset) => {
    try {
      if (currentAudio?.id === audio.id && sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
          return;
        }
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentAudio(audio);
      setIsPlaying(true);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier audio :", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const renderHeader = () => (
    <LinearGradient
      colors={['#1e3c72', '#2a5298']}
      style={audioListStyles.headerGradient}
    >
      <View style={audioListStyles.headerContent}>
        <MaterialIcons name="library-music" size={32} color="#fff" />
        <Text style={audioListStyles.header}>Ma Bibliothèque</Text>
        <Text style={audioListStyles.subHeader} numberOfLines={1} ellipsizeMode="tail">
          {audioFiles.length} morceaux
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={audioListStyles.container}>
      {renderHeader()}

      {loading ? (
        <View style={audioListStyles.loaderContainer}>
          <ActivityIndicator size="large" color="#1e3c72" />
          <Text style={audioListStyles.loadingText}>Chargement de votre bibliothèque...</Text>
        </View>
      ) : (
        <Animated.View 
          style={audioListStyles.contentContainer}
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
                    onPressPlay={() => handlePlayPauseAudio(item)} 
                    onPress={() => navigation.navigate("PlayerScreen", { audio: item })} 
                    isPlaying={currentAudio?.id === item.id && isPlaying} 
                  />
                </Animated.View>
              )}
              contentContainerStyle={audioListStyles.listContent}
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
            <View style={audioListStyles.emptyContainer}>
              <MaterialIcons name="music-off" size={64} color="#1e3c72" />
              <Text style={audioListStyles.emptyMessage}>Aucun fichier audio trouvé</Text>
              <Text style={audioListStyles.emptySubMessage}>
                Ajoutez de la musique à votre appareil pour commencer
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default AudioListScreen;
