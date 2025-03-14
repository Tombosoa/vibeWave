import * as MediaLibrary from "expo-media-library";

export const fetchAudioFiles = async (): Promise<MediaLibrary.Asset[]> => {
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

  return allAudioFiles;
};
