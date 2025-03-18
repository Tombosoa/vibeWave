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

export const fetchArtists = async (): Promise<Artist[]> => {
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

  const artistMap: Record<string, MediaLibrary.Asset[]> = {};

  for (const file of allAudioFiles) {
    const metadata = await fetchMetadata(file.uri);
    const artist = metadata.artist || "Artiste inconnu";

    if (!artistMap[artist]) {
      artistMap[artist] = [];
    }
    artistMap[artist].push(file);
  }

  return Object.keys(artistMap).map((name) => ({ name, songs: artistMap[name] }));
};

export const fetchSongsByArtist = async (artistName: string): Promise<MediaLibrary.Asset[]> => {
  const artists = await fetchArtists();
  const artist = artists.find((a) => a.name === artistName);
  return artist ? artist.songs : [];
};

export const fetchAlbums = async (): Promise<{ name: string; songs: MediaLibrary.Asset[]; picture: string | null }[]> => {
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

  const albumMap: Record<string, { songs: MediaLibrary.Asset[]; picture: string | null }> = {};

  for (const file of allAudioFiles) {
    try {
      const metadata = await fetchMetadata(file.uri);
      const album = metadata?.album || "Album inconnu"; 
      const picture = metadata?.picture || null;

      if (!albumMap[album]) {
        albumMap[album] = { songs: [], picture };
      }
      albumMap[album].songs.push(file);
    } catch (error) {
      console.error("Erreur lors du traitement du fichier audio :", file.uri, error);
    }
  }

  return Object.keys(albumMap).map((name) => ({
    name,
    songs: albumMap[name].songs,
    picture: albumMap[name].picture,
  }));
};

export const fetchSongsByAlbum = async (albumName: string): Promise<MediaLibrary.Asset[]> => {
  const albums = await fetchAlbums();
  const album = albums.find((a) => a.name === albumName);
  return album ? album.songs : [];
};