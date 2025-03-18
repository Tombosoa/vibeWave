import * as MediaLibrary from "expo-media-library";
import MusicInfo from "expo-music-info-2";
import pLimit from "p-limit";

const metadataCache = new Map<string, any>();

const limit = pLimit(10);

export const fetchAudioFiles = async (): Promise<MediaLibrary.Asset[]> => {
  try {
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

      allAudioFiles.push(...media.assets);
      hasNextPage = media.hasNextPage;
      after = media.endCursor;
    }

    return allAudioFiles;
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers audio :", error);
    throw error;
  }
};

export const fetchMetadata = async (uri: string) => {
  if (metadataCache.has(uri)) {
    return metadataCache.get(uri);
  }

  try {
    const metadata = await (MusicInfo as any).getMusicInfoAsync(uri, {
      title: true,
      artist: true,
      album: true,
      genre: true,
      picture: true,
    });
    metadataCache.set(uri, metadata);
    return metadata;
  } catch (error) {
    console.warn(`Erreur lors de la récupération des métadonnées pour ${uri}:`, error);
    return null;
  }
};

const groupByKey = (
  data: MediaLibrary.Asset[],
  metadataResults: PromiseSettledResult<any>[],
  key: "artist" | "album"
) => {
  const map = new Map<string, { songs: MediaLibrary.Asset[]; picture: Picture | null }>();

  metadataResults.forEach((result, index) => {
    const value = result.status === "fulfilled" && result.value ? result.value[key]?.trim() : null;
    const name = value || `${key === "artist" ? "Artiste" : "Album"} inconnu`;
    const picture = result.status === "fulfilled" && result.value ? result.value.picture || null : null;

    if (!map.has(name)) {
      map.set(name, { songs: [], picture });
    }
    map.get(name)!.songs.push(data[index]);
  });

  return map;
};

interface Picture {
  name: string;
  pictureData: string;
}

interface Artist {
  name: string;
  songs: MediaLibrary.Asset[];
}

interface Album {
  name: string;
  songs: MediaLibrary.Asset[];
  picture: Picture | null;
}

/**
 * Récupère tous les artistes avec leurs fichiers audio.
 */
export const fetchArtists = async (): Promise<Artist[]> => {
  const allAudioFiles = await fetchAudioFiles();
  if (allAudioFiles.length === 0) return [];

  const metadataResults = await Promise.allSettled(
    allAudioFiles.map(file => limit(() => fetchMetadata(file.uri)))
  );

  const artistMap = groupByKey(allAudioFiles, metadataResults, "artist");
  return Array.from(artistMap.entries()).map(([name, { songs }]) => ({ name, songs }));
};

/**
 * Récupère tous les albums avec leurs fichiers audio et couvertures.
 */
export const fetchAlbums = async (): Promise<Album[]> => {
  const allAudioFiles = await fetchAudioFiles();
  if (allAudioFiles.length === 0) return [];

  const metadataResults = await Promise.allSettled(
    allAudioFiles.map(file => limit(() => fetchMetadata(file.uri)))
  );

  const albumMap = groupByKey(allAudioFiles, metadataResults, "album");
  return Array.from(albumMap.entries()).map(([name, { songs, picture }]) => ({
    name,
    songs,
    picture,
  }));
};

/**
 * Récupère les fichiers audio d'un artiste spécifique.
 */
export const fetchSongsByArtist = async (
  artistName: string,
  artists?: Artist[]
): Promise<MediaLibrary.Asset[]> => {
  const artistList = artists || await fetchArtists();
  return artistList.find((artist) => artist.name === artistName)?.songs || [];
};

/**
 * Récupère les fichiers audio d'un album spécifique.
 */
export const fetchSongsByAlbum = async (
  albumName: string,
  albums?: Album[]
): Promise<MediaLibrary.Asset[]> => {
  const albumList = albums || await fetchAlbums();
  return albumList.find((album) => album.name === albumName)?.songs || [];
};