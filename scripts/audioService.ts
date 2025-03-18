import * as MediaLibrary from "expo-media-library";
import MusicInfo from "expo-music-info-2";
import MusicFiles from "react-native-get-music-files";

export const fetchAudioFiles = async (): Promise<MediaLibrary.Asset[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error(
      "Permission non accordée pour accéder à la bibliothèque musicale.",
    );
  }

  let allAudioFiles: MediaLibrary.Asset[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1,
      after: after || undefined,
    });

    allAudioFiles = [...allAudioFiles, ...media.assets];
    hasNextPage = media.hasNextPage;
    after = media.endCursor;
  }

  return allAudioFiles;
};

export async function fetchMetadata(uri:string){
   let data = await (MusicInfo as any).getMusicInfoAsync(uri, {
      title: true,
      artist: true,
      album: true,
      genre: true,
      picture: true, 
    });

    return data;
};

interface Artist {
  name: string;
  songs: MediaLibrary.Asset[];
}

export const fetchArtists = async (): Promise<{ name: string; songs: MediaLibrary.Asset[] }[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission non accordée pour accéder à la bibliothèque musicale.");
  }

  let allAudioFiles: MediaLibrary.Asset[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 100,
      after: after || undefined,
    });

    allAudioFiles = [...allAudioFiles, ...media.assets];
    hasNextPage = media.hasNextPage;
    after = media.endCursor;
  }

  if (allAudioFiles.length === 0) return [];

  // Récupération des métadonnées en parallèle
  const metadataResults = await Promise.allSettled(allAudioFiles.map((file) => fetchMetadata(file.uri)));

  const artistMap: Record<string, MediaLibrary.Asset[]> = {};

  metadataResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      const artist = result.value.artist?.trim() || "Artiste inconnu";

      if (!artistMap[artist]) {
        artistMap[artist] = [];
      }
      artistMap[artist].push(allAudioFiles[index]);
    } else {
      console.warn(`Impossible de récupérer les métadonnées du fichier : ${allAudioFiles[index].uri}`);
    }
  });

  return Object.keys(artistMap).map((name) => ({ name, songs: artistMap[name] }));
};


export const fetchSongsByArtist = async (artistName: string): Promise<MediaLibrary.Asset[]> => {
  const artists = await fetchArtists();
  const artist = artists.find((a) => a.name === artistName);
  return artist ? artist.songs : [];
};
type picture={
  name:string;
  pictureData: string;
}
export const fetchAlbums = async (): Promise<{ name: string; songs: MediaLibrary.Asset[]; picture: picture | null }[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission non accordée pour accéder à la bibliothèque musicale.");
  }

  let allAudioFiles: MediaLibrary.Asset[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  // Récupération optimisée des fichiers audio (plus grande pagination)
  while (hasNextPage) {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 200, // Augmenté pour limiter les requêtes
      after: after || undefined,
    });

    allAudioFiles = allAudioFiles.concat(media.assets);
    hasNextPage = media.hasNextPage;
    after = media.endCursor;
  }

  if (allAudioFiles.length === 0) return [];

  // Récupérer toutes les métadonnées en parallèle pour accélérer le processus
  const metadataResults = await Promise.allSettled(allAudioFiles.map(file => fetchMetadata(file.uri)));

  const albumMap = new Map<string, { songs: MediaLibrary.Asset[]; picture: picture | null }>();

  allAudioFiles.forEach((file, index) => {
    const result = metadataResults[index];
    let albumName = "Album inconnu";
    let albumCover: picture | null = null;

    if (result.status === "fulfilled" && result.value) {
      albumName = result.value.album || "Album inconnu";
      albumCover = result.value.picture || null;
    }

    if (!albumMap.has(albumName)) {
      albumMap.set(albumName, { songs: [], picture: albumCover });
    }

    albumMap.get(albumName)!.songs.push(file);
  });

  return Array.from(albumMap.entries()).map(([name, { songs, picture }]) => ({
    name,
    songs,
    picture,
  }));
};


export const fetchSongsByAlbum = async (albumName: string): Promise<MediaLibrary.Asset[]> => {
  const albums = await fetchAlbums();
  const album = albums.find((a) => a.name === albumName);
  return album ? album.songs : [];
};