import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Function to get fresh download URL
async function getFreshDownloadUrl(storagePath: string): Promise<string> {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, storagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new Error('Failed to get download URL from Firebase');
  }
}

// Function to get file extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
    'image/tiff': '.tiff',
    'image/svg+xml': '.svg',
  };

  return mimeToExt[mimeType.toLowerCase()] || '.jpg'; // Default to .jpg if unknown
}

// Updated save function that gets fresh URL and handles file extensions
export async function saveImageToGallery(storagePath: string) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'We need permission to save images.');
    return;
  }

  try {
    // Get fresh download URL
    console.log('Getting fresh download URL for:', storagePath);
    const freshUrl = await getFreshDownloadUrl(storagePath);
    console.log('Fresh URL obtained:', freshUrl);

    // Extract filename from storage path
    const baseFilename = storagePath.split('/').pop() || `image_${Date.now()}`;

    // Create temporary filename for download (we'll rename it after getting the MIME type)
    const tempLocalUri = FileSystem.cacheDirectory + baseFilename + '_temp';

    // Download the file
    console.log('Starting download...');
    const downloadResult = await FileSystem.downloadAsync(freshUrl, tempLocalUri);
    console.log('Download result:', downloadResult);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }

    // Check if file exists and has content
    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
    console.log('File info:', fileInfo);

    if (!fileInfo.exists || fileInfo.size === 0) {
      throw new Error("Downloaded file is empty or doesn't exist");
    }

    // Get the proper extension from the MIME type
    const mimeType =
      downloadResult.headers['Content-Type'] || downloadResult.mimeType || 'image/jpeg';
    const extension = getExtensionFromMimeType(mimeType);
    const finalFilename = baseFilename + extension;
    const finalLocalUri = FileSystem.cacheDirectory + finalFilename;

    // Move/rename the file to have the proper extension
    await FileSystem.moveAsync({
      from: downloadResult.uri,
      to: finalLocalUri,
    });

    console.log('File renamed to:', finalLocalUri);

    // Save to photo library
    await MediaLibrary.saveToLibraryAsync(finalLocalUri);

    Alert.alert('Saved!', 'Image has been saved to your photo album.');
  } catch (error: unknown) {
    console.error('Error saving image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    Alert.alert('Error', `Could not save the image: ${errorMessage}`);
  }
}

export const handleImageUpload = async (
  setBlobs: (blobs: Blob[]) => void,
  setImageUrls: (urls: string[]) => void
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    const blobsAndImages = await Promise.all(
      result.assets.map(async (asset) => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        return { blob, image: asset.uri };
      })
    );

    const blobs = blobsAndImages.map((item) => item.blob);
    const images = blobsAndImages.map((item) => item.image);

    setBlobs(blobs);
    setImageUrls(images);
  }
};
